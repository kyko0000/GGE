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

exports.getDiseaseByGene = function(condition, callback)
{
    var result = function(rows, field)
    {
        callback(rows, field);
    }
    var query = "SELECT G.DiseaseName, D.DEF FROM GeneNDisease AS G, DiseaseDef AS D "+ condition+";"
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
