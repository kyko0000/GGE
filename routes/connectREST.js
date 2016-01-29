/**
 * Created by yuechungng on 13/1/2016.
 * Connect to Ensembl REST API
 */
var option = {
    host: 'http://rest.ensembl.org',
    path:'/archive/id/ENSG00000157764?',
    method:'GET'
};

http.request(option, function(res){
    console.log('STATUS:' + res);
    console.log('HEADER', JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        console.log('BODY:'+chunk);
    });
}).end();