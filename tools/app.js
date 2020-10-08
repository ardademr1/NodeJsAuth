var http = require('http')
var fs = require('fs')
var server = http.createServer(function(req,res){
    if(req.url=='/'){
        fs.readFile('index.html',function(err,data){
            res.write(data);
            res.end(' mesaj bitti')
        });
    }
});
server.listen(8000);