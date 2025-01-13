import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = new Resend(RESEND_API_KEY);

export const sendPremiumConfirmationEmail = async (
  userEmail: string,
  userName: string
) => {
  try {
    console.log("Attempting to send email to:", userEmail);
    console.log("Using API key:", RESEND_API_KEY ? "API key exists" : "No API key found");
    
    const result = await resend.emails.send({
      from: "Contract AI <onboarding@resend.dev>",
      to: userEmail,
      subject: "Welcome to Premium",
      html: `<p>Hi ${userName},</p><p>Welcome to Premium. You're now a Premium user!</p>`,
    });
    
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error; // Re-throw để có thể xử lý ở tầng trên
  }
};