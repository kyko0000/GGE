/**
 * Created by yuechungng on 15/2/2016.
 */
var search = function()
{
    $(".spinner-div").show();
    var searchString = $("#query-string").val();
    var query={};
    // query chromosome or with region
    if(searchString.substring(0,3).toLowerCase() == "chr"&&searchString.search(":")!= -1)
    {
        query.type="chromosome";
        query.chromosomeName = searchString.substring(3,searchString.search(":"));
        if(query.chromosomeName != 'x' && query.chromosomeName != 'y' && parseInt(query.chromosomeName) > 22)
        {
            alert("No Chromosome " +  query.chromosomeName + " in human");
            return;
        }
        //query region
        if(searchString.search(':') != searchString.length-1)
        {
            var start = searchString.substring(searchString.search(":")+1, searchString.search("-"));
            var end = searchString.substring(searchString.search("-")+1, searchString.length);
            if(isNaN(start)||isNaN(end) || end < start || end - start > 5000000) {
                alert("region not valid");
                return;
            }
            query.regionStart = start;
            query.regionEnd = end;
            query.type = "chromosome-region";
        }
        callEnsemblAjax(query);
    }
    else if(searchString.substring(0,4).toLowerCase() == "ensg"&&searchString.search(":") == -1)//search by gene ID
    {
        //alert("ok");
        query.type="gene-id";
        query.id = searchString;
        callEnsemblAjax(query);
    }
    else //search by symbol
    {
        query.type = "symbol";
        query.symbol = searchString;
        callEnsemblAjax(query);
    }

}

var callEnsemblAjax = function(query)
{
    $.ajax(
        {
            url: './gene',
            data: query,
            type: 'GET',
            success:function(data)
            {
                $(".container").remove();
                $('body').append(data);
            }
            ,
            error: function(xhr, status, error)
            {
                alert("Error: "+ error.message);
            }
        });
}