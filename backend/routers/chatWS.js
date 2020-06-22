const router = require('express').Router();
const User = require('../models/user');
const Chat = require('../models/chat');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);

let chats = {};

router.ws('/:id', (ws, req) => {

  let { id } = req.params;
  id = String(id);

  if (id in chats) {
    if (!chats[id].includes(ws)) {
      chats[id].push(ws);
    }
  } else {
    chats[id] = [ws];
  }

  ws.on('message', async (message) => {
    try {
      let msg = JSON.parse(message);
      msg.time = String(new Date()).slice(16, 24);
      msg.date = new Date();
      let chat = await Chat.findOne({ _id: req.params.id });
      if (!chat) {
        console.log(404)
      }
      let messages = chat.messages;
      messages.push({ firstName: msg.firstName, lastName: msg.lastName, message: msg.message, time: msg.time, userId: msg.userId, date: msg.date });
      chat.save();
      chats[id].forEach((clientWs) => clientWs.send(JSON.stringify(msg)));
    } catch (err) {
      console.log(err.message);
    }
  })

  // ping pong
  ws.on('close', () => {
    chats[id] = chats[id].filter((websocket) => (websocket !== ws))
  });
});

module.exports = router;
