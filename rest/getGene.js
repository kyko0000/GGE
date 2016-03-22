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
            var cookiesData ={};
            cookiesData.type = 'chromosome-region';
            cookiesData.chr = chromosome;
            cookiesData.regionStart = start;
            cookiesData.regionEnd = end;
            res.cookie('historyCookies', cookiesData,{maxAge:7*24*3600000, httpOnly:true});
            res.send(data);
        }
        option.path = "/overlap/region/human/"+ chromosome +':' + start + "-" + end +"?feature=gene;";
        console.log(option.path);
        ensemblRestApi.callRestGet(option, getData);

    });

}

/*var drawGene = function(jsonObj, length, start, end)
{
    var html = "";
    for(i=0; i<jsonObj.length;i++)
    {
        var isComplete = 0;
        var geneLength = (jsonObj[i].end - jsonObj[i].start) / length;
        if(jsonObj[i].start >= start && end >= jsonObj[i].end)
        {
            isComplete = 1;
            if(geneLength < 0.001)
            {
                html += "<tr class='gene short' id='" + jsonObj[i].gene_id + "' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-isComplete='" + isComplete + "'>";
            }
            else
            {
                html += "<tr class='gene' id='" + jsonObj[i].gene_id + "' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-isComplete='" + isComplete + "'>";
            }
        }
        else {
            html += "<tr class='gene overlap' id='" + jsonObj[i].gene_id + "' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-isComplete='" + isComplete + "'>";
        }
        html += "<td class='title gene-name'>" + jsonObj[i].external_name +  "</td><td class='data'>";
        if(isComplete) {
            var geneLength = (jsonObj[i].end - jsonObj[i].start) / length;
            html += "<div class='gene-padding' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%'></div>";
            html += "<SVG class='gene-position' style='width:" + ((jsonObj[i].end - jsonObj[i].start) / length) * 100 + "%' viewBox='0 0 100 100' preserveAspctRaio='none' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "'>" +
                "<polygon points='0,60 75,60 75,50 100,70 75,90 75,80 0,80 0,60' style='fill:red;stroke:purple;stroke-width:1' />" + "</SVG>";
            html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
        }
        else if(start > jsonObj[i].start && jsonObj[i].end <= end) //overlap from the begining
        {
            html += "<div class='gene-position left' style='width:" + ((jsonObj[i].end - start) / length) * 100 + "% data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end +"'></div>";
            html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
        }
        else if(end < jsonObj[i].end && start <= jsonObj[i].start) //overlap at the end
        {
            html += "<div class='gene-padding right' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end +"></div>";
            html += "<div class='gene-position' style='width:" + ((end - jsonObj[i].start) / length) * 100 + "%'></div>";
        }
        else
        {
            html+="<div class='gene-position' style='width:100%'></div>";
        }
        html += "</td></tr>";
    }
    return html;
}*/

module.exports.rest = rest;