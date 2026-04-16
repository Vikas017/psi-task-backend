const User = require("../models/User");

//  GET ALL USERS (for dropdown)
exports.getUsers = async (req, res) => {
  try {
    // only admin should access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find().select("_id email");

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};