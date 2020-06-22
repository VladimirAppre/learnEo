import React, { useState, useEffect } from 'react';
import Message from './Message';
import styles from './MessageField.module.css';

function MessagesField(props) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState({});
  const [partner, setPartner] = useState({});
  const [ws, setWs] = useState({});
  const [activeChat, setActiveChat] = useState('');


  useEffect(() => {
    if (props.activeChat)
      setActiveChat(props.activeChat);
  }, [props.activeChat])

  useEffect(() => {
    setActiveChat(props.activeChat);
    // const wsConnect = new WebSocket(`ws://localhost:3001/chat/${activeChat}`);
    const wsConnect = new WebSocket(`${window.location.origin.replace(/^https/, 'wss')}/api/chat/${activeChat}`);
    setWs(wsConnect);

    let userID;
    if (localStorage.user) {
      setUser(JSON.parse(localStorage.user))
      userID = JSON.parse(localStorage.user)._id;
    }

    const getMessagesHistory = async () => {
      let partnerID;
      // const responseMessages = await fetch(`http://localhost:3001/chats/messagesHistory/${activeChat}`, {
      const responseMessages = await fetch(`/api/chats/messagesHistory/${activeChat}`, {
        cache: 'no-cache',
        credentials: 'include',
      });
      const req = await responseMessages.json();
      String(userID) === String(req.firstUser.id) ? partnerID = req.secondUser.id : partnerID = req.firstUser.id;
      if (req.messages.length === 0) {
        setMessages([]);
      } else {
        setMessages(req.messages);
      }
      // const responsePartner = await fetch(`http://localhost:3001/profile/${partnerID}`, {
      const responsePartner = await fetch(`/api/profile/${partnerID}`, {
        cache: 'no-cache'
      });
      const reqPartner = await responsePartner.json();
      if (reqPartner) {
        setPartner(reqPartner);
      }
    };

    if (activeChat !== '')
      getMessagesHistory();
  }, [activeChat]);

  useEffect(() => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages([...messages, data]);
    };
    const chatWindow = document.querySelector(`.${styles['msger-chat']}`);
    chatWindow.scrollTo(0, chatWindow.scrollHeight);
  }, [messages]);

  const handleChange = ({ target }) => {
    setText(target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text === '') {
      return
    }
    ws.send(JSON.stringify({ message: text, lastName: user.lastName, firstName: user.firstName, userId: user._id }));
    document.querySelector(`.${styles['msger-input']}`).value = '';
  };



  return (
    <section className={styles["msger"]}>
      <header className={styles["msger-header"]}>
        {props.mobile &&
          <div>
            <button className="btn" onClick={props.toggleChatList}><i class="material-icons">chat</i></button>
          </div>
        }
        <div> 
          Собеседник:
          {String(partner.firstName + partner.lastName).length > 30 ?
            ` ${partner.firstName} ${partner.lastName}`.slice(0, 30) + '...' :
            ` ${partner.firstName} ${partner.lastName}`}
        </div>
      </header>
      <main className={styles["msger-chat"]}>
        {messages.map((message, index) => {
          return (<Message key={index} avatar={user.avatar} partnerAvatar={partner.avatar} {...message} />)
        })}
      </main>
      <form className={styles["msger-inputarea"]} onSubmit={handleSubmit}>
        <input type="text" className={styles["msger-input"]} placeholder="Написать сообщение..." onChange={handleChange} />
        <button type="submit" className={styles["msger-send-btn"]}>Отправить</button>
      </form>
    </section>
  )
}


export default MessagesField;
