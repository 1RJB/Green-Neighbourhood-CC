const { validateToken } = require("../middlewares/staffauth");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Staff } = require("../models");

const yup = require("yup");

router.post("/staffregister", async (req, res) => {
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
    let staff = await Staff.findOne({
      where: { email: data.email },
    });
    if (staff) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }
    // Hash password
    data.password = await bcrypt.hash(data.password, 10);
    // Remove confirmPassword from data to avoid storing it
    delete data.confirmPassword;
    // Create user
    let result = await Staff.create(data);
    res.json({
      message: `Email ${result.email} was registered successfully.`,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/staffauth", validateToken, (req, res) => {
  let staffInfo = {
    id: req.staff.id,
    email: req.staff.email,
    name: req.staff.firstName,
    usertype: user.usertype // Include usertype
  };
  res.json({
    staff: staffInfo,
  });
});

module.exports = router;
