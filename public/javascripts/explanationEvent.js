/**
 * Created by yuechungng on 19/2/2016.
 */
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
    this.seqReg;

    var svgContainer = $('#svg-container');

    //alert(transcripts);
    for (i = 0; i < this.transcriptObjs.length; i++) {
        var transcript = new Transcript(this.transcriptObjs[i].start, this.transcriptObjs[i].end, this.transcriptObjs[i].transcript_id, this.transcriptObjs[i].strand, this.transcriptObjs[i].external_name, svgContainer);
        transcript.canonicalCheck(canonicalTranscript);
        this.transcriptList.push(transcript);
        this.transcriptIDList.push(this.transcriptObjs[i].transcript_id);
    }
    //console.log(exonObjs.length);

    for (i = 0; i < this.exonObjs.length; i++) {
        var exon = new Exon(this.exonObjs[i].start, this.exonObjs[i].end, this.exonObjs[i].id, this.exonObjs[i].Parent, this.exonObjs[i].rank);
        var parent = this.exonObjs[i].Parent;
        var index = this.transcriptIDList.indexOf(this.exonObjs[i].Parent);
        if (index != -1) {
            //console.log("Adding Exon with Parent is " + exon.parent + " to transcript " + transcriptList[index].id);
            this.transcriptList[index].addExon(exon);
        }
    }

    for (i=0; i<this.cdsObjs.length; i++)
    {
        var cds = new Cds(this.cdsObjs[i].start, this.cdsObjs[i].end, this.cdsObjs[i].Parent, this.cdsObjs[i].strand, this.cdsObjs[i].id);
        var parent = this.cdsObjs[i].Parent;
        var index = this.transcriptIDList.indexOf(parent);
        if(index != -1)
        {
            this.transcriptList[index].addCDS(cds);
        }
    }
    this.seqReg = $("#sequence-region");
    this.hideShowSeqReg();
    ////TESTING ONLY
    //for(k=0; k<this.transcriptList.length; k++)
    //{
    //    console.log(this.transcriptList[k].testingMessage());
    //}
}
explanationCreater.prototype.drawSVG = function()
{
    //this.transcriptList[0].drawTranscript(svgContainer);
    var transcriptMenu = $("#transcript-menu > .menu");
    for(i=0; i<this.transcriptList.length;i++)
    {
        this.transcriptList[i].createTranscript(transcriptMenu);
        this.transcriptList[i].drawCanonicalTranscript();
    }
    $('html, body').animate(
        {
            scrollTop: $(".svg-container").offset().top
        },2000)
}
explanationCreater.prototype.hideShowSeqReg = function()
{
    $("#sequence-region").hide();
    $("#sequence-title").click(function()
    {
        $("#sequence").toggle(1000);
        $('html, body').animate({
            scrollTop: $("#explanation-container").offset().top
        }, 2000);
    })
}



