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
    console.log('✓ MongoDB connected');

    await User.deleteMany({});
    console.log('✓ Existing users cleared');

    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save(); // triggers pre-save bcrypt hook
      console.log(`✓ User created: ${user.email} (${user.role})`);
    }

    console.log('✓ Seed completed successfully');
    console.log('');
    console.log('Login credentials:');
    console.log('  Admin   → admin@academy.az   / Admin123!');
    console.log('  Manager → manager@academy.az / Manager123!');
    process.exit(0);
  } catch (error) {
    console.error(`✗ Seed failed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
