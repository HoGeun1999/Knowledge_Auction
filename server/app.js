var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

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

 
// app.get('/item/', function(req, res) {
//   let { itemName } = req.params;
//   console.log(itemName)
//   connection.query(`SELECT * FROM test WHERE name = '${itemName}'` , (error, rows, fields) => {
//     if (error) throw error;
//     res.send(rows)
//   });
// });

app.post("/item", function(req, res){
  const item = req.body;
  const uuid = uuidv4();
  const selectQuery = `SELECT * FROM knowledge WHERE name = '${item.name}' AND level = ` + item.level   
  connection.query(selectQuery, (err, rows, fields) => {
    if (err) throw err; 
    const getItem = rows[0]
    console.log(rows[0],rows)
    const insertQuery = `INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${rows[0].id}')`
    connection.query(insertQuery,(err, result, fields) => {
      if (err) throw err; 
      const sendData = [rows[0],uuid]
      res.send(sendData)
    })
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
