
var audio = new Audio('ploop.wav');
var socket = io.connect('speeks.us');
var currentname = ""


$("#name").focus();

socket.on('namelist', function (data, pops) {
  var list = "";
  var poplist = "";
  var arr = [];

  for(var e in pops){
    arr.push([e, pops[e]]);
  }
  arr.sort(function(a, b) {return a[1] - b[1]});
  arr.reverse();

  for(var i=0; i<arr.length; i++){
    poplist += "<div class=\'nameitem\'>" + arr[i][0] + ": " + arr[i][1] + "</div>";
  }
  $(".poplist").html(poplist);

	for(var item in data){
		list += "<div class=\'nameitem\'>" + data[item] + "</div>";
	}
	$(".namelist").html(list);

});

socket.on('incoming', function (data) {
  if(data.name===currentname){
    $(".listbox").append("<div class=\'msgbody\'><div class=\'truemsg\'>"+data.message+"</div><div class=\'time\'>"+timec(data.time)+"</div></div>");
  }else{
     $(".listbox").append("<div class=\'msgbody\'><div class=\'msgname\'>"+data.name +"</div><div class=\'truemsg\'>"+data.message+"</div><div class=\'time\'>"+timec(data.time)+"</div></div>");
     currentname=data.name;
  }
  if(($(".listbox")[0].scrollHeight-$(".listbox")[0].scrollTop)<$(".listbox").height()+150){
    $(".listbox")[0].scrollTop = $(".listbox")[0].scrollHeight;
  }
  $(".truemsg").greenify();
  if($("#audiobox").prop('checked')){
      audio.play();
  }
});

socket.on('enterchat', function(data){
	$("#nameinput").addClass("hide");
	$(".chatbox").removeClass("hidden");
  $("#roomselect").removeClass("hidden");
	toast("sucess", "you've joined the room \""+data+"\".");
  $(".listbox").html("<i>now in room: "+data+"</i><br>");
  $("#msg").focus();
});

$("#submitname").click(function(event){
	event.preventDefault();
	socket.emit('name', $("#name").val());
});

$("#abe").click(function(event){
  $("#nameinput").removeClass("hide");
  $("#nameinput").addClass("special");
  $(".aboutbox").removeClass("hidden");
  $(".modalbox").addClass("hidden");
});
$("#oya").click(function(event){
  $("#nameinput").addClass("hide");
});

$("#chatinput").submit(function(event){
	event.preventDefault();
	socket.emit('message', $("#msg").val());
	$("#msg").val("");
  return false;
});



$("#roomselect").submit(function(event){
  event.preventDefault();
  socket.emit('roomchange', $("#rmnm").val());
  $("#rmnm").val("");
  $("#msg").focus();

});

socket.on('roomname', function(data){
  $('#room').html("["+data+"]");
  $(".listbox").html("<i>now in room: "+data+"</i><br>");
});


socket.on('toast', function(data){
	toast(data.style, data.msg);
  audio.play();
});



function timec(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var hour = a.getHours();
  if(hour<10){
    hour='0'+hour;
  }
  var min = a.getMinutes();
  if(min<10){
    min='0'+min;
  }
  var sec = a.getSeconds();
  if(sec<10){
    sec='0'+sec;
  }
  var time =hour + ':' + min + ':' + sec ;
  return time;
}
