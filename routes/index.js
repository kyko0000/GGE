var express = require('express');
var Chromosome = require('../public/javascripts/chromosome.js');
var http = require('http');
var router = express.Router();


var option = {
  host: 'rest.ensembl.org',
  path:'/info/assembly/human/2?feature=gene;bands=1',
  headers: {'Content-Type': 'application/json'},
  method:'GET'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  var chromosomeJson;
  var responseString="";
  http.get(option, function (resj) {
    resj.setEncoding('utf8');
    console.log(res.body);
    resj.on('data', function (data) {
      responseString += data;
      //console.log(responseString);
    });
    resj.on('end', function(){
        console.log(responseString);
        res.render('index', { title: 'Genetic General Education System', data: responseString});
    });
  });
});

module.exports = router;
