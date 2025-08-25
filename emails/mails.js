//send welcome message
export const welcomeEmailTemplate = (user) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4CAF50;">Welcome, ${user.name}!</h2>
      <p>Thank you for signing up for <b>My App</b>. 🚀</p>
      <p>Click the button below to verify your email:</p>
      <a href="" 
         style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Verify Email
      </a>
    </div>
  `;
};

//send otp
export const otpEmailTemplate=(user,otp)=>{
  return`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Password Reset OTP</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f0f2f5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        border-top: 5px solid #007BFF;
      }
      .header {
        background-color: #007BFF;
        color: #ffffff;
        text-align: center;
        padding: 20px 0;
        font-size: 24px;
        font-weight: bold;
      }
      .body {
        padding: 30px 20px;
        text-align: center;
        color: #333333;
      }
      .body h2 {
        font-size: 36px;
        color: #007BFF;
        margin: 20px 0;
      }
      .body p {
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 25px;
        background-color: #007BFF;
        color: #ffffff;
        text-decoration: none;
        border-radius: 50px;
        font-weight: bold;
      }
      .footer {
        background-color: #f0f2f5;
        color: #888888;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      @media (max-width: 600px) {
        .body h2 {
          font-size: 28px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Your App Name
      </div>
      <div class="body">
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested a password reset. Your One-Time Password (OTP) is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in <strong>5 minutes</strong>. Please use it promptly to reset your password.</p>
        <a href="#" class="button">Reset Password</a>
      </div>
      <div class="footer">
        If you did not request this email, you can safely ignore it.<br/>
        &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.
      </div>
    </div>
  </body>
  </html>`
}


