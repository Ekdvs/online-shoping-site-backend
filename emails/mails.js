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
