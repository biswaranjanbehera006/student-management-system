const nodemailer = require("nodemailer");

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("SMTP credentials are missing.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"Student Management System" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Verify Your Email - Student Management System",
    text: `Hello ${name},

Your verification OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not create an account, please ignore this email.

Regards,
Student Management System`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
        
        <h2 style="margin-bottom: 10px;">
          Verify Your Email
        </h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          Thank you for registering with Student Management System.
          Please use the OTP below to verify your email address.
        </p>

        <div style="margin: 25px 0; text-align: center;">
          <span style="
            display: inline-block;
            padding: 15px 30px;
            background: #f3f4f6;
            border-radius: 10px;
            font-size: 30px;
            font-weight: bold;
            letter-spacing: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color: #6b7280; font-size: 13px;">
          If you did not create this account, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

        <p style="color: #6b7280; font-size: 12px;">
          Student Management System
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
};