import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("findjob","root","Tung_2002@",{
  host: "14.225.210.106",
  dialect: "mysql",
  port: 3306,

})

export default sequelize;