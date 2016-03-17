/**
 * Created by yuechungng on 17/3/2016.
 */
var mysql = require('./connectMysql.js');

function rest(router, data)
{
    router.get('/getChromosome/', function(req, res)
    {
        var sendChromosome = function(data)
        {
            var dataString = JSON.stringify(data);
            console.log(dataString);
            res.send(dataString);
        }
        mysql.fetchAllChromosome(sendChromosome);
    })
}

module.exports.rest = rest;