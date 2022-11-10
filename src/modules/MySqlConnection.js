const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_midtest",
});

db.getConnection(function(err, connection) {
    if (err) throw err;
    console.log('mysql Connected');
});

exports.db = db;
