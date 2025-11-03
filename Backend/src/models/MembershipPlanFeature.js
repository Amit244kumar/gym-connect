import { DataTypes,Model } from "sequelize";
import sequelize from "../config/database.js";
import OwnerMembershipPlan from "./OwnerMembershipPlan.js";
export class MembershipPlanFeature extends Model {}

MembershipPlanFeature.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    featureName:{
        type:DataTypes.STRING(100),
        allowNull:false,
        field:'feature_name',
    },
    ownerMembershipPlanId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        field:'owner_membership_plan_id',
        references:{
            model:OwnerMembershipPlan,
            key:'id',
        },
        onDelete:'CASCADE',
    },
},{
    sequelize,
    modelName:'MembershipPlanFeature',  
    tableName:'MembershipPlanFeature',
    underscored:true,
    timestamps:true,
    indexes:[
        {fields:['owner_membership_plan_id']},
    ],
})


MembershipPlanFeature.associate = function(models) {
  MembershipPlanFeature.belongsTo(models.OwnerMembershipPlan, {
    foreignKey: 'owner_membership_plan_id',
    as: 'plan'
  });
};

export default MembershipPlanFeature;