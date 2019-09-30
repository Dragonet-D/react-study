const Koa = require('koa');
const router = require('koa-router')();
const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost/test');

const app = new Koa();

router.get('/', async (ctx, next) => {

});

app.use(router.routes());

app.listen(8080);
