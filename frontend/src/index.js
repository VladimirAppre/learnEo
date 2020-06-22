import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GreetPage from './pages/GreetPage';
import ProfilePage from './pages/ProfilePage';
import { Provider } from 'react-redux';
import Store from './redux/store';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import './materialize/materialize.scss';
import './index.css'
import EditProfilePage from './pages/EditProfilePage';
import MatchingPage from './pages/MatchingPage';
import ChatPage from './pages/ChatPage';
import Page404 from './pages/Page404';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <Router>
        <Route path='/' exact component={GreetPage} />
        <Route path='/profile/:id' exact component={ProfilePage} />
        <Route path='/profile/:id/edit' exact component={EditProfilePage} />
        <Route path='/match' exact component={MatchingPage} />
        <Route path='/chat' exact component={ChatPage} />
        <Route path='/page404' component={Page404} />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

