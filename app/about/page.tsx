import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Sentim8</h1>
      <p className="text-xl text-muted-foreground">
        Sentim8 is a powerful Customer Sentiment Analysis tool designed to help businesses understand and improve customer satisfaction.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To empower businesses with actionable insights derived from customer sentiment, enabling them to enhance products and services for maximum customer satisfaction.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Collect feedback from multiple sources
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Analyze sentiment using advanced AI
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Generate actionable insights
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Track sentiment trends over time
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureItem title="Multi-source Analysis" description="Analyze feedback from reviews, social media, and support tickets" />
            <FeatureItem title="Real-time Insights" description="Get up-to-date sentiment analysis as feedback comes in" />
            <FeatureItem title="Trend Tracking" description="Monitor sentiment changes over time to identify patterns" />
            <FeatureItem title="Customizable Dashboards" description="Create personalized views of the data most important to you" />
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureItem({ title, description }) {
  return (
    <li>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </li>
  );
}