const router = require("express").Router();

const { getUsers } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getUsers);

module.exports = router;