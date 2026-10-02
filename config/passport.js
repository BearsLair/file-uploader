import passport from "passport"; // Import Passport middleware to manage authentication strategies
import LocalStrategy from "passport-local"; // Import the local strategy (username/password) instead of OAuth or JWT
import bcrypt from "bcryptjs"; // Import hashing library for secure password comparison
import { prisma } from "../lib/prisma.js";

/**
 * Rationale: This defines the authentication logic using the LocalStrategy.
 * It tells Passport how to verify a user's credentials against the database before granting access.
 */
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Query with Prisma the database for the specific user based on the provided username.
      const user = await prisma.user.findUnique({
        where: {
          name: username,
        },
      });

      if (!user) {
        // Rationale: If no user is found with this username, we return a failure signal.
        // Passing an object `{ message: "Incorrect username" }` allows Passport to pass this
        // error object back to the view layer so the frontend can display a custom error message
        // instead of a generic 401/403 response.
        return done(null, false, { message: "Incorrect username" });
      }

      // Compare the provided password with the hashed password stored in the database using bcrypt.
      // This ensures we are comparing hashes against hashes, not plain text.
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        // If the hash doesn't match (wrong password), return a failure signal.
        // Similar to above, this allows the frontend to display "Incorrect password".
        return done(null, false, { message: "Incorrect password" });
      }

      // SUCCESS: Credentials are valid. Return the full user object so Passport can attach it
      // to the request context (req.user) for subsequent routes and views.
      return done(null, { id: user.id, name: user.name });
    } catch (error) {
      // Rationale: Catch any database errors or unexpected exceptions during authentication.
      // Passing `done(error)` stops the flow and triggers Passport's error handling middleware
      // to log the issue securely without exposing internal DB details to the client.
      return done(error);
    }
  }),
);

/**
 * Rationale: This function defines how Passport should serialize (store) a user object into the session store.
 * Storing the entire `user` object here is inefficient for large datasets; instead, we only save
 * the unique database ID (`id`). The actual data will be fetched back when needed via deserializeUser.
 */
passport.serializeUser((user, done) => done(null, user.id));

/**
 * Rationale: This function defines how Passport should deserialize (retrieve) a user object from the session store.
 * When a request comes in with a valid session ID, Passport calls this to fetch the full user details
 * (like name, permissions, etc.) back into memory so they can be attached to `req.user`.
 */
passport.deserializeUser(async (id, done) => {
  try {
    // Query with Prisma the userinfo table to retrieve specific profile fields needed for the application.
    // We select only necessary columns (firstname, lastname, member status, admin status, usersid)
    // rather than fetching the entire row to optimize performance.
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    done(null, user ? { id: user.id, name: user.name } : null); // Return the populated user object to Passport so it attaches it to req.user
  } catch (err) {
    // If the session ID is invalid or the user data cannot be found in the database,
    // we pass the error. This typically results in the user being logged out or redirected to login.
    done(err);
  }
});
