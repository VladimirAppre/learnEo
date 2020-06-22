import React from 'react';
import ChatList from '../components/Chat/ChatList';
import MessagesField from '../components/Chat/MessagesField';
import Header from '../components/Header';
import styles from './ChatPage.module.css'

let user;

class ChatPage extends React.Component {
  state = {
    activeChat: '',
    showChatList: true,
    mobile: window.innerWidth < 600,
  }

  changeChatHandle = id => {
    if (this.state.mobile) {
      this.setState({
        ...this.state,
        activeChat: id,
        showChatList: !this.state.showChatList,
      })
    } else {
      this.setState({
        ...this.state,
        activeChat: id,
      })
    }
  }

  async componentDidMount() {
    if (localStorage.user) {
      user = JSON.parse(localStorage.user);
    }
    // const response = await fetch(`http://localhost:3001/chats/${user._id}`, {
    const response = await fetch(`/api/chats/${user._id}`, {
      cache: 'no-cache',
      credentials: 'include',
    })
    const chats = await response.json();
    this.setState((prevState) => {
      if (chats.length === 0) {
        return {
          ...prevState,
          chats: [],
        };
      } else {
        return {
          ...prevState,
          chats,
          activeChat: chats[0].id
        };
      }
    });
  }

  toggleChatList = () => {
    this.setState({
      ...this.state,
      showChatList: !this.state.showChatList,
    })
  }
  render() {
    return (
      <>
        <Header />
        {!this.state.chats ?
          <div className={styles["loader"]}>
            <div className={styles["center"]}>
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
          :

          <div className="container">
            <div className="row">
              {this.state.showChatList &&
                <div className="col s12 m4">
                  <div className={styles["backgroundField"]}>
                    <div className={styles["header"]}>Собеседники</div>
                    <div className={styles["row"]}>
                      {this.state.chats.map((chat) => (
                        <div key={chat.id}>
                          <ChatList toggleChatList={this.toggleChatList} changeChatHandle={this.changeChatHandle} user={user._id} {...chat} />
                        </div>)
                      )}
                    </div>
                  </div>
                </div>
              }

              {((this.state.mobile && !this.state.showChatList) || (!this.state.mobile)) &&
                this.state.chats.length > 0 && this.activeChat !== ''?
                <div className="col s12 m8">
                  <MessagesField mobile={this.state.mobile} toggleChatList={this.toggleChatList} activeChat={this.state.activeChat} />
                </div> : <></>
              }
            </div>
          </div>}
      </>
    )
  }
}

export default ChatPage;
