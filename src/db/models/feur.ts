import { DataTypes, Model } from "sequelize";

import db from "../main";

class Feur extends Model {
    declare userId: string;
    declare amount: number;
    declare isAdmin: boolean;
}

Feur.init(
    {
        userId: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize: db,
        tableName: "feurs",
        timestamps: false
    }
);

export default Feur;
