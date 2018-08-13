
var socket = io();
  socket.on('connect', function() {
     console.log('connected to server');
 });

socket.emit('newCode' , {
  code : 670,
  event_id : 45
} , function(data) {
  console.log(data);
});


socket.on('checkCode', function(code) {
  console.log(code);
   // if(code){
   //   console.log('You won!');
   // }
   // else{
   //   console.log('Try again');
   // }
});


socket.on('disconnect', function() {
    console.log('Disconnected from server');
});
