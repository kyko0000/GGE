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
    this.exons = [];
    this.cdsList = [];
    //web page element
    this.transcriptButton;
    this.svgContainer = svgContainer;
    this.intronSVGs = [];
    this.btnExons;
    this.btnTranscription;
    this.btnTranscriptSeq;
    this.btnCdsSeq;
    this.btncdnaSeq;
    this.proteinSeq;
    //animation variable
    this.exonAniInterval; //interval for exons Animation
    this.transcriptionAniInterval; // interval for transcription Animation

    this.upperStrand;
    this.lowerStrand;
    this.rnaPolymerase;
    this.rna;
    this.rnaPolymeraseAni;
    this.rnaAni=[];

    //private method
    this.getSequence = function()
    {
        var data = {};
        data.id = this.id;
        data.mask = 'true';
        $.ajax(
            {
                url: './api/getSequence',
                data: data,
                type: 'GET',
                contentType: 'application/json',
                success: function(data)
                {
                    $("#sequence-region").show();
                    $('#sequence').empty();
                    $('#sequence').append(data);
                    $('#sequence').height('inherit');
                    if($('#sequence').height() > 250)
                    {
                        $('#sequence').height(250);
                    }
                    $('#sequence-title-text').text("Sequence: " + this.id);
                    $('html, body').animate({
                        scrollTop: $("#sequence").offset().top
                    }, 2000);

                }.bind(this),
                error: function(xtr, err, status)
                {
                    alert("AJAX: GET Sequence ERROR");
                }
            }
        )
    };

    this.addPanAndZoom = function()
    {
        var container = document.querySelector("#svg-container");
        panZoomInstance = svgPanZoom(container,
            {
                zoomEnable: true,
                controlIconsEnabled: true,
                dblClickZoomEnabled: false,
                minZoom: 0.5,
                maxZoom:10,
                fit: 1,
                center: 1,
                onZoom: function(zoomScale)
                {
                    if(zoomScale > 2 && !exonDescriptionShowned)
                    {
                        $(".exonDescription").attr("class", "exonDescription show");
                        exonDescriptionShowned = true;
                    }
                    else if(zoomScale < 2)
                    {
                        $(".exonDescription").attr("class", "exonDescription hidden");
                        exonDescriptionShowned = false;
                    }

                    //console.log(zoomScale);
                }
            });
    };
    this.transcriptionAnimate = function()
    {
        var periousAnimate = '';
        for(x=0; x<this.exons.length; x++)
        {
            periousAnimate = this.exons[x].createTranscriptionAnimate(periousAnimate, this.strand);
            if(x < this.exons.length - 1)
                periousAnimate = this.drawIntronWithAnimate(periousAnimate, x);
        }
    };
}
Transcript.panZoomInstance; //static object variable for all transcript object
Transcript.prototype.addExon = function(exon)
{
    if(!exon.isChildOf(this.id))
    {
        console.log("Exon is not belong to " + this.id);
        return;
    }
    exon.addTranscript(this);
    if (this.exons.length == 0) {
        this.exons.push(exon);
        inserted = true;
    }
    else {
        var inserted = false
        for (j = 0; j < this.exons.length && !inserted; j++) //check from first exon to last exon
        {
            if(exon.rank == 1)
            {
                this.exons.splice(0,0,exon);
                inserted = true;
            }
            if(this.exons[j].isBehind(exon))
            {
                this.exons.splice(j, 0, exon);
                inserted = true;
            }
        }
        if(!inserted)
        {
            this.exons.push(exon);
            inserted = true;
        }

        //return inserted;
    }
};

Transcript.prototype.addCDS = function(cds)
{
var inserted = false;
    if(this.cdsList.length == 0)
    {
        this.cdsList.push(cds);
        inserted = true;
    }
    for(j=0; j<this.cdsList.length && !inserted; j++)
    {
        if(this.cdsList[j].isbehindOf(cds))
        {
            this.cdsList.splice(j,0,cds);
            inserted = true;
        }
    }
    if(!inserted)
    {
        this.cdsList.push(cds);
        console.log('add at last');
    }
};

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
};

Transcript.prototype.drawCanonicalTranscript = function()
{
    if(this.isCanonical)
    {
        $(this.transcriptButton).attr('class', 'selected');
        this.drawTranscript(false);
    }
};

