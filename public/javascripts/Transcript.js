/**
 * Created by yuechungng on 19/2/2016.
 */
function Transcript(start, end, id)
{
    this.start = start;
    this.end = end;
    this.id = id;
    this.exons = {};

    Transcript.prototype.addExon(order, exon)
    {
        exon.push({
            order : exon
        });
    }

    Transcript.prototype.drawTranscript()
    {

    }

}