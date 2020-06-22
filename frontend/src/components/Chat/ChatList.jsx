import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ChatList.module.css'

export default class ChatList extends React.Component {

  state = {
    avatar: '/img/defaultavatar.png',
  }

  async componentDidMount() {
    // const response = await fetch(`http://localhost:3001/profile/${this.props.partner.id}`, {
    const response = await fetch(`/api/profile/${this.props.partner.id}`, {
      cache: 'no-cache',
    })
    const request = await response.json();
    if (request.avatar) {
      this.setState({
        avatar: request.avatar,
      });
    };
  }

  render() {
    return (
      <>
        <div className={styles["chat-list"]}>
          <div id={this.props.id} onClick={() => { this.props.changeChatHandle(this.props.id) }} className={styles.chatBlock}>
            <Link to={`/profile/${this.props.partner.id}`}>
              <div className={styles["chat-list-avatar"]} style={{ backgroundImage: "url(" + this.state.avatar + ")" }}></div>
            </Link>
            <div>
              {String(this.props.partner.firstName + this.props.partner.lastName).length > 15 ?
                `${this.props.partner.firstName} ${this.props.partner.lastName}`.slice(0, 15) + '...' :
                `${this.props.partner.firstName} ${this.props.partner.lastName}`}
            </div>
          </div>
        </div>
      </>
    )
  }
}
