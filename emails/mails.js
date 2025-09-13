// emailTemplates.js
export const generateEmailHeader = () => `
  <div style="
    background-color: #007BFF;
    color: #fff;
    text-align: center;
    padding: 25px 20px;
    font-size: 28px;
    font-weight: bold;
  ">
    Online Shopping Center
  </div>
`;

export const generateEmailFooter = () => `
  <div style="
    background-color: #f0f2f5;
    color: #888888;
    text-align: center;
    padding: 20px;
    font-size: 14px;
  ">
    &copy; ${new Date().getFullYear()} Online Shopping Center. All rights responseerved.<br/>
    123 Your Street, Your City, Country
  </div>
`;

// Welcome email
export const welcomeEmailTemplate = (user, url) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Welcome to Online Shopping Center</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f7;">
  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    ${generateEmailHeader()}
    <div style="padding:30px 20px; color:#333; text-align:center;">
      <h1 style="color:#007BFF; margin-bottom:15px;">Hello, ${user.name}!</h1>
      <p>We’re thrilled to have you on board. Your journey with <strong>Online Shopping Center</strong> starts here!</p>
      <p>Get ready to explore all the featuresponse and make the most out of your experience.</p>
      <a href="${url}" style="display:inline-block; margin-top:20px; padding:12px 25px; background-color:#28a745; color:#fff; text-decoration:none; border-radius:50px; font-weight:bold;">Verify Email</a>
      <p style="margin-top:25px;">If you have any questions, feel free to reply to this email. We’re always here to help.</p>
    </div>
    ${generateEmailFooter()}
  </div>
</body>
</html>
`;

// OTP email
export const otpEmailTemplate = (user, otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Password responseet OTP</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f2f5;">
  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    ${generateEmailHeader()}
    <div style="padding:30px 20px; text-align:center; color:#333;">
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You requseted a password responseet. Your One-Time Password (OTP) is:</p>
      <h2 style="font-size:36px; color:#007BFF; margin:20px 0;">${otp}</h2>
      <p>This OTP will expire in <strong>5 minutes</strong>. Please use it promptly to responseet your password.</p>
      <a href="#" style="display:inline-block; margin-top:25px; padding:12px 25px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:50px; font-weight:bold;">responseet Password</a>
    </div>
    ${generateEmailFooter()}
  </div>
</body>
</html>
`;

// Coupon email
export const couponEmailTemplate = (userName, coupon) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Your Special Coupon</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f2f5;">
  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    ${generateEmailHeader()}
    <div style="padding:30px 20px; text-align:center; color:#333;">
      <p>Hello <strong>${userName}</strong>,</p>
      <p>We have a special coupon just for you!</p>
      <h2 style="font-size:28px; color:#007BFF; margin:20px 0;">${coupon.code}</h2>
      <p>Get <strong>${coupon.discountPercent}% off</strong> on your next purchase.</p>
      <p>Expiresponse on: <strong>${coupon.expiryDate.toDateString()}</strong></p>
      <a href="${process.env.FRONTEND_URL}" style="display:inline-block; margin-top:25px; padding:12px 25px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:50px; font-weight:bold;">Shop Now</a>
    </div>
    ${generateEmailFooter()}
  </div>
</body>
</html>
`;

// Order status email
export const orderStatusTemplate = (userName, order) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Order Update</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f0f2f5;">
  <div style="max-width:600px; margin:40px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
    ${generateEmailHeader()}
    <div style="padding:30px 20px; text-align:center; color:#333;">
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your order <strong>${order._id}</strong> has been updated:</p>
      <p><strong>Payment Status:</strong> ${order.payment_status}</p>
      <p><strong>Delivery Status:</strong> ${order.delivery_status}</p>
      <a href="${process.env.FRONTEND_URL}/orders/${order._id}" style="display:inline-block; margin-top:25px; padding:12px 25px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:50px; font-weight:bold;">View Order</a>
    </div>
    ${generateEmailFooter()}
  </div>
</body>
</html>
`;
//payment suess full template
export const paymentSuccessSimpleTemplate = (order, payment) => {
  const address = order.delivery_address;

  // Email header
  const header = `
    <div style="
      background-color: #007BFF;
      color: #fff;
      text-align: center;
      padding: 25px 20px;
      font-size: 28px;
      font-weight: bold;
    ">
      Online Shopping Center
    </div>
  `;

  // Email footer
  const footer = `
    <div style="
      background-color: #f0f2f5;
      color: #888888;
      text-align: center;
      padding: 20px;
      font-size: 14px;
    ">
      &copy; ${new Date().getFullYear()} Online Shopping Center. All rights reserved.<br/>
      123 Your Street, Your City, Country
    </div>
  `;

  // Main email content
  const body = `
    <div style="
        font-family: Arial, sans-serif; 
        color: #333; 
        line-height: 1.6; 
        background-color: #f7f7f7; 
        padding: 30px 20px;
      ">
      
      <div style="
          max-width: 600px; 
          margin: auto; 
          background-color: #ffffff; 
          padding: 20px; 
          border-radius: 8px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        <h2 style="color: #007BFF; text-align: center;">Hello ${order.userId.name},</h2>
        <p style="text-align: center; font-size: 16px;">We're thrilled to let you know that your payment has been successfully received!</p>

        <h3 style="border-bottom: 2px solid #007BFF; padding-bottom: 5px;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total Amount:</strong> LKR ${order.totalAmt}</p>
        <p><strong>Delivery Address:</strong><br/>
           ${address.address_line}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}
        </p>

        <p><strong>Payment Receipt:</strong><br/>
           <a href="${payment.receipt_url}" target="_blank" rel="noopener noreferrer" 
              style="color: #ffffff; background-color: #007BFF; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Receipt
           </a>
        </p>

        <p style="font-size: 16px; color: #555;">Thank you for shopping with us! If you have any questions, feel free to reply to this email.</p>

        <p style="font-size: 16px; color: #555; text-align: center;">Happy Shopping!<br/><strong>Your Online Shopping Team</strong></p>
      </div>
    </div>
  `;

  // Combine header, body, and footer
  return `${header}${body}${footer}`;
};

