import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,   // e.g., smtp.gmail.com / smtp.mail.yahoo.com / smtp.office365.com
  port: process.env.MAIL_PORT,   // usually 465 (secure) or 587 (TLS)
  secure: process.env.MAIL_SECURE === "true", // true if using port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App password (Gmail/Yahoo/Outlook)
  },
});

export default transporter;