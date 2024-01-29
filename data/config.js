const mysql = require('mysql');

const pool = mysql.createPool({
    port: 3306,
    host: 'localhost',
    user: 'recipes',
    password: 'recipesPass32',
    database: 'recipes',
});

pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    connection.release();
});

module.exports = pool;