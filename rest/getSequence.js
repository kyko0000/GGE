/**
 * Created by yuechungng on 25/2/2016.
 */
var ensemblRestApi = require('./ensemblRestApi');
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
        var getData = function(sequence)
        {
            console.log(sequence);
            res.send(sequence);
        }
        option.path = "/sequence/id/"+id;
        if(mask == 'true')
        {
            option.path +="?mask_feature=1";
        }
        ensemblRestApi.callRestGet(option, getData);
    })
}

module.exports.rest = rest;