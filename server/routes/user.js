const { validateToken } = require("../middlewares/userauth");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

const yup = require("yup");

router.post("/  ", async (req, res) => {
  let data = req.body;
  let validationSchema = yup.object({
    firstName: yup
      .string()
      .trim()
      .min(3)
      .max(25)
      .required()
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "name only allow letters, spaces and characters: ' - , ."
      ),
    lastName: yup
      .string()
      .trim()
      .min(3)
      .max(25)
      .required()
      .matches(
        /^[a-zA-Z '-,.]+$/,
        "name only allow letters, spaces and characters: ' - , ."
      ),
    email: yup.string().trim().lowercase().email().max(50).required(),
    gender: yup.string().oneOf(["Male", "Female"]).required(),
    birthday: yup.date().max(new Date()).required(),
    password: yup
      .string()
      .trim()
      .min(8)
      .max(50)
      .required()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "password at least 1 letter and 1 number"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
        "password at least 1 letter and 1 number"
      ),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Check email
    let user = await User.findOne({
      where: { email: data.email },
    });
    if (user) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }
    // Hash password
    data.password = await bcrypt.hash(data.password, 10);
    // Remove confirmPassword from data to avoid storing it
    delete data.confirmPassword;
    // Create user
    let result = await User.create(data);
    res.json({
      message: `Email ${result.email} was registered successfully.`,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.post("/login", async (req, res) => {
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    email: yup.string().trim().lowercase().email().max(50).required(),
    password: yup.string().trim().min(8).max(50).required(),
  });
  // Check email and password
  let errorMsg = "Email or password is not correct.";
  let user = await User.findOne({
    where: { email: data.email },
  });
  if (!user) {
    res.status(400).json({ message: errorMsg });
    return;
  }
  let match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    res.status(400).json({ message: errorMsg });
    return;
  }

  // Return user info
  let userInfo = {
    pfp: user.pfp,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
    birthday: user.birthday,
    gender: user.gender,
    usertype: user.usertype, // Include usertype
    points: user.points,
  };
  let accessToken = sign(userInfo, process.env.APP_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  res.json({
    accessToken: accessToken,
    user: userInfo,
  });
});

router.get("/userauth", validateToken, (req, res) => {
  let userInfo = {
    pfp: req.user.pfp,
    id: req.user.id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    password: req.user.password,
    birthday: req.user.birthday,
    gender: req.user.gender,
    usertype: req.user.usertype, // Include usertype
    points: req.user.points,
  };
  res.json({
    user: userInfo,
  });
});

router.get("/userInfo", validateToken, async (req, res) => {
  try {
    // Retrieve the user's information from the database using the user ID from the token
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: [] // Exclude the password from the response
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user info
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Validation schema for user update
const updateSchema = yup.object({
  firstName: yup.string().trim().min(3).max(25).matches(/^[a-zA-Z '-,.]+$/, "Invalid first name"),
  lastName: yup.string().trim().min(3).max(25).matches(/^[a-zA-Z '-,.]+$/, "Invalid last name"),
  email: yup.string().trim().lowercase().email().max(50),
  gender: yup.string().oneOf(["Male", "Female"]),
  birthday: yup.date().max(new Date()),
  password: yup.string().trim().min(8).max(50).matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
});

router.put("/userInfo/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  let data = req.body;

  console.log("Received data:", data); // Log the received data

  try {
    data = await updateSchema.validate(data, { abortEarly: false });

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Remove password if it was not updated (empty string)
    if (!data.password) {
      delete data.password;
    }

    // Update user in the database
    const updatedUser = await User.update(data, { where: { id } });

    if (updatedUser[0] === 1) {
      const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
      res.json(user);
    } else {
      res.status(404).json({ message: `User with ID ${id} not found. ` });
    }
  } catch (err) {
    console.error("Validation error:", err); // Log validation errors
    res.status(400).json({ errors: err.errors });
  }
});

router.delete("/userInfo/:id", validateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    res.json({ message: `User with ID ${id} has been deleted successfully.` });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/allUsers", validateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get top 20 users by points
router.get("/top20Users", validateToken, async (req, res) => {
  try {
    // Fetch all users, excluding staff
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: { usertype: 'user' } // Assuming 'usertype' field distinguishes between users and staff
    });

    // Sort users by points in descending order and limit to top 20
    const sortedUsers = users.sort((a, b) => b.points - a.points).slice(0, 20);

    res.json(sortedUsers);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;