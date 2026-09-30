import express from "express";
import expressSession from "express-session";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

// Todo add passport configuration
import passport from "passport";

import path from "node:path";
// Todo: create routes in separate files
import indexRouter from "./routes/indexRouter.js"; // Load the main application router

// Configure EJS view engine and directory location
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Enable URL-encoded form data parsing (required for login forms)
app.use(express.urlencoded({ extended: true }));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
