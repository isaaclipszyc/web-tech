// var sqlite3 = require('sqlite3').verbose();
// const DBSOURCE = "db.sqlite";
//
// //initialises database
// let db = new sqlite3.Database(DBSOURCE, (err) => {
//     if (err) {
//       // Cannot open database
//       console.error(err.message);
//       throw err
//     }else{
//         console.log('Connected to the SQLite database.');
//         db.run(`CREATE TABLE user (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             username text UNIQUE,
//             CONSTRAINT username_unique UNIQUE (username),
//             )`,
//         (err) => {
//             if (err) {
//                 // Table already created
//             }else{
//                 // Table just created, creating some rows
//                 var insert = 'INSERT INTO user (username) VALUES (?)';
//                 db.run(insert, ["isaac"]);
//                 db.run(insert, ["ben"]);
//             }
//         });
//     }
// });

"use strict";
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("data.db");

db.serialize(create);

function create() {
  /////////////////////////////////////////////////////////////////////////////////////////////// FOR DEVELOPMENT ONLY /////////////////////////////////////////////////////////////////////////////////////
  db.run("DROP TABLE IF EXISTS user");
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  db.run(`CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username text UNIQUE,
      email text UNIQUE,
      password text,
      highscore INTEGER(8))`,
      (err) => {
        if (err) {
        //Table already created
      } else {
        //Table just created, populate
        addUser('Isaac', 'il17557@bristol.ac.uk', 'abc');
        addUser('Ben', 'bf17813@bristol.ac.uk', 'def');
        // removeUser('Ben');
        // updateHighscore('Isaac', 100);
      }
    });
}

// addUser('Ben', 'bf17813@bristol.ac.uk', 'def');

//Password should be hashed client-side before being sent to this function for storage
async function addUser(username, email, hashedPsword) {
  //New user has highscore of 0
  var ps = db.prepare('INSERT INTO user (username, email, password, highscore) VALUES (?, ?, ?, ?)');
  await ps.run(username, email, hashedPsword, 0, (err) => {
    if (err) {
      //Fields don't match
    } else {
      //Insertion completed
    }
  });
  await ps.finalize();
}

async function removeUser(username) {
  var ps = db.prepare('DELETE FROM user WHERE username = (?)');
  await ps.run(username, (err) => {
    if (err) {
      //Fields don't match
    } else {
      //Insertion completed
    }
  });
  await ps.finalize();
}

function checkLogin(username, hashedPsword) {
  // var find = 'SELECT EXISTS(SELECT 1 FROM user WHERE username = (?) AND password = (?))';
  // db.run(find, [username, hashedPsword]);
}

async function updateHighscore(username, highscore) {
  var ps = db.prepare('UPDATE user SET highscore = (?) WHERE username = (?)');
  await ps.run(highscore, username, (err) => {
    if (err) {
      //Fields don't match
    } else {
      //Insertion completed
    }
  });
  await ps.finalize();
}


const getUsers = (request, response) => {
    var sql = "SELECT * FROM user"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            response.status(400).json({"error":err.message});
          return;
        }
        response.json({
            "message":"success",
            "data":rows
        })
      });
}

const getLeaderboard = (request, response) => {
    var sql = "SELECT username, highscore FROM user ORDER BY highscore DESC"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            response.status(400).json({"error":err.message});
          return;
        }
        response.json({
            "message":"success",
            "data":rows
        })
      });
}

module.exports = {
    db,
    getUsers
}
