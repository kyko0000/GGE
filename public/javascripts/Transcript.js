/**
 * Created by yuechungng on 19/2/2016.
 */
function Transcript(start, end, id, strand, name, svgContainer) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.strand = strand;
    this.name = name;
    this.isCanonical;
    this.exons = [];
    this.cdsList = [];
    //web page element
    this.transcriptButton;
    this.svgContainer = svgContainer;
    this.btnExons;
    this.btnTranscription;
    //animation variable
    this.exonAniInterval; //interval for exons Animation
    this.transcriptionAniInterval; // interval for transcription Animation
}
Transcript.panZoomInstance; //static object variable for all transcript object
Transcript.prototype.addExon = function(exon)
{
    if(!exon.isChildOf(this.id))
    {
        console.log("Exon is not belong to " + this.id)
        return;
    }
    if (this.exons.length == 0) {
        this.exons.push(exon);
        inserted = true;
    }
    else {
        var inserted = false
        for (j = 0; j < this.exons.length && !inserted; j++) //check from first exon to last exon
        {
            //    if(j == 0 || exon.isFrontOf(this.exons[0])) //if exon is in front of all exons in list --> put it at the front
            //    {
            //        this.exons.splice(0,0,exon);
            //        inserted = true;
            //    }
            //    if (exon.isBehind(this.exons[j])&&exon.isFrontOf(this.exons[j+1])) //if exon is Behind i th exon and in front of i+1 th exon --> put it between of them
            //    {
            //        this.exons.splice(j+1, 0, exon);
            //        inserted = true;
            //    }
            //    if(j = this.exons.length-1&&exon.isBehind(this.exons[j])) //if exon is behind all exons in list --> put it to the last
            //    {
            //        this.exons.push(exon);
            //        inserted = true;
            //    }
            //}
            //if(inserted)
            //{
            //    console.log("Inserted");
            //}
            if(exon.rank == 1)
            {
                this.exons.splice(0,0,exon);
                inserted = true;
            }
            if(this.exons[j].isBehind(exon))
            {
                this.exons.splice(j, 0, exon);
                inserted = true;
            }
        }
        if(!inserted)
        {
            this.exons.push(exon);
            inserted = true;
        }

        //return inserted;
    }
}

Transcript.prototype.addCDS = function(cds)
{
var inserted = false;
    if(this.cdsList.length == 0)
    {
        this.cdsList.push(cds);
        inserted = true;
    }
    for(j=0; j<this.cdsList.length && !inserted; j++)
    {
        if(this.cdsList[j].isbehindOf(cds))
        {
            this.cdsList.splice(j,0,cds);
            inserted = true;
        }
    }
    if(!inserted)
    {
        this.cdsList.push(cds);
        console.log('add at last');
    }
}

Transcript.prototype.canonicalCheck = function(id)
{
    console.log("canonicalCheck: "+ this.id + " with canonical ID: "+ id);
    if (this.id == id) {
        this.isCanonical = true;
        console.log("canonical");
    }
    else {
        this.isCanonical = false
    }
}

Transcript.prototype.drawCanonicalTranscript = function()
{
    if(this.isCanonical)
    {
        $(this.transcriptButton).attr('class', 'selected');
        this.drawTranscript(false);
    }
}

