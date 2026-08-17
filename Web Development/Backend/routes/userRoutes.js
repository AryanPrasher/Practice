const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, getUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;
