const express = require('express');

const app = express();
const port = 9000;
app.use(express.static('./dist'));
module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`listening at http://localhost:${port}`);
});
