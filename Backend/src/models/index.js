import sequelize from '../config/database.js';
import Member from './member.js';
import GymOwner from './gymOwner.js';
import Membership from './membership.js';

// Define all associations here
Member.belongsTo(GymOwner, { foreignKey: "ownerId" });
GymOwner.hasMany(Member, { foreignKey: "ownerId" });

Member.hasMany(Membership, { foreignKey: "memberId" });
Membership.belongsTo(Member, { foreignKey: "memberId" });

export { Member, GymOwner, Membership };