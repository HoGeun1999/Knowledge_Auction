const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');
const { error } = require('console');

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

app.get('/items/enforce/:inventoryID', function (req, res) {
  let { inventoryID } = req.params;
  // connection.beginTransaction(function (err) {
  //   if(err) {throw err}
  connection.query(`SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id where i.id = '${inventoryID}'`, (err, rows) => {
    if (err) { throw err }
    connection.query(`SELECT probability, price FROM enforce where rarity = '${rows[0].rarity}' && level = '${rows[0].level}'`, (err, enforceData) => {
      if (err) { throw err }
      connection.query(`SELECT holdings FROM userData where id = ${userID}`, (err, userMoney) => {
        if (err) { throw err }
        if (userMoney[0].holdings > 0) {
          connection.query(`UPDATE userData SET holdings = ${userMoney[0].holdings - enforceData[0].price} where id = ${userID}`, (err, updataUserMoney) => {
            if (err) { throw err }
            console.log(userMoney[0].holdings)
            console.log(enforceData)
            const randomNum = Math.floor(Math.random() * 10 + 1);
            if (randomNum === 10) {
              connection.query(`DELETE FROM inventory where id = '${inventoryID}'`, (err, result1) => {
                if (err) { throw err }
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => { throw err; })
                  }
                  else {
                    res.send({ result: '파괴' })
                  }
                })
              })
            }
            else if (randomNum <= enforceData[0].probability) {
              connection.query(`SELECT * FROM knowledge where name = '${rows[0].name}' && level = ${rows[0].level + 1}`, (err, enforceItemId) => {
                console.log(enforceItemId)
                if (err) { throw err }
                connection.query(`UPDATE inventory SET itemId = '${enforceItemId[0].id}' where id = '${inventoryID}'`, (err, result2) => {
                  if (err) { throw err }
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => { throw err; })
                    }
                    else {
                      console.log(enforceItemId)
                      res.send({ result: [enforceItemId, rows[0].inventory_id] })
                    }
                  })
                })
              })
            }
            else {
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => { throw err; })
                }
                else {
                  res.send({ result: '강화 실패' })
                }
              })
            }
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
  })
})
// });

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

app.post('/sellItem/', function (req, res) {
  const sellItemList = req.body;
  let sellMoney = 0

  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      for (let i = 0; i < sellItemList.length; i++) {
        const ids = await executeQuery(`SELECT itemId FROM inventory where id = '${sellItemList[i]}'`);
        const price = await executeQuery(`SELECT price FROM knowledge where id = '${ids[0].itemId}'`)
        await executeQuery(`DELETE FROM inventory WHERE id = '${sellItemList[i]}'`);
        await executeQuery(`UPDATE userData SET holdings = holdings + ${price[0].price}`);
        sellMoney = sellMoney + price[0].price
      }
      connection.commit((err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(403);
            res.send('에러')
          })
        }
        else{
          res.send({result : sellMoney})
        }
      })
    }
    catch (e) {
      console.log("err:", e);
    }
  })
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


app.get('/collectionReward/1', function (req, res) {
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const getHistoryCount = await executeQuery('SELECT count(getHistory) as count FROM collection where getHistory = 0 AND collectionId = 1')
      
      if (getHistoryCount[0].count === 0) {
        await executeQuery('UPDATE userData SET holdings = holdings + 5')
        await executeQuery('UPDATE collection SET rewardClear = 1 WHERE collectionId = 1')
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => { throw err; })
          }
          else{
            res.send({result : '도감 보상 : 5원'})
          }
        })
      }
      else {
        return connection.rollback(() => {
          res.status(403);
          res.send('도감 부족')
        })
      }
    }
    catch (e) {
      console.log("err:", e);
    }
  })
});

// app.get('/collectionReward/1', function (req, res) {
//   connection.query('UPDATE userData SET holdings = holdings + 5', (error, rows, fields) => {
//     if (error) throw error;
//   });
// });



app.get('/collectionList/', function (req, res) {
  connection.query('SELECT * FROM collection order by collectionName;', (error, rows, fields) => {
    if (error) throw error;
    res.send(rows)
  });
});

app.post('/collectionCheck/', function (req, res) {
  const itemData = req.body;
  connection.query(`UPDATE collection SET getHistory = 1 WHERE name = '${itemData.name}' AND level = ${itemData.level}`, (error, rows, fields) => {
    if (error) throw error;
  });
});



function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

app.get('/user/normalTicketCheck/:ticketType', function (req, res) {
  const uuid = uuidv4();
  let { ticketType } = req.params;
  let ticket = ticketType + 'Ticket'
  let rarity = ''
  if (ticketType == 'normal') {
    rarity = ticketType
  }
  else {
    // const arr = ['Rare','Epic']
    const arr = ['Rare']
    rarity = arr[Math.floor(Math.random() * arr.length)]
  }
  console.log(rarity)
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const rows = await executeQuery(`SELECT ${ticket} FROM userData`);
      console.log(rows)
      if (rows[0][ticket] > 0) {
        await executeQuery(`UPDATE userData SET ${ticket} = ${rows[0][ticket] - 1} where id = ${userID}`);
        const randomItem = await executeQuery(`SELECT * FROM knowledge k WHERE rarity = '${rarity}' && level = 1 ORDER BY RAND() LIMIT 1`)
        console.log(randomItem)
        await executeQuery(`INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${randomItem[0].id}')`)
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => { throw err; })
          }
          else {
            res.send([randomItem, uuid])
          }
        })
      } else {
        return connection.rollback(() => {
          res.status(403);
          res.send('no Ticket')
        })
      }
    }
    catch (e) {
      console.log("err:", e);
    }
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
