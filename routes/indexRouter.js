import express from "express";
const indexRouter = express.Router();
import uploaderControllers from "../controllers/uploaderControllers.js";
import passport from "passport";

// Render login page
indexRouter.get("/", (req, res) => {
  res.render("login");
});

// Render register page
indexRouter.get("/register", (req, res) => {
  res.render("register");
});

indexRouter.post("/register", uploaderControllers.registerUser);

// User login with passport
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/file-viewer",
    failureRedirect: "/",
  }),
);

// User logout with passport
indexRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Render file viewer page
indexRouter.get("/file-viewer", (req, res) => {
  res.render("file-viewer", { name: req.user.name });
});

export default indexRouter;
