import { Feedback } from './dummyData';

interface Insight {
  type: 'trend' | 'anomaly' | 'recommendation';
  description: string;
  importance: 'low' | 'medium' | 'high';
}

export function generateInsights(feedbacks: Feedback[]): Insight[] {
  const insights: Insight[] = [];

  // Analyze sentiment trends
  const sentimentTrend = analyzeSentimentTrend(feedbacks);
  if (sentimentTrend) {
    insights.push(sentimentTrend);
  }

  // Detect anomalies
  const anomalies = detectAnomalies(feedbacks);
  insights.push(...anomalies);

  // Generate recommendations
  const recommendations = generateRecommendations(feedbacks);
  insights.push(...recommendations);

  return insights;
}

function analyzeSentimentTrend(feedbacks: Feedback[]): Insight | null {
  const recentFeedbacks = feedbacks.slice(-100); // Consider last 100 feedbacks
  const positiveFeedbacks = recentFeedbacks.filter(f => f.sentiment === 'Positive').length;
  const negativeFeedbacks = recentFeedbacks.filter(f => f.sentiment === 'Negative').length;

  const positivePercentage = (positiveFeedbacks / recentFeedbacks.length) * 100;
  const negativePercentage = (negativeFeedbacks / recentFeedbacks.length) * 100;

  if (positivePercentage > 70) {
    return {
      type: 'trend',
      description: 'Positive sentiment is trending upwards. Keep up the good work!',
      importance: 'high'
    };
  } else if (negativePercentage > 30) {
    return {
      type: 'trend',
      description: 'Negative sentiment is increasing. Immediate attention required.',
      importance: 'high'
    };
  }

  return null;
}

function detectAnomalies(feedbacks: Feedback[]): Insight[] {
  const anomalies: Insight[] = [];

  // Check for sudden spikes in negative feedback
  const recentFeedbacks = feedbacks.slice(-50); // Consider last 50 feedbacks
  const negativeFeedbacks = recentFeedbacks.filter(f => f.sentiment === 'Negative').length;
  if (negativeFeedbacks > 25) { // More than 50% negative
    anomalies.push({
      type: 'anomaly',
      description: 'Unusual spike in negative feedback detected. Investigate immediately.',
      importance: 'high'
    });
  }

  // Check for new emerging categories
  const allCategories = feedbacks.flatMap(f => f.categories);
  const uniqueCategories = [...new Set(allCategories)];
  const recentCategories = recentFeedbacks.flatMap(f => f.categories);
  const newCategories = recentCategories.filter(c => !uniqueCategories.includes(c));

  if (newCategories.length > 0) {
    anomalies.push({
      type: 'anomaly',
      description: `New feedback categories detected: ${newCategories.join(', ')}. Consider investigating these areas.`,
      importance: 'medium'
    });
  }

  return anomalies;
}

function generateRecommendations(feedbacks: Feedback[]): Insight[] {
  const recommendations: Insight[] = [];

  // Recommend focusing on most frequent negative categories
  const negativeCategories = feedbacks
    .filter(f => f.sentiment === 'Negative')
    .flatMap(f => f.categories);

  const categoryCounts = negativeCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topNegativeCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  if (topNegativeCategories.length > 0) {
    recommendations.push({
      type: 'recommendation',
      description: `Focus on improving these top negative feedback areas: ${topNegativeCategories.join(', ')}.`,
      importance: 'high'
    });
  }

  // Recommend capitalizing on positive feedback
  const positiveCategories = feedbacks
    .filter(f => f.sentiment === 'Positive')
    .flatMap(f => f.categories);

  const positiveCategoryCounts = positiveCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPositiveCategories = Object.entries(positiveCategoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  if (topPositiveCategories.length > 0) {
    recommendations.push({
      type: 'recommendation',
      description: `Capitalize on these strengths: ${topPositiveCategories.join(', ')}. Consider showcasing these in marketing efforts.`,
      importance: 'medium'
    });
  }

  return recommendations;
}