Transcript.prototype.drawTranscript = function(withcds)
{
    var svgWidth = $(this.svgContainer)[0].getBoundingClientRect().width;
    var svgStart = parseInt(svgWidth * 0.05);
    var svgEnd = parseInt(svgWidth * 0.95);
    //draw exon or cds
    if(!withcds)
    { //draw noral exon
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
                x: parseInt(svgWidth*0.95),
                y: '40'
            },this.end)

        $("#scale-ruler").append(rulerleftStraightLine);
        $("#scale-ruler").append(rulerhorizontalLine);
        $("#scale-ruler").append(rulerRightStraightLine);
        $("#scale-ruler").append(startTextSVG);
        $("#scale-ruler").append(endTextSVG);

        for (var i = 0; i < this.exons.length; i++) {
            this.exons[i].drawExon(this.svgContainer, this.start, this.end);
            if (this.strand == -1) {
                this.exons[i].drawExonDescription(this.exons.length);
            }
            else (this.strand == 1)
            {
                this.exons[i].drawExonDescription(this.exons.length);
            }

        }
        //draw Intron
        this.drawIntron();
        //var container = document.querySelector("#svg-container");
        this.addPanAndZoom();
        //button for explanation
        this.exonsBtn();
        this.transcriptionBtn();

    }
    else //draw utrs and cds
    {
        var groupSVG = makeSVG('g', { //group svg tag for the chromosome and rna polymerase
            stroke: 'black',
            'stroke-width': '1',
            id: 'chromosome-svg'
        });
        //draw chromosome left to right strand and RNA----------------------
        this.upperStrand = makeSVG('line',
            {
                x1: svgStart,
                y1:'20',
                x2: svgEnd,
                y2:'20',
                style:'stroke:black;stroke-width:1'
            });

        this.lowerStrand = makeSVG('line',
            {
                x1: svgStart,
                y1:'40',
                x2:svgEnd,
                y2:'40',
                style:'stroke:black;stoke-width:1'
            });
        var upperFiveEnd = makeTextSVG('text', {x: (svgStart - 15), y:'20'}, "5'");
        var upperThreeEnd = makeTextSVG('text', {x:(svgEnd + 10), y:'20'}, "3'");
        $(this.svgContainer).append(upperFiveEnd);
        $(this.svgContainer).append(upperThreeEnd);
        var lowerFiveEnd = makeTextSVG('text', {x: (svgEnd + 10), y:'40'}, "5'");
        var lowerThreeEnd = makeTextSVG('text', {x:(svgStart - 15), y:'40'}, "3'");
        $(this.svgContainer).append(lowerFiveEnd);
        $(this.svgContainer).append(lowerThreeEnd);
        if(this.strand == 1) {
            var index = 0; //forward strand

            this.rnaPolymerase = makeSVG('rect',
                {
                    x:svgStart,
                    y:'32',
                    width:'10',
                    height:'10',
                    style:'fill:red;opacity:0.3'
                });

            this.rna = makeSVG('line',
                {
                    x1:svgStart,
                    y1:'35',
                    x2:svgStart,
                    y2:'35',
                    style:'stroke:blue;opacity:1'
                });

            //rna Polymerase Animation
            this.rnaPolymeraseAni = makeSVG('animate',
                {
                    begin:'btnPlay.click',
                    id:'rnaPolymerase',
                    dur:'20s',
                    attributeName:'x',
                    from: svgStart,
                    to: svgEnd,
                    fill:'freeze'
                });

            //rna animation
            this.rnaAni.push(makeSVG('animate', //moving animation
                {
                    id:'rnaCreate',
                    dur:'20s',
                    attributeName:'x2',
                    from:svgStart,
                    to:svgEnd,
                    begin:'rnaPolymerase.begin',
                    fill:'freeze'
                }));
            $(this.rnaPolymerase).append(this.rnaPolymeraseAni);
            for(ani=0;ani<this.rnaAni.length;ani++) {
                $(this.rna).append(this.rnaAni[ani]);
            }
        }
        else { //reverse strand
            var index = this.cdsList.length - 1;
            this.rnaPolymerase= makeSVG('rect',
                {
                    x:(svgEnd-10),
                    y:'18',
                    width:'10',
                    height:'10',
                    style:'fill:red;opacity:0.3'
                });
            this.rna = makeSVG('line',
                {
                    x1:svgStart,
                    y1:'26',
                    x2:svgEnd,
                    y2:'26',
                    style:'opacity:0'
                })
        }
        $(this.svgContainer).append(this.upperStrand);
        $(this.svgContainer).append(this.lowerStrand);
        $(this.svgContainer).append(this.rnaPolymerase);
        $(this.svgContainer).append(this.rna);

        //button for animation start
        var startBtn = makeSVG('rect',{
            id:'btnPlay',
            x:(((svgEnd - svgStart)/2)-20),
            y:($(this.svgContainer)[0].getBoundingClientRect().height - 20),
            width: '40',
            height: '20',
            style:'fill:green;stroke-width:1;stroke:black;cursor:pointer'
        });

        $(this.svgContainer).append(startBtn);

        $("#btnPlay").click(function(self,e)
        {
            self.addPanAndZoom();
        }.bind(null,this));
        $(this.svgContainer).append(groupSVG);
        //End of draw Chromosome and rna-------------------------

        //draw all exon with utrs and cds with animation

        var animationIDList = [];
        for (var i = 0; i < this.exons.length; i++) {
            //console.log(this.exons[i].start+ "--" +this.cdsList[index].start + "||" + this.exons[i].end + " -- " + this.cdsList[index].end);
            if(index >= 0 && index < this.cdsList.length)
                var cdsMatched = this.exons[i].drawExonAndShowUTRs(this.cdsList[index],this.svgContainer);
            else
                var cdsMatched = this.exons[i].drawExonAndShowUTRs('',this.svgContainer);
            if(cdsMatched && this.strand == 1)
                index++;
            else if(cdsMatched && this.strand == -1)
                index --;
        }
        this.transcriptionAnimate();
    }

    //button for sequence
    $("#sequences-menu > .menu").empty();
    this.seqBtn();
    //var container = document.querySelector("#svg-container");
    var exonDescriptionShowned = false;
    //textbox show info
    $("#focusing-transcript-info").val('');
    var infoMsg = this.name;
    if(this.strand == 1)
        infoMsg += " Forward Strand";
    else if(this.strand == -1)
        infoMsg += " Reverse Strand";
    $("#focusing-transcript-info").val(infoMsg);

};

