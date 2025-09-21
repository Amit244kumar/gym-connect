import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get payment plans
// @route   GET /api/v1/payments/plans
// @access  Public
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'trial',
        name: 'Free Trial',
        duration: '2 months',
        price: 0,
        currency: 'INR',
        features: [
          'Up to 50 members',
          'QR code entry system',
          'Basic member management',
          'Email notifications',
          'Basic analytics',
        ],
        popular: false,
      },
      {
        id: 'monthly',
        name: 'Premium Monthly',
        duration: '1 month',
        price: 999,
        currency: 'INR',
        features: [
          'Unlimited members',
          'Advanced QR system',
          'Complete member management',
          'SMS & Email notifications',
          'Advanced analytics',
          'Custom branding',
          'Priority support',
        ],
        popular: true,
      },
      {
        id: 'quarterly',
        name: 'Premium Quarterly',
        duration: '3 months',
        price: 1899,
        currency: 'INR',
        features: [
          'Everything in Premium',
          'Advanced reporting',
          'API access',
          'White-label solution',
          '24/7 dedicated support',
          'Custom integrations',
          'Training sessions',
        ],
        popular: false,
        savings: 99,
      },
    ];

    res.json({
      success: true,
      data: { plans },
    });
  } catch (error) {
    logger.error('Get payment plans error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment plans',
    });
  }
});

// @desc    Create payment intent
// @route   POST /api/v1/payments/create-intent
// @access  Private (Owner)
router.post('/create-intent', protect, authorize('owner'), [
  body('planId').isIn(['monthly', 'quarterly']).withMessage('Invalid plan ID'),
  body('currency').optional().isIn(['INR', 'USD', 'EUR']).withMessage('Invalid currency'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { planId, currency = 'INR' } = req.body;

    // Get plan details
    const plans = {
      monthly: { price: 999, duration: '1 month' },
      quarterly: { price: 1899, duration: '3 months' },
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan selected',
      });
    }

    // In a real implementation, you would integrate with Stripe here
    // For now, we'll create a mock payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: plan.price * 100, // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      plan: {
        id: planId,
        name: `Premium ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
        price: plan.price,
        duration: plan.duration,
        currency,
      },
    };

    logger.info(`Payment intent created: ${paymentIntent.id} for plan: ${planId}`);

    res.json({
      success: true,
      message: 'Payment intent created successfully',
      data: { paymentIntent },
    });
  } catch (error) {
    logger.error('Create payment intent error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while creating payment intent',
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/v1/payments/confirm
// @access  Private (Owner)
router.post('/confirm', protect, authorize('owner'), [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('planId').isIn(['monthly', 'quarterly']).withMessage('Invalid plan ID'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { paymentIntentId, planId } = req.body;

    // In a real implementation, you would verify the payment with Stripe here
    // For now, we'll simulate a successful payment
    const payment = {
      id: paymentIntentId,
      status: 'succeeded',
      amount: planId === 'monthly' ? 999 : 1899,
      currency: 'INR',
      planId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (planId === 'monthly' ? 30 : 90) * 24 * 60 * 60 * 1000),
    };

    logger.info(`Payment confirmed: ${paymentIntentId} for plan: ${planId}`);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: { payment },
    });
  } catch (error) {
    logger.error('Confirm payment error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while confirming payment',
    });
  }
});

// @desc    Get payment history
// @route   GET /api/v1/payments/history
// @access  Private (Owner)
router.get('/history', protect, authorize('owner'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // In a real implementation, you would fetch from a Payment model
    // For now, we'll return mock data
    const mockPayments = [
      {
        id: 'pi_1',
        amount: 999,
        currency: 'INR',
        planId: 'monthly',
        status: 'succeeded',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'pi_2',
        amount: 1899,
        currency: 'INR',
        planId: 'quarterly',
        status: 'succeeded',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    ];

    const total = mockPayments.length;

    res.json({
      success: true,
      data: {
        payments: mockPayments.slice(skip, skip + limit),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get payment history error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching payment history',
    });
  }
});

// @desc    Cancel subscription
// @route   POST /api/v1/payments/cancel
// @access  Private (Owner)
router.post('/cancel', protect, authorize('owner'), async (req, res) => {
  try {
    // In a real implementation, you would cancel the subscription with Stripe
    // For now, we'll simulate a cancellation
    logger.info(`Subscription cancellation requested by: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Subscription cancellation request submitted',
      data: {
        cancellationDate: new Date(),
        note: 'Your subscription will remain active until the end of the current billing period.',
      },
    });
  } catch (error) {
    logger.error('Cancel subscription error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while cancelling subscription',
    });
  }
});

// @desc    Get subscription status
// @route   GET /api/v1/payments/subscription
// @access  Private (Owner)
router.get('/subscription', protect, authorize('owner'), async (req, res) => {
  try {
    // In a real implementation, you would fetch from Stripe
    // For now, we'll return mock data
    const subscription = {
      id: 'sub_1',
      status: 'active',
      planId: 'monthly',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
      plan: {
        id: 'monthly',
        name: 'Premium Monthly',
        price: 999,
        currency: 'INR',
        interval: 'month',
      },
    };

    res.json({
      success: true,
      data: { subscription },
    });
  } catch (error) {
    logger.error('Get subscription status error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching subscription status',
    });
  }
});

export default router;
