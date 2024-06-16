import { DataTypes, Model } from "sequelize";
import db from "../main";

export class Contest extends Model {
	declare id: number;
	declare name: string;
	declare channelId: string;
	declare endTime: Date;
}

export class ContestMessage extends Model {
	declare id: number;
	declare contestId: number;
	declare messageId: string;
	declare reactionCount: number;
}

export class ContestVote extends Model {
	declare id: number;
	declare messageId: string;
	declare userId: string;
}

Contest.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		channelId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "contests"
	}
);

ContestMessage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		contestId: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		messageId: {
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
		tableName: "contest_messages"
	}
);

ContestVote.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		messageId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize: db,
		tableName: "contest_votes"
	}
);

// Create link between Contest and ContestMessage
Contest.hasMany(ContestMessage, {
	sourceKey: "id",
	foreignKey: "contestId",
	as: "messages"
});

ContestMessage.belongsTo(Contest, {
	foreignKey: "contestId",
	as: "contest"
});

ContestMessage.hasMany(ContestVote, {
	sourceKey: "id",
	foreignKey: "messageId",
	as: "votes"
});

ContestVote.belongsTo(ContestMessage, {
	foreignKey: "messageId",
	as: "message"
});
