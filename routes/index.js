var express = require('express');
var Chromosome = require('../public/javascripts/chromosome.js');
var http = require('http');
var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.historyCookies !== undefined)
  {
    var cookieString = JSON.stringify(req.cookies.historyCookies);
    console.log(req.cookies.historyCookies)
    res.render('index', {cookies: cookieString});
  }
  else
  {
    res.cookie('name', 'hello');
    res.render('index', {cookies: '0'});
  }
});

module.exports = router;
