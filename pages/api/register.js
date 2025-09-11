import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import cors from '../../lib/cors';

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
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}