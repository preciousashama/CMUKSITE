import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or any email service you use
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendVerificationEmail(email, code) {
  const url = `${process.env.NEXTAUTH_URL}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your email',
    html: `
      <p>Thanks for signing up! Please verify your email by clicking the link below:</p>
      <a href="${url}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}
