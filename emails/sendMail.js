import transporter from "./mailer.js";
import dotenv from 'dotenv'

dotenv.config();

export const sendWelcomeMail = async (user) => {
  try {
    const mailOptions = {
      from: `"The Todo App" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Welcome to The Todo App 🎉",
      html: `
        <h2>Welcome, ${user.name}!</h2>
        <p>Thank you for registering with <b>The Todo App</b>. 
        Start creating and managing your tasks today 🚀</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};