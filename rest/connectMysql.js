/**
 * Created by yuechungng on 13/3/2016.
 */
var mysql = require('mysql');
var connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'GGE',
        password: 'Password',
        database: 'GeneEducation'
    });



exports.searchGeneByDisease = function(condition, callback)
{
    var result = function(rows, field)
    {
        callback(rows, field);
    }
    var query = "SELECT G.GeneSymbol, G.DiseaseName, D.Def From GeneNDisease AS G, DiseaseDef AS D Where " + condition +";";
    queryMysqlServer(query, result);
};

exports.checkDiseaseBySymbol = function(condition, callback)
{
    var result = function(rows, field)
    {
        var result = rows[0].count;
        callback(result);
    }
    var query = "SELECT COUNT(*) AS count FROM GeneNDisease " + condition + ";";
    queryMysqlServer(query, result);
};

//Get the Diseases and related genes which they are related to the target gene
exports.getDiseaseByGene = function(condition, callback)
{
    var result = function(rows, field)
    {
        callback(rows, field);
    }
    var query = "SELECT G2.ConceptID, G2.GeneSymbol, G2.DiseaseName, D.Def FROM GeneNDisease AS G1, GeneNDisease AS G2, DiseaseDef AS D WHERE " +
        "G1.GeneSymbol = '"+ condition+"' AND G1.ConceptID = G2.ConceptID AND G1.ConceptID = D.CUI ORDER BY G2.ConceptID;"
    queryMysqlServer(query, result);
}

exports.fetchAllChromosome = function(callback)
{
    var result = function(rows, field)
    {
        callback(rows);
    }
    var query = "SELECT * FROM Chromosome ORDER BY ChrOrder;"
    queryMysqlServer(query, result);
}

 queryMysqlServer = function(query, callback)
{
    //connection.connect();
    console.log(query);
    connection.query(query, function(err, rows, fields)
    {
        if(err) throw err;
        callback(rows, fields);
    });
    //connection.end();

}
