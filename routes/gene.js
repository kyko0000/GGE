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
    console.log("Search by chromosome: "+ req.query.chromosomeName);
    if(req.query.type == "chromosome" || req.query.type == "chromosome-region") { //chromosome search
        option.path = "/info/assembly/human/" + req.query.chromosomeName + "?feature=gene;bands=1";

        var regionJSON;
        if (req.query.type == "chromosome-region") //region
        {
            console.log("Search by region: "+req.query.regionStart+" - "+req.query.regionEnd);
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
    else if(req.query.type=="gene-id") //gene id search
    {
        console.log("Search by Gene ID= " + req.query.id);
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
                    console.log("Get the target gene..")
                }
            }
            regionJSON = JSON.stringify(region);
            callEnsembl(option, sendDataWithGene);
        }
        //call back for output data
        var sendDataWithGene = function(data)
        {
            res.render('gene',{data: data, genesData: genesData, geneRegion: regionJSON});
        }

        callEnsembl(option, getChromosomeAndRegion);

    }
    else if(req.query.type == "symbol") //gene symbol search
    {
        var geneRegion={};
        option.path = "lookup/symbol/human/"+ req.query.symbol;
        console.log("Passed a symbol:" + req.query.symbol);
        var getChromosome = function(data)
        {
            var gene = JSON.parse(data);
            geneRegion.start = gene.start;
            geneRegion.end = gene.end;
            regionJSON = JSON.stringify(geneRegion)
            option.path = "/info/assembly/human/" + gene.seq_region_name + "?feature=gene;bands=1";
            callEnsembl(option, sendData)

        }
        var sendData = function(data)
        {
            res.render('gene', {title: 'Genetic General Education System', data: data, region: regionJSON});
        }
        callEnsembl(option, getChromosome);


    }
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
