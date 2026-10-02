import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

async function registerUser(req, res) {
  console.log("Username: ", req.body.username);
  try {
    // Check if username already exists
    const user = await prisma.user.findUnique({
      where: {
        name: req.body.username,
      },
    });
    if (user) {
      console.log("User already exists");
      return res.render("register", {
        error: "Username already exists",
      });
    }

    // No Error? Continue.
    const { username, password } = req.body;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
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
