const { validateToken } = require("../middlewares/userauth");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

const yup = require("yup");

router.post("/register", async (req, res) => {
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
    name: user.firstName,
    lname:user.lastName,
    password: user.password,
    birthday: user.birthday,
    gender: user.gender,
    usertype: user.usertype // Include usertype
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
    name: req.user.firstName,
    lname: req.user.lastName,
    password: req.user.password,
    birthday: req.user.birthday,
    gender: user.gender,
    usertype: req.user.usertype // Include usertype
  };
  res.json({
    user: userInfo,
  });
});

router.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    let data = req.body;
  
    try {
      // Validate input data
      data = await updateSchema.validate(data, { abortEarly: false });
  
      // Hash password if provided
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
  
      // Update user in the database
      const updatedUser = await User.update(data, {
        where: { id: id },
      });
  
      if (updatedUser[0] === 1) {
        res.json({ message: `Staff member with ID ${id} updated successfully.` });
      } else {
        res.status(404).json({ message: `Staff member with ID ${id} not found.` });
      }
    } catch (err) {
      res.status(400).json({ errors: err.errors });
    }
  });


module.exports = router;