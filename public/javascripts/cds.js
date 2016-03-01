/**
 * Created by yuechungng on 1/3/2016.
 */
function Cds(start, end, parent, strand, id)
{
    this.start = start;
    this.end = end;
    this.parent = parent;
    this.strand = strand;
    this.id = id;
}

Cds.prototype.isbehindOf = function(cds)
{
    return (this.start > cds.end);
}

Cds.prototype.isFrontOf = function(cds)
{
    return (this.end < cds.start);
}

Cds.prototype.testingMsg = function()
{
    console.log("ID: " + this.id + " Start: "+ this.start + " END: "+ this.end + " Parent: "+ this.parent);
}