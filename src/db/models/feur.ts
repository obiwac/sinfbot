import { DataTypes, Model } from "sequelize";

import db from "../main";

class Feur extends Model {
    declare userId: number;
    declare amount: number;
}

Feur.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    },
    {
        sequelize: db,
        tableName: "feurs",
        timestamps: false
    }
);

export default Feur;
