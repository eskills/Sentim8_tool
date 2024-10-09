import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface Insight {
  type: 'trend' | 'anomaly' | 'recommendation';
  description: string;
  importance: 'low' | 'medium' | 'high';
}

interface AIInsightsProps {
  insights: Insight[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-6 w-6" />;
      case 'anomaly':
        return <AlertTriangle className="h-6 w-6" />;
      case 'recommendation':
        return <Lightbulb className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Insights</CardTitle>
        <CardDescription>Automatically generated insights based on sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg shadow">
              <div className="flex-shrink-0">{getIcon(insight.type)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{insight.description}</p>
                <div className="mt-1">
                  <Badge className={getImportanceColor(insight.importance)}>
                    {insight.importance}
                  </Badge>
                  <Badge className="ml-2 bg-secondary text-secondary-foreground">
                    {insight.type}
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AIInsights;