/**
 * Created by yuechungng on 13/3/2016.
 */
var mysql = require('./connectMysql.js');
var ensemblRestApi = require('./ensemblRestApi.js');

var option = {
    host: 'rest.ensembl.org',
    path: '',
    headers: {'Content-Type': 'application/json'},
    method: 'GET'
}

function rest(router, data)
{
    router.get('/geneFromDisSym/', function(req,res)
    {
        var result = {}; //for sending the result
        var queryString = req.query.queryString;
        //searching by symbol from ensembl
        option.path = 'lookup/symbol/human/'+queryString;
        console.log(option.path);
        var symbolData = '';
        //searching by disease from db;
        var condition = "DiseaseName Like '%"+queryString+"%' OR GeneSymbol Like '%"+queryString+"%'";

        var symbolResult = function(data)
        {
            var dataObj = JSON.parse(data);
            if(!dataObj.error)
            {
                console.log("Symbol Found");
                //var symbolData = dataObj;
                result.haveSymbol = 1;
                result.symbolData = dataObj;
                var condition = "GeneSymbol = '"+queryString+"'";
            }
            else
            {
                result.haveSymbol = 0;
                console.log('No Symbol found');
                var condition = "DiseaseName Like '%"+queryString+"%'";
            }
            mysql.searchGeneByDisease(condition, diseaseData);
        };
        var diseaseData = function(rows, fields)
        {
            if(rows.length > 0)
            {
                result.haveDisease = 1;
                result.rows = rows;
                result.field = fields;
                var dataJson = JSON.stringify(result);
                console.log(dataJson);
                res.send(dataJson);
            }
            else
            {
                result.haveDisease = 0;
                var dataJson = JSON.stringify(result);
                console.log(dataJson);
                res.send(dataJson);
            }
        };
        if(req.query.queryString.indexOf(' ') > 0)
        {
            mysql.searchGeneByDisease(condition, diseaseData);
        }
        else {
            ensemblRestApi.callRestGet(option, symbolResult);
        }
    });
}

module.exports.rest = rest;