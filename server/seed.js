require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const MembershipPlan = require('./models/MembershipPlan');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await MembershipPlan.deleteMany({});

  const plans = await MembershipPlan.insertMany([
    {
      name: 'Basic',
      description: 'Perfect for beginners starting their fitness journey.',
      price: 1500,
      durationDays: 30,
      features: ['Gym access', 'Locker room', 'Basic equipment'],
    },
    {
      name: 'Standard',
      description: 'Most popular plan with extended access and amenities.',
      price: 2500,
      durationDays: 30,
      features: ['Gym access', 'Locker room', 'All equipment', 'Group classes'],
    },
    {
      name: 'Premium',
      description: 'Full access with premium facilities and priority support.',
      price: 4000,
      durationDays: 30,
      features: ['24/7 gym access', 'Sauna & steam', 'All classes', 'Nutrition guide'],
    },
  ]);

  await User.create({
    name: 'Admin User',
    email: 'admin@gym.com',
    password: 'admin123',
    role: 'admin',
    phone: '01700000000',
  });

  const start = new Date();
  const expiry = new Date(start);
  expiry.setDate(expiry.getDate() + plans[1].durationDays);

  await User.create({
    name: 'Demo Member',
    email: 'member@gym.com',
    password: 'member123',
    role: 'member',
    phone: '01800000000',
    age: 22,
    gender: 'male',
    height: 175,
    weight: 70,
    membershipPlan: plans[1]._id,
    membershipStart: start,
    membershipExpiry: expiry,
  });

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@gym.com / admin123');
  console.log('Member login: member@gym.com / member123');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
