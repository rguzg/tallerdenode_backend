import express from "express";
import dotenv from "dotenv";

// Middleware
import notfound from "./middleware/notfound.js";

const app = express();
dotenv.config();

app.use(notfound);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});