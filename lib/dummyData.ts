import { addDays, subDays } from 'date-fns';
import { categorizeFeedback, analyzeSentiment } from './categorization';

export interface Feedback {
  _id: string;
  text: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  categories: string[];
  createdAt: Date;
}

function generateRandomFeedback(date: Date): Feedback {
  const texts = [
    "Great product! It's really well-made and durable.",
    "The customer service was very helpful and responsive.",
    "I think the price is a bit expensive for what you get.",
    "Love the new features, they're really useful!",
    "The app is quite slow and laggy at times.",
    "Very user-friendly interface, easy to navigate.",
    "The quality of the product is disappointing.",
    "Excellent value for money, affordable and reliable.",
    "The support team was unhelpful and unresponsive.",
    "Some features don't work as expected, needs improvement."
  ];

  const text = texts[Math.floor(Math.random() * texts.length)];
  const sentiment = analyzeSentiment(text);
  const categories = categorizeFeedback(text);

  return {
    _id: Math.random().toString(36).substr(2, 9),
    text,
    sentiment,
    categories,
    createdAt: date
  };
}

export function generateDummyFeedback(days: number = 30, feedbackPerDay: number = 5): Feedback[] {
  const feedback: Feedback[] = [];
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    for (let i = 0; i < feedbackPerDay; i++) {
      feedback.push(generateRandomFeedback(date));
    }
  }

  return feedback;
}

export function getDummyFeedback(timeRange?: string, from?: Date, to?: Date): Feedback[] {
  const allFeedback = generateDummyFeedback();

  if (!timeRange && !from && !to) {
    return allFeedback;
  }

  const endDate = to || new Date();
  let startDate: Date;

  if (timeRange) {
    switch (timeRange) {
      case 'week':
        startDate = subDays(endDate, 7);
        break;
      case 'month':
        startDate = subDays(endDate, 30);
        break;
      case 'year':
        startDate = subDays(endDate, 365);
        break;
      default:
        return allFeedback;
    }
  } else {
    startDate = from || subDays(endDate, 30);
  }

  return allFeedback.filter(feedback => 
    feedback.createdAt >= startDate && feedback.createdAt <= endDate
  );
}