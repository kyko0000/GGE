/**
 * Created by yuechungng on 4/2/2016.
 */
var ensemblRestApi = require('./ensemblRestApi');
var option = {
    host : 'rest.ensembl.org',
    path : '',
    headers : {'Content-Type': 'application/json'},
    method : 'GET'
}

function rest(router, data)
{
    router.get(/gene_info/, function(req, res){
        var geneID = req.query.id;
        //res.send(showInfo(geneID));
        var getData = function(data)
        {
            console.log("Data: " + data);
            //var jsonObj = JSON.parse(data);
            //var htmlResponse = showInfo(geneID, jsonObj);
            //console.log(htmlResponse);
            res.send(data);
        }
        option.path = "/lookup/id/" + geneID +"?expand=1";
        console.log()
        ensemblRestApi.callRestGet(option, getData);
    });



}
/*
var showInfo = function(id, jsonObj)
{
    //separate transcript info from gene info
    var transcripts=[];
    for(i=0; i<jsonObj.Transcript.length; i++)
    {
        transcripts.push(jsonObj.Transcript[i]);
    }
    console.log(transcripts.length);
    //modal with gene information
    var html="";
    html += "<div class='modal fade' id='dia-" + id + "' role='dialog'>"+
                "<div class='modal-dialog'>"+
                    "<div class='modal-content'>"+
                        "<div class='modal-header'>"+
                            "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
                            "<h4 class='modal-title'>" + jsonObj.display_name + "</h4>"+
                        "</div>"+
                        "<div class='modal-body'>"+
                            "<p><b>Gene ID:&emsp;</b>" + jsonObj.id + "</p>"+
                            "<p> Gene Name:&emsp;" + jsonObj.display_name + "</p>"+
                            "<p> Description:&emsp;"+ jsonObj.description +"</p>" +
                            "<p> Start:&emsp;" + jsonObj.start + "</p>"+
                            "<p> End:&emsp;" + jsonObj.end + "</p>"+
                            "<p> Transcript: </p>"+
                            "<div class='modal-transcript-table'>"+
                                "<div class='transcript-tr">+
                                    "<div class='transcript-td transcript-id transcript-title'>Transcript ID</div>"+
                                    "<div class='transcript-td transcrpt-name transcript-title'>Name</div>"+
                                    "<div class='transcript-td transcrpt-biotype transcript-title'>Biotype</div>"+
                                "</div>"+
                                createTranscriptTable(transcripts)+
                            "</div>"+
                        "</div>"+
                        "<div class='modal-footer'>"+
                            "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
    console.log(html);
    return html;
}

var createTranscriptTable = function(transcripts)
{
    var html = "";
    for(i=0; i<transcripts.length;i++) {
        html += "<div transcript-tr>"+
            "<div class='transcript-td transcript-id'>" + transcripts[i].id + "</div>" +
            "<div class='transcript-td transcript-name'>" + transcripts[i].display_name + "</div>" +
            "<div class='transcript-td transcript-biotype'>" + transcripts[i].biotype + "</div>"+
            "</div>";
    }
    console.log(html);
    return html;

}
*/
module.exports.rest = rest;