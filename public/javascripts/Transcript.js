/**
 * Created by yuechungng on 19/2/2016.
 */
function Transcript(start, end, id, strand) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.strand = strand;
    this.name = name;
    this.isCanonical;
    this.exons = [];

}
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
            if(j == 0 || exon.isFrontOf(this.exons[0])) //if exon is in front of all exons in list --> put it at the front
            {
                this.exons.splice(0,0,exon);
                inserted = true;
            }
            if (exon.isBehind(this.exons[j])&&exon.isFrontOf(this.exons[j+1])) //if exon is Behind i th exon and in front of i+1 th exon --> put it between of them
            {
                this.exons.splice(j+1, 0, exon);
                inserted = true;
            }
            if(j = this.exons.length-1&&exon.isBehind(this.exons[j])) //if exon is behind all exons in list --> put it to the last
            {
                this.exons.push(exon);
                inserted = true;
            }
        }
        if(inserted)
        {
            console.log("Inserted");
        }
        //return inserted;
    }
}

Transcript.prototype.canonicalCheck = function(id)
{
    if (this.id == id) {
        this.isCanonical = true;
    }
    else {
        this.isCanonical = false
    }
}

Transcript.prototype.drawTranscript = function(svgContainer)
{
    for(i=0;i<this.exons.length;i++)
    {
        this.exons[i].drawExon(svgContainer, this.start, this.end);
    }
}

Transcript.prototype.testingMessage = function()
{
    console.log("Transcript ID: " + this.id);
    for(i=0; i<this.exons.length;i++)
    {
        this.exons[i].testingMessage();
    }
}


