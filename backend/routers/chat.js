const router = require('express').Router();
const User = require('../models/user');
const Chat = require('../models/chat');
const express = require('express');

// Ручка создания нового чата
router.route('/newChat')

  .get(async (req, res) => {
    let { id1, id2 } = req.query

    // Проверяем не пытается ли пользователь чатиться сам с собой
    try {
      if (id1 === id2) {
        return res.status(200).json({ sameUser: true });
      }

      // Проверяем нет существует ли такой же чат, чтобы не дублировать
      if (id1 > id2) {
        [id1, id2] = [id2, id1];
      }
      const chatID = id1 + id2;
      const chatExist = await Chat.findOne({ id: chatID })
      if (chatExist) {
        return res.status(200).json(chatExist);
      }

      // Создаем чат
      const newChat = new Chat({
        id: chatID,
        messages: [],
        dateCreation: new Date(),
      });

      // Добавляем 1му пользователю чат в рефы и в чат добавляем firstUser в чат
      let user1 = await User.findOne({ _id: req.query.id1 });
      if (!user1) {
        res.status(404).json({ error: 'Пользователя не существует' });
      } else {
        newChat.firstUser = {
          id: user1._id,
          firstName: user1.firstName,
          lastName: user1.lastName,
        };
        user1.chats.push(newChat._id);
      };
      await user1.save();

      // Добавляем 2му пользователю чат в рефы и в чат добавляем secondUser в чат
      let user2 = await User.findOne({ _id: req.query.id2 })
      if (!user2) {
        res.status(404).json({ error: 'Пользователя не существует' });
      } else {
        newChat.secondUser = {
          id: user2._id,
          firstName: user2.firstName,
          lastName: user2.lastName,
        };
        user2.chats.push(newChat._id);
      };
      await user2.save();

      // Сохраняем чат  и отправляем на фронт
      await newChat.save();
      return res.status(200).json(newChat);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

// Отдаем все чаты по запросу на id пользователя
router.route('/:id')

  .get(async (req, res) => {
    if(req.session.user) {
    try {
      let userSend = [];
      const user = await User.findOne({ _id: req.params.id }).populate('chats');
      let chats = user.chats;
      chats.sort(function (prevChat, nextChat) {
        let prevChatLastMessageDate;
        let nextChatLastMessageDate;
        if (prevChat.messages.length > 0) {
          prevChatLastMessageDate = prevChat.messages[prevChat.messages.length - 1].date;
        } else {
          prevChatLastMessageDate = prevChat.dateCreation;
        }
        if (nextChat.messages > 0) {
          nextChatLastMessageDate = nextChat.messages[nextChat.messages.length - 1].date;
        } else {
          nextChatLastMessageDate = nextChat.dateCreation;
        }
        if (prevChatLastMessageDate < nextChatLastMessageDate) {
          return 1;
        }
        if (prevChatLastMessageDate > nextChatLastMessageDate) {
          return -1;
        }
        return 0;
      });
      chats.forEach((chat) => {
        let partner;
        if (String(chat.firstUser.id) === String(req.params.id)) {
          partner = chat.secondUser;
        } else {
          partner = chat.firstUser;
        }
        userSend.push({
          id: chat._id,
          partner,
        });
      });
      return res.status(200).json(userSend);
    } catch (err) {
      return res.status(500).json({ getChats: false });
    };
  };
  res.status(200).json({error: 'Вы не вошли в систему'})
  });


// Получение сообщений для чата
router.route('/messagesHistory/:id')

  .get(async (req, res) => {
    if(req.session.user) {
      try {
        const chat = await Chat.findOne({ _id: req.params.id });
        return res.status(200).json(chat);
      } catch (err) {
        return  res.status(500).json({ getMessagesHistory: false });
      };
    };
    res.status(200).json({error: 'Вы не вошли в систему'})
  });

module.exports = router;
