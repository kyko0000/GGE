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
            var htmlResponse = showInfo(geneID, data);
            //console.log(htmlResponse);
            res.send(htmlResponse);
        }
        option.path = "/lookup/id/" + geneID +"?expand=1";
        console.log()
        ensemblRestApi.callRestGet(option, getData);
    });



}

var showInfo = function(id, data)
{
    var html="";
    html += "<div class='modal fade' id='dia-" + id + "' role='dialog'>"+
                "<div class='modal-dialog'>"+
                    "<div class='modal-content'>"+
                        "<div class='modal-header'>"+
                            "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
                            "<h4 class='modal-title'>Modal Header</h4>"+
                        "</div>"+
                        "<div class='modal-body'>"+
                            "<p>" + data + "</p>"+
                        "</div>"+
                        "<div class='modal-footer'>"+
                            "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>";
    return html;
}

module.exports.rest = rest;