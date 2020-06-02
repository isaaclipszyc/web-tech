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
  // db.run("DROP TABLE IF EXISTS user");
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  db.run(`CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username text UNIQUE,
      email text UNIQUE,
      highscore INTEGER(8))`,
      (err) => {
        if (err) {
        //Table already created
      } else {
        //Table just created, populate
        db.serialize(addUser('Isaac', 'il17557@bristol.ac.uk'));
        db.serialize(addUser('Ben', 'bf17813@bristol.ac.uk'));
      }
    });
}

// db.serialize(removeUser('Ben'));
// db.serialize(updateHighscore('Ben', 100));

// db.serialize(addUser('Isaac', 'il17557@bristol.ac.uk'));
// db.serialize(addUser('Ben', 'bf17813@bristol.ac.uk'));

function addUser(username, email) {
  //New user has highscore of 0
  var insert = 'INSERT INTO user (username, email, highscore) VALUES (?, ?, ?)';
  db.run(insert, [username, email, 0]);
}

function removeUser(username) {
  var remove = 'DELETE FROM user WHERE username = (?)';
  db.run(remove, [username]);
}

function updateHighscore(username, highscore) {
  var update = 'UPDATE user SET highscore = (?) WHERE username = (?)';
  db.run(update, [highscore, username]);
}


const getUsers = (request, response) => {
    var sql = "select * from user"
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
