//send welcome message
export const welcomeEmailTemplate = (user,url) => {
  return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Welcome to Your App Name</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin:0; padding:0;}
            .container { max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); }
            .header { background-color: #007BFF; color: #fff; text-align:center; padding:25px 20px; font-size:28px; font-weight:bold; }
            .body { padding:30px 20px; color:#333; text-align:center; }
            .body h1 { color:#007BFF; margin-bottom:15px; }
            .body p { font-size:16px; line-height:1.6; margin:15px 0; }
            .button { display:inline-block; margin-top:20px; padding:12px 25px; background-color:#28a745; color:#fff; text-decoration:none; border-radius:50px; font-weight:bold; font-size:16px; }
            .footer { background-color:#f0f2f5; color:#888; text-align:center; padding:20px; font-size:14px; }
            @media only screen and (max-width: 600px) {
              .container { margin: 20px; }
              .header { font-size:24px; }
              .body h1 { font-size:24px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              Welcome to Your App Name
            </div>
            <div class="body">
              <h1>Hello, ${user.name}!</h1>
              <p>We’re thrilled to have you on board. Your journey with <strong>Your App Name</strong> starts here!</p>
              <p>Get ready to explore all the features and make the most out of your experience.</p>
              <a href="${url}" class="button">verify email</a>
              <p style="margin-top:25px;">If you have any questions, feel free to reply to this email. We’re always here to help.</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.<br/>
              123 Your Street, Your City, Country
            </div>
          </div>
        </body>
        </html>
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
        Online Shooping Center
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
        &copy; ${new Date().getFullYear()} Online Shooping Center. All rights reserved.
      </div>
    </div>
  </body>
  </html>`
}


