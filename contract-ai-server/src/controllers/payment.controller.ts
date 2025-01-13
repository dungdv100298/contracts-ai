import { Request, Response } from "express";
import Stripe from "stripe";
import User, { IUser } from "../models/user.model";
import { sendPremiumConfirmationEmail } from "../services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export const createCheckOutSession = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lifetime Subscription",
            },
            unit_amount: 1000, // $10
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      client_reference_id: user._id?.toString() || "",
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create charge" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(error);
    res.status(400).send(`Webhook error: ${error.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    if (userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        { isPremium: true },
        { new: true }
      );
      console.log(`User ${userId} upgraded to premium`);
      console.log(user);
      if (user && user.email) {
        await sendPremiumConfirmationEmail(user.email, user.displayName);
      }
    }
  }
  res.status(200).json({ message: "Webhook received" });
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.isPremium) {
    res.json({ status: "active" });
  } else {
    res.json({ status: "inactive" });
  }
};
