/**
 * Created by yuechungng on 28/3/2016.
 */
var showSpinner = function()
{
    var spinnerDiv = document.createElement('div');
    $(spinnerDiv).attr('class','spinner-div');
    var spinnerInner = document.createElement('div');
    $(spinnerInner).attr('class','spinner-inner');
    var loading = document.createElement('div');
    $(loading).attr('class', 'loader');
    $(spinnerInner).append(loading);
    $(spinnerDiv).append(spinnerInner);
    $('body').append(spinnerDiv);
}