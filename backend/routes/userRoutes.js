const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); //Both ways
router.post("/login", authUser); //We can write
//router.route("/").get(allUsers); as this route is already in use above

module.exports = router;
