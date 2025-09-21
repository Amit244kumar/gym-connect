import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true,
    maxlength: [100, 'Gym name cannot exceed 100 characters'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Gym owner is required'],
  },
  
  // Business Information
  businessType: {
    type: String,
    enum: ['fitness', 'yoga', 'crossfit', 'martial-arts', 'swimming', 'dance', 'other'],
    required: [true, 'Business type is required'],
  },
  businessLicense: {
    type: String,
    required: [true, 'Business license is required'],
    unique: true,
  },
  taxId: {
    type: String,
    required: [true, 'Tax ID is required'],
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
    },
    country: {
      type: String,
      default: 'India',
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  
  // Gym Details
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  facilities: [{
    name: String,
    description: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }],
  amenities: [{
    type: String,
    enum: [
      'parking', 'shower', 'locker-room', 'towel-service', 'wifi',
      'childcare', 'cafe', 'pro-shop', 'personal-training',
      'group-classes', 'pool', 'sauna', 'steam-room'
    ],
  }],
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
  },
  
  // Capacity and Pricing
  capacity: {
    type: Number,
    required: [true, 'Gym capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  currentMembers: {
    type: Number,
    default: 0,
  },
  pricing: {
    monthly: {
      type: Number,
      required: [true, 'Monthly pricing is required'],
    },
    quarterly: {
      type: Number,
      required: [true, 'Quarterly pricing is required'],
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly pricing is required'],
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
  },
  
  // Images and Media
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  logo: {
    type: String,
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
  },
  
  // Gym Status
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verificationNotes: String,
  
  // Statistics
  stats: {
    totalCheckins: {
      type: Number,
      default: 0,
    },
    averageDailyVisits: {
      type: Number,
      default: 0,
    },
    peakHours: {
      type: String,
      default: '6:00 PM - 8:00 PM',
    },
    memberRetentionRate: {
      type: Number,
      default: 0,
    },
  },
  
  // Settings
  settings: {
    qrCodeEnabled: {
      type: Boolean,
      default: true,
    },
    autoRenewal: {
      type: Boolean,
      default: true,
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    privacy: {
      memberDirectory: {
        type: String,
        enum: ['public', 'members-only', 'private'],
        default: 'members-only',
      },
    },
  },
  
  // Timestamps
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for availability status
gymSchema.virtual('availabilityStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.isVerified) return 'unverified';
  return 'active';
});

// Virtual for occupancy rate
gymSchema.virtual('occupancyRate').get(function() {
  if (this.capacity === 0) return 0;
  return Math.round((this.currentMembers / this.capacity) * 100);
});

// Virtual for full address
gymSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Indexes
gymSchema.index({ name: 1 });
gymSchema.index({ owner: 1 });
gymSchema.index({ 'address.city': 1 });
gymSchema.index({ 'address.state': 1 });
gymSchema.index({ businessType: 1 });
gymSchema.index({ isActive: 1, isVerified: 1 });
gymSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure only one primary image
gymSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      let foundPrimary = false;
      this.images.forEach(img => {
        if (img.isPrimary && !foundPrimary) {
          foundPrimary = true;
        } else {
          img.isPrimary = false;
        }
      });
    }
  }
  next();
});

// Method to update member count
gymSchema.methods.updateMemberCount = function() {
  return this.model('User').countDocuments({
    gymId: this._id,
    role: 'member',
    membershipStatus: 'active'
  }).then(count => {
    this.currentMembers = count;
    return this.save();
  });
};

// Method to check if gym is open
gymSchema.methods.isOpen = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase().slice(0, 3);
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayHours = this.operatingHours[dayOfWeek];
  if (!todayHours || !todayHours.isOpen) return false;
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Static method to find nearby gyms
gymSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10) {
  return this.find({
    isActive: true,
    isVerified: true,
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    }
  });
};

const Gym = mongoose.model('Gym', gymSchema);

export { Gym };
