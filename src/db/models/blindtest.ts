import { DataTypes, Model } from "sequelize";

import db from "../main";

class Blindtest extends Model {
	declare userId: string;
	declare score: number;
}

Blindtest.init(
	{
		userId: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false
		},
		score: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	},
	{
		sequelize: db,
		tableName: "blindtest_score",
		timestamps: false
	}
);

export default Blindtest;
