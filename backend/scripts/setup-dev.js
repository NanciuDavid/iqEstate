#!/usr/bin/env node

/**
 * Development Setup Script for EstateIQ Backend
 * 
 * This script helps set up the development environment by:
 * - Checking if required environment variables are set
 * - Providing helpful messages for getting started
 * - Validating the basic setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 EstateIQ Backend Setup Helper\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env file not found!');
  console.log('\n📝 Please create a .env file in the backend directory with the following variables:');
  console.log(`
DB_URL=postgresql://username:password@hostname:port/database_name
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
ML_MODEL_API_URL=http://localhost:5000/predict
  `);
  console.log('💡 See the README.md file for more details on environment setup.');
  process.exit(1);
}

console.log('✅ .env file found');

// Load and check environment variables
require('dotenv').config({ path: envPath });

const requiredVars = ['DB_URL', 'JWT_SECRET'];
const missingVars = [];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Please update your .env file with the missing variables.');
  process.exit(1);
}

console.log('✅ Required environment variables are set');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules not found');
  console.log('💡 Please run: npm install');
  process.exit(1);
}

console.log('✅ Dependencies installed');

// Check if Prisma client is generated
const prismaClientPath = path.join(__dirname, '../node_modules/@prisma/client');
if (!fs.existsSync(prismaClientPath)) {
  console.log('❌ Prisma client not generated');
  console.log('💡 Please run: npx prisma generate');
  process.exit(1);
}

console.log('✅ Prisma client generated');

console.log('\n🎉 Setup looks good! You can now start the development server with:');
console.log('   npm run dev');
console.log('\n📚 Available endpoints once running:');
console.log(`   - Health: http://localhost:${process.env.PORT || 3001}/api/health`);
console.log(`   - Auth: http://localhost:${process.env.PORT || 3001}/api/auth`);
console.log(`   - Properties: http://localhost:${process.env.PORT || 3001}/api/properties`);
console.log(`   - Predictions: http://localhost:${process.env.PORT || 3001}/api/predict`);
console.log(`   - Users: http://localhost:${process.env.PORT || 3001}/api/users`);
console.log('\n📖 See README.md for detailed API documentation.'); 