import transporter from "../mailer.js";
import { couponEmailTemplate, orderStatusTemplate, otpEmailTemplate, welcomeEmailTemplate } from "./mails.js";



export const sendWelcomeEmail = async (user,verifyurl) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to My App 🎉",
      html: welcomeEmailTemplate(user,verifyurl), // 🔥 Import template
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
      subject: "Password responseet OTP",
      html: otpEmailTemplate(user,otp), // 🔥 Import template
    });
    console.log("✅ otp email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

export const sendPromotional = async (emailList,subject, message) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: emailList,
      subject: subject,
      html: message, 
    });
    console.log("✅ otp email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

export const sendCoupon = async (emailList, username, coupon) => {
  try {
    await  transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: emailList,
      subject: "We have a special coupon just for you!",
      html: couponEmailTemplate(username, coupon), // 🔥 Import template
    });
    console.log("✅ coupon email sent successfully!");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

// Send order update email
export const sendOrderUpdate = async (email, username, order) => {
  try {
    await transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Update - ${order._id}`,
      html: orderStatusTemplate(username, order),
    });
    console.log(`✅ Order update email sent to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send order email to ${email}:`, err);
  }
};