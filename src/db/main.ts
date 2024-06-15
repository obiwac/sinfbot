import { Sequelize } from "sequelize";

const db = new Sequelize({
	dialect: "sqlite",
	storage: process.env.DATABASE_PATH!
});

export default db;
