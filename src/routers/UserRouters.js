const express = require("express");
const UserRoute = express.Router();

const {
  Register,
  Login,
  GetProfile,
  LogOut,
  updateProfile,
} = require("../controllers/UserController");

UserRoute.get("/test", (req, res) => {
  res.send("This is work :)");
});
UserRoute.post("/register", Register);
UserRoute.post("/login", Login);
UserRoute.delete("/logout", LogOut);
UserRoute.get("/profile/:UserId", GetProfile);
UserRoute.put("/update/:userId", updateProfile);

module.exports = UserRoute;
