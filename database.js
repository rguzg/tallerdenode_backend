const mysql = require("mysql");
const util = require("util");
const dotenv = require("dotenv");

dotenv.config();

// The default database name is node. To change it add a DATABASE environment variable
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE || "node"
});

pool.query = util.promisify(pool.query);

module.exports = pool;