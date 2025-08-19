import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true", 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }

});

export default transporter;