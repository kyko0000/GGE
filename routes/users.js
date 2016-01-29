var express = require('express');
var http = require('http');
var router = express.Router();
var util = require('util');

/* GET users listing. */

var option = {
  host: 'rest.ensembl.org',
  path:'lookup/symbol/human/ABO?',
  headers: {'Content-Type': 'application/json'},
  method:'GET'
};

var keepGoing = false;

router.get('/', function(req, res, next) {
  var responseString;
  //call api
  var done = false;
  http.get(option, function (resj) {
    resj.setEncoding('utf8');
    console.log(res.body);
    resj.on('data', function (data) {
      responseString += JSON.stringify(data) + "\n";
      //console.log(responseString);
    });
    resj.on('end', function(){

      res.send(responseString);
    });
  });

});

function rest() {
  try {
    var responseString = '';
    http.get(option, function (res) {
      res.setEncoding('utf8');
      console.log(res.body);
      res.on('data', function (data) {
        responseString += JSON.stringify(data);
        console.log(responseString);
      });
      res.on('end', function(){
        console.log('hi');
        return responseString;
      });
    });
  }catch(e){
    console.log(e);
  }
}


module.exports = router;
