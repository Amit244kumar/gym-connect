import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import GymOwner from './gymOwner.js';
export class OwnerMembershipPlan extends Model {}

OwnerMembershipPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    planName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'plan_name',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 12
        },
        field: 'month',
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_popular',
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'owner_id',
      references: {
        model: GymOwner,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    modelName: 'OwnerMembershipPlan',
    tableName: 'OwnerMembershipPlan',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['owner_id'] },
      { fields: ['is_active'] },
    ],
  }
);

OwnerMembershipPlan.associate = function(models) {
  OwnerMembershipPlan.hasMany(models.MembershipPlanFeature, {
    foreignKey: 'owner_membership_plan_id',
    as: 'features'
  });
};
export default OwnerMembershipPlan; 