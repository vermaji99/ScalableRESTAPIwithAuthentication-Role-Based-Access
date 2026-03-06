import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { config } from '../config/env.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();
    console.log('Existing data cleared.');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Create Users
    const users = await User.create([
      { name: 'User One', email: 'user1@example.com', password: 'password123', role: 'user' },
      { name: 'User Two', email: 'user2@example.com', password: 'password123', role: 'user' },
      { name: 'User Three', email: 'user3@example.com', password: 'password123', role: 'user' },
    ]);

    // Create Tasks
    const tasks = [];
    for (let i = 1; i <= 10; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      tasks.push({
        title: `Task ${i}`,
        description: `Description for task ${i}`,
        status: i % 2 === 0 ? 'completed' : 'pending',
        userId: randomUser._id,
      });
    }

    await Task.create(tasks);
    console.log('Seed data created successfully!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
