import transporter from "../mailer.js";
import { welcomeEmailTemplate } from "./mails.js";


export const sendWelcomeEmail = async (user) => {
  try {
    await  transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to My App 🎉",
      html: welcomeEmailTemplate(user), // 🔥 Import template
    });
    console.log("✅ Welcome email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};
