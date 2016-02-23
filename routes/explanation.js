/**
 * Created by yuechungng on 19/2/2016.
 */
var express = require('express');
var http = require('http');
var router = express.Router();

router.get('/', function(req, res, next)
{

    var option =
    {
        host:'rest.ensembl.org',
        path:'/overlap/id/'+req.query.id+'?feature=gene;feature=transcript;feature=exon;feature=cds',
        headers:{'Content-Type':'application/json'},
        type: 'GET'
    }
    var callEnsembl = function(callback)
    {
        var response="";
        http.get(option, function(res)
        {
            res.on('data', function(data)
            {
              response+=data;
            })
            res.on('end', function()
            {
                console.log("response: " + response);
                callback(response);
            })
        })
    }
    var responseData = function(data)
    {
        var id = req.query.id;
        var jsonObj = JSON.parse(data);
        var transcriptObjs = [];
        var exonObjs = [];
        var cdsObjs = [];
        var transcriptIDs = [];
        for (i=0; i<jsonObj.length; i++)
        {
            //console.log(jsonObj[i].feature_type);
            if(jsonObj[i].feature_type == "transcript" && jsonObj[i].Parent == id)
            {
                console.log("transcript");
                transcriptObjs.push(jsonObj[i]);
                transcriptIDs.push(jsonObj[i].id);
            }
            else if(jsonObj[i].feature_type == "exon")
            {
               exonObjs.push(jsonObj[i]);
            }
            else if(jsonObj[i].feature_type == "cds")
            {
                cdsObjs.push(jsonObj[i]);
            }
        }
        for (i=0; i<exonObjs.length; i++)
        {
            if(transcriptIDs.indexOf(exonObjs[i].Parent) == -1)
            {
                exonObjs.splice(i,1);
            }
        }
        for (i=0;i<cdsObjs.length;i++)
        {
            if(!transcriptIDs.indexOf(cdsObjs[i].Parent) == -1)
            {
                cdsObjs.splice(i,1);
            }
        }
        var transcripts = JSON.stringify(transcriptObjs);
        var exons = JSON.stringify(exonObjs);
        var cds = JSON.stringify(cdsObjs);
        console.log(transcripts);
        console.log(exons);
        console.log(cds);

        res.render('explanation', {transcripts: transcripts, exons: exons, cds: cds ,id: id});
    }
    callEnsembl(responseData);
})

module.exports = router;