import { body, param, query } from 'express-validator';
const memberShipPlanValidation =[
    body('planName')
        .notEmpty()
        .withMessage('Plan name is required'),
    body('duration')
        .isInt({ min: 1 })
        .withMessage('Duration must be at least 1 month')
        .notEmpty()
        .withMessage('Duration is required'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    body('isPopular')
        .isBoolean()
] 
const updateMemberShipPlanValidation =[
    body('planId')
        .notEmpty()
        .withMessage('Plan ID is required'),
    body('planName')
        .notEmpty()
        .withMessage('Plan name is required'),
    body('duration')
        .isInt({ min: 1 })
        .withMessage('Duration must be at least 1 month')
        .notEmpty()
        .withMessage('Duration is required'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
        .notEmpty()
        .withMessage('Price is required'),
    body('isPopular')
        .isBoolean()
] 
export { 
    memberShipPlanValidation,
    updateMemberShipPlanValidation
}