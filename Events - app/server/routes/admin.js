const { validateToken } = require("../middlewares/adminauth");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Admin } = require("../models");

const yup = require("yup");

router.post("/adminregister", async (req, res) => {
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
    let admin = await Admin.findOne({
      where: { email: data.email },
    });
    if (admin) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }
    // Hash password
    data.password = await bcrypt.hash(data.password, 10);
    // Remove confirmPassword from data to avoid storing it
    delete data.confirmPassword;
    // Create user
    let result = await Admin.create(data);
    res.json({
      message: `Email ${result.email} was registered successfully.`,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/adminauth", validateToken, (req, res) => {
  let adminInfo = {
    id: req.admin.id,
    email: req.admin.email,
    name: req.admin.firstName,
    usertype: user.usertype // Include usertype
  };
  res.json({
    admin: adminInfo,
  });
});

module.exports = router;
