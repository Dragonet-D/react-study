const Koa = require('koa');
const router = require('koa-router')();
const mongoose = require('mongoose');
const cors = require('koa2-cors');

const app = new Koa();

app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous']
}));

const db = mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

// user db model
const UserScheme = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const User = mongoose.model('User', UserScheme);

const user = {
  username: 'xiaolong',
  password: '123',
  email: ''
};

const newUser = new User(user);
newUser.save();

router.get('/', async (ctx, next) => {
  const data = await User.findOne({ username: 'xiaolong' });
  console.log(data);
  const result = {
    code: 200,
    response: data,
    ts: 12345
  };
  ctx.response.body = result;
  return result;
});

app.use(router.routes());

app.listen(8080);
