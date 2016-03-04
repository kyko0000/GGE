/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id, parent, rank) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.parent = parent;
    this.parentTranscript;
    this.exonSVG;
    this.svgStartPointX;
    this.svgStartPointY = 125;
    this.svgWidth;
    this.svgEndPointX;
    this.utrsWidth;
    this.cdsWidth;
    this.rank = rank;
    //svg for utr and tr
    this.utrSVG;
    this.cdsSVG;
    //ani
    this.transcriptionAni;
    this.transcriptionOpacityAni;
    this.getExonSequence = function()
    {
        //conosle.log('clicked');
        var data = {};
        data.id = this.id;
        $.ajax(
            {
                url: './api/getSequence',
                data: data,
                type: 'GET',
                contentType: 'application/json',
                success: function(data)
                {
                    $("#sequence-region").show();
                    $('#sequence').empty();
                    $('#sequence').append(data);
                    $('#sequence').height('inherit');
                    if($('#sequence').height() > 250)
                    {
                        $('#sequence').height(250);
                    }
                    $('#sequence-title-text').text("Sequence: " + this.id);
                    $('html, body').animate({
                        scrollTop: $("#sequence").offset().top
                    }, 2000);
                    //console.log(sequence);
                }.bind(this),
                error: function(xhr, status, err)
                {
                    console.log("Get Sequence Ajax Error");
                }
            }
        )
    }
}
Exon.prototype.isChildOf = function(transcriptID)
{
    return (this.parent == transcriptID);
}

Exon.prototype.addTranscript = function(transcript)
{
    this.transcript = transcript;
}

//draw Exon
Exon.prototype.drawExon = function(svgContainer, transcriptStart, transcriptEnd)
{
    var svgWidth = $(svgContainer).width();
    var svgStartPoint = svgWidth * 0.05; //5% left space
    var svgEndPoint = parseInt(svgWidth*0.95);
    var svgLength = svgEndPoint - svgStartPoint;
    var transcriptLength = transcriptEnd - transcriptStart;
    this.svgStartPointX = ((this.start - transcriptStart)/transcriptLength) * svgLength + svgStartPoint;
    this.svgWidth = ((this.end - this.start)/transcriptLength) * svgLength;
    this.svgEndPointX = this.svgWidth + this.svgStartPointX;
    //var exonGroup = makeSVG('g',
    //    {
    //        id:'g-'+this.id
    //    });
    this.exonSVG = makeSVG('rect',
        {
            id: this.id,
            class: 'exon',
            x: this.svgStartPointX,
            y: this.svgStartPointY,
            width: this.svgWidth,
            height: '50',
            style:'fill:blue;fill-opacity:0.6'
        }
    )
    $(svgContainer).append(this.exonSVG);
    //$(svgContainer).append(exonGroup);

    $(this.exonSVG).dblclick(function(e)
    {
        this.getExonSequence();
        this.transcript.clearAllExonSVGFocus();
        this.svgExonFocusing(true);
    }.bind(this));
}

//draw cds and utrs
Exon.prototype.drawExonAndShowUTRs = function(cds, svgContainer)
{
    var cdsMatched = false;
    //var exonGroup = makeSVG('g',
    //    {
    //        id:'g-'+this.id
    //    });
    if(cds == '' || cds.start > this.end)
    {
        this.utrSVG = makeSVG('rect',
        {
            id:'utr-'+this.id,
            class: 'utr',
            x: this.svgStartPointX,
            y: this.svgStartPointY,
            width: this.svgWidth,
            height: '50',
            'stroke-width': '0.1',
            stroke: 'black',
            style:'fill:none'
        })
        //$(exonGroup).append(this.utrSVG);
        $(svgContainer).append(this.utrSVG);
        console.log('inserted utr Only');
    }
    else if(this.start == cds.start && this.end == cds.end)
    {
        this.cdsWidth = this.svgWidth;
        this.cdsSVG = makeSVG('rect',
            {
                id: 'cds-'+this.id,
                class: 'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;fill-opacity:0.6'
            }
        )
        $(svgContainer).append(this.cdsSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted cds only')
    }
    else if(this.start != cds.start && this.end == cds.end) //the most left exon
    {
        this.utrsWidth = (cds.start - this.start)/(this.end - this.start) * this.svgWidth;
        var trStartX = this.svgStartPointX + this.utrsWidth;
        this.cdsWidth = this.svgEndPointX - trStartX;
        //make unfilled rectangle for utrs
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: trStartX - this.svgStartPointX,
                height: '50',
                'stroke-width': '0.1',
                stroke: 'black',
                style:'fill:none;'
            })
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: trStartX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;opacity:0.6'
            })
        $(svgContainer).append(this.utrSVG);
        $(svgContainer).append(this.cdsSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted head cds');
    }
    else if(this.start == cds.start && this.end != cds.end) //the most right exon
    {
        this.utrsWidth = ((this.end - cds.end) / (this.end - this.start)) * this.svgWidth;
        //console.log(utrsWidth);
        utrStartX = this.svgEndPointX - this.utrsWidth;
        this.cdsWidth = utrStartX - this.svgStartPointX;
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;opacity:0.6'

            });
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: utrStartX,
                y: this.svgStartPointY,
                width: this.utrsWidth,
                height: '50',
                stroke: 'black',
                'stroke-width': '0.1',
                style: 'fill:none;'

            });
        $(svgContainer).append(this.cdsSVG);
        $(svgContainer).append(this.utrSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted tail cds');
    }
    return cdsMatched
}

