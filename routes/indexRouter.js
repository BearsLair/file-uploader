import express from "express";
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.render("login");
});

indexRouter.get("/register", (req, res) => {
  res.render("register");
});

export default indexRouter;
