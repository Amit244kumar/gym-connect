import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

class MembershipRenewal extends Model {
  static associate(models) {
    // Relationship with Member
    MembershipRenewal.belongsTo(models.Member, {
      foreignKey: "member_id",
      as: "member",
    });

    // Relationship with OwnerMembershipPlan
    MembershipRenewal.belongsTo(models.OwnerMembershipPlan, {
      foreignKey: "plan_id",
      as: "plan",   // FIXED: Must match API include alias
    });
  }
}

MembershipRenewal.init(
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
    },

    planId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "plan_id",
      references: {
        model: "owner_membership_plans",
        key: "id",
      },
    },

    renewalDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "renewal_date",
    },

    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "expiry_date",
    },
  },
  {
    sequelize,
    modelName: "MembershipRenewal",
    tableName: "membership_renewals",
    underscored: true,
    timestamps: true,
  }
);

export default MembershipRenewal;
