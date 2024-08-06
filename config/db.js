import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("findjob","root","1832003",{
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3307,

})

export default sequelize;