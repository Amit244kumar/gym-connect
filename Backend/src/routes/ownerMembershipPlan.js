import { memberShipPlanValidation, updateMemberShipPlanValidation } from "../validator/ownerMembersipPlan.js";
import { Router } from "express";
import authMiddleware from '../middleware/auth.js';
import { createMembershipPlan,deleteMembershipPlan,disableMembershipPlan,getMembershipPlans, updateMembershipPlan } from "../controller/OwnerMemberShipPlan.js";
const router = Router();

router.post("/createMembershipPlan",
    authMiddleware,
    memberShipPlanValidation,
    createMembershipPlan
)
router.put("/updateMembershipPlan",
    authMiddleware,
    updateMemberShipPlanValidation,
    updateMembershipPlan
);
router.get("/getMembershipPlans",
    authMiddleware,
    getMembershipPlans
);
router.patch("/disableMembershipPlan/:planId",
    authMiddleware,
    disableMembershipPlan
);

router.delete("/deleteMembershipPlan/:planId",
    authMiddleware,
    deleteMembershipPlan
);

export default router;