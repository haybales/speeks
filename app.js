var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var usernames = {};
var maxNameLength = 12;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/about', function (req, res) {
  res.sendFile(__dirname + '/about.html');
});

app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + '/style.css');
});

app.get('/easytoast.css', function (req, res) {
  res.sendFile(__dirname + '/easytoast.css');
});

app.get('/easytoast.js', function (req, res) {
  res.sendFile(__dirname + '/easytoast.js');
});

app.get('/chat.js', function (req, res) {
  res.sendFile(__dirname + '/chat.js');
});

app.get('/ploop.wav', function (req, res) {
  res.sendFile(__dirname + '/ploop.wav');
});

io.on('connection', function (socket) {
    var addedUser = false;
    var room = "main";
    var roomusers=[];
    var trigger = false;
    function updateUserList(){
		roomusers=[];
		for(var item in usernames){
			if(usernames[item]===room){
				roomusers.push(item);
			}
		}
	}

    socket.on('name', function (data) {
    	if(!addedUser){
	    	if(data.length>maxNameLength){
	    		socket.emit('toast', {'style': "error", 'msg': "Name too long. Must be under "+maxNameLength+" characters."});
	    	}else if(data===""){
	    		socket.emit('toast', {'style': "error", 'msg': "Please enter a name."});
	    	}else if(usernames[data]){
	    		socket.emit('toast', {'style': "error", 'msg': "User already exists."});
	    	}else{
	    		data=encodeHTML(data);
				addedUser = true;
				usernames[data]=room;
				socket.username = data;
				socket.join(room);
				updateUserList();
		    	io.sockets.in(room).emit('namelist', roomusers, roompops(usernames));
		    	socket.emit('enterchat', room);
		    	socket.emit('roomname', room);
	    	}
    	}
    });
    socket.on('message', function (data){
    	var d = new Date();
    	if(data==="/rainbow"){
    		trigger = !trigger;
    	}else{
    		if(trigger){
		    	data = encodeHTML(data);
		    	if(addedUser && data !=""){
			    	io.sockets.in(room).emit('incoming', {'name': socket.username, 'message': "<span class=\'rainbow\'>"+data+"</span>", 'time': d.getTime()});
			    }
	    	}else{
	    		data = encodeHTML(data);
		    	if(addedUser && data !=""){
			    	io.sockets.in(room).emit('incoming', {'name': socket.username, 'message': data, 'time': d.getTime()});
			    }
	    	}
    	}
    });

    socket.on('roomchange', function(data){
    	data=encodeHTML(data);
    	if(addedUser && data!="" && data.length < 8){
	    	socket.leave(room);
	    	usernames[socket.username]=data;
	    	updateUserList();
		    io.sockets.in(room).emit('namelist', roomusers, roompops(usernames));
	    	room=data;
	    	socket.join(room);
	    	updateUserList();
		    io.sockets.in(room).emit('namelist', roomusers, roompops(usernames));
		    socket.emit('roomname', room);
		}else if(data.length > 8){
			socket.emit("toast", {"style": "error", "msg": "Room name must be less than 8 characters."})
		}

    });

    socket.on('disconnect', function(){
    	if(addedUser){
			delete usernames[socket.username];
			updateUserList();
			io.sockets.in(room).emit('namelist', roomusers, roompops(usernames));
		}
	});
});


server.listen(80);
console.log("running on localhost:80...");
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function roompops(list){
	poplist={};
	for(var item in list){
		if(poplist[list[item]]){
			poplist[list[item]]+=1;
		}else{
			poplist[list[item]]=1;
		}
	}
	return poplist;
}
