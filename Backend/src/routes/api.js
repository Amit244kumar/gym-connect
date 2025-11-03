import gymOwnerAuth from './gymOwnerAuth.js';
import memberAuth from '../routes/membersAuth.js';
import membershipPlan from './ownerMembershipPlan.js';
import express from "express"
const router=express.Router()

router.use("/gymOnwerAuth",gymOwnerAuth)
router.use('/memberAuth',memberAuth)
router.use("/ownerMembershipPlan",membershipPlan)
export default router;