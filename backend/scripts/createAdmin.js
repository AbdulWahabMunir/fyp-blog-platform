/**
 * Script to create default admin user
 * Run this once after setting up MongoDB
 * 
 * Usage: node scripts/createAdmin.js
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      process.exit(0)
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@blog.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    })

    console.log('✅ Admin user created successfully!')
    console.log('Username: admin')
    console.log('Password: admin123')
    console.log('Email: admin@blog.com')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()








