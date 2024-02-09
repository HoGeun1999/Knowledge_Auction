const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');
const userID = 1
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'knowledgeAuction',
});

connection.connect();

// connection.end();

const app = express();

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


app.get('/item/:inventoryID', function (req, res) {
  let { inventoryID } = req.params;
  connection.query(`SELECT * FROM knowledge WHERE id = (SELECT itemId FROM inventory WHERE id = '${inventoryID}')`, (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
});

app.get('/inventories/:inventoryID', function (req, res) {
  let { inventoryID } = req.params;
  connection.query(`SELECT * FROM knowledge WHERE id = (SELECT itemId FROM inventory WHERE id = '${inventoryID}')`, (error, rows, fields) => {
    if (error) throw error;
    res.send([rows, inventoryID])
  });
});

app.post("/items/random", function (req, res) {
  const item = req.body;
  const uuid = uuidv4();

  connection.query(`INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${item.id}')`, (err, rows) => {
    if (err) throw err;
    res.send(uuid)
  })

  // const selectQuery = `SELECT * FROM knowledge WHERE name = '${item.name}' AND level = ` + item.level   
  // connection.query(selectQuery, (err, rows, fields) => {
  //   if (err) throw err; 
  //   const getItem = rows[0]
  //   console.log('getdata:'+ rows[0],rows)
  //   const insertQuery = `INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${rows[0].id}')`
  //   console.log(' insertQuery :' + insertQuery)
  //   connection.query(insertQuery,(err, result, fields) => {
  //     if (err) throw err; 
  //     const sendData = [rows[0],uuid]
  //     res.send(sendData)
  //   })
  // }); 
});

app.post("/collection", function (req, res) {
  const item = req.body;
  const selectQuery = `SELECT * FROM knowledge WHERE name = '${item.name}' AND level = ` + item.level
  console.log('selectQuery:' + selectQuery)
  connection.query(selectQuery, (err, rows, fields) => {
    if (err) throw err;
    res.send(rows)
  })
});

app.get('/sellItem/:inventoryID', function (req, res) {
  let { inventoryID } = req.params;
  connection.query(`SELECT * FROM knowledge WHERE id = (SELECT itemId FROM inventory WHERE id = '${inventoryID}')`, (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
  connection.query(`DELETE FROM inventory WHERE id = '${inventoryID}'`, (error, rows, fields) => {
    if (error) throw error;
  });
});

app.get('/delItem/:inventoryID', function (req, res) {
  let { inventoryID } = req.params;
  connection.query(`DELETE FROM inventory WHERE id = '${inventoryID}'`, (error, rows, fields) => {
    if (error) throw error;
  });
});

app.get('/getInventory/', function (req, res) {
  connection.query('SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id', (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
});

app.get('/getUserData/', function (req, res) {
  connection.query('SELECT * FROM userData', (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
});

app.get('/user/normalTicketCheck', function (req, res) {
  const uuid = uuidv4();
  connection.beginTransaction(function (err) {
    if (err) { throw err }
    connection.query('SELECT normalTicket FROM userData', (err, rows) => {
      if (err) { throw err }
      if (rows[0].normalTicket > 0) {
        connection.query(`UPDATE userData SET normalTicket = ${rows[0].normalTicket - 1} where id = ${userID}`, (err, up) => {
          if (err) { throw err }
          connection.query(`SELECT * FROM knowledge k WHERE rarity = 'Normal' && level = 1 ORDER BY RAND() LIMIT 1`, (err, randomItem) => {
            if (err) { throw err }
            connection.query(`INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${randomItem[0].id}')`, (err, _) => {
              if (err) { throw err }
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => { throw err; })
                }
                else {
                  res.send([randomItem,uuid])
                }
              })
            })
          })
        })
      }
      else {
        console.log(1000)
        return connection.rollback(() => {
          res.status(403);
          res.send('no money')
        })
      }
    })
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
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

const server = app.listen(app.get('port'), function () {

  console.log('Express server listening on port ' + server.address().port);

});

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// })
