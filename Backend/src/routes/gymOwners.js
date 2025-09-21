// import express from 'express';
// import { protect } from '../middleware/auth.js';
// import { logger } from '../utils/logger.js';
// import gymOwner from '../models/gymOwner.js';
// import User from '../models/User.js';
// import Gym from '../models/Gym.js';

// const router = express.Router();

// // Get all gym owners (admin only)
// router.get('/', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can view all gym owners' });
//     }

//     const gymOwners = await gymOwner.findAll({
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: ['firstName', 'lastName', 'email', 'phone']
//         },
//         {
//           model: Gym,
//           as: 'gym',
//           attributes: ['name', 'businessType', 'businessStreet', 'businessCity']
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     res.json(gymOwners);
//   } catch (error) {
//     logger.error('Error fetching gym owners:', error);
//     res.status(500).json({ error: 'Failed to fetch gym owners' });
//   }
// });

// // Get gym owner by ID
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const gymOwner = await GymOwner.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: ['firstName', 'lastName', 'email', 'phone', 'profilePicture']
//         },
//         {
//           model: Gym,
//           as: 'gym',
//           attributes: ['name', 'businessType', 'description', 'facilities', 'amenities']
//         }
//       ]
//     });

//     if (!gymOwner) {
//       return res.status(404).json({ error: 'Gym owner not found' });
//     }

//     // Check if user can view this gym owner
//     if (req.user.role !== 'admin' && req.user.id !== gymOwner.userId) {
//       return res.status(403).json({ error: 'Not authorized to view this gym owner' });
//     }

//     res.json(gymOwner);
//   } catch (error) {
//     logger.error('Error fetching gym owner:', error);
//     res.status(500).json({ error: 'Failed to fetch gym owner' });
//   }
// });

// // Get gym owner by user ID
// router.get('/user/:userId', protect, async (req, res) => {
//   try {
//     const gymOwner = await GymOwner.findOne({
//       where: { userId: req.params.userId },
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: ['firstName', 'lastName', 'email', 'phone']
//         },
//         {
//           model: Gym,
//           as: 'gym',
//           attributes: ['name', 'businessType', 'businessStreet', 'businessCity']
//         }
//       ]
//     });

//     if (!gymOwner) {
//       return res.status(404).json({ error: 'Gym owner not found' });
//     }

//     // Check if user can view this gym owner
//     if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
//       return res.status(403).json({ error: 'Not authorized to view this gym owner' });
//     }

//     res.json(gymOwner);
//   } catch (error) {
//     logger.error('Error fetching gym owner by user ID:', error);
//     res.status(500).json({ error: 'Failed to fetch gym owner' });
//   }
// });

// // Create new gym owner
// router.post('/', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'owner') {
//       return res.status(403).json({ error: 'Only gym owners can create gym owner profiles' });
//     }

//     // Check if user already has a gym owner profile
//     const existingOwner = await GymOwner.findOne({
//       where: { userId: req.user.id }
//     });

//     if (existingOwner) {
//       return res.status(400).json({ error: 'User already has a gym owner profile' });
//     }

//     // Validate required fields
//     const requiredFields = [
//       'gymId', 'ownershipType', 'businessName', 'businessRegistrationNumber',
//       'businessType', 'panNumber', 'gstNumber', 'businessLicense',
//       'businessEmail', 'businessPhone', 'businessStreet', 'businessCity',
//       'businessState', 'businessZipCode', 'accountHolderName', 'accountNumber',
//       'ifscCode', 'bankName'
//     ];

//     for (const field of requiredFields) {
//       if (!req.body[field]) {
//         return res.status(400).json({ error: `${field} is required` });
//       }
//     }

//     // Create gym owner profile
//     const gymOwnerData = {
//       userId: req.user.id,
//       ...req.body
//     };

//     const gymOwner = await GymOwner.create(gymOwnerData);

