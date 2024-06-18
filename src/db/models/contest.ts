import { DataTypes, Model } from "sequelize";

import db from "../main";

export class Contest extends Model {
	declare name: string;
	declare channelId: string;
	declare startTime: Date;
	declare endTime: Date;
}

export class ContestMessage extends Model {
	declare contestName: string;
	declare messageId: string;
	declare reactionCount: number;
}

export class ContestVote extends Model {
	declare messageId: string;
	declare userId: string;
}

Contest.init(
	{
		name: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false
		},
		channelId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "contests",
		timestamps: false
	}
);

ContestMessage.init(
	{
		messageId: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false
		},
		contestName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		reactionCount: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "contest_messages",
		timestamps: false
	}
);

ContestVote.init(
	{
		messageId: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "contest_votes",
		timestamps: false
	}
);

// Create link between Contest and ContestMessage
Contest.hasMany(ContestMessage, {
	sourceKey: "name",
	foreignKey: "contestName"
});

ContestMessage.belongsTo(Contest, {
	foreignKey: "contestName"
});

// Create link between ContestMessage and ContestVote
ContestMessage.hasMany(ContestVote, {
	sourceKey: "messageId",
	foreignKey: "messageId"
});

ContestVote.belongsTo(ContestMessage, {
	foreignKey: "messageId"
});
