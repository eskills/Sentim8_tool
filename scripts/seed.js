const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  try {
    await client.connect();
    const database = client.db("sentimate");
    const feedbacks = database.collection("feedbacks");

    // Delete existing entries
    await feedbacks.deleteMany({});

    const sentiments = ['Positive', 'Negative', 'Neutral'];
    const feedbackTexts = [
      "Great product!",
      "Could use some improvements.",
      "Not satisfied with the service.",
      "Amazing customer support!",
      "The app is buggy.",
      "Love the new features!",
      "Needs better documentation.",
      "Very intuitive interface.",
      "Slow response times.",
      "Excellent value for money."
    ];

    const sampleFeedbacks = [];
    const startDate = new Date(2023, 0, 1);  // January 1, 2023
    const endDate = new Date();  // Current date

    for (let i = 0; i < 1000; i++) {
      sampleFeedbacks.push({
        text: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        createdAt: randomDate(startDate, endDate)
      });
    }

    const result = await feedbacks.insertMany(sampleFeedbacks);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);