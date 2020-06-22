import React from 'react';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';
import style from './ProfilePage.module.css';
import Rating from '../components/Rating/index';
import { Redirect, Link } from 'react-router-dom';

class ProfilePage extends React.Component {
  state = {
    user: localStorage.user,
    isYou: false,
    chat: false,
  }

  async componentDidMount() {
    window.onclose = this.reset
    const { id } = this.props.match.params;
    if (this.state.user && JSON.parse(this.state.user)._id === id) {
      this.setState({
        ...this.state,
        user: JSON.parse(this.state.user),
        isYou: true,
      })
    } else {
      // тест мержа
      // const res = await fetch(`http://localhost:3001/profile/${id}`);
      const res = await fetch(`/api/profile/${id}`);
      const user = await res.json();
      this.setState({
        ...this.state,
        user,
      })
    }
  }

  async componentDidUpdate(prevProps) {
    window.onclose = this.reset
    const { id } = this.props.match.params;
    const { id: id2 } = prevProps.match.params;
    if (id !== id2) {
      if (localStorage.user && JSON.parse(localStorage.user)._id === id) {
        this.setState({
          ...this.state,
          user: JSON.parse(localStorage.user),
          isYou: true,
        })
      } else {
        // const res = await fetch(`http://localhost:3001/profile/${id}`, {
        const res = await fetch(`/api/profile/${id}`, {
          cache: "no-cache",
        });
        const user = await res.json();
        this.setState({
          ...this.state,
          user,
          isYou: false,
        })
      }
    }
  }

  feedbackHandler = async (e) => {
    e.preventDefault();
    const author = JSON.parse(localStorage.user);
    const feedbackText = e.target.text.value;
    e.target.text.value ='';
    // const response = await fetch(`http://localhost:3001/profile/${this.state.user._id}/feedback`, {
    const response = await fetch(`/api/profile/${this.state.user._id}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
        rating: e.target.rating.value,
        message: feedbackText,
        avatar: author.avatar,
      }),
    })
    const res = await response.json();
    if (res.error) {
      alert(res.error);
    }
    if (res.succes) {
      this.setState({
        ...this.state,
        user: {
          ...this.state.user,
          rating: res.user.rating,
          feedBacks: res.user.feedBacks,
        }
      })
    }
  }

  handleClick = async (e) => {
    e.preventDefault();
    const id1 = JSON.parse(localStorage.user)._id;
    const id2 = this.state.user._id;
    // const response = await fetch(`http://localhost:3001/chats/newChat?id1=${id1}&id2=${id2}`);
    const response = await fetch(`/api/newChat?id1=${id1}&id2=${id2}`);
    const result = await response.json();
    this.setState({ ...this.state, chat: result._id });
  };

  render() {
    if (this.state.chat) {
      return <Redirect to={`/chat/`} />
    }
    if (this.state.user) {
      return (<>
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col s12 m4 center">
                <div className={style.avatarWrapper}>
                  <img src={this.state.user.avatar ? this.state.user.avatar : "/img/defaultavatar.png"} alt="avatar" className={`${style.avatar}`} />
                </div>
              </div>
              <div className="col s12 m4 center">
                <div className="row">
                  <div className={`${style.name}`}>
                    <div className="col s12">
                      <div>{this.state.user.firstName}</div>
                    </div>
                    <div className="col s12">
                      <div>{this.state.user.lastName}</div>
                    </div>
                  </div>
                </div>

                <div className={style["row"]}>
                  <div className="col s12 center">
                    <div className={`${style.rating} center`}>
                      <div>Рейтинг: </div>
                      <Rating rating={this.state.user.rating} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col s12 center">
                {
                  this.state.isYou
                    ?
                    <div className={style.profilePageButtons}>
                      <div>
                        <Link to={`/profile/${this.state.user._id}/edit`} className="waves-effect waves-light btn"> Редактировать данные </Link>
                      </div>
                      <div>
                        <Link to="/chat" className="waves-effect waves-light btn"><i className="material-icons right">chat</i>Ваши чаты</Link>
                      </div>
                      <div>
                        <Link to="/match" className="waves-effect waves-light btn">Ваши совпадения</Link>
                      </div>
                    </div>
                    :
                    <a href="#" className="waves-effect waves-light btn" onClick={this.handleClick} >Начать чат</a>
                }
              </div>

            </div>

            <div className="row">
              <div className="col s12 m4">
                <div className="card leo-fc">
                  <div className="card-content white-text">
                    <span className="card-title">О себе: </span>
                    <p>{this.state.user.aboutUser ? this.state.user.aboutUser : 'Этот раздел еще не заполнен'}</p>
                  </div>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="card leo-fc">
                  <div className="card-content white-text">
                    <span className="card-title">Могу научить: </span>
                    {this.state.user.canTeach
                      ? this.state.user.canTeach.map(el => <div key={el._id} className={`chip ${style.chipsInner}`}><span>{el.skill}</span></div>)
                      : 'Этот раздел еще не заполнен'
                    }
                  </div>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="card leo-fc">
                  <div className="card-content white-text">
                    <span className="card-title">Хочу научиться: </span>
                    {this.state.user.toLearn
                      ? this.state.user.toLearn.map(el => <div key={el._id} className={`chip ${style.chipsInner}`}><span>{el.skill}</span></div>)
                      : 'Этот раздел еще не заполнен'
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col s12">
                <div className={style.feedbacks}>
                  <h4>Отзывы: </h4>
                  <ul className="collection">
                    {this.state.user.feedBacks ? this.state.user.feedBacks.map(fb => (
                      <li key={fb.id} className="collection-item avatar">
                        <img src={fb.avatar ? fb.avatar : "/img/defaultavatar.png"} alt="avatar" className="circle" />
                        <span className="title">{`${fb.firstName} ${fb.lastName}`}</span>
                        <p>{fb.message}</p>
                      </li>
                    ))
                      :
                      <p>Ещё нет ни одного отзыва</p>
                    }
                  </ul>
                </div>
              </div>
            </div>

            {!this.state.isYou &&
              <div className="row">
                <form name='feedbackForm' onSubmit={this.feedbackHandler} className="col s12">
                  <div className="row">
                    <div className="input-field col s8">
                      <textarea id="textarea1" name='text' className="materialize-textarea"></textarea>
                      <label htmlFor="textarea1">Отзыв</label>
                    </div>
                    <div className="col s4">
                      <p className="range-field">
                        <label htmlFor="ratingFeedback">Оценить</label>
                        <input type="range" name="rating" id="ratingFeedback" min="0" max="5" />
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s8">
                      <button className="btn waves-effect waves-light" type="submit" name="action">Отправить отзыв
                  <i className="material-icons right">send</i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            }

          </div>
        </div>
        <Footer />
      </>
      );
    } else {
      return (
        <>
          <Redirect to='/' />
        </>
      )
    }
  }

}

export default ProfilePage;
