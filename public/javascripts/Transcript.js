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
    this.transcriptButton;
    this.exons = [];
    this.svgContainer = svgContainer;

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
        this.drawTranscript();
    }
}

Transcript.prototype.drawTranscript = function()
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
            x: parseInt(svgWidth*0.9),
            y: '40'
        },this.end)

    $("#scale-ruler").append(rulerleftStraightLine);
    $("#scale-ruler").append(rulerhorizontalLine);
    $("#scale-ruler").append(rulerRightStraightLine);
    $("#scale-ruler").append(startTextSVG);
    $("#scale-ruler").append(endTextSVG);


    for(var i=0;i<this.exons.length;i++)
    {
        this.exons[i].drawExon(this.svgContainer, this.start, this.end);
    }
    var container = document.querySelector("#svg-container");
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
                if(zoomScale > 5)
                {
                    console.log(this.getPan());
                }

                //console.log(zoomScale);
            }
        });
}

Transcript.prototype.testingMessage = function()
{
    console.log("Transcript ID: " + this.id);
    for(i=0; i<this.exons.length;i++)
    {
        this.exons[i].testingMessage();
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
        this.drawTranscript();
    }.bind(this));
}


