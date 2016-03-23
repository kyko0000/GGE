/**
 * Created by yuechungng on 23/3/2016.
 */
var express = require('express');
var http = require('http');
var router = express.Router();

router.get('/', function(req, res, next)
{
    res.render('blast');
});

module.exports = router;