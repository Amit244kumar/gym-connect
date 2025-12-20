import { memberShipPlanValidation, updateMemberShipPlanValidation } from "../validator/ownerMembersipPlan.js";
import { Router } from "express";
import ownerAuthMiddleware from '../middleware/auth.js';
import { createMembershipPlan,deleteMembershipPlan,disableMembershipPlan,getMembershipPlans, updateMembershipPlan } from "../controller/OwnerMemberShipPlan.js";
const router = Router();

router.post("/createMembershipPlan",
    ownerAuthMiddleware,
    memberShipPlanValidation,
    createMembershipPlan
)
router.put("/updateMembershipPlan",
    ownerAuthMiddleware,
    updateMemberShipPlanValidation,
    updateMembershipPlan
);
router.get("/getMembershipPlans",
    ownerAuthMiddleware,
    getMembershipPlans
);
router.patch("/disableMembershipPlan/:planId",
    ownerAuthMiddleware,
    disableMembershipPlan
);

router.delete("/deleteMembershipPlan/:planId",
    ownerAuthMiddleware,
    deleteMembershipPlan
);

export default router;