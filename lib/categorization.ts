// Simple tokenization function
function tokenize(text: string): string[] {
  return text.toLowerCase().match(/\b(\w+)\b/g) || [];
}

// Define categories and their associated keywords
const categories = {
  'Product Quality': ['quality', 'durability', 'reliable', 'well-made', 'poorly', 'defective'],
  'Customer Service': ['service', 'support', 'helpful', 'unhelpful', 'responsive', 'unresponsive'],
  'Pricing': ['price', 'expensive', 'cheap', 'affordable', 'overpriced', 'value'],
  'Features': ['feature', 'functionality', 'works', 'useful', 'useless'],
  'User Experience': ['easy', 'difficult', 'intuitive', 'confusing', 'user-friendly'],
  'Performance': ['fast', 'slow', 'responsive', 'laggy', 'efficient', 'inefficient'],
};

// Simple sentiment words
const sentimentWords = {
  positive: ['great', 'excellent', 'good', 'love', 'awesome', 'fantastic', 'helpful'],
  negative: ['bad', 'poor', 'terrible', 'awful', 'disappointing', 'frustrating', 'useless']
};

export function categorizeFeedback(text: string): string[] {
  const tokens = tokenize(text);
  const matchedCategories = Object.entries(categories)
    .filter(([_, keywords]) => 
      keywords.some(keyword => tokens.includes(keyword))
    )
    .map(([category, _]) => category);

  return matchedCategories.length > 0 ? matchedCategories : ['Uncategorized'];
}

export function analyzeSentiment(text: string): 'Positive' | 'Negative' | 'Neutral' {
  const tokens = tokenize(text);
  const positiveCount = tokens.filter(token => sentimentWords.positive.includes(token)).length;
  const negativeCount = tokens.filter(token => sentimentWords.negative.includes(token)).length;

  if (positiveCount > negativeCount) return 'Positive';
  if (negativeCount > positiveCount) return 'Negative';
  return 'Neutral';
}