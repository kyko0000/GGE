/**
 * Created by yuechungng on 19/2/2016.
 */
function Exon(start, end, id, parent, rank) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.parent = parent;
    this.parentTranscript;
    this.exonSVG;
    this.svgStartPointX;
    this.svgStartPointY = 125;
    this.svgWidth;
    this.svgEndPointX;
    this.utrsWidth;
    this.cdsWidth;
    this.rank = rank;
    //svg for utr and cds
    this.utrSVG;
    this.cdsSVG;
    this.utrCdsList = []; //order of utr and cds
    //ani
    this.transcriptionAni;
    this.transcriptionOpacityAni;
    this.animatedRuler;
    this.getExonSequence = function(type)
    {
        //conosle.log('clicked');
        var data = {};
        data.id = this.id;
        data.type = type;
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
                    var sequenceObj = JSON.parse(data);
                    $('#sequence').append("DNA Sequence of "+sequenceObj.id+": ");
                    $('#sequence').append(sequenceObj.seq);
                    $('#sequence').height('inherit');
                    if($('#sequence').height() > 250)
                    {
                        $('#sequence').height(250);
                    }
                    $('#sequence-title-text').text("Sequence: " + this.id);
                    $('html, body').animate({
                        scrollTop: $("#sequence").offset().top
                    }, 2000);
                    //console.log(sequence);
                }.bind(this),
                error: function(xhr, status, err)
                {
                    console.log("Get Sequence Ajax Error");
                }
            }
        )
    }

    //class for create different animates
    this.createAnimate = function(periousAni, attributeName, from, to, id, svgWidth, time, strand, svgStart)
    {
        var animations=[];
        var animation = makeSVG('animate',
            {
                id:id,
                dur:((to/svgWidth)*time)+"s",
                attributeName: attributeName,
                from:from,
                to:to,
                fill:'freeze'
            })
        var animationSet = makeSVG('animate',
            {
                begin:id+".begin",
                dur:'0.1s',
                attributeName:'opacity',
                from:'0',
                to:'1',
                fill:'freeze'
            })
        if(periousAni.length != 0)
        {
            animation = setSVGAttr(animation,
                {
                    begin: periousAni+".end"
                })
        }
        else
        {
            animation = setSVGAttr(animation,
                {
                    begin: 'rnaPolymerase.begin'
                })
        }
        animations.push(animation);
        animations.push(animationSet);
        //one more animation from reverse Strand making it seem like created from right to left
        if(strand == -1)
        {
            var svgEnd = (parseFloat(svgStart) + parseFloat(to));
            console.log(svgStart + " + " + to +" = "+ svgEnd);
            var reverse = makeSVG('animate',
                {
                    begin:id+".begin",
                    id:'revsrse'+id,
                    dur:((to/svgWidth)*time)+"s",
                    attributeName:'x',
                    from: svgEnd,
                    to: svgStart,
                    fill:'freeze'
                })
            animations.push(reverse);
        }
        return animations;
    }
}
Exon.prototype.isChildOf = function(transcriptID)
{
    return (this.parent == transcriptID);
}

Exon.prototype.addTranscript = function(transcript)
{
    this.transcript = transcript;
}

//draw Exon
Exon.prototype.drawExon = function(svgContainer, transcriptStart, transcriptEnd)
{
    var svgWidth = $(svgContainer)[0].getBoundingClientRect().width;
    var svgStartPoint = svgWidth * 0.05; //5% left space
    var svgEndPoint = parseInt(svgWidth*0.95);
    var svgLength = svgEndPoint - svgStartPoint;
    var transcriptLength = transcriptEnd - transcriptStart;
    this.svgStartPointX = ((this.start - transcriptStart)/transcriptLength) * svgLength + svgStartPoint;
    this.svgWidth = ((this.end - this.start)/transcriptLength) * svgLength;
    this.svgEndPointX = this.svgWidth + this.svgStartPointX;
    //var exonGroup = makeSVG('g',
    //    {
    //        id:'g-'+this.id
    //    });
    this.exonSVG = makeSVG('rect',
        {
            id: this.id,
            class: 'exon',
            x: this.svgStartPointX,
            y: this.svgStartPointY,
            rx:'5',
            ry:'5',
            width: this.svgWidth,
            height: '50',
            style:'fill:green;fill-opacity:0.6'
        }
    )
    $(svgContainer).append(this.exonSVG);
    //$(svgContainer).append(exonGroup);

    $(this.exonSVG).dblclick(function(e)
    {
        this.getExonSequence('genomic');
        this.transcript.clearAllExonSVGFocus();
        this.svgExonFocusing(true);
    }.bind(this));
}

