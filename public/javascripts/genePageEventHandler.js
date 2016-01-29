/**
 * Created by yuechungng on 21/1/2016.
 */
var relativeStart;
var relativeEnd;
var actualStart;
var actualEnd;
$(".selected-info").val("Chromosome " + $(".chromosome").attr("id") + " : ");

//event handler
//event handler for chromosome
$(".position-locator").mousedown(function(e)
{
    relativeStart = recordStartAndEnd(e, this);

})

$(".position-locator").mouseup(function(e)
{
    relativeEnd = recordStartAndEnd(e, this);
    relativeLength();
    drawPosition(relativeStart, relativeEnd);
    drawTable(actualStart, actualEnd);
    getGeneInfo();

});


//function call
//record the start point and end point of user
var recordStartAndEnd = function(e, element)
{
    var offSet = $(element).offset();
    var relativeX = e.pageX - offSet.left;
    return relativeX;
    //var width = $(this).width();
    //var relativePosition = relativeX/width;
}

var relativeLength = function()
{
    var length = $(".chromosome").data("length");
    var width = $(".position-locator").width();
    actualStart = parseInt(length * relativeStart/width);
    actualEnd = parseInt(length * relativeEnd/width);

    $(".selected-info").val("Chromosome " + $(".chromosome").attr("id") + " : " + actualStart + " - " + actualEnd);
}

//draw the indicator to indicate the section of user focusing.
var drawPosition = function(start, end)
{
    var c = document.getElementById('indicator');
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "rgba(0, 255, 0, 1)";
    ctx.fillRect(start, 0, end - start, 5);
}

var drawTable = function(start, end)
{
    var length = end - start;
    var partition = parseInt(length / 4);
    $('.selected-length').val(length + "bp.");
    var x = start;
    for(i = 1; i <= 4; i++)
    {
        $('#'+i+'.partition').empty();
        x += partition;
        $('#' + i + '.partition').append(x);
    }

}

//ajax call server to get gene info
var getGeneInfo = function()
{
    var data = {};
    data.start = actualStart;
    data.end = actualEnd;
    data.chromosome = $('.chromosome').attr('id');
    $.ajax({
        url: './api/get_gene',
        data: data,
        type:'GET',
        contentType: 'application/json',
        success: function(data)
        {
            $("#gene-navigator").append(data);
        },
        error: function(xhr, status, error)
        {
            console.log('Error', error.message);
            alert("ajax error");
        }
    });
}
