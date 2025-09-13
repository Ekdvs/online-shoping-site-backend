import transporter from "../mailer.js";
import { couponEmailTemplate,  otpEmailTemplate, paymentSuccessSimpleTemplate, welcomeEmailTemplate } from "./mails.js";



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

export const sendPaymentSuccess = async (order, payment) => {
  try {
    await transporter.sendMail({
      from: `"Online Shopping" <${process.env.EMAIL_USER}>`,
      to: order.userId.email,
      subject: "Payment Successful - Order Details",
      html: paymentSuccessSimpleTemplate(order, payment), // pass both
    });
    console.log("✅ Payment success email sent to:", order.userId.email);
  } catch (err) {
    console.error(`❌ Failed to send payment email to ${order.userId.email}:`, err);
  }
};


