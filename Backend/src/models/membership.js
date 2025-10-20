import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Member from "./member.js";

class Membership extends Model {}

Membership.init(
  {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "member_id",
      references: { model: Member, key: "id" },
      onDelete: "CASCADE",
    },

    membershipType: {
      type: DataTypes.ENUM("monthly", "quarterly", "yearly"),
      allowNull: false,
      field: "membership_type",
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },

    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },

    expireInDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "expire_in_days",
    },

    membershipStatus: {
      type: DataTypes.ENUM("active", "expired"),
      allowNull: false,
      defaultValue: "active",
      field:"membership_status"
    },
  },
  {
    sequelize,
    modelName: "Membership",
    tableName: "memberships",
    timestamps: true,
  }
);
// Member.hasMany(Membership, { foreignKey: "memberId" });
// Membership.belongsTo(Member, { foreignKey: "memberId" });

export default Membership;
