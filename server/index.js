'use strict';

const express = require('express');
const http = require('http');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const moment = require('moment')
const fetch = require('node-fetch');
const base64 = require('base-64');
const passport = require('passport');
const session = require('express-session');
const oauth2 = require('./lib/oauth2');

let app = express();

let username = process.env.ANSATT_USERNAME
let password = process.env.ANSATT_PASSWORD

app.use(cors());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(require('./lib/oauth2').router);

app.use('/app', oauth2.authRequired);
app.use('/app', express.static(__dirname + '/public'));

app.get('/data', (req, res) => {
  fetch('https://ansatt.app.iterate.no/api/people/full', {
    headers: {
      'Authorization': 'Basic ' + base64.encode(username + ':' + password)
    }
  })
  .then(function(response) {
    return response.json();
  }).then(function(json) {
    res.send(json);
  });
});


http.createServer(app).listen(5000, () => {
  console.log("Listen on http://localhost:5000");
});

process.on('SIGINT', function() {
  process.exit();
});
