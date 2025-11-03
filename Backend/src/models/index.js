import sequelize from '../config/database.js';
import Member from './member.js';
import GymOwner from './gymOwner.js';
import Membership from './membership.js';
import OwnerMembershipPlan from './OwnerMembershipPlan.js';
import MembershipPlanFeature from './MembershipPlanFeature.js';
// Define all associations here
Member.belongsTo(GymOwner, { foreignKey: "ownerId" });
GymOwner.hasMany(Member, { foreignKey: "ownerId" });

Member.hasMany(Membership, { foreignKey: "memberId" });
Membership.belongsTo(Member, { foreignKey: "memberId" });

OwnerMembershipPlan.belongsTo(GymOwner, { foreignKey: "ownerId" });
GymOwner.hasMany(OwnerMembershipPlan, { foreignKey: "ownerId" });

MembershipPlanFeature.belongsTo(OwnerMembershipPlan, { foreignKey: "ownerMembershipPlanId", as: 'plan' });
OwnerMembershipPlan.hasMany(MembershipPlanFeature, { foreignKey: "ownerMembershipPlanId", as: 'features' });
// Export all models and sequelize instance

export { Member, GymOwner, Membership, OwnerMembershipPlan, MembershipPlanFeature };