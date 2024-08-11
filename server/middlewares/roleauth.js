// middlewares/roleAuth.js

const { User } = require('../models');

// Middleware to check if the user is a volunteer
const isVolunteer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user && user.usertype === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Only volunteers can access this resource.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if the user is a staff
const isStaff = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user && user.usertype === 'staff') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Only staff can access this resource.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { isVolunteer, isStaff };