//draw cds and utrs
Exon.prototype.drawExonAndShowUTRs = function(cds, svgContainer, strand)
{
    var cdsMatched = false;
    var thisLastAnimateID ='';
    this.utrCdsList = [];
    console.log(this.id);
    console.log(this.start +" -  " + this.end + " : " + cds.start + " - " + cds.end);
    //var exonGroup = makeSVG('g',
    //    {
    //        id:'g-'+this.id
    //    });
    if(cds == '' || cds.start > this.end || this.start > cds.end) //No cds or this exon not consist any cds, forward --> cds start > exon start / reverse --> exon start > cds end
    {
        this.utrSVG = makeSVG('rect',
        {
            id:'utr-'+this.id,
            class: 'utr',
            x: this.svgStartPointX,
            y: this.svgStartPointY,
            width: this.svgWidth,
            height: '50',
            'stroke-width': '0.1',
            stroke: 'black',
            style:'fill:white;opacity:0'
        })
        thisLastAnimateID = 'utr'+this.id;
        //var utrAnimation = this.createAnimate(periousAnimate, 'width', 0, this.svgWidth, thisLastAnimateID);
        //this.utrSVG.append(utrAnimation);
        this.utrCdsList.push(this.utrSVG);
        $(svgContainer).append(this.utrSVG);
        console.log('inserted utr Only');
    }
    else if(this.start == cds.start && this.end == cds.end)
    {
        this.cdsWidth = this.svgWidth;
        this.cdsSVG = makeSVG('rect',
            {
                id: 'cds-'+this.id,
                class: 'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;opacity:0'
            }
        )
        this.utrCdsList.push(this.cdsSVG);
        $(svgContainer).append(this.cdsSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted cds only');
    }
    else if(this.start != cds.start && this.end == cds.end) //the most left exon
    {
        this.utrsWidth = (cds.start - this.start)/(this.end - this.start) * this.svgWidth;
        var trStartX = this.svgStartPointX + this.utrsWidth;
        this.cdsWidth = this.svgEndPointX - trStartX;
        //make unfilled rectangle for utrs
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: trStartX - this.svgStartPointX,
                height: '50',
                'stroke-width': '0.1',
                stroke: 'black',
                style:'fill:white;opacity:0'
            })
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: trStartX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;opacity:0'
            })
        thisLastAnimateID = cds+this.id;
        //var utrSVGAnimate = this.createAnimate(periousAnimate, 'width', 0, (trStartX - this.svgStartPointX), 'utr'+this.id);
        //var cdsSVGAnimate = this.createAnimate('utr'+this.id, 'width', 0, (this.cdsWidth), thisLastAnimateID);
        //this.utrSVG.append(utrSVGAnimate);
        //this.cdsSVG.append(cdsSVGAnimate);
        if(strand == 1) {
            console.log('forward strand Head');
            this.utrCdsList.push(this.utrSVG);
            this.utrCdsList.push(this.cdsSVG);
        }
        else if(strand == -1)
        {
            console.log('reverse Strand Tail')
            this.utrCdsList.push(this.cdsSVG);
            this.utrCdsList.push(this.utrSVG);
        }
        $(svgContainer).append(this.utrSVG);
        $(svgContainer).append(this.cdsSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted head cds');
    }
    else if(this.start == cds.start && this.end != cds.end) //the most right exon
    {
        this.utrsWidth = ((this.end - cds.end) / (this.end - this.start)) * this.svgWidth;
        //console.log(utrsWidth);
        utrStartX = this.svgEndPointX - this.utrsWidth;
        this.cdsWidth = utrStartX - this.svgStartPointX;
        this.cdsSVG = makeSVG('rect',
            {
                id:'cds-'+this.id,
                class:'cds',
                x: this.svgStartPointX,
                y: this.svgStartPointY,
                width: this.cdsWidth,
                height: '50',
                style:'fill:blue;opacity:0'

            });
        this.utrSVG = makeSVG('rect',
            {
                id:'utr-'+this.id,
                class:'utr',
                x: utrStartX,
                y: this.svgStartPointY,
                width: this.utrsWidth,
                height: '50',
                stroke: 'black',
                'stroke-width': '0.1',
                style: 'fill:white;opacity:0'

            });
        thisLastAnimateID = 'utr'+this.id

       //var cdsSVGAnimate = this.createAnimate(periousAnimate, 'width', 0, this.cdsWidth,'cds'+this.id);
        //var utrSVGAnimate = this.createAnimate('cds'+this.id, 'width', 0, this.utrsWidth, thisLastAnimateID);
        if(strand == 1) {
            console.log('forward strand tail');
            this.utrCdsList.push(this.cdsSVG);
            this.utrCdsList.push(this.utrSVG);
        }
        else if(strand == -1)
        {
            console.log('reverse strand head');
            this.utrCdsList.push(this.utrSVG);
            this.utrCdsList.push(this.cdsSVG)
        }

        $(svgContainer).append(this.cdsSVG);
        $(svgContainer).append(this.utrSVG);
        //$(svgContainer).append(exonGroup);
        cdsMatched = true;
        console.log('inserted tail cds');
    }

    $(this.cdsSVG).hover(function(e)
    {
        if(factMode)
        {
            var cdsString = "<h3>Coding Region (CDS)</h3><p>Cds is a portion of a gene's DNA or RNA, composed of exons, that codes of protein.</p>";
            $('#text-explanation').empty();
            $('#text-explanation').append(cdsString);
        }
    });

    $(this.utrSVG).hover(function(e)
    {
        if(factMode)
        {
            var utrString = "<h3>Untransated Region(UTR)</h3><p>Untranslated region (or UTR) refers to either of two sections." +
                "If it is found on the 5' side, it is called the 5' UTR (or leader sequence), or if it is found on the 3' side, it is called the 3' UTR (or trailer sequence)." +
                "The importance of these untranslated regions of mRNA is just beginning to be understood. Various medical studies are being conducted that have found connections" +
                " between mutations in untranslated regions and increased risk for developing a particular disease, such as cancer. " +
                "</p>";
            $('#text-explanation').empty();
            $('#text-explanation').append(utrString);
        }
    });

    return cdsMatched
}

