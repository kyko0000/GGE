/**
 * Created by yuechungng on 19/1/2016.
 * Here are Chromosome and Bands Class
 * One Chromosome will have more than one Bands
 * Bands are belonged to a Chromosome.
 */
function chromosomeCreater(bands)
{
    $("#chromosome-navigator").append("<tr></tr>")
    for(i=0; i<bands.length; i++)
    {
        var band = bands[i];
        band.createTD("#chromosome-navigator");
    }
}

//chromosome Bands class
function Band(start, end, id, chromosomeLength) {
    this.start = start;
    this.end = end;
    this.length = this.end - this.start;
    this.lengthPer = this.length / chromosomeLength * 100;
    this.id = id;
    this.jqueryID = '';
    //this.td;
    this.isStart = 0;
    this.isEnd = 0;
}
Band.prototype.createTD = function(tr)
{
    //$("#"+tr).append(td);
    if(this.isStart) {
        var td = "<td id='"+ this.id +"'"+"data-start='" + this.start + "' data-end='" + this.end + "' class='start'><div class='bands' title='"+this.id+"' style=\"'width:"+ this.lengthPer +"%'\"></div></td>";
    }
    else if(this.isEnd) {
        var td = "<td id='" + this.id + "'" + "data-start='" + this.start + "' data-end='" + this.end + "' class='end'><div class='bands' title='"+this.id+"' style=\"'width:"+ this.lengthPer +"%'\"></div></td>";
    }
    else
    {
        var td = "<td id='"+ this.id +"'"+"data-start='" + this.start + "' data-end='" + this.end + "'><div class='bands' title='"+this.id+"' style=\"'width:"+ this.lengthPer +"%'\"></div></td>";
    }
    $("#"+tr).append(td);

}
Band.prototype.checkStartOrEnd = function(length)
{
    if(this.start == 1)
    {
        this.isStart = 1;
    }
    else if(this.end == length)
    {
        this.isEnd = 1;
    }
}
Band.prototype.setArmStartOrEnd = function(startOrEnd) {
    if(startOrEnd == "Start")
        this.isStart = 1;
    else if(startOrEnd == "End")
        this.isEnd = 1;
}

//Chromosome Class
function Chromosome(name, length)
{
    this.bands = [];
    this.name = name;
    this.length = length;
    this.chromosomeTR;
}
Chromosome.prototype.addBands = function(start, end, id)
{
    var band = new Band(start, end, id, this.length);
    band.checkStartOrEnd(this.length);
    this.bands.push(band);
}
Chromosome.prototype.createChromosome = function()
{
    this.sortBand();
    this.checkArm();
    this.chromosomeTR = "<tr id='" + this.name + "' data-length='" + this.length + "' class='chromosome'></tr>";
    $("#chromosome-navigator").append(this.chromosomeTR);
    for(i = 0; i < this.bands.length; i++)
    {
        this.bands[i].createTD(this.name);
    }
}
Chromosome.prototype.sortBand = function()
{
    //insertion sort
    var length = this.bands.length;
    for(i = 1; i < length; i++)
    {
        var temp = this.bands[i];
        for(j = i - 1; j >= 0 && this.bands[j].start > temp.start; --j)
        {
            this.bands[j+1] = this.bands[j];
        }
        this.bands[j+1] = temp;
    }
}
Chromosome.prototype.checkArm = function()
{
    var length = this.bands.length;
    for(i = 0; i < length-1; i++)
    {
        if(this.bands[i].id.substr(0,1) != this.bands[i+1].id.substr(0,1))
        {
            this.bands[i].setArmStartOrEnd("End");
            this.bands[i+1].setArmStartOrEnd("Start");
        }
    }
}


//module.exports = Chromosome;
//module.exports = Band;