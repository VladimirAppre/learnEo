import React from 'react';
import M from 'materialize-css';
import { Redirect, Link } from 'react-router-dom';
import style from './index.module.css';

class Header extends React.Component {
  state = {
    user: null,
    login: false,
    logout: false,
  }

  componentDidMount() {
    // Sidenav for mobiles
    const navs = document.querySelectorAll('.sidenav');
    M.Sidenav.init(navs);

    // Modal frames
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    // Auth
    const user = localStorage.user;
    if (user) {
      this.setState({
        ...this.state,
        user: JSON.parse(user),
      })
    }

  }
  loginHandler = async (e) => {
    e.preventDefault();
    // const response = await fetch('http://localhost:3001/login', {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    })
    const res = await response.json();
    this.hideNavBar()
    if (res.error) {
      alert(res.error);
    } else {
      document.querySelectorAll('.modal').forEach(el => M.Modal.getInstance(el).close());
      localStorage.setItem('user', JSON.stringify(res.user));
      this.setState({
        ...this.state,
        user: res.user,
        login: true,
        logout: false,
      });
    }
  }

  regHandler = async (e) => {
    e.preventDefault();
    // const response = await fetch('http://localhost:3001/register', {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        email: e.target.email.value,
        password: e.target.password.value,
        confirm: e.target.passwordRep.value,
      }),
    })
    const res = await response.json();
    this.hideNavBar();
    if (res.error) {
      alert(res.error);
    } else {
      document.querySelectorAll('.modal').forEach(el => M.Modal.getInstance(el).close());
      localStorage.setItem('user', JSON.stringify(res.user));

      this.setState({
        ...this.state,
        user: res.user,
        login: true,
        logout: false,
      });
    }
  }

  logoutHandler = async (e) => {
    e.preventDefault();
    // const req = await fetch('http://localhost:3001/logout');
    const req = await fetch('/api/logout');
    const res = await req.json();
    this.hideNavBar();
    if (res.success) {
      localStorage.user = null;
      this.setState({
        user: null,
        login: false,
        logout: true,
      })
    } else {
      alert(res.error);
    }
  }

  hideNavBar = () => {
    M.Sidenav.getInstance(document.querySelector('.sidenav')).close()
  }

  render() {
    return (
      <>
        {this.state.logout && <Redirect to='/' />}
        {this.state.login && <Redirect to={`/profile/${this.state.user._id}`} />}
        <header>
          <nav>
            <div className="nav-wrapper">
              <div className="container">
                <div className="row">
                  <a href="/" className="brand-logo">LearnEO</a>
                  <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {this.state.user
                      ?
                      <>
                        <li><Link to="/">Главная</Link></li>

                        <li><Link to={`/profile/${this.state.user._id}`}>Мой профиль</Link></li>
                        <li><Link to="/chat">Чаты</Link></li>
                        <li><a onClick={this.logoutHandler}>Выйти</a></li>
                      </>
                      :
                      <>
                        <li><a className="waves-effect modal-trigger" href="#singIn">Войти</a></li>
                        <li><a className="waves-effect modal-trigger" href="#singOut">Регистрация</a></li>
                      </>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </nav>

          <ul id="mobile-demo" className="sidenav">

            {this.state.user
              ?
              <>
                <li onClick={this.hideNavBar}><Link to="/">Главная</Link></li>
                <li onClick={this.hideNavBar}><Link to={`/profile/${this.state.user._id}`}>Мой профиль</Link></li>
                <li onClick={this.hideNavBar}><Link to="/chat">Чаты</Link></li>
                <li><a onClick={this.logoutHandler}>Выйти</a></li>
              </>
              :
              <>
                <li><a className="waves-effect modal-trigger" href="#singIn">Войти</a></li>
                <li><a className="waves-effect modal-trigger" href="#singOut">Регистрация</a></li>
              </>
            }
          </ul>
        </header>

        <div id="singIn" className={`modal ${style.overflow}`}>
          <div className="modal-content">
            <div className="row">
              <div className="col s12">
                <form action="/login" method="POST" name="loginForm" onSubmit={this.loginHandler}>
                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">mail</i>
                      <input id="email_login" type="email" name="email" className="validate" />
                      <label htmlFor="email_login">Почта</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">lock</i>
                      <input id="passwordIn" type="password" name="password" className="validate" />
                      <label htmlFor="passwordIn">Пароль</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 center">
                      <button className="btn waves-effect waves-light" type="submit" name="action">Войти
                  <i className="material-icons right">send</i>
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>

        <div id="singOut" className={`modal ${style.overflow}`}>
          <div className="modal-content">
            <div className="row">
              <div className="col s12">
                <form action="/reg" method="POST" name="regForm" onSubmit={this.regHandler}>
                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">account_circle</i>
                      <input id="username" type="text" name="firstName" className="validate" />
                      <label htmlFor="username">Имя</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">account_circle</i>
                      <input id="lastName" type="text" name="lastName" className="validate" />
                      <label htmlFor="lastName">Фамилия</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">mail</i>
                      <input id="email" type="email" name="email" className="validate" />
                      <label htmlFor="email">Почта</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">lock</i>
                      <input id="password" type="password" name="password" className="validate" />
                      <label htmlFor="password">Пароль</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field s12">
                      <i className="material-icons prefix">repeat</i>
                      <input id="passwordRep" type="password" name="passwordRep" className="validate" />
                      <label htmlFor="passwordRep">Повторите пароль</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 center">
                      <button className="btn waves-effect waves-light" type="submit" name="action">Зарегистрироваться
                  <i className="material-icons right">send</i>
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default Header;
