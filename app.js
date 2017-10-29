var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var url=require('url');
var path=require('path');

var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

app.listen(1356, function () {//监听80端口
    console.log('1356 go');
});


function handler(req,res){
    console.log(1);
    var filePath;
    if(req.url==="/"){
        filePath =  "index.html";
    } else{
        filePath = "./" + url.parse(req.url).pathname;
    }
    console.log(filePath);
    fs.exists(filePath,function(err){
        if(!err){
            console.log(err);
            //send404(res);
        }else{
            var ext = path.extname(filePath);
            ext = ext?ext.slice(1) : 'unknown';
            var contentType = MIME_TYPE[ext] || "text/plain";
            fs.readFile(filePath,function(err,data){
                if(err){
                    res.end("<h1>500</h1>服务器内部错误！");
                }else{
                    res.writeHead(200,{'content-type':contentType});
                    res.end(data.toString());
                }
            });//fs.readfile
        }
    })//path.exists
    // fs.readFile(__dirname + '/index.html', function (err, data) {
    //     if(err){
    //         res.writeHead(500);
    //         return res.end('no index');
    //     }
    //     res.writeHead(200);
    //     res.end(data);
    // });

}

io.on('connection', function (socket) {
    socket.emit('news',{hello:'world'});
    //socket.on('my other event', function (data) {
    //    //console.log(data);
    //});
    socket.on('welcome', function (data) {
        //console.log(data);
        socket.broadcast.emit('welcome',data);
        socket.userId = data.id;
    });
    socket.on('msg',function (data){
        //console.log(data);
        socket.broadcast.emit('msg',data);
        socket.userId = data.id;
    });
    socket.on('disconnect',function(data){
        //
        //console.log(data);
        //console.log(socket.userId);
        socket.broadcast.emit('dis',socket.userId);

    })
});