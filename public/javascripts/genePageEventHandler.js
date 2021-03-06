/**
 * Created by yuechungng on 21/1/2016.
 */
var relativeStart;
var relativeEnd;
var actualStart;
var actualEnd;
var selectedGeneCanonicalTranscript = {};
$(".selected-info").val("Chromosome " + $(".chromosome").attr("id") + " : ");
$("[name='my-checkbox']").bootstrapSwitch();
//$(".spinning-div").hide();
//hide the Slide Instruction
setTimeout(function()
{
    $('slide-instruction').toggle(1000);
},5000);
//event handler
//event handler for chromosome

$(".position-locator").mousedown(function(e)
{
    relativeStart = recordStartAndEnd(e, this);
    $(".position-locator").css('cursor','col-resize')

});

$(".position-locator").mouseup(function(e)
{
    relativeEnd = recordStartAndEnd(e, this);
    relativeLength();
    drawPosition(relativeStart, relativeEnd);
    drawTable(actualStart, actualEnd);
    $(".position-locator").css('cursor','default');
    getGenes();

});

//used for gene mouse click event
var showGene = function()
{
    var length = $(".chromosome").data('length');
    var width = $(".position-locator").width();
    relativeStart = actualStart / length * width;
    relativeEnd = actualEnd / length * width;
    drawTable(actualStart, actualEnd);
    drawPosition(relativeStart, relativeEnd);
    getGenes();
}
var geneEventHandler = function() {
    $(".gene-name").click(function (e) {
        actualStart = $(this).parent().data('start');
        actualEnd = $(this).parent().data('end');
        showGene();
    });

    $(".gene-position").click(function(e)
    {
        var selectedGeneID = $(this).parent().parent().attr('id');
        if($("#dia-"+selectedGeneID).length)
        {
            $("#dia-"+selectedGeneID).modal('toggle');
        }
        else {
            getGeneInfo(selectedGeneID);
            $('body').css('cursor', 'wait');
            $(this).css('cursor','wait');
        }
    });

    $(".gene-position").hover(function(e)
    {
        if($(this).data("strand") == 1)
        {
            $($(this).children()).attr("class",$($(this).children()).attr('class')+" forward-animate");
        }
        else
        {
            $($(this).children()).attr("class",$($(this).children()).attr('class')+" reverse-animate");
        }
    }, function(e)
    {
        $($(this).children()).attr("class", "strand-display");
    })
}


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
    if(relativeStart > relativeEnd)
    {
        var temp = relativeStart;
        relativeStart = relativeEnd;
        relativeEnd = temp;
    }
    actualStart = parseInt(length * relativeStart/width);
    actualEnd = parseInt(length * relativeEnd/width);


    if((actualEnd - actualStart) > 5000000)
    {
        actualEnd = actualStart + 4999999;
        relativeEnd = (actualEnd/length)*width;
    }

    $(".selected-info").val("Chromosome " + $(".chromosome").attr("id") + " : " + actualStart + " - " + actualEnd);
}

//draw the indicator to indicate the section of user focusing.
var drawPosition = function(start, end)
{
    console.log('draw position...' + start + ' ' + end)
    var c = document.getElementById('indicator');
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.strokeRect(start, 0, end - start, 10);
    ctx.fillStyle = "rgba(255,0,0, 0.4)";
    ctx.fillRect(start, 0, end-start, 10);

}

//show the start, end and length information to the textbox under the chromosome.
var drawTable = function(start, end)
{
    var length = end - start;
    var partition = parseInt(length / 4);
    $(".selected-info").val("Chromosome " + $(".chromosome").attr("id") + " : " + start + " - " + end);
    $('.selected-length').val("Length: " + length + "bp.");
    var x = start;
    for(i = 1; i <= 4; i++)
    {
        $('#'+i+'.partition').empty();
        x += partition;
        $('#' + i + '.partition').append(x);
    }

}


//ajax call server to get gene info
var getGenes = function()
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
            var jsonObj = JSON.parse(data);
            var html = drawGene(jsonObj, actualEnd-actualStart, actualStart, actualEnd);
            $(".gene").remove();
            $("#gene-navigator").append(html);
            drawStrand();
            hideAndShowGene("overlap");
            hideAndShowGene("short");
            geneEventHandler();
            $(".spinner-div").remove();
        },
        error: function(xhr, status, error)
        {
            console.log('Error', error.message);
            alert("ajax error");
        }
    });
}

