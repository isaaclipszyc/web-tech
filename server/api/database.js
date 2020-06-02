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
      email text UNIQUE)`);
  // var insert = 'INSERT INTO user (username, email) VALUES (?)';
  // db.run(insert, ['isaac', 'il17557@bristol.ac.uk']);
  db.run("INSERT INTO user (username, email) VALUES ('isaac', 'il17557@bristol.ac.uk')");
}


db.serialize(addUser('Ben', 'bf17813@bristol.ac.uk'));

function addUser(username, email) {
  var insert = 'INSERT INTO user (username, email) VALUES (?, ?)';
  db.run(insert, [username, email]);
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
