const nodemailer = require("nodemailer");

const sendVerificationEmail = async (emailId, token) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Change the link to point to the frontend verification page
      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailId,
        subject: "Verify Your Email",
        html: `<h2>Click the link below to verify your email:</h2>
               <a href="${verificationLink}">${verificationLink}</a>
               <p>This link will expire in 24 hours.</p>`
      };

      await transporter.sendMail(mailOptions);
      console.log("Verification email sent successfully!");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
};

module.exports = sendVerificationEmail;