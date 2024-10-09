"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast"
import { getDummyFeedback, Feedback, generateDummyFeedback } from '@/lib/dummyData';
import { categorizeFeedback } from '@/lib/categorization';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = () => {
    const data = getDummyFeedback();
    setFeedbacks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFeedback.trim()) {
      const categories = categorizeFeedback(newFeedback);
      const newFeedbackItem: Feedback = {
        _id: Math.random().toString(36).substr(2, 9),
        text: newFeedback,
        sentiment: 'Neutral', // You could implement sentiment analysis here
        categories,
        createdAt: new Date(),
      };

      setFeedbacks([newFeedbackItem, ...feedbacks]);
      setNewFeedback('');
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been successfully submitted.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feedback Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
            />
            <Button type="submit">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="p-4 border rounded">
                <p>{feedback.text}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{feedback.sentiment}</Badge>
                  {feedback.categories.map((category, index) => (
                    <Badge key={index} variant="outline">{category}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Created at: {new Date(feedback.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}