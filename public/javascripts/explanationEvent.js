/**
 * Created by yuechungng on 19/2/2016.
 */
$("#testbtn").click(function()
{
    $.ajax(
    {
        url: './explanation',
        type: 'GET',
        success: function(data)
        {
            $("body").append(data);
        },
        error: function(xhr, status, error)
        {
            alert("ERROR!!"+error.message);
        }
    });

});

function explanationCreater(transcripts,exons,cds,id,canonicalTranscript)
{
    transcripts = transcripts.replace(/&quot;/g, '"');
    exons = exons.replace(/&quot;/g, '"');
    cds = cds.replace(/&quot;/g, '"');
    this.transcriptObjs = JSON.parse(transcripts);
    this.exonObjs = JSON.parse(exons);
    this.cdsObjs = JSON.parse(cds);
    this.transcriptList = [];
    this.transcriptIDList = [];
    this.exonList = [];
    this.cdsList = [];

    //alert(transcripts);
    for (i = 0; i < this.transcriptObjs.length; i++) {
        var transcript = new Transcript(this.transcriptObjs[i].start, this.transcriptObjs[i].end, this.transcriptObjs[i].transcript_id, this.transcriptObjs[i].strand, this.transcriptObjs[i].external_name);
        transcript.canonicalCheck(canonicalTranscript);
        this.transcriptList.push(transcript);
        this.transcriptIDList.push(this.transcriptObjs[i].transcript_id);
    }
    //console.log(exonObjs.length);

    for (i = 0; i < this.exonObjs.length; i++) {
        var exon = new Exon(this.exonObjs[i].start, this.exonObjs[i].end, this.exonObjs[i].id, this.exonObjs[i].Parent);
        var parent = this.exonObjs[i].Parent;
        var index = this.transcriptIDList.indexOf(this.exonObjs[i].Parent);
        if (index != -1) {
            //console.log("Adding Exon with Parent is " + exon.parent + " to transcript " + transcriptList[index].id);
            this.transcriptList[index].addExon(exon);
        }
        //console.log(index);
    }
}
explanationCreater.prototype.drawSVG = function()
{
    var svgContainer = $('#svg-container');
    this.transcriptList[0].drawTranscript(svgContainer);
    var transcriptMenu = $("#transcript-menu").children();
    for(i=0; i<this.transcriptList.length;i++)
    {
        this.transcriptList[i].createTranscript(transcriptMenu);
    }
}



