const express = require("express");
const db = require("../database.js");
const dotenv = require("dotenv");
const auth = require("../middleware/auth");
const queryBuilder = require("../utilities/querybuilder");

const empleados = express.Router();
dotenv.config();

empleados.use(auth);

/*  
    Este endpoint retorna una lista páginada de los empleados en la base de datos. Por defecto cada página
    contiene veinte recursos. La cantidad de recursos que se retornan se puede modificar utilizando el query
    parameter limit. A partir de cuál recurso se retorna se puede modificar utilizando el query parameter
    offset.

    Se puede filtrar por nombre si se incluye el query parameter nombre. El filtrado se realiza utilizando la
    función LIKE %nombre% de MySQL, así que si por ejemplo, el párametro nombre es igual a R, se retornarán
    todos los recursos que contengan una 'R' en su nombre

    Por ejemplo, si se quisiera el segundo grupo de 60 empleados con el nombre Pedro se enviarian 
    los siguientes párametros: /?limit=60&offset=60&nombre='Pedro'

    Además de la lista de empleados, el endpoint retorna el campo count que indica cuantos recursos existen
    en la base de datos
*/
empleados.get("/", async (req, res, next) => {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const nombre = req.query.nombre || '';

    let query = `SELECT * FROM empleados WHERE nombre LIKE '%${nombre}%' 
    LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;

    let queryResult = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    query = `SELECT COUNT(nombre) FROM empleados WHERE nombre LIKE '%${nombre}%'`;

    let count = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    return res.status(200).json({
        code: 200,
        message: {count: count[0]['COUNT(nombre)'], results: queryResult}
    });
});

/*  
    Este endpoint agrega un nuevo empleado a la base de datos y retorna una copia del nuevo recurso

    La petición utiliza el MIME type application/x-www-form-urlencoded y tiene el siguiente formato:
    - nombre
    - apellidos
    - telefono (opcional)
    - correo (opcional)
    - direccion (opcional)
*/
empleados.post("/", async (req, res, next) => {
    let { nombre, apellidos } = req.body;

    // Verificación de que no exista un empleado con el mismo nombre y apellidos
    let query = `SELECT * FROM empleados WHERE nombre = '${nombre}' AND apellidos = '${apellidos}'`;
    console.log(query);
    let queryResult = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    if (queryResult.length == 0) {
        query = queryBuilder("empleados", req.body);
        console.log(query);

        queryResult = await db.query(query).catch((error) => {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
            });
        });

        return res.status(201).json({ status: 201, mesage: req.body });
    } else {
        return res.status(400).json({
            status: 400,
            message: {
                errors: ["Ya existe un usuario con este nombre y apellido"],
            },
        });
    }
});

/*
    Este endpoint actualiza la información de un empleado y retorna una copia del recurso actualizado

    La petición utiliza el MIME type application/x-www-form-urlencoded y tiene el siguiente formato:
    - nombre (opcional)
    - apellidos (opcional)
    - telefono (opcional)
    - correo (opcional)
    - direccion (opcional)
*/
empleados.put("/", (req, res, next) => {

});

module.exports = empleados;
