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
  try {
    connection.beginTransaction(async function (err) {
      if (err) { throw err }
      const rows = await executeQuery(`SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id where i.id = '${inventoryID}'`)
      const enforceData = await executeQuery(`SELECT probability, price FROM enforce where rarity = '${rows[0].rarity}' && level = '${rows[0].level}'`)
      const userMoney = await executeQuery(`SELECT holdings FROM userData where id = ${userID}`)

      if (userMoney[0].holdings > 0) {
        await executeQuery(`UPDATE userData SET holdings = ${userMoney[0].holdings - enforceData[0].price} where id = ${userID}`)
        const randomNum = Math.floor(Math.random() * 10 + 1);

        if (randomNum === 10) {
          await executeQuery(`DELETE FROM inventory where id = '${inventoryID}'`)
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => { throw err; })
            }
            else {
              res.send({ result: '파괴' })
            }
          })
        }

        else if (randomNum <= enforceData[0].probability) {
          const enforceItemId = await executeQuery(`SELECT * FROM knowledge where name = '${rows[0].name}' && level = ${rows[0].level + 1}`)
          await executeQuery(`UPDATE inventory SET itemId = '${enforceItemId[0].id}' where id = '${inventoryID}'`)
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => { throw err; })
            }
            else {
              res.send({ result: [enforceItemId, rows[0].inventory_id] })
            }
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
      }

      else {
        console.log(1000)
        return connection.rollback(() => {
          res.status(403);
          res.send('no money')
        })

      }
    })

  }
  catch (e) {
    console.log("err:", e);
  }

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
        else {
          res.send({ result: sellMoney })
        }
      })
    }
    catch (e) {
      console.log("err:", e);
    }
  })
});

app.post('/edit', function (req, res) {
  const uuid = uuidv4();
  const leftItemId = req.body.leftItemId
  const rightItemId = req.body.rightItemId
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const leftItemName = await executeQuery(`SELECT name FROM knowledge WHERE id = (SELECT itemId FROM inventory WHERE id = '${leftItemId}')`)
      const rightItemName = await executeQuery(`SELECT name FROM knowledge WHERE id = (SELECT itemId FROM inventory WHERE id = '${rightItemId}')`)
      const editItem = await executeQuery(`SELECT * FROM editRecipe WHERE (item1 = '${leftItemName[0].name}' AND item2 = '${rightItemName[0].name}') OR (item1 = '${rightItemName[0].name}' AND item2 = '${leftItemName[0].name}')`)
      if (editItem.length == 0) {
        return connection.rollback(() => {
          res.status(403);
          res.send('합성 실패')
        })
      }
      else {
        const KnowledgeItemId = await executeQuery(`SELECT id FROM knowledge WHERE level = 1 AND name = '${editItem[0].result}'`)
        await executeQuery(`INSERT INTO inventory VALUES ('${uuid}','${KnowledgeItemId[0].id}')`)
        const result = await executeQuery(`SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id WHERE i.id = '${uuid}'`)
        await executeQuery(`DELETE FROM inventory WHERE id = '${leftItemId}'`)
        await executeQuery(`DELETE FROM inventory WHERE id = '${rightItemId}'`)
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(403);
              res.send('에러')
            })
          }
          else {
            res.send(result)
          }
        })
      }
    }
    catch (e) {
      console.log("err:", e)
    }
  })


})


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
          else {
            res.send({ result: '도감 보상 : 5원' })
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

app.get('/collectionReward/2', function (req, res) {
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const getHistoryCount = await executeQuery('SELECT count(getHistory) as count FROM collection where getHistory = 0 AND collectionId = 1')

      if (getHistoryCount[0].count === 0) {
        const enfroceData = await executeQuery(`SELECT * FROM enforce WHERE rarity = 'normal'`)
        for (let i = 0; i < enfroceData.length; i++) {
          await executeQuery(`UPDATE enforce SET probability = probability + 1 WHERE rarity = 'normal' AND level = ${i + 1}`)
        }

        await executeQuery('UPDATE collection SET rewardClear = 1 WHERE collectionId = 2')
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => { throw err; })
          }
          else {
            res.send({ result: '도감 보상 : 노말아이템 강화확률 10퍼 증가' })
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


app.get('/collectionReward/3', function (req, res) {
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const getHistoryCount = await executeQuery('SELECT count(getHistory) as count FROM collection where getHistory = 0 AND collectionId = 1')

      if (getHistoryCount[0].count === 0) {
        await executeQuery('UPDATE userData SET normalTicket = normalTicket + 3')
        await executeQuery('UPDATE collection SET rewardClear = 1 WHERE collectionId = 3')
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => { throw err; })
          }
          else {
            res.send({ result: '도감 보상 : 일반티켓 3개' })
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

app.get('/quiz/math', function (req, res) {
  const uuid = uuidv4()
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const mathId = await executeQuery(`SELECT id FROM knowledge WHERE name = '수학' AND level = 1 `)
      await executeQuery(`INSERT INTO inventory (id,itemId) VALUES ('${uuid}','${mathId[0].id}')`)
      const data = await executeQuery(`SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id WHERE i.id = '${uuid}';`)
      connection.commit((err) => {
        if (err) {
          return connection.rollback(() => { throw err; })
        }
        else {
          res.send(data)
        }
      })
    }

    catch (e) {
      console.log("err:", e);
    }
  })
})

app.get('/quiz/english', function (req, res) {
  const uuid = uuidv4()
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const mathId = await executeQuery(`SELECT id FROM knowledge WHERE name = '영어' AND level = 1 `)
      await executeQuery(`INSERT INTO inventory (id,itemId) VALUES ('${uuid}','${mathId[0].id}')`)
      const data = await executeQuery(`SELECT i.id as inventory_id, k.* FROM inventory i INNER JOIN knowledge k ON i.itemId = k.id WHERE i.id = '${uuid}';`)
      connection.commit((err) => {
        if (err) {
          return connection.rollback(() => { throw err; })
        }
        else {
          res.send(data)
        }
      })
    }

    catch (e) {
      console.log("err:", e);
    }
  })
})

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
    res.send('ok')
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

