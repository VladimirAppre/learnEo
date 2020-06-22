import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';
import style from './MatchingPage.module.css';
import Rating from '../components/Rating/index';
import { Link } from 'react-router-dom';

function MatchingPage(props) {
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let users = async () => {
      let user = JSON.parse(localStorage.user)
      // const response = await fetch(`http://localhost:3001/match/${user._id}`);
      const response = await fetch(`/api/match/${user._id}`);
      const req = await response.json();
      setMatchingUsers(req.matchingUsers);
      setLoading(false);
    }
    users();
  }, []);

  const handleClick = async (e) => {
    e.preventDefault();
    const id1 = JSON.parse(localStorage.user)._id;
    const id2 = e.target.getAttribute('id');
    const response = await fetch(`/api/chats/newChat?id1=${id1}&id2=${id2}`);
    const result = await response.json();
    setChatId(result._id);
  };


  if (chatId) {
    return <Redirect to={`/chat/`} />
  }
  if (loading) {
    return (
      <>
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col s12 center">
                <h3>Найденные совпадения по вашим предпочтениям</h3>
              </div>
            </div>
            <div className="center">
              <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-leo-sc-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div><div className="gap-patch">
                    <div className="circle"></div>
                  </div><div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  } else if (matchingUsers.length > 0){
    return (
      <>
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col s12 center">
                <h3>Найденные совпадения по вашим предпочтениям</h3>
              </div>
            </div>
            <div className="row">
              {matchingUsers.map(el => {
                return (
                  <div key={el._id} className="col s12 m6 xl4">
                    <div className="card hoverable leo-fc">
                      <div className="card-content white-text">
                        <Link to={`/profile/${el._id}`}>
                          <span className="card-title">{`${el.firstName} ${el.lastName}`}</span>
                        </Link>
                        <div className="row">
                          <div className="col s4">
                            <Link to={`/profile/${el._id}`}>
                              {el.avatar ?
                                <img src={el.avatar} className={`${style.ava} circle`} alt="" />
                                :
                                <img src='/img/defaultavatar.png' className={`${style.ava} circle`} alt="" />
                              }
                            </Link>
                          </div>
                          <div className="col s8">
                            <p>Рейтинг:</p>
                            <Rating rating={el.rating} />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col s12">
                            <p className={style.chipMar}>Могу научить: </p>
                            {el.canTeach.map((skill) => {
                              return (
                                <div key={skill._id} className="chip">{skill.skill}</div>
                              )
                            })}
                          </div>

                          <div className="col s12">
                            <p className={style.chipMar}>Хочу научиться: </p>
                            {el.toLearn.map((skill) => {
                              return (
                                <div key={skill._id} className="chip">{skill.skill}</div>
                              )
                            })}
                          </div>
                        </div>



                      </div>
                      <div className="card-action">
                        <div className={style.linkWrapper}>
                          <div className={style.link}>
                            <a href="#" onClick={handleClick} id={el._id}>Начать чат</a>
                          </div>
                          <div className={style.link}>
                            <Link to={`/profile/${el._id}`}>Подробнее</Link>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return (
      <>
        <Header />
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col s12 center">
                <h3>Найденные совпадения по вашим предпочтениям</h3>
                <h4 className={style.noMatching}>Совпадений нет, попробуйте добавить другие навыки, которым вы хотели бы научиться</h4>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}

export default MatchingPage;
