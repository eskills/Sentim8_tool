import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sentimate");

  switch (req.method) {
    case 'GET':
      const { timeRange, from, to } = req.query;
      let query = {};

      if (timeRange || (from && to)) {
        query.createdAt = {};
        if (timeRange) {
          const now = new Date();
          switch (timeRange) {
            case 'week':
              query.createdAt.$gte = new Date(now.setDate(now.getDate() - 7));
              break;
            case 'month':
              query.createdAt.$gte = new Date(now.setMonth(now.getMonth() - 1));
              break;
            case 'year':
              query.createdAt.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
              break;
          }
        }
        if (from && to) {
          query.createdAt.$gte = new Date(from);
          query.createdAt.$lte = new Date(to);
        }
      }

      const feedbacks = await db.collection("feedbacks").find(query).sort({ createdAt: -1 }).toArray();
      res.json(feedbacks);
      break;
    case 'POST':
      const newFeedback = req.body;
      const result = await db.collection("feedbacks").insertOne(newFeedback);
      res.json(result);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}