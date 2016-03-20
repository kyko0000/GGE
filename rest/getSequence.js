/**
 * Created by yuechungng on 25/2/2016.
 */
var ensemblRestApi = require('./ensemblRestApi');
var async = require('async');
var option = {
    host: 'rest.ensembl.org',
    path: '',
    headers: {'Content-Type':'application/json'},
    method: 'GET'
}

function rest(router, res)
{
    router.get('/getSequence',function(req, res)
    {
        var id = req.query.id;
        var mask = req.query.mask;
        var type = req.query.type;
        var getData = function(sequence)
        {
            //console.log(sequence);
            var sequenceObj = JSON.parse(sequence);
            //mask the sequence
            var seqText = sequenceObj.seq;
            async.series([
                function(callback)
                {
                    seqText = seqText.replace(/[A-Z]+/g, "<span style='background-color:green'>$&</span>");
                    callback(null, seqText);
                }
            ],function(err, results)
            {
                sequenceObj.seq = results[0];
                console.log(results[0]);
                var sequenceResult = JSON.stringify(sequenceObj);
                res.send(sequenceResult);
            });

        }
        option.path = "/sequence/id/"+id+"?type="+type+";multipile_sequences=1;";
        if(mask == 'true')
        {
            option.path +="mask_feature=1";
        }
        ensemblRestApi.callRestGet(option, getData);
    })
}

module.exports.rest = rest;