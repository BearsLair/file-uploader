import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

async function registerUser(req, res) {
  try {
    // Check if username already exists
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      return res.render("register", {
        error: "Username already exists",
      });
    }

    // No Error? Continue.
    const { username, password } = req.body;
    // Insert user into database
    await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.render("login");
  } catch (error) {
    console.error(error);
    res.render("register", {
      error: "An error occurred while registering the user",
    });
  }
}

export default {
  registerUser,
};
