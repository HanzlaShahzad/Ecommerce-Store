import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendEmailVerification(email, token) {
  try {
    const verificationUrl = `${process.env.CLIENT_URL.trim()}/verify-email/${token}`;

    console.log("=================================");
    console.log("SENDING EMAIL");
    console.log("FROM:", process.env.EMAIL_USER);
    console.log("TO:", email);
    console.log("=================================");

    const info = await transporter.sendMail({
      from: `"MyShop" <${process.env.EMAIL_USER}>`,

      // IMPORTANT: This is the signup user's email
      to: email,

      subject: "Verify Your Email - MyShop",

      // Plain text version
      text: `Welcome to MyShop!

Thank you for creating your account.

Please verify your email by opening this link:

${verificationUrl}

This verification link will expire in 15 minutes.`,

      // HTML version
      html: `
        <div style="
          max-width:600px;
          margin:auto;
          padding:30px;
          font-family:Arial,sans-serif;
          text-align:center;
          border:1px solid #eee;
          border-radius:12px;
        ">

          <h1>Welcome to MyShop!</h1>

          <p>
            Thank you for creating your account.
          </p>

          <p>
            Please verify your email address by clicking
            the button below.
          </p>

          <a
            href="${verificationUrl}"
            style="
              display:inline-block;
              padding:14px 25px;
              background:#000;
              color:#fff;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
              margin-top:15px;
            "
          >
            Verify Email
          </a>

          <p style="
            margin-top:25px;
            color:#666;
            font-size:13px;
          ">
            This verification link will expire in 15 minutes.
          </p>

        </div>
      `,
    });

    console.log("=================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("FROM:", process.env.EMAIL_USER);
    console.log("TO:", email);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Message ID:", info.messageId);
    console.log("=================================");

    return info;
  } catch (error) {
    console.log("EMAIL SENDING ERROR:", error);
    throw error;
  }
}