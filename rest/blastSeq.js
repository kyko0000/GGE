/**
 * Created by yuechungng on 23/3/2016.
 */
var blast = require('./blastApi');

function rest(router, data)
{
    router.get('/blastSeq/', function(req,res)
    {
        var rid='';
        var rtoe='';
        var query = req.query.query;
        console.log('get the query: '+ query);
        var checkSearchInfo = function(data)
        {
            if(/\s+Status=WAITING/m.test(data))
            {
                console.log('waiting...');
                setTimeout(function() {blast.checkResultReady(rid, rtoe, checkSearchInfo)}, 5000);
            }
            else if(/\s+Status=READY/m.test(data))
            {
                console.log('Ready...');

            }
            else
            {
                console.log('something wrong');
            }
        }
        var handleRes = function(data)
        {
            //console.log(data);
            var idMatch = data.match(/^    RID = (.*$)/m);
            rid = RegExp.$1;
            var rtoeMatch = data.match(/^    RTOE = (.*$)/m);
            rtoe = RegExp.$1;
            console.log(rid);
            console.log(rtoe);
            blast.checkResultReady(rid,rtoe,checkSearchInfo);
        }
        blast.callBlast(query, handleRes);
    });
}

module.exports.rest = rest;
