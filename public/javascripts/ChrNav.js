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
        var maxChromosomeLength = 249000000;
        var chromosomeBoxWidth = ($(chrNavSvg)[0].getBoundingClientRect().width/12); //divide 12 box for 12 chromosomes in each line
        var chromosomeBoxHeight = ($(chrNavSvg)[0].getBoundingClientRect().height/2)*0.9; //divid 2 row for all chromosomes and have 5% padding
        var startPointX = (chromosomeBoxWidth*0.25);
        var startPointY = ($(chrNavSvg)[0].getBoundingClientRect().height/2)*0.05;//the chromosome locate in the certer of the box
        var chromosomeWidth = chromosomeBoxWidth/4;
        for(i=0;i<this.chromosomesData.length;i++)
        {
            var pArmHeight = (this.chromosomesData[i].Centromere/maxChromosomeLength)*chromosomeBoxHeight;
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
                    style:'stroke-width:1px; stroke:black; fill:grey'
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
                    style: 'stroke-width:1px; stroke:black; fill:grey'
                })

            var chromosomeName = makeTextSVG('text',
                {
                    id: 'chrName'+this.chromosomesData[i].Chr,
                    x: startPointX+chromosomeWidth,
                    y: startPointY+pArmHeight+qArmHeight, //Below the Chromosome
                    style:'font:1px; opacity:0.2'
                },this.chromosomesData[i].Chr);

            //$("."+this.chromosomesData[i]).hover(function(e)
            //{
            //    $("#chrName"+this.chromosomesData[i].Chr).css('opacity', '1');
            //},
            //function(e)
            //{
            //    $("#chrName"+this.chromosomesData[i].Chr).css('opacity', '1');
            //});

            $(chrNavSvg).append(chrPArmSvg);
            $(chrNavSvg).append(chrQArmSvg);
            $(chrNavSvg).append(chromosomeName);
            if(i != 11)
            {
                startPointX += chromosomeBoxWidth;
            }
            else
            {
                startPointX = (chromosomeBoxWidth*0.25);
                startPointY = ($(chrNavSvg)[0].getBoundingClientRect().height/2)
            }
        }
    }
    this.createChromosomes();
}