Transcript.prototype.testingMessage = function() //for testing only
{
    console.log("Transcript ID: " + this.id + " Strand: " + this.strand + " Name: "+ this.name );
    for(i=0; i<this.cdsList.length;i++)
    {
        this.cdsList[i].testingMsg();
    }
};

Transcript.prototype.createTranscript = function(dropdownList)
{
    this.transcriptButton = $(document.createElement('a'));
    $(this.transcriptButton).text(this.name);
    $(dropdownList).append(this.transcriptButton);
    $(this.transcriptButton).click(function(e)
    {
        panZoomInstance.destroy();
        $(this.svgContainer).children().remove();
        this.drawTranscript(false);
    }.bind(this));
};


Transcript.prototype.drawIntron = function()
{
    for (var i = 0; i < this.exons.length - 1; i++) {
        //console.log(this.strand);
        if(this.strand == '1') { //forward stard
            //console.log("Forward");
            var startX = this.exons[i].svgEndPointX;
            var endX = this.exons[i + 1].svgStartPointX;
        }
        else if(this.strand == '-1')//reverse strand
        {
            //console.log("reverse");
            var startX = this.exons[i].svgStartPointX;
            var endX = this.exons[i+1].svgEndPointX;
        }
        var xRadius = (endX - startX) * 4;
        var intronSVG = makeSVG('path',
            {
                d: 'M ' + startX + ' 150 A ' + xRadius + " " + xRadius + " 0 0 1 " + endX + " 150",
                stroke: '#e0e0e0',
                'stroke-width': '2',
                fill: 'none'
            });
        this.intronSVGs.push(intronSVG);
        //console.log(intronSVG);
        $('#svg-container').append(intronSVG);

    }

};

Transcript.prototype.drawIntronWithAnimate = function(periousAnimate, index)
{
    if(this.strand == '1') { //Forward stard
        var startX = this.exons[index].svgEndPointX;
        var endX = this.exons[index + 1].svgStartPointX;
    }
    else if(this.strand == '-1')//Reverse strand
    {
        var startX = this.exons[index].svgStartPointX;
        var endX = this.exons[index+1].svgEndPointX;
    }
    var xRadius = (endX - startX) * 4;
    var intronSVG = makeSVG('path',
        {
            d: 'M ' + startX + ' 150 A ' + xRadius + " " + xRadius + " 0 0 1 " + endX + " 150",
            stroke: '#e0e0e0',
            'stroke-width': '2',
            fill: 'none'
        });
    var id = 'intronAni'+index;
    var intronAnimate = makeSVG('animate',
        {
            id:id,
            dur:'3s',
            attributeName:'d',
            from: 'M ' + startX + ' 150 A ' + xRadius + " " + xRadius + " 0 0 1 " + startX + " 150",
            end: 'M ' + startX + ' 150 A ' + xRadius + " " + xRadius + " 0 0 1 " + endX + " 150",
            fill:'freeze',
            begin:periousAnimate
        })
    return id;

};


