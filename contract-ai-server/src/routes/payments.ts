import { Router } from "express";
import { createCheckOutSession, getPremiumStatus } from "../controllers/payment.controller";
import { handleErrors } from "../middleware/errors";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/create-checkout-session", isAuthenticated, handleErrors(createCheckOutSession));
router.get("/membership-status", isAuthenticated, handleErrors(getPremiumStatus));

export default router;

