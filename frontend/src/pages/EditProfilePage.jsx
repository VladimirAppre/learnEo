import React from 'react';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';
import style from './EditProfilePage.module.css';
import M from 'materialize-css';
import Croppie from 'croppie';
import { Redirect } from 'react-router-dom';

class EditProfilePage extends React.Component {

  state = {
    _id: null,
    firstName: '',
    lastName: '',
    avatar: null,
    aboutUser: '',
    ableToLearn: [],
    wantToLearn: [],
    skills: [],
    skillsCats: [],
    selectedSkill: 'Музыка',
    selectedSkillWant: 'Музыка',
    imgLoaded: false,
    updated: false,
  }

  addCategoryAble = (e) => {
    e.preventDefault();
    let newSkill = true;
    this.state.ableToLearn.forEach((skill) => {
      if (skill._id.includes(document.profileForm.subcategory_edit.value)) {
        newSkill = false;
        return
      }
    })
    if (newSkill)
      this.setState({
        ...this.state,
        ableToLearn: this.state.ableToLearn.concat([{
          skill: document.profileForm.subcategory_edit.selectedOptions[0].innerText,
          _id: document.profileForm.subcategory_edit.value,
        }]),
      })
  }

  addCategoryWant = (e) => {
    e.preventDefault();
    let newSkill = true;
    this.state.wantToLearn.forEach((skill) => {
      if (skill._id.includes(document.profileForm.subcategory_edit_want.value)) {
        newSkill = false;
        return
      }
    })
    if (newSkill)
      this.setState({
        ...this.state,
        wantToLearn: this.state.wantToLearn.concat([{
          skill: document.profileForm.subcategory_edit_want.selectedOptions[0].innerText,
          _id: document.profileForm.subcategory_edit_want.value,
        }]),
      })
  }

  submitHandler = async (e) => {
    e.preventDefault();
    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      aboutUser: e.target.about_edit.value,
      city: e.target.city.value,
      avatar: document.querySelector('#profilePic').src,
      canTeach: this.state.ableToLearn.map(el => el._id),
      toLearn: this.state.wantToLearn.map(el => el._id),
      trainingFormat: e.target.formatLearning.value,
    }
    if (this.state.imgLoaded) {
      data.avatar = document.querySelector('#profilePic').src;
    }