var getGeneInfo = function(id)
{
    var data = {};
    data.id = id;
    $.ajax({
        url:'./api/gene_info',
        data: data,
        type:'GET',
        contentType: 'application/json',
        success: function(data)
        {
            var jsonObj = JSON.parse(data);
            var html = showGeneInfo(jsonObj);
            $("body").append(html);
            $('#modal').on('show.bs.modal', function () { //modal auto size change
                $(this).find('.modal-body').css({
                    width:'auto', //probably not needed
                    height:'auto', //probably not needed
                    'max-height':'100%'
                });
            });
            $("#dia-"+id).modal('toggle');
            //recover the pointer
            $('body').css('cursor','default');
            $('.gene-position').css('cursor', 'pointer');
        },
        error: function(xhr, status, error)
        {
            console.log('Error',error.message);
            alert("Get Gene Information Error");
        }

    })

}
var hideAndShowGene = function(type)
{
    if($("#"+type+"-switch").bootstrapSwitch('state'))
    {
        $(".gene."+type).show();
    }
    else
    {
        $(".gene."+type).hide();
    }
}

$("#overlap-switch").on('switchChange.bootstrapSwitch',function(e,state)
{
   hideAndShowGene("overlap");
});

$("#short-switch").on('switchChange.bootstrapSwitch', function(e,state)
{
    hideAndShowGene("short")
})

//show gene info
var showGeneInfo = function(jsonObj)
{
    //separate transcript info from gene info
    var transcripts=[];
    var canonical_Transcript_ID;
    for(i=0; i<jsonObj.Transcript.length; i++)
    {
        transcripts.push(jsonObj.Transcript[i]);
    }
    //
    var html="";
    html += "<div class='modal fade' id='dia-" + jsonObj.id + "' role='dialog'>"+
        "<div class='modal-dialog'>"+
            "<div class='modal-content'>"+
                "<div class='modal-header'>"+
                    "<button type='button' class='close' data-dismiss='modal'>&times;</button>"+
                    "<h4 class='modal-title'>" + jsonObj.display_name + "</h4>"+
                "</div>"+
                "<div class='modal-body'>"+
                    "<p><b>Gene ID:&emsp;</b>" + jsonObj.id + "</p>"+
                    "<p><b>Gene Name:&emsp;</b>" + jsonObj.display_name + "</p>"+
                    "<p><b>Description:&emsp;</b>"+ jsonObj.description +"</p>" +
                    "<p><b>Start:&emsp;</b>" + jsonObj.start + "</p>"+
                    "<p><b>End:&emsp;</b>" + jsonObj.end + "</p>";
    if(jsonObj.strand == 1) {
        html += "<p><b>Strand:&emsp;</b>Forward</p>";
    }
    else {
        html += "<p><b>Strand:&emsp;</b>Reverse</p>";
    }
                    html+="<p><b>Transcript:</b></p>"+
                     "<div class='modal-transcript-table'>"+
                        "<div class='transcript-tr'>"+
                            "<div class='transcript-td transcript-id transcript-title'>Transcript ID</div>"+
                            "<div class='transcript-td transcrpt-name transcript-title'>Name</div>"+
                            "<div class='transcript-td transcrpt-biotype transcript-title'>Biotype</div>"+
                        "</div>"+
                        createTranscriptTable(transcripts, selectedGene)+
                    "</div>"+
                "<span style='background-color:lightyellow'>Canonical Transcript</span></div>"+
                "<div class='modal-footer'>"+
                    "<button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button>"+
                    "<button type='button' class='btn btn-success' data-dismiss='modal' data-canonical='"+selectedGene.canonicalTranscript+"' data-id='"+jsonObj.id+"' data-start='"+jsonObj.start+"' data-end='"+jsonObj.end+"' data-symbol='"+jsonObj.display_name+"' onclick='callExplaination(this)'> More Information </button>"+
                "</div>"+
            "</div>"+
        "</div>"+
    "</div>";
    //console.log(selectedGeneCanonicalTranscript.canonicalTranscript);
    //selectedGene.symbol = jsonObj.display_name;
    //selectedGene.start = jsonObj.start;
    //selectedGene.end = jsonObj.end;
    return html;
}

var callExplaination = function(btn)
{
    var query={};
    query.id = $(btn).data('id');
    console.log($(btn).data('start'));
    selectedGene.start = $(btn).data('start');
    selectedGene.end = $(btn).data('end');
    selectedGene.symbol = $(btn).data('symbol');
    selectedGene.canonicalTranscript = $(btn).data('canonical');
    showSpinner();
    $.ajax(
        {
            url: './explanation',
            data: query,
            type: 'GET',
            success: function(data)
            {
                factMode = false;
                $(".explanation-container").remove();
                $("#sequence-region").remove();
                $(".related-disease").remove();
                //
                //selectedGeneCanonicalTranscript = $(btn).data('canonical');
                $('body').append(data);
                $(".spinner-div").remove();
            },
            error: function()
            {
              alert("ajax fail");
            }
        })
}

var createTranscriptTable = function(transcripts, selectedGene)
{
    var html = "";
    for(i=0; i<transcripts.length;i++) {

        if(transcripts[i].is_canonical == 1)
        {
            html += "<div class='transcript-tr canonical'>";
            selectedGene.canonicalTranscript = transcripts[i].id;
            console.log('have');
        }
        else
        {
            html += "<div class='transcript-tr'>";
        }
        html+="<div class='transcript-td transcript-id'>" + transcripts[i].id + "</div>" +
            "<div class='transcript-td transcript-name'>" + transcripts[i].display_name + "</div>" +
            "<div class='transcript-td transcript-biotype'>" + transcripts[i].biotype + "</div>"+
            "</div>";
    }
    //console.log(html);
    return html;

}

