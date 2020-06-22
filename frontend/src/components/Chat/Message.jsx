import React from 'react';
import styles from './MessageField.module.css';

let user;
if (localStorage.user) {
  user = JSON.parse(localStorage.user);
}

export default class Message extends React.Component {
  render() {
    const userID = String(user._id);
    const userMessageID = String(this.props.userId);
    const userMessage = userID === userMessageID;
    return (
      <>
        {userMessage ?
          <div className={styles["right-msg"]}>
            <div
              className={styles["msg-img"]}
              style={this.props.avatar ? { backgroundImage: "url(" + this.props.avatar +")" } : { backgroundImage: "url(/img/defaultavatar.png)" }}
            ></div>
            <div className={styles["msg-bubble"]}>
              <div className={styles["msg-info"]}>
                <div className={styles["msg-info-name"]}>{this.props.firstName} {this.props.lastName}</div>
                <div className={styles["msg-info-time"]}>{this.props.time}</div>
              </div>

              <div className={styles["msg-text"]}>
                {this.props.message}
              </div>
            </div>
          </div>
          :
          <div className={styles["left-msg"]}>
            <div
              className={styles["msg-img"]}
              style={this.props.partnerAvatar ? { backgroundImage: "url(" + this.props.partnerAvatar +")" } : { backgroundImage: "url(/img/defaultavatar.png)" }}
            ></div>

            <div className={styles["msg-bubble"]}>
              <div className={styles["msg-info"]}>
                <div className={styles["msg-info-time"]}>{this.props.time}</div>
                <div className={styles["msg-info-name"]}>{this.props.firstName} {this.props.lastName}</div>
              </div>

              <div className={styles["msg-text"]}>
                {this.props.message}
              </div>
            </div>
          </div>}
      </>
    )
  }
}