//     // Populate the created gym owner with user and gym data
//     const populatedGymOwner = await GymOwner.findByPk(gymOwner.id, {
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: ['firstName', 'lastName', 'email']
//         },
//         {
//           model: Gym,
//           as: 'gym',
//           attributes: ['name', 'businessType']
//         }
//       ]
//     });

//     res.status(201).json(populatedGymOwner);
//   } catch (error) {
//     logger.error('Error creating gym owner:', error);
//     if (error.name === 'SequelizeValidationError') {
//       return res.status(400).json({ error: error.message });
//     }
//     res.status(500).json({ error: 'Failed to create gym owner' });
//   }
// });

// // Update gym owner profile
// router.put('/:id', protect, async (req, res) => {
//   try {
//     const gymOwner = await GymOwner.findByPk(req.params.id);
    
//     if (!gymOwner) {
//       return res.status(404).json({ error: 'Gym owner not found' });
//     }

//     // Check if user can update this gym owner profile
//     if (req.user.role !== 'admin' && req.user.id !== gymOwner.userId) {
//       return res.status(403).json({ error: 'Not authorized to update this gym owner profile' });
//     }

//     // Update the gym owner profile
//     await gymOwner.update(req.body);

//     // Fetch updated gym owner with populated data
//     const updatedGymOwner = await GymOwner.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           as: 'user',
//           attributes: ['firstName', 'lastName', 'email']
//         },
//         {
//           model: Gym,
//           as: 'gym',
//           attributes: ['name', 'businessType']
//         }
//       ]
//     });

//     res.json(updatedGymOwner);
//   } catch (error) {
//     logger.error('Error updating gym owner:', error);
//     if (error.name === 'SequelizeValidationError') {
//       return res.status(400).json({ error: error.message });
//     }
//     res.status(500).json({ error: 'Failed to update gym owner' });
//   }
// });

// // Update verification status (admin only)
// router.patch('/:id/verify', protect, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Only admins can verify gym owners' });
//     }

//     const { verificationStatus, verificationNotes } = req.body;
    
//     if (!verificationStatus) {
//       return res.status(400).json({ error: 'Verification status is required' });
//     }

//     const gymOwner = await GymOwner.findByPk(req.params.id);
    
//     if (!gymOwner) {
//       return res.status(404).json({ error: 'Gym owner not found' });
//     }

//     await gymOwner.updateVerification(verificationStatus, verificationNotes, req.user.id);

//     res.json({ message: 'Verification status updated successfully', gymOwner });
//   } catch (error) {
//     logger.error('Error updating verification status:', error);
//     res.status(500).json({ error: 'Failed to update verification status' });
//   }
// });

// // Delete gym owner profile
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const gymOwner = await GymOwner.findByPk(req.params.id);
    
//     if (!gymOwner) {
//       return res.status(404).json({ error: 'Gym owner not found' });
//     }

//     // Check if user can delete this gym owner profile
//     if (req.user.role !== 'admin' && req.user.id !== gymOwner.userId) {
//       return res.status(403).json({ error: 'Not authorized to delete this gym owner profile' });
//     }

//     await gymOwner.destroy();
//     res.json({ message: 'Gym owner profile deleted successfully' });
//   } catch (error) {
//     logger.error('Error deleting gym owner:', error);
//     res.status(500).json({ error: 'Failed to delete gym owner profile' });
//   }
// });

// // Get verified gym owners
// router.get('/verified/list', async (req, res) => {
//   try {
//     const verifiedOwners = await GymOwner.findVerifiedOwners();
//     res.json(verifiedOwners);
//   } catch (error) {
//     logger.error('Error fetching verified gym owners:', error);
//     res.status(500).json({ error: 'Failed to fetch verified gym owners' });
//   }
// });

// // Get gym owners by business type
// router.get('/type/:businessType', async (req, res) => {
//   try {
//     const owners = await GymOwner.findByBusinessType(req.params.businessType);
//     res.json(owners);
//   } catch (error) {
//     logger.error('Error fetching gym owners by business type:', error);
//     res.status(500).json({ error: 'Failed to fetch gym owners by business type' });
//   }
// });

// export default router;

