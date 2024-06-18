import { DataTypes, Model } from "sequelize";

import db from "../main";

class Confess extends Model {
	declare userIdHash: string;
	declare messageId: string;
}

Confess.init(
	{
		userIdHash: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false
		},
		messageId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "confesses",
		timestamps: false
	}
);

export default Confess;
