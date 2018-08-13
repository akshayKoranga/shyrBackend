var http = require('http');
var express = require('express');
var engine = require('ejs-locals'); // to provide layout functionality
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var randomString = require('randomstring');
var fileUpload = require('express-fileupload');
var moment = require('moment');
var socketIO = require('socket.io');
var processImage = require('express-processimage');
// var cookieSession = require('cookie-session')

var codes = require('./utils/codes');
var routes = require('./routes/web'); //including web routes
var apiRoutes = require('./routes/api');
var socketRoutes = require('./routes/socket');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
//var io = require('socket.io')(server, { wsEngine: 'ws' });

app.engine('ejs',engine);
app.set('view engine','ejs');
// app.set('trust proxy', 1)

var middleware = [
  express.static('public'),
  bodyParser.urlencoded({
    extended : false
  }),
  validator(),
  session({
    secret : randomString.generate(10),
    resave : false,
    saveUninitialized: false
  }),
  // fileUpload(),
  processImage({root: 'public'})
];

app.use(middleware);

app.use('/admin',routes); //adding a prefix 'admin' to all web routes. Any route beginning with 'admin' will be handled by the specified module
app.use('/api',apiRoutes);

app.locals.moment = moment;

// app.get('/',(req, res) => {
  io.on('connection' , (socket) => {
    console.log('New user connected');

    socket.on('eventGamePlay',(data) => {

       var room = data.event_id + '' + data.position;
       socket.join(room);

       codes.eventConnect(data, socket.id , (response ,sockets) => {
            if(response){
              socket.emit('eventGameLost', response);
          }
       });
    });

    socket.on('eventGameWon', (data) => {
       codes.winnerCode(data , (response ,sockets) => {
        var room = data.event_id + '' + data.position;
        io.sockets.in(room).emit('eventGameLost', response);
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    })
  });
// });


server.listen(3000,() => {
  console.log('listening to port 3000');
});
