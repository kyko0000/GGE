/**
 * Created by yuechungng on 13/3/2016.
 */
var mysql = require('./connectMysql.js');

function rest(router, data)
{
    http.get('/getGeneByDisease/', function(req,res)
    {
        var queryString = req.query.queryString;
        var condition = "DiseaseName Like '%"+queryString+"%'";
        var sendData = function(rows, fields)
        {
            var data = {};
            if(rows.length > 0)
            {
                data.haveResult = 1;
                data.rows = rows;
                data.field = fields;
                var dataJson = JSON.stringify(data);
                res.send(dataJson);
            }
            else
            {
                data.haveResult = 0
                var dataJson = JSON.stringify(data);
                res.send(dataJson);
            }
        };
        mysql.queryMysqlServer(condition, sendData);
    });
}