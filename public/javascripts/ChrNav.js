/**
 * Created by yuechungng on 17/3/2016.
 */
function ChrNav(chromosomesData, chrNavSvg)
{
    this.chromosomesData = chromosomesData; //the chromosome object from database
    this.chrNavSvg = chrNavSvg;
    this.panZoomInstance
    this.createChromosomes = function()
    {
        var svgContainerWidth = $(this.chrNavSvg)[0].getBoundingClientRect().width;
        var svgContainerHeight = $(this.chrNavSvg)[0].getBoundingClientRect().height;
        var maxChromosomeLength = 249000000;
        var chromosomeBoxWidth = (svgContainerWidth/12); //divide 12 box for 12 chromosomes in each line
        var chromosomeBoxHeight = (svgContainerHeight/2)*0.9; //divid 2 row for all chromosomes and have 5% padding
        var startPointX = (chromosomeBoxWidth*0.25);
        var startPointY = (svgContainerHeight/2)*0.05;//the chromosome locate in the certer of the box
        var chromosomeWidth = chromosomeBoxWidth/4;
        for(i=0;i<this.chromosomesData.length;i++)
        {
            var pArmHeight = (this.chromosomesData[i].Centromere/maxChromosomeLength)*chromosomeBoxHeight;

            //group svg, every chromosome within one group
            var group = makeSVG('g',{
                id:'g'+this.chromosomesData[i].Chr,
                class:'Chr-Group chrType'+ this.chromosomesData[i].Type,
                'data-chr':this.chromosomesData[i].Chr,
                });
            //drawing P Arm
            var chrPArmSvg = makeSVG('rect',
                {
                    id: this.chromosomesData[i].Chr+"P",
                    class: this.chromosomesData[i].Chr,
                    x: startPointX,
                    y: startPointY,
                    rx:10,
                    ry:10,
                    width:chromosomeWidth,
                    height: pArmHeight,
                    style:'stroke-width:1px; stroke:black;'
                });
            var qArmHeight = (this.chromosomesData[i].Length - (this.chromosomesData[i].Centromere+1))/maxChromosomeLength*chromosomeBoxHeight;
            var qArmStartPointY = ((this.chromosomesData[i].Centromere+1)/maxChromosomeLength)*chromosomeBoxHeight+startPointY;
            //drawing Q Arm
            var chrQArmSvg = makeSVG('rect',
                {
                    id: this.chromosomesData[i].Chr+"Q",
                    class:this.chromosomesData[i].Chr,
                    x: startPointX,
                    y: qArmStartPointY,
                    rx:'10',
                    ry:'10',
                    width: chromosomeWidth,
                    height:qArmHeight,
                    style: 'stroke-width:1px; stroke:black;'
                })

            var chromosomeName = makeTextSVG('text',
                {
                    id: 'chrName'+this.chromosomesData[i].Chr,
                    x: startPointX-(chromosomeBoxWidth/4),
                    y: startPointY+pArmHeight+qArmHeight+svgContainerHeight*0.05, //Below the Chromosome
                },"Chromosome "+this.chromosomesData[i].Chr);

            $(group).append(chrPArmSvg);
            $(group).append(chrQArmSvg);
            $(group).append(chromosomeName);
            $(this.chrNavSvg).append(group);
            if(i != 11)
            {
                startPointX += chromosomeBoxWidth;
            }
            else
            {
                startPointX = (chromosomeBoxWidth*0.25);
                startPointY = (svgContainerHeight/2)+(svgContainerHeight*0.05)
            }
        }
    }


    this.createChromosomes();
    $('.spinner-div').hide();

    //chromosome navigator event handler
    //click the information button
    $('#btn-chromosome-type').click(function(e)
    {
        //alert("HI");
        $('.chromosome-type').toggle(500);
        $('.Chr-Group').addClass('info-showing');
        $('html, body').animate({
            scrollTop: $("#chromosomes-navigator-container").offset().top
        }, 500);
        $(this).hide();
    });
    //double click --> go to chromosome and gene page
    $('.Chr-Group').dblclick(function(e)
    {
        $('.spinner-div').show();
        var query={};
        query.type='chromosome';
        query.chromosomeName='Chr'+$(this).data('chr');
        $.ajax({
            url:'./Gene/',
            data: query,
            type: "GET",
            contentType:'application/json',
            success: function(data)
            {
                $('.container').remove();
                $('body').append(data);
                $('.spinner-div').hide();
            },
            error: function(xtr, status, err)
            {
                alert("AJAX Get Chromosome Error");
            }
        });
    });
}