Exon.prototype.svgExonFocusing = function(focusing)
{
    if(!focusing)
    {
        $(this.exonSVG).css('fill', 'blue');
        $(this.exonSVG).css('fill-opacity','0.6');
    }
    else
    {
        $(this.exonSVG).css('fill', 'green');
    }
}

Exon.prototype.isBehind = function(exon)
{
    return (this.rank > exon.rank);
}

Exon.prototype.isFrontOf = function(exon)
{
    return (this.rank < exon.rank);
}

Exon.prototype.testingMessage = function()
{
    console.log("Exon: Parent: "+this.parent+" Start: "+this.start+" End: "+ this.end + "Rank:" + this.rank);
}

Exon.prototype.updateSVG = function(svg)
{
    $("#g-"+this.id).append(svg);

}

Exon.prototype.drawExonDescription = function(length)
{
    var exonDescriptionSVG = makeTextSVG('text',
        {
            id: "d-"+this.id,
            class: 'exonDescription hidden',
            x: this.svgStartPointX,
            y: 180,
            'font-size': 3,
        }, "Exon " + this.rank + " / " + length);
    $("#g-"+this.id).append(exonDescriptionSVG);

    //exon hover
    $(this.exonSVG).hover(function(e)
    {
        $('#d-'+ this.id+".show").css('opacity', '1');
    }.bind(this),
    function(e)
    {
        $('#d-'+this.id+'.show').css('opacity',0.2);
    }.bind(this));
}

Exon.prototype.exonAnimation = function()
{
    console.log(this.id);
    $("#"+this.id).attr('class', 'exon blinkingEach');
}

Exon.prototype.transcriptionAnimation = function(strand,periousAni)
{
    if(strand == 1) //forward strand
    {
        //console.log("go here");
        if($("#cds-"+this.id).length)
        {
            this.transcriptionAni = makeSVG('animate',
                {
                    id: 'ani' + this.id,
                    dur: '6s',
                    attributeName: 'width',
                    from: 0,
                    to: this.cdsWidth,
                    repeatCount: '1',
                });
            this.transcriptionOpacityAni = makeSVG('animate',
                {
                    dur:'1s',
                    attributeName:'opacity',
                    from:'0',
                    to:'1',
                    fill:'freeze',
                    begin:'ani'+this.id+".begin"
                })
            if(periousAni.length > 0)
            {
                this.transcriptionAni = setSVGAttr(this.transcriptionAni,
                    {
                        begin:periousAni+".end"
                    })
            }
            if(periousAni.length > 0) {
                $("#cds-" + this.id).append(this.transcriptionAni);
            }
            $("#cds-"+this.id).append(this.transcriptionOpacityAni);
            return "ani"+this.id;
        }
        else
        {
            return 0;
        }
    }
    else //reverse strand
    {

    }
}

Exon.prototype.transcriptionAniRestart = function(lastAni)
{
    this.transcriptionAni = setSVGAttr(this.transcriptionAni,
        {
            begin: "0s;"+lastAni+".end"
        })
    $("#cds-"+this.id).append(this.transcriptionAni);
}

Exon.prototype.hideShowcdsAndutrs = function(hide)
{
    if(hide)
        $(this.cdsSVG).css('opacity','0');
    else
        $(this.cdsSVG).css('opacity', '1');
}