    // const response = await fetch(`http://localhost:3001/profile/${this.state._id}`, {
    const response = await fetch(`/api/profile/${this.state._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const ans = await response.json();
    localStorage.user = JSON.stringify(ans.userSend);
    this.setState({
      ...this.state,
      ...ans.userSend,
      updated: true,
    })

  }

  skills2cats = (arr) => {
    const uniq = [];
    arr.forEach(skill => { if (!uniq.includes(skill.skillCategory)) { uniq.push(skill.skillCategory) } });
    return uniq;
  }
  initM = () => {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
  }
  componentDidUpdate() {
    this.initM();
    M.updateTextFields();
  }

  componentDidMount = async () => {
    let user = localStorage.user;
    if (user) {
      user = JSON.parse(user);
    }
    // const req = await fetch('http://localhost:3001/skills');
    const req = await fetch('/api/skills');
    const res = await req.json();

    this.setState({
      ...this.state,
      skills: res.skills,
      skillsCats: this.skills2cats(res.skills),
      ...user,
      ableToLearn: user.canTeach,
      wantToLearn: user.toLearn,
    }, this.initM);
  }

  ableChangeHandler = (e) => {
    if (this.state.selectedSkill.includes(e.target.value)) return
    this.setState({
      ...this.state,
      selectedSkill: e.target.value,
    })
  }

  wantChangeHandler = (e) => {
    if (this.state.selectedSkillWant.includes(e.target.value)) return
    this.setState({
      ...this.state,
      selectedSkillWant: e.target.value,
    })
  }

  loadImage = (e) => {
    const editModal = document.querySelector('#imgEditModal');
    M.Modal.getInstance(editModal).open()
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target.result;
      const sizeB = window.innerWidth < 600 ? 200 : 300;
      const editor = new Croppie(document.querySelector('#imgEditInner'), {
        viewport: { width: 200, height: 200 },
        boundary: { width: sizeB, height: sizeB },
        enforceBoundary: true,
        enableExif: true,
      })

      editor.bind({
        url: imgData,
      })

      document.querySelector('#cropBtn').addEventListener('click', () => {
        editor.result({
          type: 'base64',
          format: 'jpeg',
        }).then(data => {
          document.querySelector('#profilePic').src = data;
          M.Modal.getInstance(editModal).close();
          editor.destroy();
        })
      })


    }
    reader.readAsDataURL(e.target.files[0]);

    this.setState({
      ...this.state,
      imgLoaded: true,
    })

  }

  delAbleSkill = (e) => {
    this.setState({
      ...this.state,
      ableToLearn: this.state.ableToLearn.filter(el => el._id !== e.target.id),
    })
  }

  delWantSkill = (e) => {
    this.setState({
      ...this.state,
      wantToLearn: this.state.wantToLearn.filter(el => el._id !== e.target.id),
    })
  }


  render() {
    return (<>
      {this.state.updated && <Redirect to={`/profile/${this.state._id}`} />}
      <Header />

      <div id='imgEditModal' className="modal">
        <div id="imgEdit" className={`${style.imgEdit}`}>
          <div className="modal-content">
            <div id="imgEditInner"></div>
          </div>
          <div className="modal-footer">
            <button id='cropBtn' className="btn">Обрезать</button>
          </div>
        </div>
      </div>


      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col s12 center">
              <div id='avatarWrapper'>
                <img id='profilePic' src={this.state.avatar ? this.state.avatar : "/img/defaultavatar.png"} alt="avatar" className={`${style.avatar}`} />
              </div>
            </div>
          </div>


          <div className="row">
            <form name="profileForm" className="col s12" onSubmit={this.submitHandler}>
              <div className="row">
                <div className="input-field col s6">
                  <input id="first_name_edit" defaultValue={this.state.firstName} type="text" name="firstName" className="validate" />
                  <label className="active" htmlFor="first_name_edit">Имя</label>
                </div>
                <div className="input-field col s6">
                  <input id="last_name" defaultValue={this.state.lastName} type="text" name="lastName" className="validate" />
                  <label htmlFor="last_name">Фамилия</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <div className="file-field input-field">
                    <div className="btn">
                      <span>Загрузить фото</span>
                      <input onChange={this.loadImage} type="file" name='ava_edit' />
                    </div>

                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text"
                        placeholder="Upload file" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <textarea id="about_edit" defaultValue={this.state.aboutUser} className="materialize-textarea"></textarea>
                  <label htmlFor="about_edit">О себе</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s6">
                  <input id="cityEdit" defaultValue={this.state.city} type="text" name="city" className="validate" />
                  <label htmlFor="cityEdit">Город</label>
                </div>
                <div className="input-field col s6">
                  <input id="formatLearning" defaultValue={this.state.trainingFormat} type="text" name="formatLearning" className="validate" />
                  <label htmlFor="formatLearning">Формат занятий</label>
                </div>
              </div>

              <div className="row">
                <h5>Могу научить</h5>
                <div className="input-field col m5 s4">
                  <select onChange={this.ableChangeHandler} name="category_edit">
                    {this.state.skillsCats.map(el => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                  <label>Основная категрия</label>
                </div>

                <div className="input-field col m5 s4">
                  <select name="subcategory_edit">
                    {this.state.skills.filter(el => el.skillCategory === this.state.selectedSkill)
                      .map(el => (
                        <option key={el._id} value={el._id}>{el.skill}</option>
                      ))}
                  </select>
                  <label>Подкатегрия</label>
                </div>
                <div className="col m2 s4 input-field">
                  <button className="btn" onClick={this.addCategoryAble}>Добавить</button>
                </div>
                <div className="col s12 input-field">
                  <div className="row">

                    {this.state.ableToLearn.map(el => (
                      <div key={el._id} className="col s6 m2">
                        <div className={`chip ${style.chipsInner}`}>
                          <span>{el.skill}</span>
                          <i id={el._id} onClick={this.delAbleSkill} className="material-icons">close</i>
                        </div>
                      </div>)
                    )}

                  </div>
                </div>
              </div>

              <div className="row">
                <h5>Хочу научиться</h5>
                <div className="input-field col m5 s4">
                  <select onChange={this.wantChangeHandler} name="category_edit_want">
                    {this.state.skillsCats.map(el => (
                      <option key={el} value={el}>{el}</option>
                    ))}
                  </select>
                  <label>Основная категрия</label>
                </div>

                <div className="input-field col m5 s4">
                  <select name="subcategory_edit_want">
                    {this.state.skills.filter(el => el.skillCategory === this.state.selectedSkillWant)
                      .map(el => (
                        <option key={el._id} value={el._id}>{el.skill}</option>
                      ))}
                  </select>
                  <label>Подкатегрия</label>
                </div>
                <div className="col m2 s4 input-field">
                  <button className="btn" onClick={this.addCategoryWant}>Добавить</button>
                </div>
                <div className="col s12 input-field">
                  <div className="row">

                    {this.state.wantToLearn.map(el => (
                      <div key={el._id} className="col s6 m2">
                        <div className={`chip ${style.chipsInner}`}>
                          <span>{el.skill}</span>
                          <i id={el._id} onClick={this.delWantSkill} className="material-icons">close</i>
                        </div>
                      </div>)
                    )}

                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 center">
                  <button className="btn" type="submit">Обновить</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>)
  }
}

export default EditProfilePage;
