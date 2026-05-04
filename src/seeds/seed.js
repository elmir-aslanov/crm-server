import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/Users.js';

dotenv.config();

const seedUsers = [
  { firstName: 'System', lastName: 'Admin', email: 'admin@academy.az', password: 'Admin123!', role: 'Admin' },
  { firstName: 'Sales', lastName: 'Manager', email: 'manager@academy.az', password: 'Manager123!', role: 'Manager' },
  { firstName: 'Regular', lastName: 'User 1', email: 'user1@academy.az', password: 'User12345!', role: 'Student' },
  { firstName: 'Regular', lastName: 'User 2', email: 'user2@academy.az', password: 'User12345!', role: 'Student' },
];

const runSeed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await User.create(seedUsers);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
