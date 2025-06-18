const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: 'admin@admin' }
    });

    if (!user) {
      // Create the user in the BetterAuth user table
      user = await prisma.user.create({
        data: {
          email: 'admin@admin',
          name: 'Admin User',
          emailVerified: true, // Skip email verification for testing
        }
      });
      console.log('✅ User created!');
    } else {
      console.log('ℹ️ User already exists, checking account...');
    }

    // Check if account exists
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: 'credential'
      }
    });

    if (!existingAccount) {
      // Create an account record for email/password authentication
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.email,
          providerId: 'credential',
          password: hashedPassword,
        }
      });
      console.log('✅ Account created!');
    } else {
      // Update the password
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashedPassword }
      });
      console.log('✅ Password updated!');
    }

    console.log('✅ Test user ready!');
    console.log('Email: admin@admin');
    console.log('Password: admin');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 