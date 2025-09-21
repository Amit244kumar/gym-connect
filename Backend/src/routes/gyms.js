import express from 'express';
import { Gym } from '../models/Gym.js';
import { protect } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Get all gyms
router.get('/', async (req, res) => {
  try {
    const gyms = await Gym.find().populate('owner', 'firstName lastName email');
    res.json(gyms);
  } catch (error) {
    logger.error('Error fetching gyms:', error);
    res.status(500).json({ error: 'Failed to fetch gyms' });
  }
});

// Get gym by ID
router.get('/:id', async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id).populate('owner', 'firstName lastName email');
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    logger.error('Error fetching gym:', error);
    res.status(500).json({ error: 'Failed to fetch gym' });
  }
});

// Create new gym (owner only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Only gym owners can create gyms' });
    }

    const gym = new Gym({
      ...req.body,
      owner: req.user._id
    });

    await gym.save();
    res.status(201).json(gym);
  } catch (error) {
    logger.error('Error creating gym:', error);
    res.status(500).json({ error: 'Failed to create gym' });
  }
});

// Update gym (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    if (gym.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this gym' });
    }

    const updatedGym = await Gym.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedGym);
  } catch (error) {
    logger.error('Error updating gym:', error);
    res.status(500).json({ error: 'Failed to update gym' });
  }
});

// Delete gym (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    if (gym.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this gym' });
    }

    await Gym.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    logger.error('Error deleting gym:', error);
    res.status(500).json({ error: 'Failed to delete gym' });
  }
});

export default router;