Exon.prototype.createTranscriptionAnimate = function(periousAnimate, strand, svgWidth, time, periousEnd)
{
    for(k=0; k<this.utrCdsList.length; k++)
    {
        if(strand == -1 && this.utrCdsList.length > 1 && k==0)
        {
            periousEnd += parseFloat($(this.utrCdsList[k+1]).attr('width'));
        }
        var id = 'ani'+this.id+k;
        var animates = this.createAnimate(periousAnimate, 'width', '0', $(this.utrCdsList[k]).attr('width'), id, svgWidth, time, strand, $(this.utrCdsList[k]).attr('x'));
        for(animateIndex=0; animateIndex<animates.length;animateIndex++) {
            $(this.utrCdsList[k]).append(animates[animateIndex]);
        }
        var translationAnimate = makeSVG('animate',
            {
                id: 'transclation' + this.id,
                dur: '5s',
                attributeName:'x',
                from: $(this.utrCdsList[k]).attr('x'),
                to: periousEnd,
                fill:'freeze',
                begin:'rnaPolymerase.end'
            });
        if(periousEnd != 0) {
                $(this.utrCdsList[k]).append(translationAnimate);
            if(strand == 1)
            {
                periousEnd += parseFloat($(this.utrCdsList[k]).attr('width'));
            }
            else {
                periousEnd = parseFloat(periousEnd - $(this.utrCdsList[k+1]).attr('width'));
            }
        }
        periousAnimate = id
    }
    return id;
}
Exon.prototype.svgExonFocusing = function(focusing)
{
    if(!focusing)
    {
        $(this.exonSVG).css('fill', 'green');
        $(this.exonSVG).css('fill-opacity','0.6');
    }
    else
    {
        $(this.exonSVG).css('fill', 'red');
    }
}

Exon.prototype.isBehind = function(exon)
{
    return (this.rank > exon.rank);
}

Exon.prototype.isFrontOf = function(exon)
{
    return (this.rank < exon.rank);
}

