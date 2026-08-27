const User = require('../models/User');

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  age: user.age,
  gender: user.gender,
  height: user.height,
  weight: user.weight,
  membershipPlan: user.membershipPlan,
  membershipStart: user.membershipStart,
  membershipExpiry: user.membershipExpiry,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('membershipPlan');
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'age', 'gender', 'height', 'weight'];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).populate('membershipPlan');

    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculateBMI = async (req, res) => {
  try {
    const height = req.body.height ?? req.user.height;
    const weight = req.body.weight ?? req.user.weight;

    if (!height || !weight) {
      return res.status(400).json({ message: 'Height and weight are required' });
    }

    const heightM = height / 100;
    const bmi = Number((weight / (heightM * heightM)).toFixed(1));

    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';

    if (req.body.saveToProfile) {
      await User.findByIdAndUpdate(req.user._id, { height, weight });
    }

    res.json({ bmi, category, height, weight });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
