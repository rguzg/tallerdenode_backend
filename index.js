const app = require("express");
const dotenv = require("dotenv");
const endpoints = require("./endpoints.js");

// Middleware
const notfound = require("./middleware/notfound.js");
dotenv.config();

app.get("/", (req, res, next) => {
    return res.status(200).json({code: 200, message: endpoints});
});

app.use(notfound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});