Exon.prototype.testingMessage = function()
{
    console.log("Exon: Parent: "+this.parent+" Start: "+this.start+" End: "+ this.end + "Rank:" + this.rank);
}

Exon.prototype.updateSVG = function(svg)
{
    $("#g-"+this.id).append(svg);

}

Exon.prototype.drawExonDescription = function(length, svgContainer)
{
    //var exonDescriptionSVG = makeTextSVG('text',
    //    {
    //        id: "d-"+this.id,
    //        class: 'exonDescription hidden',
    //        x: this.svgStartPointX,
    //        y: 195,
    //        'font-size': 12,
    //    }, "Exon " + this.rank + " / " + length);

    //$(svgContainer).append(exonDescriptionSVG);

    var svgEndPoint = this.svgStartPointX + this.svgWidth;
    this.animatedRuler = makeSVG('g',{class: 'exonDescription show'});
    var exonRuler = makeSVG('path', {

        d:'M '+ this.svgStartPointX + ' 180 V 190 V 185 H '+ svgEndPoint + ' V 190 V 180',
        style:'fill:none; stroke:black; stroke-width:0.5px'
    });
    $(this.animatedRuler).append(exonRuler);
    var exonLenghtText = makeTextSVG('text',
        {
            x: this.svgStartPointX,
            y: 205,
            'font-size':'12'
        }, 'EXON ' + this.rank + ': ' + parseInt(this.end - this.start) + 'bp' );
    $(this.animatedRuler).append(exonLenghtText);

    $(svgContainer).append(this.animatedRuler);

    //exon hover
    $(this.exonSVG).hover(function(e)
    {
        $(this.animatedRuler).css('opacity', '1');
        var path = $(this.animatedRuler).children()[0];
        //path animation
        $(path).attr('class', 'path');
        if(factMode) {
            var exonString = '<h2>Exon</h2>' +
                '<p>An exon is any part of a gene that will become a part of the final mature RNA produced by that ' +
                'gene after introns have been removed by RNA splicing. In RNA splicing, introns are removed and exons are covalently joined to one another as part' +
                ' of generating the mature messenger RNA. Since the non-coding exons are known in human gene, Exon is not only refer the coding sequence for the final protein</p>';
            $('#text-explanation').empty();
            $('#text-explanation').append(exonString);
        }

    }.bind(this),
    function(e)
    {
        $(this.animatedRuler).css('opacity','0');
        var path = $(this.animatedRuler).children()[0];
        $(path).attr('class', '');
    }.bind(this));
}

Exon.prototype.exonAnimation = function()
{
    console.log(this.id);
    $("#"+this.id).attr('class', 'exon blinkingEach');
}

/*Exon.prototype.transcriptionAnimation = function(strand,periousAni)
{
    if(strand == 1) //forward strand
    {
        //console.log("go here");
        if($("#cds-"+this.id).length)
        {
            this.transcriptionAni = makeSVG('animate',
                {
                    id: 'ani' + this.id,
                    dur: '6s',
                    attributeName: 'width',
                    from: 0,
                    to: this.cdsWidth,
                    repeatCount: '1',
                });
            this.transcriptionOpacityAni = makeSVG('animate',
                {
                    dur:'1s',
                    attributeName:'opacity',
                    from:'0',
                    to:'1',
                    fill:'freeze',
                    begin:'ani'+this.id+".begin"
                })
            if(periousAni.length > 0)
            {
                this.transcriptionAni = setSVGAttr(this.transcriptionAni,
                    {
                        begin:periousAni+".end"
                    })
            }
            if(periousAni.length > 0) {
                $("#cds-" + this.id).append(this.transcriptionAni);
            }
            $("#cds-"+this.id).append(this.transcriptionOpacityAni);
            return "ani"+this.id;
        }
        else
        {
            return 0;
        }
    }
    else //reverse strand
    {

    }
}*/

Exon.prototype.transcriptionAniRestart = function(lastAni)
{
    this.transcriptionAni = setSVGAttr(this.transcriptionAni,
        {
            begin: "0s;"+lastAni+".end"
        })
    $("#cds-"+this.id).append(this.transcriptionAni);
}

Exon.prototype.hideShowcdsAndutrs = function(hide)
{
    if(hide)
        $(this.cdsSVG).css('opacity','0');
    else
        $(this.cdsSVG).css('opacity', '1');
}





