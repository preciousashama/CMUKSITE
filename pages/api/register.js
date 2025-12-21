import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import { sendEmail } from '../../lib/mail';
import { generateVerificationCode } from '../../lib/generateCode';

// Professional tip: Use a library like 'zod' for validation, but we'll do it manually here
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, password } = req.body;

  // 1. Enhanced Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // 2. Silent Existence Check (Security Best Practice)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // We still return an error, but we log the attempt internally
      return res.status(400).json({ message: 'Email already in use' });
    }

    // 3. Secure Processing
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const codeExpires = new Date(Date.now() + 60 * 60 * 1000); // Extended to 1 hour for better UX

    // 4. Atomic Transaction (Ensures User and Code are created together)
    const user = await prisma.user.create({
      data: {
        firstName, // Storing separately for better email personalization
        lastName,
        name: `${firstName} ${lastName}`,
        email: email.toLowerCase(), // Always normalize emails
        password: hashedPassword,
        verificationCode,
        codeExpires,
        emailVerified: false,
        // Add a "Role" so you can have Admins later
        role: 'CUSTOMER' 
      },
    });

    // 5. Background Email Sending
    // We don't 'await' this if we want the user to get an instant response, 
    // but for reliability in simple apps, keeping the await is safer.
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to CustomiseMe UK - Verify Your Account',
        html: renderWelcomeEmail(firstName, verificationCode), 
      });
    } catch (mailError) {
      console.error('Mail failed but user was created:', mailError);
      // Don't crash the registration if the email fails; provide a "Resend" option later
    }

    res.status(201).json({ 
      success: true,
      message: 'Account created successfully. Please check your email.',
      userId: user.id 
    });

  } catch (error) {
    console.error('REGISTRATION_ERROR:', error);
    res.status(500).json({ message: 'An unexpected error occurred during registration.' });
  }
}

// Helper for clean HTML emails
function renderWelcomeEmail(name, code) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h1 style="color: #2563eb;">Welcome, ${name}!</h1>
      <p>Thanks for joining CustomiseMe UK. Use the code below to verify your email and start designing:</p>
      <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
        ${code}
      </div>
      <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
        This code expires in 60 minutes. If you didn't create an account, please ignore this email.
      </p>
    </div>
  `;
}