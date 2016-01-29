/**
 * Created by yuechungng on 26/1/2016.
 */
//var express = require('express');
//var http = require('http');
//var router = express.Router();
//var util = require('util');
var ensemblRestApi = require('./ensemblRestApi');

var option = {
    host: 'rest.ensembl.org',
    path: '',
    headers: {'Content-Type': 'application/json'},
    method: 'GET'
}
function rest(router, data) {


    router.get('/get_gene/', function (req, res) {
        var chromosome = req.query.chromosome;
        var start = req.query.start;
        var end = req.query.end;
        var length = end - start;
        var getData = function(data)
        {
            console.log("Data: " + data);
            var jsonObj = JSON.parse(data);
            var html = "";
            for(i=0; i<jsonObj.length;i++)
            {
                var isComplete = 0;
                if(jsonObj[i].start >= start && end >= jsonObj[i].end)
                {
                    isComplete = 1;
                }
                html += "<tr class='gene' id='" + jsonObj[i].gene_id + "' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-isComplete='" + isComplete + "'>";
                html += "<td class='title'>" + jsonObj[i].external_name +  "</td><td class='data'>";
                if(isComplete) {
                    html += "<div class='gene-padding' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%'></div>";
                    html += "<div class='gene-position' style='width:" + ((jsonObj[i].end - jsonObj[i].start) / length) * 100 + "%'></div>";
                    html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
                }
                else if(start > jsonObj[i].start) //overlap from the begining
                {
                    html += "<div class='gene-position' style='width:" + ((jsonObj[i].end - start) / length) * 100 + "%'></div>";
                    html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
                }
                else if(end < jsonObj[i].end) //overlap at the end
                {
                    html += "<div class='gene-padding' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%'></div>";
                    html += "<div class='gene-position' style='width:" + ((end - jsonObj[i].start) / length) * 100 + "%'></div>";
                }
                html += "</td></tr>";
            }
            res.send(html);
        }
        option.path = "/overlap/region/human/"+ chromosome +':' + start + "-" + end +"?feature=gene;";
        console.log(option.path);
        var response = ensemblRestApi.callRestGet(option, getData);

    });

}

module.exports.rest = rest;