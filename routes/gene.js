var express = require('express');
var Chromosome = require('../public/javascripts/chromosome.js');
var http = require('http');
var router = express.Router();


var option = {
    host: 'rest.ensembl.org',
    path:'',
    headers: {'Content-Type': 'application/json'},
    method:'GET'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query.chromosomeName);
    if(req.query.type == "chromosome" || req.query.type == "chromosome-region") {
        option.path = "/info/assembly/human/" + req.query.chromosomeName + "?feature=gene;bands=1";

        var regionJSON;
        if (req.query.type == "chromosome-region") {
            var region = {};
            region.start = req.query.regionStart;
            region.end = req.query.regionEnd;
            regionJSON = JSON.stringify(region);
        }
        var sendData = function(data)
        {
            res.render('gene', {title: 'Genetic General Education System', data: data, region: regionJSON});
        }
        callEnsembl(option, sendData);
    }
    else if(req.query.type="gene-id")
    {
        option.path = "/overlap/id/"+req.query.id+"?feature=gene";
        var genesData;
        var regionJSON;
        var getChromosomeAndRegion = function(data)
        {
            genesData = data;
            var jsonObj = JSON.parse(data);
            var found = false;
            for(i=0; i<jsonObj.length&&!found;i++)
            {
                if(jsonObj[i].id == req.query.id) {
                    option.path = "/info/assembly/human/" + jsonObj[i].seq_region_name + "?feature=gene;bands=1";
                    var region = {};
                    region.start = jsonObj[i].start;
                    region.end = jsonObj[i].end;
                    regionJSON = JSON.stringify(region);
                    found = true;
                    console.log("get")
                }
            }

            //option.path = "/info/assembly/human/" + jsonObj.seq_region_name + "?feature=gene;bands=1"
            regionJSON = JSON.stringify(region);
            callEnsembl(option, sendDataWithGene);
        }
        var sendDataWithGene = function(data)
        {
            res.render('gene',{data: data, genesData: genesData, geneRegion: regionJSON});
        }
        callEnsembl(option, getChromosomeAndRegion);

    }
    //console.log(option.path);
   /* http.get(option, function (resj) {
        resj.setEncoding('utf8');
        //console.log(res.body);
        resj.on('data', function (data) {
            responseString += data;
            //console.log(responseString);
        });
        resj.on('end', function(){
            console.log(responseString);
            res.render('gene', { title: 'Genetic General Education System', data: responseString, region: regionJSON});
        });
    });*/
});

var callEnsembl = function(option, callback)
{
    var responseString="";
    http.get(option, function (res) {
        res.setEncoding('utf8');
        //console.log(res.body);
        res.on('data', function (data) {
            responseString += data;
            //console.log(responseString);
        });
        res.on('end', function(){
            console.log(responseString);
            //res.render('gene', { title: 'Genetic General Education System', data: responseString, region: regionJSON});
            callback(responseString);
        });
    });
}

module.exports = router;
