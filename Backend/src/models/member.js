import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";
import GymOwner from "./gymOwner.js";
import OwnerMembershipPlan from "./OwnerMembershipPlan.js";
import MembershipRenawal from "./MembershipRenewal.js";

class Member extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

Member.init(
  {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    name: { 
        type: DataTypes.STRING(50),
        allowNull: false 
    },

    email: { 
        type: DataTypes.STRING(50), 
        allowNull: false, 
        unique: true 
    },

    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },

    phone: { 
        type: DataTypes.STRING(10), 
        allowNull: true 
    },

    memberPhoto: { 
        type:  DataTypes.STRING(100), 
        allowNull: true, 
        field: "member_photo" 
    },

    address: { 
        type: DataTypes.STRING,
        allowNull: true 
    },

    dateOfBirth: { 
        type: DataTypes.DATEONLY, 
        allowNull: true, 
        field: "date_of_birth" 
    },

    gender: { 
        type: DataTypes.ENUM("male", "female", "other"), 
        allowNull: true 
    },

    resetpasswordToken: { 
        type: DataTypes.STRING, 
        allowNull: true,
        field: "resetpassword_token" 
    },

    resetpasswordExpires: { 
        type: DataTypes.DATE, 
        allowNull: true, 
        field: "resetpassword_expires" 
    },

    // Membership related fields
    // membershipType: {
    //  type:DataTypes.INTEGER,
    //  allowNull:true,
    //  field:"membershipPlan_id",
    //  references:{model:OwnerMembershipPlan,key:"id"}
    // },

    // membershipStartDate: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    //   field: "membership_start_date"
    // },

    // membershipEndDate: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    //   field: "membership_end_date"
    // },

    memberRenewalId:{
      type:DataTypes.INTEGER,
      allowNull:true,
      field:"member_renewal_id",
      references:{model:'membership_renewals',key:"id"}
    },

    membershipStatus: {
      type: DataTypes.ENUM("active", "expired", "suspended"),
      defaultValue: "active",
      field: "membership_status"
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "owner_id",
      references: { model: GymOwner, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Member",
    tableName: "members",
    timestamps: true,
  },
  Member.associations = function(models) {
    Member.belongsTo(models.GymOwner, {
      foreignKey: "owner_id",
      as: "gymOwner",
    });
    Member.hasMany(models.MembershipRenewal, {
      foreignKey: "member_id",
      as: "membershipRenewals",
    });
  }
);

export default Member;