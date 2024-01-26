var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'knowledgeAuction',
});

connection.connect(); 

// connection.end();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// port setup

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: "http://localhost:8000",
  credentials: true,
})); 

 


//app.use('/items', usersRouter);
  
app.get('/item/:itemId', function(req, res) {
  let { itemId } = req.params;
  connection.query('SELECT * FROM knowledge WHERE id =' + itemId, (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
});


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

module.exports = app;
//////////////////////////////////////////////////////

// ------- creates Server -------

module.exports = app;

var server = app.listen(app.get('port'), function() {

console.log('Express server listening on port ' + server.address().port);

});

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// })
