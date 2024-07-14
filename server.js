// import express from 'express';

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mySqlPool from "./config/db.js";
import sequelize from "./config/db.js";
// const mySqlPool = require("./config/db")
import routerAuth from "./routers/auth.js";
dotenv.config();

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());

// routes
app.get("/test", (req, res) => {
  res.status(200).send("<h1> Node js my sql</h1>");
});
app.use("/api/auth", routerAuth);

const PORT = process.env.PORT || 8080;
// MY SQL

sequelize
  .authenticate()
  .then(() => {
    console.log("MYSQL DB Connected");

    // Đồng bộ hóa các model với cơ sở dữ liệu và khởi động server
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
