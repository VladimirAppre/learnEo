const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
require('dotenv').config();
require('express-ws')(app);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, });

const registerRouter = require('./routers/register');
const loginRouter = require('./routers/login');
const logoutRouter = require('./routers/logout');
const profileRouter = require('./routers/profile');
const skillsRouter = require('./routers/skills');
const matchingRouter = require('./routers/matching');
const chatRouter = require('./routers/chat');
const chatWebSocketRouter = require('./routers/chatWS');

app.use(express.static(path.resolve('../frontend/build/')));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))




const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: 'userSession',
});

store.on('error', function (error) {
  console.log(error);
});

app.use(session({
  store: store,
  secret: process.env.SESSION_SECRET,
  secret: 'dd',
  key: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 1000 * 60 * 60 * 24 * 7,
    secure: false,
  },
}));

app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/profile', profileRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/match', matchingRouter);
app.use('/api/chat', chatWebSocketRouter);
app.use('/api/chats', chatRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('../frontend/build/index.html'));
})

app.listen(process.env.PORT || 3000)
