/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id)
{
    this.start = start;
    this.end = end;
    this.id = id
    Exon.prototype.drawExon()
    {
        
    }
    Exon.prototype.makeSVG()
    {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;

    }
}
