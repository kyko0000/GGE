/**
 * Created by yuechungng on 24/2/2016.
 */
var makeSVG = function(tag, attrs)
{
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;

}

var makeTextSVG = function(tag, attrs, val)
{
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for(var k in attrs)
    {
        el.setAttribute(k, attrs[k]);

    }
    el.textContent = val;
    return el;
}

var setSVGAttr = function(svg, attrs)
{
    for(var k in attrs)
    {
        svg.setAttribute(k, attrs[k]);

    }
    return svg;
}

var setSVGText = function(svg, text)
{
    svg.textContent = text;
    return svg;
}
