const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT;
const jwt_key = process.env.JWT_KEY;

app.use(cors());

app.get('/', (req, res) => {
  //health check route
  res.status(200).send({ code: 0, message: 'ok' });
});

app.get('/token', (req, res) => {
  //route to get a token
  let id = Math.random().toString(36).substring(2, 8);
  // We set the expire time of 3 minutes in our token here
  let limit = 60 * 3; // 180 seconds
  // Data.now() gets you millisecond value, which divided by 1000 to get second, because exp value in payload is calculated in seconds
  // Date.now() / 1000 gets us current time in seconds. Because it's decimal value, we use Math.floor to get rid of decimal part
  // Now we have timestamp that is 3 minutes in the future from right now
  let expires = Math.floor(Date.now() / 1000) + limit;
  // unit of exp in the object is second here, but not always, check Web Dev Cody
  let payload = {
    _id: id,
    exp: expires,
  };
  let token = jwt.sign(payload, jwt_key);
  res.status(201).send({ code: 0, message: 'ok', data: token });
});

app.get('/test', (req, res) => {
  //simulate route that needs a valid token to access
  const header = req.header('Authorization');
  const [type, token] = header.split(' ');
  if (type === 'Bearer' && typeof token !== 'undefined') {
    try {
      // if verifies successfully, it returns the payload we setup in front
      let payload = jwt.verify(token, jwt_key);

      // Now we start to calculate the how much time left for the token to be valid
      let current = Math.floor(Date.now() / 1000);
      let diff = payload.exp - current;
      res
        .status(200)
        .send({ code: 0, message: `all good. ${diff} seconds remaining` });
    } catch (err) {
      res.status(401).send({ code: 123, message: 'Invalid or expired token.' });
    }
  } else {
    res.status(401).send({ code: 456, message: 'Invalid token' });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log('Bad things', err);
    return;
  }
  console.log('Listening on port', port);
});
