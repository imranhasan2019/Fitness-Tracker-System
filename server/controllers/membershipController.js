const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');

exports.getPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: 'Membership plan not found' });
    }

    const start = new Date();
    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + plan.durationDays);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        membershipPlan: plan._id,
        membershipStart: start,
        membershipExpiry: expiry,
      },
      { new: true }
    ).populate('membershipPlan');

    res.json({
      message: `Subscribed to ${plan.name} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        membershipPlan: user.membershipPlan,
        membershipStart: user.membershipStart,
        membershipExpiry: user.membershipExpiry,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
