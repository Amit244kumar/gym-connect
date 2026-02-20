import { Sequelize, DataTypes } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

// Connect to PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: console.log, // Enable logging for debugging
  }
);

// Test connection

export default sequelize;
