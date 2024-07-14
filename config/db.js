import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("findJob","root","1832003",{
  host: "localhost",
  dialect: "mysql",
  port: 3307,

})

export default sequelize;