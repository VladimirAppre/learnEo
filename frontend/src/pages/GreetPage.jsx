import React from 'react';
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';
import style from './GreetPage.module.css';

function GreetPage() {
  return (<>
    <Header />

    <video preload="auto" autoPlay={true} loop={true} muted={true} id="bgVideo">
      <source src="/img/backgroundLearnEO-720p.mp4" type='video/mp4' />
    </video>
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col m7 s12">
            <h3 className={`white-text ${style.titleText}`} >Прикоснись к миру продуктивного взаимодействия. Объединяйся, делись знаниями и учись новому вместе с LearnEO</h3>
          </div>
        </div>
        <div className="row">
          <div className={`col s12 ${style.links}`}>
            <h3 className={`white-text ${style.text}`}>Начни прямо сейчас!</h3>
            {localStorage.user === 'null' &&
              <div className="valign-wrapper">
                <a className="waves-effect modal-trigger" href="#singOut">Регистрация</a>
                <a className="waves-effect modal-trigger v" href="#singIn">Войти</a>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
    <Footer />
  </>
  );
}

export default GreetPage;
