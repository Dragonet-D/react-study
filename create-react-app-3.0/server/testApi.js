const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const DBUrl = 'mongodb://localhost:27017';
const DB_NAME = 'test';
const COLLECTION = 'user';
const port = 5000;
const app = new express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set access control
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.post('/api/login', (req, res) => {
  const { body } = req;
  MongoClient.connect(DBUrl, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    dbo
      .collection(COLLECTION)
      .find(body)
      .toArray((error, result) => {
        if (!result.length) {
          res.status(403);
          res.send({
            code: '123123'
          })
        } else {
          res.send({
            payload: result[0],
            code: '00000000'
          });
        }
        db.close();
      });
  });
});

app.post('/api/test', (req, res) => {
  const { body } = req;
  MongoClient.connect(DBUrl, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db(DB_NAME);
    console.log(body);
    dbo
      .collection(COLLECTION)
      .find(body)
      .toArray((error, result) => {
        console.log(result);
        res.send({ payload: result });
        db.close();
      });
  });
});

app.listen(port, 'localhost');
console.log(`this server is listening at localhost://${port}`);
