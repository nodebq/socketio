var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80, function () {//监听80端口
    console.log('80 go');
});


function handler(req,res){
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if(err){
            res.writeHead(500);
            return res.end('no index');
        }
        res.writeHead(200);
        res.end(data);
    });
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