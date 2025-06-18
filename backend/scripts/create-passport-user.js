const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createPassportUser() {
  try {
    // Hash the password with bcryptjs (same as Passport will use)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Check if admin user already exists
    let user = await prisma.users.findUnique({
      where: { email: 'admin@estateiq.com' }
    });

    if (!user) {
      // Create the admin user in the original users table
      user = await prisma.users.create({
        data: {
          email: 'admin@estateiq.com',
          password_hash: hashedPassword,
          first_name: 'Admin',
          last_name: 'User',
          user_type: 'admin',
          is_verified: true,
        }
      });
      console.log('✅ Passport admin user created!');
    } else {
      // Update the password
      await prisma.users.update({
        where: { user_id: user.user_id },
        data: { password_hash: hashedPassword }
      });
      console.log('✅ Passport admin password updated!');
    }

    console.log('\n🎯 PASSPORT ADMIN ACCOUNT READY:');
    console.log('Email: admin@estateiq.com');
    console.log('Password: admin123');
    console.log('\nYou can now test login with Passport.js!');
    
  } catch (error) {
    console.error('❌ Error creating Passport user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPassportUser(); 