//show genes
var drawGene = function(jsonObj, length, start, end)
{
    var html = "";
    for(i=0; i<jsonObj.length;i++)
    {
        var isComplete = 0;
        var geneLength = (jsonObj[i].end - jsonObj[i].start) / length;
        if(jsonObj[i].start >= start && end >= jsonObj[i].end)
        {
            isComplete = 1;
            if(geneLength < 0.01)
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
        html += "<td class='title gene-name' title='Click for zoom in this gene'>" + jsonObj[i].external_name +  "</td><td class='data'>";
        if(isComplete) {
            var geneLength = (jsonObj[i].end - jsonObj[i].start) / length;
            html += "<div class='gene-padding' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%'></div>";
            html += "<SVG class='gene-position' id='svg-" + jsonObj[i].gene_id + "' style='width:" + ((jsonObj[i].end - jsonObj[i].start) / length) * 100 + "%' preserveAspctRaio='none' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-strand='" + jsonObj[i].strand + "' title='Click for more information'></SVG>";
                //"<polygon points='0,60 75,60 75,50 100,70 75,90 75,80 0,80 0,60' style='fill:red;stroke:purple;stroke-width:1' />" + "</SVG>";
           // html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
        }
        else if(start > jsonObj[i].start && jsonObj[i].end <= end) //overlap from the begining only
        {
            //html += "<div class='gene-position left' style='width:" + ((jsonObj[i].end - start) / length) * 100 + "% data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end +"'></div>";
            html += "<SVG class='gene-position left' id='svg-" + jsonObj[i].gene_id + "' style='width:" + ((jsonObj[i].end - start) / length) * 100 + "%' preserveAspctRaio='none' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-strand='" + jsonObj[i].strand + "' title='Click for more information'></SVG>";
            //html += "<div class='gene-padding' style='width:" + ((end - jsonObj[i].end) / length) * 100 + "%'></div>";
        }
        else if(end < jsonObj[i].end && start <= jsonObj[i].start) //overlap at the end only
        {
            //html += "<div class='gene-padding right' style='width:" + ((jsonObj[i].start - start) / length) * 100 + "%' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end +"></div>";
            html += "<SVG class='gene-position' id='svg-" + jsonObj[i].gene_id + "' style='width:100%' preserveAspctRaio='none' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-strand='" + jsonObj[i].strand + "' title='Click for more information'></SVG>";
            //html += "<div class='gene-position' style='width:" + ((end - jsonObj[i].start) / length) * 100 + "%'></div>";
        }
        else
        {
            //html+="<div class='gene-position' style='width:100%'></div>";
            html += "<SVG class='gene-position' id='svg-" + jsonObj[i].gene_id + "' style='width:100%' viewBox='0 0 100 100' preserveAspctRaio='none' data-start='" + jsonObj[i].start + "' data-end='" + jsonObj[i].end + "' data-strand='" + jsonObj[i].strand + "'>";
        }
        html += "</td></tr>";
    }
    return html;
}

var drawStrand = function()
{
    var genePositionSVGs = $(".gene-position");
    for(i=0; i<genePositionSVGs.length; i++)
    {
        if($(genePositionSVGs[i]).parent().parent().attr("class") == "gene") {
            if ($(genePositionSVGs[i]).data("strand") == 1) {
                var topPoint = parseInt($(genePositionSVGs[i])[0].getBoundingClientRect().width);
                var turningPoint = parseInt(topPoint * 0.85);
                var svg = makeSVG('polygon', {
                    class: 'strand-display',
                    points: '0,25 ' + turningPoint + ',25, ' + turningPoint + ',20 ' + topPoint + ',30 ' + turningPoint + ',40 ' + turningPoint + ',35 0,35 0,25',
                    style: 'fill:#66b3ff;'
                });
                $(genePositionSVGs[i]).append(svg);

            }
            else {
                //var turningPoint = parseInt($(genePositionSVGs[i]).width()*0.15);
                var tailPoint = parseInt($(genePositionSVGs[i])[0].getBoundingClientRect().width);
                var turningPoint = parseInt(tailPoint * 0.15);
                var svg = makeSVG('polygon', {
                    class: 'strand-display',
                    points: '0,30 ' + turningPoint + ',20, ' + turningPoint + ',25 ' + tailPoint + ',25 ' + tailPoint + ',35 ' + turningPoint + ',35 ' + turningPoint + ',40 0,30',
                    style: 'fill:#ff6666;'
                });
                $(genePositionSVGs[i]).append(svg);
            }
        }
    }
    //function makeSVG(tag, attrs) {
    //    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    //    for (var k in attrs)
    //        el.setAttribute(k, attrs[k]);
    //    return el;
    //}
}
