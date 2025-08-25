import transporter from "../mailer.js";
import { otpEmailTemplate, welcomeEmailTemplate } from "./mails.js";


export const sendWelcomeEmail = async (user) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to My App 🎉",
      html: welcomeEmailTemplate(user), // 🔥 Import template
    });
    console.log("✅ Welcome email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

export const sendOtp = async (user,otp) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: otpEmailTemplate(user,otp), // 🔥 Import template
    });
    console.log("✅ otp email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
