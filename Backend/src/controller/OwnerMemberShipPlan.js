import {OwnerMembershipPlan} from "../models/OwnerMembershipPlan.js";
import {MembershipPlanFeature} from "../models/MembershipPlanFeature.js";
import { validationResult } from "express-validator";
import Member from "../models/member.js";
import sequelize from "../config/database.js";
const createMembershipPlan = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        const {id:ownerId} = req.user;
        const { planName, duration, price, features, isPopular } =  req.body;
        console.log('req.body', planName, duration, price, features, isPopular  );
        const newPlan = await OwnerMembershipPlan.create({
            planName,
            duration,
            price,
            ownerId,
            isPopular
        });
        console.log('sdfsf',newPlan);
        if(features && features.length > 0){
             const featuresData = features.map(feature => ({
                featureName: feature,
                ownerMembershipPlanId: newPlan.id
            }));
            await MembershipPlanFeature.bulkCreate(featuresData);
        }
        console.log('newPlan',newPlan);
        return res.status(201).json({
            success: true,
            message: 'Membership plan created successfully',
            data: {newPlan,features}
        }); 
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}
const updateMembershipPlan = async (req, res) => {
    // Implementation for updating a membership 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        const {id:ownerId} = req.user;
        const { planId, planName, duration, price, features, isPopular } =  req.body;
        const plan = await OwnerMembershipPlan.findOne({ where: { id: planId, ownerId } });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Membership plan not found'
            });
        }   
        plan.planName = planName;
        plan.duration = duration;
        plan.price = price;
        plan.isPopular = isPopular;
        await plan.save();
        if(features && features.length > 0){
            await MembershipPlanFeature.destroy({ where: { ownerMembershipPlanId: plan.id } });
             const featuresData = features.map(feature => ({
                featureName: feature,
                ownerMembershipPlanId: plan.id
            }));
            await MembershipPlanFeature.bulkCreate(featuresData);
        }   
        return res.status(200).json({
            success: true,
            message: 'Membership plan updated successfully',
            data: {plan,features}
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }

}
const getMembershipPlans = async (req, res) => {
  try {
    const { id: ownerId } = req.user;

    const plans = await OwnerMembershipPlan.findAll({
      where: { ownerId },
      include: [{ model: MembershipPlanFeature, as: 'features' }]
    });

    const plansId = plans.map(plan => plan.id);

    const totalMembersPerPlan = await Member.findAll({
      where: { membershipType: plansId },
      attributes: [
        'membershipType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalMembers']
      ],
      group: ['membershipType']
    });

    // Convert Sequelize objects → Normal JS
    const counts = totalMembersPerPlan.map(item => ({
      membershipType: item.membershipType,
      total: Number(item.get('totalMembers'))
    }));

    // Attach count to each plan
    plans.forEach(plan => {
      const found = counts.find(c => c.membershipType === plan.id);
      plan.dataValues.totalMembers = found ? found.total : 0;
    });

    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


const disableMembershipPlan = async (req, res) => {
    try {
        const {id:ownerId} = req.user;
        const { planId } = req.params;
        const plan = await OwnerMembershipPlan.findOne(
            {
             where: { id: planId, ownerId },
             include: [{ model: MembershipPlanFeature, as: 'features' }]
         }
        );
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Membership plan not found'
            });
        }
        plan.isActive = !plan.isActive;
        await plan.save();
        return res.status(200).json({
            success: true,
            message: `Membership plan ${plan.isActive ? 'enabled' : 'disabled'} successfully`,
            data:
             plan
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}
const deleteMembershipPlan = async (req, res) => {
      const {id:ownerId} = req.user;
      const { planId } = req.params;
        try {
        const plan = await OwnerMembershipPlan.findOne({ where: { id: planId, ownerId } });
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Membership plan not found'
            });
        }
        await plan.destroy();
        return res.status(200).json({
            success: true,
            message: 'Membership plan deleted successfully',
            data: { id: planId }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}
export {
    createMembershipPlan,
    updateMembershipPlan,
    getMembershipPlans,
    disableMembershipPlan,
    deleteMembershipPlan
};