const Koa = require('koa');
const router = require('koa-router')();
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

const app = new Koa();

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
  let val = null;
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
