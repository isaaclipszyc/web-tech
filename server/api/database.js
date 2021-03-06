"use strict";
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("data.db");

const bcrypt = require('bcrypt');

db.serialize(create);

function create() {
  /////////////////////////////////////////////////////////////////////////////////////////////// FOR DEVELOPMENT ONLY /////////////////////////////////////////////////////////////////////////////////////
  // db.run("DROP TABLE IF EXISTS user");
  // db.run("DROP TABLE IF EXISTS images");
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  db.run(`CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username text UNIQUE,
      email text UNIQUE,
      password text,
      highscore INTEGER(8),
      imagePath text)`,
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


async function addUser(username, email, password) {
  const hashedPsword = bcrypt.hashSync(password, 10);
  //New user has highscore of 0
  var ps = db.prepare('INSERT INTO user (username, email, password, highscore, imagePath) VALUES (?, ?, ?, ?, ?)');
  await ps.run(username, email, hashedPsword, 0, 'uploads\\default.png' , (err) => {
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


const updateHighscore = (request, response) => {
  var sql = "UPDATE user SET highscore = (?) WHERE username = (?)";
  const body = request.body;
  const username = body.username;
  const highscore = body.highscore;
  var params = [highscore, username]
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

const getHighscore = (request, response) => {
  var sql = "SELECT * FROM user WHERE username = (?)";
  const body = request.body;
  const username = body.username;
  var params = [username]
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

async function storeFilePath(username, path) {
  var ps = db.prepare('UPDATE user SET imagePath = (?) WHERE username = (?)');
  await ps.run(path, username, (err) => {
    if (err) {
      //Fields don't match
      console.log("Error storing path");
    } else {
      //Insertion completed
    }
  });
  await ps.finalize();
  console.log("Finished storing path");
}

const getProfilePicture = (request, response) => {
  var sql = 'SELECT imagePath FROM user WHERE username = (?)';
  var uname = request.query.uname;
  // console.log(uname);
  var params = [uname];
  db.all(sql, params, (err, rows) => {
        if (err) {
          response.status(400).json({"error":err.message});
        return;
        }
        else {
          if(rows.length != 0){
            const filepath = `${rows[0].imagePath}`;
            response.json({
                "message":"success",
                "data":filepath
            })
          }
          else {
            response.json({
                "message":"success",
                "data":"uploads\\default.png"
            })
          }


        }
  });
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
    var sql = "SELECT imagePath, username, highscore FROM user ORDER BY highscore DESC"
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

const checkLogin = (request, response) => {
  const body = request.body;
  const username = body.username;
  const password = body.password;
  var params = [username];
  var sql = 'SELECT password FROM user WHERE username = (?)';
  db.all(sql, params, (err, rows) => {
        if (err) {
            response.status(400).json({"error":err.message});
          return;
        }
        if(rows.length == 0){
          response.status(401).json("incorrect login");
        } else {
          const hash = `${rows[0].password}`;
          if(bcrypt.compareSync(password, hash)) {
             // Passwords match
             response.json({
               "message":"success",
               "data":rows
             })
          } else {
             // Passwords don't match
             response.status(401).json("incorrect login");
          }


        }
  });
}

const registerAccount = (request, response) => {
  const body = request.body;
  const username = body.username;
  const email = body.email;
  const hashedPassword = bcrypt.hashSync(body.password, 10);
  var params = [username, email, hashedPassword, 0];
  var sql = 'INSERT INTO user (username, email, password, highscore) VALUES (?, ?, ?, ?)';
  db.all(sql, params, (err, rows) => {
        if (err) {
            response.status(400).json({"error":err.message});
          return;
        }
        response.json({
            "message":"success"
        })
  });
}

const resetPassword = (request, response) => {
  console.log("Here2");
  const body = request.body;
  const username = body.username;
  const hashedPassword = body.password;
  var params = [username, hashedPassword];
  var sql = 'SELECT EXISTS(SELECT 1 FROM user WHERE username = (?) AND password = (?))';
  // db.run(find, [username, hashedPassword]);
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

const upload = (request, response) => {
  const body = request.body;
  console.log("InUpload");
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
}



module.exports = {
    db,
    getUsers,
    getLeaderboard,
    checkLogin,
    registerAccount,
    resetPassword,
    updateHighscore,
    getHighscore,
    upload,
    storeFilePath,
    getProfilePicture
}
