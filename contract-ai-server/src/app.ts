import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./config/passport";

// ROUTES
import authRoutes from "./routes/auth";
import contractsRoutes from "./routes/contracts";
import paymentsRoutes from "./routes/payments";
import { handleWebhook } from "./controllers/payment.controller";

const app = express();


mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(helmet());
app.use(morgan("dev"));

app.post("/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
 );

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/contracts", contractsRoutes);
app.use("/payments", paymentsRoutes);

const PORT = process.env.PORT || '8080';

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
