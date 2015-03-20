var express = require('express');

var app = module.exports = express();

app.get('/', require('./routes/home').get);