Transcript.prototype.exonsBtn = function()
{
    //this.btnExons = "<button class='intronduction btn btn-info btn-lg' id='exons-intro'>EXONS</button>";
    this.btnExons = document.createElement("button");
    $(this.btnExons).attr('class', 'introduction btn btn-info btn-lg');
    $(this.btnExons).attr('id', 'exons-intro');
    $(this.btnExons).html("EXONS");
    $("#exons-btn").empty();
    $("#exons-btn").append(this.btnExons);

    console.log(this.btnExons);
    var clicked = false;

    //button click event----------------------------
    $(this.btnExons).click(function()
    {
        if(!clicked) {
            clicked = true;
            //animation
            $("#exons-intro").attr('class', 'introduction btn btn-success btn-lg');
            $(".exon").attr('class', 'exon blinking');
            var explanationText = makeTextSVG('text',
                {
                    class: 'fadeInAndOut',
                    id: 'explanation-text',
                    x: ($('.svg-container').getBoundingClientRect().width / 2) - 50,
                    y: '270',
                    'font-size': '15',
                    fill: 'black',
                    'font-weight': 'bold'
                }, "ALL EXONS");

            $("#svg-container").append(explanationText);

            setTimeout(function()
            {
                $('.exon').attr('class','exon');
            },6000);

            var i = 0;
            this.exonAniInterval = setInterval(function () {
                $(".exon").attr('class', 'exon');
                $("#explanation-text").remove();
                console.log(i);
                console.log(this.exons.length);
                explanationText = setSVGText(explanationText, "EXON " + (i+1));
                this.exons[i].exonAnimation();
                //$(".exon").attr('class', 'exon');
                $("#svg-container").append(explanationText);
                i++;
                if(i >= this.exons.length)
                    i = 0;
            }.bind(this), 7000)
        }
        else //click one more time
        {
            $('#exons-intro').attr('class', 'introduction btn btn-info btn-lg');
            clicked= false;
            clearInterval(this.exonAniInterval);
            $(".exon").attr('class', 'exon')
            $("#explanation-text").remove();
        }
    }.bind(this));
    //button click event end-----------------
};

Transcript.prototype.transcriptionBtn = function()
{
    //create btn
    this.btnTranscription = document.createElement('button');
    $(this.btnTranscription).attr('class', 'introduction btn btn-info btn-lg');
    $(this.btnTranscription).attr('id', 'transcription-intro');
    $(this.btnTranscription).html("TRANSCRIPTION");
    $("#transcription-btn").empty();
    $("#transcription-btn").append(this.btnTranscription);

    //button onClick event handler
    var clicked = false;
    $(this.btnTranscription).click(function()
    {
        if(!clicked)
        {
            clicked = true;
            $("#transcription-intro").attr('class', 'introduction btn btn-success btn-lg');
            panZoomInstance.destroy();
            $(this.svgContainer).children().remove();
            this.drawTranscript(true);

            //var startTimeOut = setTimeout(function() {
            //    var periousAni='';
            //    var firstIndex;
            //    var firstCreated=false;
            //    for(i=0; i<this.exons.length; i++) {
            //        this.exons[i].hideShowcdsAndutrs(true);
            //        periousAni = this.exons[i].transcriptionAnimation(this.strand, periousAni);
            //        if(!firstCreated && periousAni.length>0)
            //        {
            //            firstIndex = i;
            //            firstCreated=true;
            //        }
            //    }
            //    this.exons[firstIndex].transcriptionAniRestart(periousAni);

            //}.bind(this),3000);
        }
        else
        {
            clicked = false;
            $("#transcription-intro").attr('class', 'introduction btn btn-info btn-lg');
            panZoomInstance.destroy();
            //clearInterval(this.transcriptionAniInterval);
            $(this.svgContainer).children().remove();
            this.drawTranscript(false);
        }

        //animation
    }.bind(this));
};

Transcript.prototype.seqBtn = function()
{
    // Basic Btn Setting
    this.btnTranscriptSeq = document.createElement('a');
    $(this.btnTranscriptSeq).text("Transcript Sequences");
    $("#sequences-menu > .menu").append(this.btnTranscriptSeq);
    if(this.cdsList.length > 0)
    {
        this.btnCdsSeq = document.createElement('a');
        $(this.btnCdsSeq).text("cds Sequences");
        this.btnProteinSeq = document.createElement('a');
        $(this.btnProteinSeq).text("Protein Sequences");
        $("#sequences-menu > .menu").append(this.btnCdsSeq);
        $("#sequences-menu > .menu").append(this.btnProteinSeq);
    }


    //btn click handler
    $(this.btnTranscriptSeq).click(function(e)
    {
        this.getSequence();
        this.clearAllExonSVGFocus();
    }
    .bind(this));
};

Transcript.prototype.clearAllExonSVGFocus = function()
{
    for(i=0;i<this.exons.length;i++)
    {
        this.exons[i].svgExonFocusing(false);
    }
};



