/**
 * Created by yuechungng on 27/1/2016.
 */
var http = require('http');

exports.callRestGet = function(option, callBack)
{
    http.get(option, function(res)
    {
        var response = "";
        res.setEncoding('utf8');
        res.on('data', function(data)
        {
            response += data;
        });
        res.on('end', function()
        {
            console.log('get finished');
            callBack(response);
        });
    });
}



