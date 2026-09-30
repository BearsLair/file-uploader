import express from "express";
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.render("login");
});

export default indexRouter;
