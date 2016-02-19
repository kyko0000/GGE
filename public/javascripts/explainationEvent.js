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