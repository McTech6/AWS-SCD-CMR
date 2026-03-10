import prisma from './src/db/prisma.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const passwordHash = await bcrypt.hash('Assurance@6', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'tiddingramsey@gmail.com',
        name: 'Admin User',
        passwordHash,
        role: 'ADMIN',
        admin: {
          create: {}
        }
      }
    });

    console.log('✅ Admin created successfully:', user.email);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