app.get('/user/randomDraw/:ticketType', function (req, res) {
  console.log('server check')
  const uuid = uuidv4();
  let { ticketType } = req.params;
  let ticket = ticketType + 'Ticket'
  let rarity = ''
  if (ticketType == 'normal') {
    rarity = ticketType
  }
  else {
    // const arr = ['Rare','Epic']
    const arr = ['Rare', 'Epic']
    rarity = arr[Math.floor(Math.random() * arr.length)]
  }
  console.log(rarity)
  connection.beginTransaction(async function (err) {
    if (err) { throw err }
    try {
      const userMoney = await executeQuery('SELECT holdings FROM userData WHERE id = 1')
      const rows = await executeQuery(`SELECT ${ticket} FROM userData`);
      console.log(rows)
      if (rows[0][ticket] > 0) {
        await executeQuery(`UPDATE userData SET ${ticket} = ${rows[0][ticket] - 1} where id = ${userID}`);
        const randomItem = await executeQuery(`SELECT * FROM knowledge k WHERE rarity = '${rarity}' && level = 1 ORDER BY RAND() LIMIT 1`)
        await executeQuery(`INSERT INTO inventory (id, itemId) VALUES ('${uuid}', '${randomItem[0].id}')`)
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => { throw err; })
          }
          else {
            res.send([randomItem, uuid])
          }
        })
      }
      else if (userMoney[0].holdings >= 3 && ticketType == 'normal') {
        await executeQuery(`UPDATE userData SET holdings = holdings -3 WHERE id = ${userID}`)
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
      }
      else if (userMoney[0].holdings >= 15 && ticketType != 'normal') {
        await executeQuery(`UPDATE userData SET holdings = holdings -15 WHERE id = ${userID}`)
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
      }
      else {
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
