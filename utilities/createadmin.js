/*  Use the npm run createadmin command to create an administrator user from the console */

const db = require("../database");
const bcrypt = require("bcrypt");
const readline = require("readline-sync");

/*  This function creates an administrator user.  
    
    This function has the following arguments:
    - username: the username for the new user
    - password: the password for the new user
    - nombre (optional): the name for the new user
    - apellidos (optional): the last name for the new user

    This function doesn't return anything
*/

async function createadmin(username, password, nombre, apellidos) {
    let saltrounds = 10;
    let passwordhash = await bcrypt.hash(password, saltrounds);

    let query = `INSERT INTO usuarios VALUES ('${username}', '${passwordhash}', '${nombre}', '${apellidos}');`;

    await db
        .query(query)
        .catch((error) => {
            if (error.code == "ER_DUP_ENTRY") {
                throw "Duplicate user";
            } else {
                throw Error;
            }
        })
        .finally(() => {
            db.end();
        });
}

let username;
let password;
let nombre = null;
let apellidos = null;

let usernameEmpty = true;
let passwordEmpty = true;

console.log("Creating an administrator user");

while (usernameEmpty) {
    username = readline.question("Username: ");
    if (username == "") {
        console.log("Please provide a valid username");
    } else {
        usernameEmpty = false;
    }
}

while (passwordEmpty) {
    password = readline.questionNewPassword("Password: ", { min: 1 });
    if (password == "") {
        console.log("Please provide a valid password");
    } else {
        passwordEmpty = false;
    }
}

nombre = readline.question("Enter your name: ");
apellidos = readline.question("Enter your last name: ");

createadmin(username, password, nombre, apellidos)
    .then((result) => {
        console.log("User created successfully!");
    })
    .catch((error) => {
        if (error == "Duplicate user") {
            console.log("There's already an user with this username. Please try again");
        } else {
            console.error("User couldn't be created. Are you sure the SQL server is running?");
        }
    });
