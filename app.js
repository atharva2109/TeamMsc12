var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http');  // Move this line up here
var socketIo = require('socket.io');

var app = express();
var server = require('http').createServer(app);
var io = socketIo(server);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatRouter = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public/images/uploads', express.static(path.join(__dirname, '/public/images/uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chatMessage', (data) => {
    console.log('Message received: ', data);
    io.emit('message', data);  // Emitting to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Use server.listen NOT app.listen
// server.listen(3000, () => {
//   console.log('Listening on port 3000');
// });

module.exports = app;
