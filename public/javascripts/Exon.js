/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id, parent) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.parent = parent
    this.exonSVG;
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
                            'font-size': '10',
                            class: 'exon-sequence'
                        }, data);
                    $(this.exonSVG).append(sequence);
                },
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
    var svgStartPoint = parseInt(svgWidth * 0.05); //5% left space
    var svgEndPoint = parseInt(svgWidth*0.95);
    var svgLength = svgEndPoint - svgStartPoint;
    var transcriptLength = transcriptEnd - transcriptStart;
    this.exonSVG = makeSVG('g',
        {
            id:this.id
        });
    var exonRect = this.makeSVG('rect',
        {
            id: this.id,
            class: 'exon',
            x: parseInt(((this.start - transcriptStart)/transcriptLength) * svgLength)+svgStartPoint,
            y: '125',
            width: parseInt(((this.end - this.start)/transcriptLength) * svgLength),
            height: '50',
            style:'fill:blue;fill-opacity:0.6'
        }
    )
    $(this.exonSVG).append(exonRect);
    $(svgContainer).append(this.exonSVG);
    $(this.exonSVG).dblclick(function(e)
    {
        this.getExonSequence();
    }.bind(this));
}
Exon.prototype.makeSVG = function(tag, attrs)
{
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;

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



