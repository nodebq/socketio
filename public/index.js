window.onload = function () {
    var board = document.getElementById("board");
    var id = Math.random().toString(36).substr(2);
    var sub = document.getElementById("sub");
    document.getElementById('id').value = id;
    var socket = io.connect('http://127.0.0.1:1356');
    socket.userId = id;
    socket.on('welcome', function (data) {
        //欢迎别人加入聊天的代码
        let welcomeOther = document.createElement("p");
        welcomeOther.innerText = '欢迎' + data.id + '进入聊天室';
        welcomeOther.setAttribute('class','welcome');
        board.appendChild(welcomeOther);

    });
    socket.on('msg', function (data) {
        //别人说的话
        let message = document.createElement("p");
        message.innerHTML = '<p class="person">'+data.id+"   "+data.date+'</p><p class="message">'+data.msg+'</p>';
        board.appendChild(message);
        //console.log(data);
    });
    socket.on('dis', function (data) {
        //别人离开聊天室
        console.log(data);
        let dis = document.createElement("p");
        dis.innerText = data + '离开了聊天室';
        dis.setAttribute('class','welcome');
        board.appendChild(dis);
    });
    socket.on('news', function (data) {
        socket.emit('welcome',{id:id});
        //欢迎进入聊天室添加进聊天框的代码
        let welcome = document.createElement("p");
        welcome.innerText = '欢迎' + document.getElementById('id').value + '进入聊天室';
        welcome.setAttribute('class','welcome');
        board.appendChild(welcome);
        sub.onclick = function msg (){
            if(document.getElementById('id').value==''||document.getElementById('msg').value==''){
                alert('空值不可以发送');
            }else{
                let data = {};
                socket.userId = document.getElementById('id').value;
                data.id = document.getElementById('id').value;//id
                data.msg = document.getElementById('msg').value;//信息
                data.date = new Date().toLocaleString();//时间
                socket.emit('msg',data);
                //自己发的消息添加进聊天框的代码
                let message = document.createElement("p");
                message.innerHTML = '<p class="person">'+data.id+"   "+data.date+'</p><p class="message">'+data.msg+'</p>';
                board.appendChild(message);
            }
        }
    });
};