Transcript.prototype.drawTranscript = function(withcds)
{
    var svgWidth = $(this.svgContainer).width();
    var svgStart = parseInt(svgWidth * 0.05);
    var svgEnd = parseInt(svgWidth * 0.95);
    var groupSVG = makeSVG('g', { //group svg tag for the ruler
        stroke: 'black',
        'stroke-width': '1',
        id: 'scale-ruler'
    });
    $(this.svgContainer).append(groupSVG);
    var rulerleftStraightLine = makeSVG('line',
        {
            x1: svgStart,
            y1: '50',
            x2: svgStart,
            y2: '60'
        });
    var rulerhorizontalLine = makeSVG('line',
        {
            x1:svgStart,
            y1: '55',
            x2: svgEnd,
            y2: '55'
        });
    var rulerRightStraightLine = makeSVG('line',
        {
            x1: svgEnd,
            y1: '50',
            x2: svgEnd,
            y2: '60'
        });

    var startTextSVG = makeTextSVG('text',
        {
            x: '0',
            y: '40'
        },
    this.start);
    var endTextSVG = makeTextSVG('text',
        {
            x: parseInt(svgWidth*0.95),
            y: '40'
        },this.end)

    $("#scale-ruler").append(rulerleftStraightLine);
    $("#scale-ruler").append(rulerhorizontalLine);
    $("#scale-ruler").append(rulerRightStraightLine);
    $("#scale-ruler").append(startTextSVG);
    $("#scale-ruler").append(endTextSVG);

    if(!withcds) {
        for (var i = 0; i < this.exons.length; i++) {
            this.exons[i].drawExon(this.svgContainer, this.start, this.end);
            if (this.strand == -1) {
                this.exons[i].drawExonDescription(this.exons.length);
            }
            else (this.strand == 1)
            {
                this.exons[i].drawExonDescription(this.exons.length);
            }
            //$("#g-"+ this.exons[i].id).append(exonDescription, this.exons.length);
        }
    }
    else
    {
        if(this.strand == 1)
            var index = 0;
        else
            var index = this.cdsList.length-1;
        for (var i = 0; i < this.exons.length; i++) {
            console.log(this.exons[i].start+ "--" +this.cdsList[index].start + "||" + this.exons[i].end + " -- " + this.cdsList[index].end);
            if(index >= 0 && index < this.cdsList.length)
                var cdsMatched = this.exons[i].drawExonAndShowUTRs(this.cdsList[index],this.svgContainer);
            else
                var cdsMatched = this.exons[i].drawExonAndShowUTRs('',this.svgContainer);
            if(cdsMatched && this.strand == 1)
                index++;
            else if(cdsMatched && this.strand == -1)
                index --;
        }
    }
    this.drawIntron();
    var container = document.querySelector("#svg-container");
    var exonDescriptionShowned = false;
    panZoomInstance = svgPanZoom(container,
        {
            zoomEnable: true,
            controlIconsEnabled: true,
            minZoom: 0.5,
            maxZoom:10,
            fit: 1,
            center: 1,
            onZoom: function(zoomScale)
            {
                if(zoomScale > 2 && !exonDescriptionShowned)
                {
                    $(".exonDescription").attr("class", "exonDescription show");
                    exonDescriptionShowned = true;
                }
                else if(zoomScale < 2)
                {
                    $(".exonDescription").attr("class", "exonDescription hidden");
                    exonDescriptionShowned = false;
                }

                //console.log(zoomScale);
            }
        });
    //textbox show info
    $("#focusing-transcript-info").val('');
    var infoMsg = this.name;
    if(this.strand == 1)
        infoMsg += " Forward Strand";
    else if(this.strand == -1)
        infoMsg += " Reverse Strand";
    $("#focusing-transcript-info").val(infoMsg);
    //$("#focusing-transcript-info").width($("#focusing-transcript-info").val().length);


    //show two btn for explanation
    this.exonsBtn();
    this.transcriptionBtn();
}

Transcript.prototype.testingMessage = function() //for testing only
{
    console.log("Transcript ID: " + this.id + " Strand: " + this.strand + " Name: "+ this.name );
    for(i=0; i<this.cdsList.length;i++)
    {
        this.cdsList[i].testingMsg();
    }
}

Transcript.prototype.createTranscript = function(dropdownList)
{
    this.transcriptButton = $(document.createElement('a'));
    $(this.transcriptButton).text(this.name);
    $(dropdownList).append(this.transcriptButton);
    $(this.transcriptButton).click(function(e)
    {
        panZoomInstance.destroy();
        $(this.svgContainer).children().remove();
        this.drawTranscript(false);
    }.bind(this));
}


