const fnIndex = async (ctx, next) => {
  ctx.response.body = 123
};

const fnSignIn = async (ctx, next) => {
  const { name, password } = ctx.request.body;
  if (name === 'name' && password === '12345') {
    ctx.response.body = '123'
  } else {
    ctx.response.body = '234'
  }
};

module.exports = {
  'GET /': fnIndex,
  'POST /': fnSignIn
};
