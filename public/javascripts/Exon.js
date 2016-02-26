/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id, parent) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.parent = parent
    this.exonSVG;
    this.svgStartPointX;
    this.svgStartPointY = 125;
    this.svgWidth;
    this.svgEndPointX;
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
    this.exonSVG = makeSVG('g',
        {
            id:'g-'+this.id
        });
    var exonRect = makeSVG('rect',
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
    $(this.exonSVG).append(exonRect);
    $(svgContainer).append(this.exonSVG);
    //$(this.exonSVG).dblclick(function(e)
    //{
    //    this.getExonSequence();
    //}.bind(this));
}
Exon.prototype.isBehind = function(exon)
{
    return (this.start > exon.end);
}
Exon.prototype.isFrontOf = function(exon)
{
    return (this.end < exon.start);
}
Exon.prototype.testingMessage = function()
{
    console.log("Exon: Parent: "+this.parent+" Start: "+this.start+" End: "+ this.end);
}
Exon.prototype.updateSVG = function(svg)
{
    $("#g-"+this.id).append(svg);

}
Exon.prototype.drawExonDescription = function(index, length)
{
    var exonDescriptionSVG = makeTextSVG('text',
        {
            id: "d-"+this.id,
            class: 'exonDescription hidden',
            x: this.svgStartPointX,
            y: 180,
            'font-size': 1,
        }, "Exon " + index + " / " + length);
    $("#g-"+this.id).append(exonDescriptionSVG);
    $(this.exonSVG).hover(function(e)
    {
        $('#d-'+ this.id+".show").css('opacity', '1');
    }.bind(this),
    function(e)
    {
        $('#d-'+this.id+'.show').css('opacity',0.3);
    }.bind(this));
}


