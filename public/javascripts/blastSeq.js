/**
 * Created by yuechungng on 23/3/2016.
 */
var blastTheSequence = function(query)
{
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

        },
        error: function(xtr, status, err)
        {
            alert("AJAX: BLAST ERROR");
        }
    });
}