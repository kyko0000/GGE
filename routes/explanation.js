/**
 * Created by yuechungng on 19/2/2016.
 */
var express = require('express');
var http = require('http');
var router = express.Router();

router.get('/', function(req, res, next)
{
    res.render('explanation',{});
})

module.exports = router;