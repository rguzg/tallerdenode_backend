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
    const nombre = req.query.nombre || "";

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
        message: { count: count[0]["COUNT(nombre)"], results: queryResult },
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
    let queryResult = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    if (nombre && apellidos) {
        if (queryResult.length == 0) {
            query = queryBuilder("empleados", req.body);

            queryResult = await db.query(query).catch((error) => {
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
                    errors: ["Ya existe un empleado con este nombre y apellido"],
                },
            });
        }
    } else {
        return res.status(400).json({
            status: 400,
            message: {
                errors: [
                    "Cuerpo de la petición incorrecta, los parámetros obligatorios de este endpoint son nombre y apellidos",
                ],
            },
        });
    }
});

/*
    Este endpoint retorna la información de un empleado
*/
empleados.get("/:id([0-9]{1,})", async (req, res, next) => {
    const { id } = req.params;

    let query = `SELECT * FROM empleados WHERE id = ${id}`;

    queryResult = await db.query(query).catch((error) => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    if (queryResult.length == 1) {
        return res.status(200).json({
            status: 200,
            message: queryResult,
        });
    } else {
        return res.status(404).json({
            status: 404,
            message: "Empleado no encontrado",
        });
    }
});

/*
    Este endpoint actualiza la información de un empleado y retorna una estado 204

    La petición utiliza el MIME type application/x-www-form-urlencoded y tiene el siguiente formato:
    - nombre
    - apellidos
    - telefono
    - correo
    - direccion
*/
empleados.put("/:id([0-9]{1,})", async (req, res, next) => {
    const { id } = req.params;
    const { nombre, apellidos, telefono, correo, direccion } = req.body;

    // Verificación de que no exista un empleado con el mismo nombre y apellidos
    let query = `SELECT nombre, apellidos FROM empleados WHERE nombre = '${nombre}' AND apellidos = '${apellidos}'`;
    let queryResult = await db.query(query).catch(() => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    if (id && nombre && apellidos) {
        // Verificar que si existe un empleado con esos nombre, que sea el mismo que se va a actualizar
        if (queryResult.length == 0 || (queryResult[0].nombre == nombre && queryResult[0].apellidos == apellidos)){
            let query = `UPDATE empleados SET nombre = '${nombre}', apellidos = '${apellidos}', 
            telefono = '${telefono}', correo = '${correo}', direccion = '${direccion}' WHERE id = ${id}`;

            queryResult = await db.query(query).catch((error) => {
                return res.status(500).json({
                    status: 500,
                    message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
                });
            });

            if (queryResult.affectedRows == 1) {
                return res.status(204).send();
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
                });
            }
        } else {
            return res.status(400).json({
                status: 400,
                message: {
                    errors: ["Ya existe un empleado con este nombre y apellido"],
                },
            });
        }
    } else {
        return res.status(400).json({
            status: 400,
            mesage: {
                errors: [
                    "Cuerpo de la petición incorrecta, los parámetros obligatorios de este endpoint son nombre y apellidos",
                ],
            },
        });
    }
});

/*
    Este endpoint elimina un empleado y retorna una estado 204
*/
empleados.delete("/:id([0-9]{1,})", async (req, res, next) => {
    const { id } = req.params;

    let query = `DELETE FROM empleados WHERE id = ${id}`;

    queryResult = await db.query(query).catch((error) => {
        return res.status(500).json({
            status: 500,
            message: "Ocurrió un error de servidor. Intentalo de nuevo más tarde",
        });
    });

    if (queryResult.affectedRows == 1) {
        return res.status(204).send();
    } else {
        return res.status(404).json({
            status: 404,
            message: "Empleado no encontrado",
        });
    }
});

module.exports = empleados;
