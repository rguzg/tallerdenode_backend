import mysql from "mysql";
import pool from "util";

// The default database name is node. To change it add an environment variable with the name database

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE || "node"
});

pool.query = util.promisify(pool.query);

export default pool;