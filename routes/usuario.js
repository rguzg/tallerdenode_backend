const express = require("express");
const db = require("../database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const usuario = express.Router();
dotenv.config();

// Returns a list of the available endpoints on /usuario
usuario.get("/", (req, res, next) => {
    return res.status(200).json({
        code: 200,
        message: {
            login: "/login",
        },
    });
});

/*  
    This endpoint returns a JSON Web Token if the request contains a valid username and password

    The request uses the MIME type application/x-www-form-urlencoded and has the following format:
    - username: Requesting user's username
    - password: Requesting user's password
*/
usuario.post("/login", async (req, res, next) => {
    let { username, password } = req.body;

    const query = `SELECT * FROM usuarios WHERE username = '${username}'`;
    const queryResult = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "A server error ocurred, please try again later",
        });
    });

    if (username && password) {
        if (queryResult.length == 1) {
            let passwordHash = queryResult[0].password;
            let isPasswordCorrect = await bcrypt.compare(password, passwordHash);

            if (isPasswordCorrect) {
                let token = jwt.sign(
                    {
                        username: queryResult[0].username,
                        nombre: queryResult[0].nombre,
                        apellidos: queryResult[0].apellidos,
                    },
                    process.env.SIGN_KEY
                );

                return res.status(200).json({ status: 200, message: { token: token } });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid username or password",
                });
            }
        } else {
            return res.status(400).json({ status: 400, message: "Invalid username or password" });
        }
    } else {
        return res.status(400).json({
            status: 400,
            message: "Invalid request body. The request has the following parameters: username, password"
        });
    }
});

module.exports = usuario;
