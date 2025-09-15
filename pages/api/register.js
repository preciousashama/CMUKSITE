import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import cors from '../../lib/cors';
import { sendEmail } from '../../lib/mail';
import { generateVerificationCode } from '../../lib/generateCode';

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        verificationCode,
        codeExpires,
        emailVerified: false,
      },
    });

    await sendEmail({
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p><p>It will expire in 15 minutes.</p>`,
    });

    res.status(201).json({ message: 'User created, verification email sent' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
    
  }
}
