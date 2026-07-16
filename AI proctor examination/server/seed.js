import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Question from './models/Question.js';
import TestSeries from './models/TestSeries.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing database tables...');
    await User.deleteMany();
    await Question.deleteMany();
    await TestSeries.deleteMany();

    console.log('Creating seed users...');
    
    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@apex.com',
      password: 'password', // Will be hashed by userSchema pre-save
      role: 'admin',
    });

    // Create Creator
    const creator = await User.create({
      name: 'Content Creator',
      email: 'creator@apex.com',
      password: 'password',
      role: 'content-creator',
    });

    // Create Candidate
    const candidate = await User.create({
      name: 'Demo Candidate',
      email: 'candidate@apex.com',
      password: 'password',
      role: 'test-taker',
    });

    console.log('Users created:');
    console.log(`- Admin: admin@apex.com (pw: password)`);
    console.log(`- Creator: creator@apex.com (pw: password)`);
    console.log(`- Candidate: candidate@apex.com (pw: password)`);

    console.log('Creating item pool (Questions)...');

    // Create questions with different difficulty levels (b)
    const questionsData = [
      // Math Easy (b < -1)
      {
        text: 'What is the value of 5x - 3 when x = 4?',
        options: ['17', '12', '23', '9'],
        correctOptionIndex: 0,
        difficulty: -1.5,
        discrimination: 1.2,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },
      {
        text: 'Solve for x: x / 3 = 12',
        options: ['4', '36', '15', '9'],
        correctOptionIndex: 1,
        difficulty: -1.2,
        discrimination: 1.1,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },
      // Math Medium (-1 <= b <= 1)
      {
        text: 'If 3x + 7 = 31, what is the value of x^2?',
        options: ['64', '49', '36', '81'],
        correctOptionIndex: 0,
        difficulty: 0.0,
        discrimination: 1.4,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },
      {
        text: 'A train travels at 60 mph. How many miles does it cover in 150 minutes?',
        options: ['120', '150', '90', '180'],
        correctOptionIndex: 1,
        difficulty: 0.2,
        discrimination: 1.3,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },
      // Math Hard (b > 1)
      {
        text: 'What is the sum of the infinite geometric series: 12 + 4 + 4/3 + 4/9 + ...?',
        options: ['16', '18', '24', '20'],
        correctOptionIndex: 1,
        difficulty: 1.5,
        discrimination: 1.6,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },
      {
        text: 'Determine the probability of drawing 2 aces consecutively from a deck of 52 cards without replacement.',
        options: ['1 / 221', '1 / 169', '4 / 663', '1 / 13'],
        correctOptionIndex: 0,
        difficulty: 1.8,
        discrimination: 1.5,
        guessing: 0.25,
        category: 'math',
        creatorId: creator._id,
      },

      // Verbal Easy
      {
        text: 'Choose the antonym of "Amicable".',
        options: ['Friendly', 'Hostile', 'Quiet', 'Active'],
        correctOptionIndex: 1,
        difficulty: -1.4,
        discrimination: 1.2,
        guessing: 0.25,
        category: 'verbal',
        creatorId: creator._id,
      },
      {
        text: 'Identify the synonym of "Candid".',
        options: ['Honest', 'Secretive', 'Vague', 'Sweet'],
        correctOptionIndex: 0,
        difficulty: -1.0,
        discrimination: 1.0,
        guessing: 0.25,
        category: 'verbal',
        creatorId: creator._id,
      },
      // Verbal Medium
      {
        text: 'Complete the sentence: Her arguments were ________, leaving no room for disagreement.',
        options: ['Ambiguous', 'Cogent', 'Frivolous', 'Elusive'],
        correctOptionIndex: 1,
        difficulty: 0.1,
        discrimination: 1.3,
        guessing: 0.25,
        category: 'verbal',
        creatorId: creator._id,
      },
      // Verbal Hard
      {
        text: 'Choose the synonym of "Pusillanimous".',
        options: ['Brave', 'Timorous', 'Generous', 'Indifferent'],
        correctOptionIndex: 1,
        difficulty: 1.6,
        discrimination: 1.5,
        guessing: 0.25,
        category: 'verbal',
        creatorId: creator._id,
      }
    ];

    const questions = await Question.insertMany(questionsData);
    console.log(`Created ${questions.length} question pool items.`);

    // Create Free Test Series
    const freeSeries = await TestSeries.create({
      title: 'Free Basic Mock Test Series',
      description: 'Introductory adaptive Mock Test covering general Math and Verbal questions.',
      price: 0,
      isPremium: false,
      questions: [questions[0]._id, questions[2]._id, questions[4]._id, questions[6]._id, questions[8]._id],
      creatorId: creator._id
    });

    // Create Premium Test Series
    const premiumSeries = await TestSeries.create({
      title: 'Advanced GMAT Premium Prep Series',
      description: 'High-discrimination math and verbal items tailored for top percentile scores.',
      price: 19.99,
      isPremium: true,
      questions: [questions[1]._id, questions[3]._id, questions[5]._id, questions[7]._id, questions[9]._id],
      creatorId: creator._id
    });

    console.log('Mock Test Series created:');
    console.log(`- Free: ${freeSeries.title}`);
    console.log(`- Premium: ${premiumSeries.title} ($19.99)`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
