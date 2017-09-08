#!/usr/bin/env node
'use strict;'

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('lootbag.sqlite', (err) => console.log('Connecting to Lootbag data'));

const { gifts } = require('./initialGifts.json');

db.run('DROP TABLE IF EXISTS gifts');

const createGiftsTable = () => {
  db.run('CREATE TABLE IF NOT EXISTS gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, childName TEXT, item TEXT NOT NULL, delivered TEXT NOT NULL)');
};


const populateGiftsTable = () => {
  gifts.forEach((obj) => {
    db.run(`INSERT INTO gifts (childName, item, delivered) VALUES ('${obj.childName}', '${obj.item}', '${obj.delivered}')`,  function (err) {
      if (err) {console.log("Error inputting gifts", err)};
    });
  });
};

//ensure that the first FINISHES before starting the next, unlike the promise which just makes sure it has been run (but doesn't have anything returned)
db.serialize(function() {
  createGiftsTable();
  populateGiftsTable();
});



// Items can be added to bag.
//first can I get the items from the DB?
const getItems = (kid, toy) => {
   return new Promise ( (resolve, reject) => {
     if (toy) {
       db.all(`SELECT * FROM gifts WHERE childName='${kid}' AND item='${toy}'`, function (err, results) {
         if (err) {reject(err)} else {
           resolve(results);
         }
         });
     } else {
      db.all(`SELECT * FROM gifts WHERE childName='${kid}'`, function (err, results) {
        if (err) {reject(err)} else {
          resolve(results);
        }
        console.log("getting items!", results);
        });
     }
  });
};

const addItem = (toy, kid) => {
  return new Promise  ((resolve, reject) => {
    db.run(`INSERT INTO gifts (childName, item, delivered) VALUES ('${kid}', '${toy}', 'false')`, function(err, success) {
      resolve(success)
      reject(err);
    })
  });
};

// Items can be removed from bag, per child only. Removing ball from the bag should not be allowed. A child's name must be specified.
const removeItem = (kid, toy) => {
    if (kid && toy) {
      return new Promise ( (resolve, reject) => {
        resolve(db.run(`DELETE FROM gifts WHERE item="${toy}" AND childName="${kid}"`));
        reject(err);
      });
    };
};

// Must be able to list all children who are getting a toy.
const goodKidsList = () => {
  return new Promise ( (resolve, reject) => {
    db.all('SELECT childName FROM gifts', function (err, results) {
      reject(err);
      console.log("goodKids", results);
      resolve(results);
    }); 
  });
};

// Must be able to list all toys for a given child's name.
const getToysByChild = (kid) => {
  return new Promise ( (resolve, reject) => {
    db.all(`SELECT item FROM gifts WHERE childName="${kid}"`, function (err, results) {
      reject(err);
      console.log("items for this kid", results);
      resolve(results);
    }); 
  });
}

// Must be able to set the delivered property of a child, which defaults to false. Can be changed to true
const deliveredChange = (kid) => {
  return new Promise ( (resolve, reject) => {
  db.run(`UPDATE gifts SET delivered="true" WHERE childName="${kid}"`)
  })
}



module.exports = { deliveredChange, getToysByChild, goodKidsList, addItem, removeItem, getItems };