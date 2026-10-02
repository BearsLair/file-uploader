import express from "express";
const indexRouter = express.Router();
import uploaderControllers from "../controllers/uploaderControllers.js";

indexRouter.get("/", (req, res) => {
  res.render("login");
});

indexRouter.get("/register", (req, res) => {
  res.render("register");
});

indexRouter.post("/register", uploaderControllers.registerUser);

export default indexRouter;
