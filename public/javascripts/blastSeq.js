/**
 * Created by yuechungng on 23/3/2016.
 */
var blastTheSequence = function(query)
{
    $('.spinner-div').show();
    var query = query;
    var query = query.toUpperCase();
    var data = {};
    data.query = query;
    $.ajax({
        url:'./api/blastSeq',
        data: data,
        type:'GET',
        success: function(data)
        {
            var result = JSON.parse(data);
            if(result.status = 0)
            {
                $("#result-string").append(result.message);
                $('#btn-result').hide();
            }
            else
            {
                $('#result-string').append('Result Found, Please Click the button to read the report');
                $('#result').append(result.message);
            }
            $('#result-container').show();
            $('.spinner-div').hide();
        },
        error: function(xtr, status, err)
        {
            alert("AJAX: BLAST ERROR");
        }
    });
}