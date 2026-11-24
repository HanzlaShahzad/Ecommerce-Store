import nodemailer from "nodemailer";
import getClientUrl from "./clientUrl.js";

export default async function sendEmailVerification(email, token) {
  try {
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");
    const clientUrl = getClientUrl();

    if (!emailUser || !emailPass) {
      throw new Error(
        "Email service is not configured. Set EMAIL_USER and EMAIL_PASS.",
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const verificationUrl = `${clientUrl}/verify-email/${token}`;

    return await transporter.sendMail({
      from: `"MyShop" <${emailUser}>`,

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

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
}