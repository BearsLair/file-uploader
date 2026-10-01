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
    // Set the max age of the session cookie in milliseconds (7 days)
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    // Secret used to sign the session ID cookie
    secret: process.env.SESSION_SECRET,
    // Resave the session to the store, even if the session was not modified
    resave: true,
    // Save the session to the store, even if the session is new
    saveUninitialized: true,
    // Configure session storage with PrismaSessionStore
    store: new PrismaSessionStore(prisma, {
      // Periodically check the store for stale sessions in milliseconds (2 minutes)
      checkPeriod: 2 * 60 * 1000,
      // Use the session ID as the record ID in the database
      dbRecordIdIsSessionId: true,
      // Function to generate a custom session ID from the session data (undefined = default)
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