Transcript.prototype.drawIntron = function()
{
    for (var i = 0; i < this.exons.length - 1; i++) {
        //console.log(this.strand);
        if(this.strand == '1') { //forward stard
            //console.log("Forward");
            var startX = this.exons[i].svgEndPointX;
            var endX = this.exons[i + 1].svgStartPointX;
        }
        else if(this.strand == '-1')//reverse strand
        {
            //console.log("reverse");
            var startX = this.exons[i].svgStartPointX;
            var endX = this.exons[i+1].svgEndPointX;
        }
        var xRadius = (endX - startX) * 4;
        var intronSVG = makeSVG('path',
            {
                d: 'M ' + startX + ' 150 A ' + xRadius + " " + xRadius + " 0 0 1 " + endX + " 150",
                stroke: '#e0e0e0',
                'stroke-width': '2',
                fill: 'none'
            });
        //console.log(intronSVG);
        $('#svg-container').append(intronSVG);

    }

}

Transcript.prototype.exonsBtn = function()
{
    //this.btnExons = "<button class='intronduction btn btn-info btn-lg' id='exons-intro'>EXONS</button>";
    this.btnExons = document.createElement("button");
    $(this.btnExons).attr('class', 'introduction btn btn-info btn-lg');
    $(this.btnExons).attr('id', 'exons-intro');
    $(this.btnExons).html("EXONS");
    $("#exons-btn").empty();
    $("#exons-btn").append(this.btnExons);

    console.log(this.btnExons);
    //var interval;
    var clicked = false;
    $(this.btnExons).click(function()
    {
        if(!clicked) {
            clicked = true;
            $("#exons-intro").attr('class', 'introduction btn btn-success btn-lg');
            $(".exon").attr('class', 'exon blinking');
            var explanationText = makeTextSVG('text',
                {
                    class: 'fadeInAndOut',
                    id: 'explanation-text',
                    x: ($('.svg-container').width() / 2) - 50,
                    y: '270',
                    'font-size': '15',
                    fill: 'black',
                    'font-weight': 'bold'
                }, "ALL EXONS");
            $("#svg-container").append(explanationText);
            setTimeout(function()
            {
                $('.exon').attr('class','exon');
            },6000)
            var i = 0;
            this.exonAniInterval = setInterval(function () {
                $(".exon").attr('class', 'exon');
                $("#explanation-text").remove();
                console.log(i);
                console.log(this.exons.length);
                explanationText = setSVGText(explanationText, "EXON " + (i+1));
                this.exons[i].exonAnimation();
                //$(".exon").attr('class', 'exon');
                $("#svg-container").append(explanationText);
                i++;
                if(i >= this.exons.length)
                    i = 0;
            }.bind(this), 7000)
        }
        else //click one more time
        {
            $('#exons-intro').attr('class', 'introduction btn btn-info btn-lg');
            clicked= false;
            clearInterval(this.exonAniInterval);
            $(".exon").attr('class', 'exon')
            $("#explanation-text").remove();
        }
    }.bind(this));
}

Transcript.prototype.transcriptionBtn = function()
{
    //create btn
    this.btnTranscription = document.createElement('button');
    $(this.btnTranscription).attr('class', 'introduction btn btn-info btn-lg');
    $(this.btnTranscription).attr('id', 'transcription-intro');
    $(this.btnTranscription).html("TRANSCRIPTION");
    $("#transcription-btn").append(this.btnTranscription);

    //button onClick event handler
    var clicked = false;
    $(this.btnTranscription).click(function()
    {
        if(!clicked)
        {
            clicked = true;
            $("#transcription-intro").attr('class', 'introduction btn btn-success btn-lg');
            panZoomInstance.destroy();
            $(this.svgContainer).children().remove();
            this.drawTranscript(true);

        }
        else
        {
            clicked = false;
            $("#transcription-intro").attr('class', 'introduction btn btn-info btn-lg');
            panZoomInstance.destroy();
            $(this.svgContainer).children().remove();
            this.drawTranscript(false);
        }
    }.bind(this));
}

