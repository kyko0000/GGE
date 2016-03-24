/**
 * Created by yuechungng on 23/3/2016.
 */
var http = require('http');

var database ='GPIPE/9606/current/all_top_level%20GPIPE/9606/current/rna';
var option =
{
    host: 'www.ncbi.nlm.nih.gov',
    headers : {'Content-Type': 'application/x-www-form-urlencoded'},
    method:'POST'
}

exports.callBlast = function(query, callback)
{
    var result='';
    option.path = '/blast/Blast.cgi?CMD=Put&PROGRAM=blastn&DATABASE='+database+'&QUERY='+query;
    console.log('ready to call blast... Path :'+ option.path);
    http.get(option, function(res)
    {
        res.setEncoding('utf8');
        res.on('data', function(chunk)
        {
            console.log("blast data retriving...");
            result += chunk;
        });
        res.on('end', function()
        {
            //console.log(result);
            callback(result);
        })
    })
}

exports.checkResultReady = function(rid, rtoe, callback)
{
    option.path='/blast/Blast.cgi?RID='+rid+'&CMD=Get';
    console.log('Checking the search info...');
    var result='';
    http.get(option, function(res)
    {
        res.on('data', function(chunk)
        {
            console.log('search info data retriving...');
            result += chunk;
        });
        res.on('end', function()
        {
            console.log(result);
            callback(result);
        })
    });
};
