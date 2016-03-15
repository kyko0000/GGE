/**
 * Created by yuechungng on 14/3/2016.
 */
function SearchResult(result) {
    // this.result = result.replace(/&quot;/g, '"');
    this.resultObj = JSON.parse(result);

    this.highLightKeyword = function (text, keyword) {
        var query = new RegExp("(\\b" + keyword + "\\b)", "gim");
        var e = text;
        var enew = e.replace(/(<span>|<\/span>)/igm, "");
        text = enew;
        var newe = enew.replace(query, "<span>$1</span>");
        return newe;
    }

}
SearchResult.prototype.showResult = function(query)
{
    $(".container").remove();
    var symbolContainer = document.createElement('div');
    if(this.resultObj.haveSymbol == 1) {
        var symbolContainer = document.createElement('div');
        $(symbolContainer).attr("class", "symbol-container container");
        //console.log("symbol!!!")
        var symbolTitleDiv = "<div class='symbol-title'><h4>Result related to Symbol: </h4></div>";
        $(symbolContainer).append(symbolTitleDiv);
        var symbolResult = this.resultObj.symbolData;
        var resultContainer = document.createElement('div');
        $(resultContainer).attr('class', 'result-container');
        var symbolFound = "<div><h5><a class='region' data-start='"+symbolResult.start+"' data-end='"+symbolResult.end+"' data-chr='"+symbolResult.seq_region_name+"' >"+ symbolResult.display_name +"</a></h5></div>";
        var symbolDescription = "<div><h6>"+symbolResult.description+"</h6></div>";
        $(resultContainer).append(symbolFound);
        $(resultContainer).append(symbolDescription);
        $(symbolContainer).append(resultContainer);
        $('body').append(symbolContainer);
    }
    if(this.resultObj.haveDisease == 1)
    {
        var diseaseContainer = document.createElement('div');
        $(diseaseContainer).attr("class", "disease-container container");
        var diseaseTitleDiv = "<div><h4>Diseases related to Genes: </h4></div>";
        $(diseaseContainer).append(diseaseTitleDiv);
        var diseaseResults = this.resultObj.rows;
        for(i=0; i<diseaseResults.length; i++)
        {
            var resultContainer = document.createElement('div');
            $(resultContainer).attr('class', 'result-container');
            var highlightedText = this.highLightKeyword(diseaseResults[i].DiseaseName, query);
            var diseaseSymbol = "<div><h5><a class='symbol' data-symbol='"+diseaseResults[i].GeneSymbol+"'>"+diseaseResults[i].GeneSymbol+"</a></h5></div>";
            //Disease Name Display
            var disease = "<div><h6>Related Disease:</h6><h6 class='disease-name'><b>"+highlightedText+"</b></h6></div>";
            //Disease Def Display
            var diseaseDef = "<div><h6>Defination: "+diseaseResults[i].Def+"</h6></div>";
            $(resultContainer).append(diseaseSymbol);
            $(resultContainer).append(disease);
            $(resultContainer).append(diseaseDef);
            $(diseaseContainer).append(resultContainer);
        }
        $('body').append(diseaseContainer);
    }
    if(this.resultObj.haveDisease == 0 && this.resultObj.haveSymbol == 0)
    {
        var noResultContainer = document.createElement('div');
        $(noResultContainer).attr('class', 'no-result container');
        $(noResultContainer).append("<div><h4>There are no Result for: "+query+"</h4>" +
            "<h5>Please try to search by Gene Symbo(e.g. ABO), Chromosome Region(e.g. chr1:1-1000), Gene Ensembl ID (e.g. ENSG00000119688) OR Disease Name (e.g. Thalassemia)</h5></div>");
        $('body').append(noResultContainer);
    }
    $('.symbol').click(function(self,e)
    {
        var data={};
        //alert('click');
        data.type = 'symbol';
        data.symbol = $(this).data('symbol');
        //alert($(this).data('symbol'));
        getGeneAjax(data);
        $('.spinner-div').show();
    })

    $('.region').click(function(self,e)
    {
        var data={};
        data.type='chromosome-region';
        data.chromosomeName = $(this).data('chr');
        data.regionStart = $(this).data('start');
        data.regionEnd = $(this).data('end');
        getGeneAjax(data);
        $('.spinner-div').show();
    });


};

var getGeneAjax = function(query)
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
};

