  import sequelize from '../config/database.js';
  import Member from './member.js';
  import GymOwner from './gymOwner.js';
  import Membership from './membership.js';
  import OwnerMembershipPlan from './OwnerMembershipPlan.js';
  import MembershipPlanFeature from './MembershipPlanFeature.js';
  import CheckIn from './checkIn.js';

import MembershipRenewal from './MembershipRenewal.js';
  // Define all associations here
  Member.belongsTo(GymOwner, { foreignKey: "ownerId" });
  GymOwner.hasMany(Member, { foreignKey: "ownerId" });

  Member.hasMany(Membership, { foreignKey: "memberId" });
  Membership.belongsTo(Member, { foreignKey: "memberId" });

  Member.belongsTo(OwnerMembershipPlan, {
    foreignKey: "membershipType", // this is the column you already have
    as: "membershipPlan"
  });

MembershipRenewal.belongsTo(Member, { foreignKey: "memberId", as:"member" });
MembershipRenewal.belongsTo(OwnerMembershipPlan, { foreignKey: "plan_id", as:"plan" });
Member.hasMany(MembershipRenewal, { foreignKey: "memberId", as:"renewals" }); // Fixed spelling
OwnerMembershipPlan.hasMany(MembershipRenewal, { foreignKey: "plan_id", as:"planRenewals" });

  OwnerMembershipPlan.belongsTo(GymOwner, { foreignKey: "ownerId" });
  GymOwner.hasMany(OwnerMembershipPlan, { foreignKey: "ownerId" });

  MembershipPlanFeature.belongsTo(OwnerMembershipPlan, { foreignKey: "membership_plan_id", as: 'plan' });
  OwnerMembershipPlan.hasMany(MembershipPlanFeature, { foreignKey: "membership_plan_id", as: 'features' });
  // Export all models and sequelize instance

  CheckIn.belongsTo(Member, { foreignKey: "memberId", as: "member" });
  CheckIn.belongsTo(GymOwner, { foreignKey: "ownerId", as: "owner" });

  Member.hasMany(CheckIn, { foreignKey: "memberId", as: "checkIns" });
  GymOwner.hasMany(CheckIn, { foreignKey: "ownerId", as: "memberCheckIns" });


  export { Member, GymOwner, Membership, OwnerMembershipPlan, MembershipPlanFeature, CheckIn , MembershipRenewal};  