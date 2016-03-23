/**
 * Created by yuechungng on 23/3/2016.
 */
var blast = require('./blastApi');

function rest(router, data)
{
    router.get('/blastSeq/', function(req,res)
    {
        var query = req.query.query;
        console.log('get the query: '+ query);
        var getResult = function(id, rtoe)
        {

        }
        var handleRes = function(data)
        {
            console.log(data);
        }
        blast.callBlast(query, handleRes);
    });
}

module.exports.rest = rest;
