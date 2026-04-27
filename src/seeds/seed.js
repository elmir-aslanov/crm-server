import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/Users.js';

dotenv.config();

const seedUsers = [
  { name: 'System Admin', email: 'admin@academy.az', password: 'Admin123!', role: 'admin' },
  { name: 'Sales Manager', email: 'manager@academy.az', password: 'Manager123!', role: 'manager' },
  { name: 'Regular User 1', email: 'user1@academy.az', password: 'User12345!', role: 'user' },
  { name: 'Regular User 2', email: 'user2@academy.az', password: 'User12345!', role: 'user' },
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
