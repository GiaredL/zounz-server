import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors";
import { userRoutes, sessionRoutes } from "./routes/index.js";
import {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
} from "./config.js";
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const app = express();

    app.disable("x-powered-by");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/uploads", express.static("uploads"));

    // Configure CORS
    const corsOptions = {
      origin:
        NODE_ENV === "production"
          ? [
              "http://d15xwmpj8a8ch7.cloudfront.net",
              "https://d15xwmpj8a8ch7.cloudfront.net",
              "http://54.241.113.130:5000",
              "https://54.241.113.130:5000",
              "http://localhost:5173",
              "http://localhost:5174",
              "http://localhost:3000",
              "http://localhost",
            ]
          : [
              "http://localhost:5173",
              "http://localhost:5174",
              "http://localhost:3000",
              "http://localhost",
            ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    app.use(cors(corsOptions));

    app.use(
      session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          collectionName: "sessions",
          ttl: parseInt(SESS_LIFETIME) / 1000,
        }),
        cookie: {
          sameSite: NODE_ENV === "production" ? "none" : "lax",
          secure: NODE_ENV === "production",
          maxAge: parseInt(SESS_LIFETIME),
        },
      })
    );

    app.use("/api/users", userRoutes);
    app.use("/api/session", sessionRoutes);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
