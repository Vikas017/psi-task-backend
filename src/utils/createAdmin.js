require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created");
    process.exit();
  })
  .catch(err => console.log(err));