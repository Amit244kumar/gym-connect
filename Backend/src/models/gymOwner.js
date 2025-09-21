import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

class GymOwner extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  generateRegistrationUrl(baseUrl) {
    const path = `/register/${this.slug}`;
    const url = `${(baseUrl || '').replace(/\/$/, '')}${path}`;
    this.registrationUrl = url;
    return url;
  }
}

GymOwner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Owner account
    ownerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // ownerPhoto: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    //   field: 'owner_photo',
    // },

    // Gym identity
    gymName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(140),
      allowNull: false,
      unique: true,
    },

    // Registration + QR sharing
    registrationUrl: {
       type: DataTypes.TEXT, 
       field: 'registration_url',
       unique:true
    },

    // Subscription & Trial (Razorpay-ready)
    subscriptionPlanType: {
      type: DataTypes.ENUM('trial', 'Premium Monthly','Premium Quarterly'),
      allowNull: false,
      defaultValue: 'trial',
      field: 'subscription_plan_type',
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'expired'),
      allowNull: false,
      field: 'subscription_status',
    },
    trialStart: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'trial_start',
    },
    trialEnd: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'trial_end',
    },
    resetpasswordToken: {
      type: DataTypes.STRING(255),
      field: 'resetpassword_token', 
      defaultValue: null
    },
    resetpasswordExpires: {
      type: DataTypes.DATE,
      field: 'resetpassword_expires', 
      defaultValue: null
    },
    // Verification
    isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_email_verified' },
    isPhoneVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_phone_verified' },
    emailVerificationToken: { type: DataTypes.STRING(255), field: 'email_verification_token' },
    emailVerificationExpires: { type: DataTypes.DATE, field: 'email_verification_expires' },
    phoneVerificationCode: { type: DataTypes.STRING(10), field: 'phone_verification_code' },
    phoneVerificationExpires: { type: DataTypes.DATE, field: 'phone_verification_expires' },

   },
  {
    sequelize,
    modelName: 'GymOwner',
    tableName: 'gym_owners',
    underscored: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['gym_name'] },
      { unique: true, fields: ['slug'] },
      { unique: true, fields: ['registration_url'] },
      { fields: ['trial_end'] },
    ],
  }
);

// Hooks
GymOwner.addHook('beforeValidate', (owner) => {
  if (owner.gymName && !owner.slug) {
    owner.slug = toSlug(owner.gymName);
  }
});

GymOwner.addHook('beforeCreate', async (owner) => {
  if (owner.password) {
    const salt = await bcrypt.genSalt(12);
    owner.password = await bcrypt.hash(owner.password, salt);
  }
});

GymOwner.addHook('beforeUpdate', async (owner) => {
  if (owner.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    owner.password = await bcrypt.hash(owner.password, salt);
  }
});

export default GymOwner;


