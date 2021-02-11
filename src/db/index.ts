import * as sequelize from "sequelize";
import {TokenFactory} from "./models/token";

export const db = new sequelize.Sequelize(
    (process.env.DB_NAME || "nodefactoryDB"),
    (process.env.DB_USER || "postgres"),
    (process.env.DB_PASSWORD || "postgres"),
    {
        port: Number(process.env.DB_PORT) || 5432,
        host: process.env.DB_HOST || "localhost",
        dialect: "postgres",
        pool: {
            min: 0,
            max: 5,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export const Token = TokenFactory(db);
