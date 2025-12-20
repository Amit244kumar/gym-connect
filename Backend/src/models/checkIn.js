import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Member from "./member.js";// Make sure to import the Member model
import GymOwner from "./gymOwner.js"; // Import GymOwner model if you need the reference

class CheckIn extends Model {}

CheckIn.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "member_id",
      references: {
        model: "members",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "owner_id",
      references: {
        model: "gym_owners",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    checkInStatus: {
      type: DataTypes.ENUM("failed", "success"),
      allowNull: false,
      defaultValue: "success",
      field: "checkin_status",
    },

  },
  {
    sequelize,
    modelName: "CheckIn",
    tableName: "checkins",
    timestamps: true,
  }
);

// Define associations (add these after the model definition)

export default CheckIn;