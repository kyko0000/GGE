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

function rest(router, data) {
    router.get('/geneFromDisSym/', function (req, res) {
        var functionType = req.query.type;
        if (functionType == 'search') {
            var result = {}; //for sending the result
            var queryString = req.query.queryString;
            //searching by symbol from ensembl
            option.path = 'lookup/symbol/human/' + queryString;
            console.log(option.path);
            var symbolData = '';
            //searching by disease from db;
            var condition = "(G.DiseaseName Like '%" + queryString + "%' OR G.GeneSymbol Like '%" + queryString + "%') AND D.CUI = G.ConceptID ";

            var symbolResult = function (data) {
                var dataObj = JSON.parse(data);
                if (!dataObj.error) {
                    console.log("Symbol Found");
                    //var symbolData = dataObj;
                    result.haveSymbol = 1;
                    result.symbolData = dataObj;
                    var condition = "G.GeneSymbol = '" + queryString + "' and D.CUI = G.ConceptID";
                }
                else {
                    result.haveSymbol = 0;
                    console.log('No Symbol found');
                    var condition = "G.DiseaseName Like '%" + queryString + "%' AND D.CUI = G.ConceptID";
                }
                mysql.searchGeneByDisease(condition, diseaseData);
            };
            var diseaseData = function (rows, fields) {
                if (rows.length > 0) {
                    result.haveDisease = 1;
                    result.rows = rows;
                    result.field = fields;
                    var dataJson = JSON.stringify(result);
                    console.log(dataJson);
                    res.send(dataJson);
                }
                else {
                    result.haveDisease = 0;
                    var dataJson = JSON.stringify(result);
                    console.log(dataJson);
                    res.send(dataJson);
                }
            };
            if (req.query.queryString.indexOf(' ') > 0) {
                mysql.searchGeneByDisease(condition, diseaseData);
            }
            else {
                ensemblRestApi.callRestGet(option, symbolResult);
            }
        }
        else if(functionType == 'check')
        {
            var symbol = req.query.symbol;
            var condition = "Where GeneSymbol = '"+symbol+"'";
            var sendData = function(result)
            {
                result = JSON.stringify(result);
                res.send(result);
            }
            mysql.checkDiseaseBySymbol(condition,sendData);
        }
        else if(functionType == 'disease')
        {
            var symbol = req.query.symbol;
            var sendData = function(rows, field)
            {
                if(rows.length == 0)
                {
                    var result = {};
                    result.count = 0;
                    var resultString = JSON.stringify(result);
                    res.send(resultString);
                }
                else {
                    var result = [];
                    var currentConceptID = rows[0].ConceptID;
                    var diseaseObject = {};
                    diseaseObject.diseaseName = rows[0].DiseaseName;
                    diseaseObject.diseaseDef = rows[0].Def;
                    diseaseObject.symbol = [];
                    diseaseObject.symbol.push(rows[0].GeneSymbol);
                    for (i = 1; i < rows.length; i++) {
                        if (rows[i].ConceptID == currentConceptID) {
                            diseaseObject.symbol.push(rows[i].GeneSymbol);
                        }
                        else {
                            console.log(rows[i].DiseaseName)
                            result.push(diseaseObject);
                            diseaseObject = {};
                            diseaseObject.diseaseName = rows[i].DiseaseName;
                            diseaseObject.diseaseDef = rows[i].Def;
                            diseaseObject.symbol = [];
                            diseaseObject.symbol.push(rows[i].GeneSymbol);
                            currentConceptID = rows[i].ConceptID;
                        }
                    }
                    result.push(diseaseObject); //add last object
                    console.log(result);
                    var resultString = JSON.stringify(result);
                    //var stringData = JSON.stringify(rows);
                    //console.log(stringData);
                    res.send(resultString);
                }
            }
            mysql.getDiseaseByGene(symbol, sendData);

        }
    });



}

module.exports.rest = rest;