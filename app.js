import express from "express";
const app = express();
import expressSession from "express-session";
import "dotenv/config";

import { prisma } from "./lib/prisma.js";
// Import PrismaSessionStore for Prisma session management (it's not native to Prisma)
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

// Todo add passport configuration
import passport from "passport";

import path from "node:path";
// Todo: create routes in separate files
import indexRouter from "./routes/indexRouter.js"; // Load the main application router

// Configure EJS view engine and directory location
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

// Enable URL-encoded form data parsing (required for login forms)
app.use(express.urlencoded({ extended: true }));

// Configure session storage with PrismaSessionStore
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
