 /**
 * Created by yuechungng on 26/1/2016.
 */

 var express = require('express');
 var router = express.Router();

 router.use(function(req, res, next){
     console.log('RESTful calls....');

     next();
 });

 require('./getGene').rest(router);
 require('./GeneInfo').rest(router);
 require('./getSequence').rest(router);
 require('./getGeneFromDiseaseOrSymbol').rest(router);

 module.exports = router;