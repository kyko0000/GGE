/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id, parent, rank) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.parent = parent
    this.exonSVG;
    this.svgStartPointX;
    this.svgStartPointY = 125;
    this.svgWidth;
    this.svgEndPointX;
    this.rank = rank;
    //svg for utr and tr
    this.utrSVG;
    this.cdsSVG;
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
                    var sequence = makeTextSVG('text',
                        {
                            x: this.svgStartPointX,
                            y: this.svgStartPointY,
                            'font-size': '0.01',
                            class: 'exon-sequence'
                        }, data);
                    //$(this.exonSVG).append(sequence);
                    //console.log(this.exonSVG);
                    //$("#"+this.id).append(sequence);
                    this.updateSVG(sequence);
                    console.log(sequence);
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
    var exonGroup = makeSVG('g',
        {
            id:'g-'+this.id
        });
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
    $(exonGroup).append(this.exonSVG);
    $(svgContainer).append(exonGroup);
    //$(this.exonSVG).dblclick(function(e)
    //{
    //    this.getExonSequence();
    //}.bind(this));
}

Exon.prototype.drawExonAndShowUTRs = function(cds, svgContainer)
{
    var cdsMatched = false;
    var exonGroup = makeSVG('g',
        {
            id:'g-'+this.id
        });
    if(cds == '')
    {
        this.utrSVG = makeSVG('rect',
        {
            id:'utr-'+this.id,
            class: 'utr',
            x: this.svgStartPointX,
            y: this.svgStartPointY,
            width: this.svgWidth,
            height: '50',
            'stroke-width':1,
            style:'fill:none'
        })
        $(exonGroup).append(this.utrSVG);
        $(svgContainer).append(exonGroup);
        console.log('inserted utr Only');
    }
    else if(this.start == cds.start && this.end == cds.end)
    {
        this.cdsSVG = makeSVG('rect',
            {
                id: this.id,
                class: 'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: this.svgWidth,
                height: '50',
                style:'fill:blue;fill-opacity:0.6'
            }
        )
        $(exonGroup).append(this.cdsSVG);
        $(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted cds only')
    }
    else if(this.start != cds.start && this.end == cds.end) //the most left exon
    {
        var utrsWidth = (cds.start - this.start)/(this.end - this.start) * this.svgWidth;
        var trStartX = this.svgStartPointX + utrsWidth;
        //make unfilled rectangle for utrs
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: trStartX - this.svgStartPointX,
                height: '50',
                'stroke-width': '1',
                style:'fill:none;'
            })
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: trStartX,
                y: this.svgStartPointY,
                width: this.svgStartPointY-trStartX,
                height: '50',
                style:'fill:blue;opacity:0.6'
            })
        $(exonGroup).append(this.utrSVG);
        $(exonGroup).append(this.cdsSVG);
        $(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted head cds');
    }
    else if(this.start == cds.start && this.end != cds.end) //the most right exon
    {
        var utrsWidth = ((this.end - cds.end) / (this.end - this.start)) * this.svgWidth;
        console.log(utrsWidth);
        var utrStartX = this.svgEndPointX - utrsWidth;
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: utrStartX - this.svgStartPointX,
                height: '50',
                style:'fill:blue;opacity:0.6'

            });
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: utrStartX,
                y: this.svgStartPointY,
                width: utrsWidth,
                height: '50',
                stroke: 'black',
                'stroke-width': '0.1',
                style: 'fill:none;'

            });
        $(exonGroup).append(this.cdsSVG);
        $(exonGroup).append(this.utrSVG);
        $(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted tail cds');
    }
    return cdsMatched
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


