const express = require("express");
const dotenv = require("dotenv");
const endpoints = require("./endpoints");

const app = express();

// Middleware
const notfound = require("./middleware/notfound");

// Routes
const usuario = require("./routes/usuario");
const empleados = require("./routes/empleados");
const auth = require("./middleware/auth");

dotenv.config();

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res, next) => {
    return res.status(200).json({ code: 200, message: endpoints });
});

app.use('/usuario', usuario);
app.use('/empleados', empleados);

app.use(notfound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
