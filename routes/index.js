var express = require('express');
var Chromosome = require('../public/javascripts/chromosome.js');
var http = require('http');
var router = express.Router();




/* GET home page. */
router.get('/', function(req, res, next) {
  var chromosomeJson;
  var responseString="";

  res.render('index', { title: 'Genetic General Education System'});
});

module.exports = router;
