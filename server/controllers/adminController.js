const User = require('../models/User');
const Workout = require('../models/Workout');
const MembershipPlan = require('../models/MembershipPlan');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalMembers, activeMembers, totalPlans, totalWorkouts, recentMembers] =
      await Promise.all([
        User.countDocuments({ role: 'member' }),
        User.countDocuments({ role: 'member', isActive: true }),
        MembershipPlan.countDocuments({ isActive: true }),
        Workout.countDocuments(),
        User.find({ role: 'member' })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('membershipPlan')
          .select('-password'),
      ]);

    res.json({
      totalMembers,
      activeMembers,
      inactiveMembers: totalMembers - activeMembers,
      totalPlans,
      totalWorkouts,
      recentMembers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { role: 'member' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await User.find(filter)
      .populate('membershipPlan')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: 'member' })
      .populate('membershipPlan')
      .select('-password');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const member = await User.create({
      name,
      email,
      password,
      phone,
      age,
      gender,
      role: 'member',
    });

    const populated = await User.findById(member._id).populate('membershipPlan').select('-password');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const allowed = [
      'name',
      'email',
      'phone',
      'age',
      'gender',
      'height',
      'weight',
      'isActive',
      'membershipPlan',
      'membershipStart',
      'membershipExpiry',
    ];

    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const member = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'member' },
      updates,
      { new: true, runValidators: true }
    )
      .populate('membershipPlan')
      .select('-password');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await User.findOneAndDelete({ _id: req.params.id, role: 'member' });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Workout.deleteMany({ user: member._id });

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
