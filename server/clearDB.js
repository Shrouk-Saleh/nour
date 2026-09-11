const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config({ path: './.env' });

// ⚠️ SAFETY CHECK — requires typing CONFIRM to proceed
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('⚠️  This will DELETE ALL data. Type CONFIRM to proceed: ', async (answer) => {
  rl.close();
  if (answer.trim() !== 'CONFIRM') {
    console.log('❌ Cancelled. No data was deleted.');
    process.exit(0);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      try {
        await collection.drop();
        console.log(`Dropped ${collection.collectionName}`);
      } catch (err) {
        console.log(`Error dropping ${collection.collectionName}:`, err.message);
      }
    }
    console.log('✅ Database cleared');
    process.exit();
  } catch (error) {
    console.error('DB Error:', error);
    process.exit(1);
  }
});
