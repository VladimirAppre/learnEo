import React from 'react';
import Header from '../components/Header';
import { Redirect } from 'react-router-dom';
import style from './Page404.module.css';

export default class Page404 extends React.Component {
  state = {
    home: false,
  }

  handleClick = (e) => {
    e.preventDefault();
    this.setState(() => {
      return {
        home: true,
      };
    });
  };
  
  render() {
    if (this.state.home) {
      return <Redirect to="/" />
    }
    
    return (
      <>
        <Header />
        <div className={style.body}>
          <div className="col s12 m6">
            <div className="col s6 m3">
              <img src="/img/light-bulb.png" className={style.image} alt=""/>
            </div>
            <div className="col s6 m3">
              <div>
                <div className={style.dialog}>
                  <h1 className={style.h1}>Эй, кто выключил свет?</h1>
                  <p className={style.p}>Ошибка 404. Простите, у нас не вышло отобразить искомый контент.</p>
                  <div className="center">
                    <button type="button" onClick={this.handleClick} className="waves-effect waves-light btn">На главную</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
