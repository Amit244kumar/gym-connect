// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/database.js';
// import GymOwner from './gymOwner.js';

// class Gym extends Model {
//   // Virtual getter for availability status


//   // Virtual getter for full address
//   get fullAddress() {
//     const addr = this.address;
//     return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
//   }

//   // Instance method to update member count
//   async updateMemberCount() {
//     const User = sequelize.models.User;
//     const count = await User.count({
//       where: {
//         gymId: this.id,
//         role: 'member',
//         membershipStatus: 'active'
//       }
//     });
    
//     this.currentMembers = count;
//     return this.save();
//   }

//   // Instance method to check if gym is open
//   // Static method to find nearby gyms
//   static async findNearby(latitude, longitude, maxDistance = 10) {
//     // Note: For geospatial queries, you'll need PostGIS with PostgreSQL
//     // This is a simplified version for MySQL/other databases
//     return Gym.findAll({
//       where: {
//         isActive: true,
//         verificationStatus: 'verified'
//       },
//       // For proper geospatial queries, consider using PostGIS or similar extensions
//       order: sequelize.literal(`
//         ST_Distance_Sphere(
//           point(${longitude}, ${latitude}),
//           point(\`address\`->'$.longitude', \`address\`->'$.latitude')
//         ) ASC
//       `),
//       limit: 10
//     });
//   }
// }

// Gym.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },

//     // Basic Information
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       validate: {
//         notEmpty: { msg: 'Gym name is required' },
//         len: { args: [1, 100], msg: 'Gym name cannot exceed 100 characters' }
//       }
//     },

//     // Ownership (Foreign Key to GymOwner)
//     ownerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       field: 'owner_id',
//       references: {
//         model: GymOwner,
//         key: 'id'
//       }
//     },

//     // Address Information (Stored as JSON)
//     address: {
//       type: DataTypes.JSON,
//       allowNull: false,
//       defaultValue: {},
//       validate: {
//         isValidAddress(value) {
//           if (!value.street || !value.city || !value.state || !value.zipCode) {
//             throw new Error('Complete address information is required');
//           }
//         }
//       }
//     },

//     // Gym Details
//     currentMembers: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       field: 'current_members'
//     },

//     // Pricing Information (Stored as JSON)
//     pricing: {
//       type: DataTypes.JSON,
//       allowNull: false,
//       defaultValue: {},
//       validate: {
//         isValidPricing(value) {
//           if (!value.monthly || !value.quarterly || !value.yearly) {
//             throw new Error('All pricing fields are required');
//           }
//         }
//       }
//     },

//     // Images and Media (Stored as JSON array)
//     images: {
//       type: DataTypes.JSON,
//       allowNull: true,
//       defaultValue: [],
//       validate: {
//         isValidImages(value) {
//           if (value && !Array.isArray(value)) {
//             throw new Error('Images must be an array');
//           }
//         }
//       }
//     },

//     // Statistics (Stored as JSON)
//     stats: {
//       type: DataTypes.JSON,
//       allowNull: false,
//       defaultValue: {
//         totalCheckins: 0,
//         averageDailyVisits: 0,
//         peakHours: '6:00 PM - 8:00 PM',
//         memberRetentionRate: 0
//       }
//     },

//     // Operating Hours (Stored as JSON)
   

//   },
//   {
//     sequelize,
//     modelName: 'Gym',
//     tableName: 'gyms',
//     underscored: true,
//     timestamps: true,
//     indexes: [
//       { fields: ['name'] },
//       { fields: ['owner_id'] },
//       { fields: ['created_at'] },
//       // For address searching
//       { fields: [{ attribute: 'address', path: '$.city' }] },
//       { fields: [{ attribute: 'address', path: '$.state' }] },
//     ],
//     hooks: {
//       // Before save hook to ensure only one primary image
//       beforeSave: (gym) => {
//         if (gym.images && Array.isArray(gym.images) && gym.images.length > 0) {
//           const primaryImages = gym.images.filter(img => img.isPrimary);
//           if (primaryImages.length > 1) {
//             let foundPrimary = false;
//             gym.images.forEach(img => {
//               if (img.isPrimary && !foundPrimary) {
//                 foundPrimary = true;
//               } else {
//                 img.isPrimary = false;
//               }
//             });
//           }
//         }
//       }
//     }
//   }
// );



// export default Gym;