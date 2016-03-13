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
    queryMysqlServer(condition, result);
}

var queryMysqlServer = function(query, callback)
{
    connection.connect();
    connection.query(query, function(err, rows, fields)
    {
        if(err) throw err;
        callback(rows, fields);
    });

}
