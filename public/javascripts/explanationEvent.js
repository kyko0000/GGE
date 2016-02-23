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

var explanation = function(transcripts,exons,cds,id,canonicalTranscriptID)
{
    transcripts = transcripts.replace(/&quot;/g, '"');
    exons = exons.replace(/&quot;/g, '"');
    cds = cds.replace(/&quot;/g, '"');
    var transcriptObjs = JSON.parse(transcripts);
    var exonObjs = JSON.parse(exons);
    var cdsObjs = JSON.parse(cds);
    var transcriptList=[];
    var transcriptIDList=[];
    var exonList=[];
    var cdsList=[];
    //alert(transcripts);
    for(i=0; i<transcriptObjs.length; i++)
    {
        var transcript = new Transcript(transcriptObjs[i].start, transcriptObjs[i].end, transcriptObjs[i].transcript_id, transcriptObjs[i].strand);
        transcript.canonicalCheck(canonicalTranscriptID);
        transcriptList.push(transcript);
        transcriptIDList.push(transcriptObjs[i].transcript_id);
    }
    console.log(exonObjs.length);

    for(i=0;i<exonObjs.length;i++)
    {
        var exon = new Exon(exonObjs[i].start, exonObjs[i].end, exonObjs[i].id, exonObjs[i].Parent);
        var parent = exonObjs[i].Parent;
        var index = transcriptIDList.indexOf(exonObjs[i].Parent);
        if(index != -1) {
            console.log("Adding Exon with Parent is " + exon.parent + " to transcript " + transcriptList[index].id);
            transcriptList[index].addExon(exon);
        }
        console.log(index);
    }

    var svgContainer = $('#svg-container');
    transcriptList[0].drawTranscript(svgContainer);
}