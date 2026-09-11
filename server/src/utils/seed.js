// Run with `npm run seed` from /server after setting MONGODB_URI in .env.
// Seeds the exact weekly schedule and achievement definitions.
// Safe to re-run: it clears existing Tasks/Achievements first so the schedule
// always matches the source of truth in seedData.js, but leaves Progress and
// Companion documents untouched so you don't lose earned progress.

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Task = require('../models/Task');
const Achievement = require('../models/Achievement');
const { buildSeedTasks, ACHIEVEMENT_DEFINITIONS } = require('./seedData');

async function run() {
  await connectDB();

  console.log('Clearing existing schedule tasks...');
  await Task.deleteMany({});

  console.log('Inserting seed schedule...');
  const tasks = buildSeedTasks();
  await Task.insertMany(tasks);
  console.log(`Inserted ${tasks.length} tasks.`);

  console.log('Ensuring achievement definitions exist...');
  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await Achievement.findOneAndUpdate(
      { key: def.key },
      { $setOnInsert: def },
      { upsert: true, new: true }
    );
  }
  console.log(`Ensured ${ACHIEVEMENT_DEFINITIONS.length} achievements.`);

  console.log('Seed complete.');
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
