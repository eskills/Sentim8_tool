"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { CheckCircle, XCircle, TrendingUp, MessageSquare, Users, BarChart2 } from 'lucide-react';
import { getDummyFeedback, Feedback } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TagCloud } from 'react-tagcloud';
import AIInsights from '@/components/AIInsights';
import { generateInsights } from '@/lib/aiInsights';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [timeRange, setTimeRange] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [widgets, setWidgets] = useState([
    { id: 'ai-insights', title: 'AI Insights' },
    { id: 'sentiment-distribution', title: 'Sentiment Distribution' },
    { id: 'sentiment-trend', title: 'Sentiment Trend' },
    { id: 'top-categories', title: 'Top Feedback Categories' },
    { id: 'feedback-volume', title: 'Feedback Volume Over Time' },
    { id: 'word-cloud', title: 'Word Cloud' },
    { id: 'comparative-analysis', title: 'Comparative Analysis' },
  ]);

  useEffect(() => {
    fetchFeedbacks();
  }, [timeRange, dateRange]);

  const fetchFeedbacks = () => {
    const data = getDummyFeedback(timeRange, dateRange.from, dateRange.to);
    setFeedbacks(data);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const sentimentDistribution = feedbacks.reduce((acc, feedback) => {
    acc[feedback.sentiment] = (acc[feedback.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sentimentDistributionData = Object.entries(sentimentDistribution).map(([name, value]) => ({ name, value }));

  const sentimentTrend = feedbacks.reduce((acc, feedback) => {
    const date = new Date(feedback.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, Positive: 0, Negative: 0, Neutral: 0 };
    }
    acc[date][feedback.sentiment]++;
    return acc;
  }, {} as Record<string, { date: string; Positive: number; Negative: number; Neutral: number }>);

  const sentimentTrendData = Object.values(sentimentTrend);

  const categoryDistribution = feedbacks.reduce((acc, feedback) => {
    feedback.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const categoryDistributionData = Object.entries(categoryDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);  // Top 5 categories

  const feedbackVolumeTrend = Object.values(sentimentTrend).map(({ date, ...rest }) => ({
    date,
    volume: Object.values(rest).reduce((a, b) => a + b, 0)
  }));

  const totalFeedbacks = feedbacks.length;
  const positiveFeedbacks = feedbacks.filter(f => f.sentiment === 'Positive').length;
  const negativeFeedbacks = feedbacks.filter(f => f.sentiment === 'Negative').length;
  const neutralFeedbacks = feedbacks.filter(f => f.sentiment === 'Neutral').length;

  const averageSentiment = (positiveFeedbacks * 1 + neutralFeedbacks * 0 + negativeFeedbacks * -1) / totalFeedbacks;

  const wordCloudData = feedbacks.reduce((acc, feedback) => {
    feedback.text.split(' ').forEach(word => {
      if (word.length > 3) {
        acc[word] = (acc[word] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const wordCloudTags = Object.entries(wordCloudData)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);

  const renderWidget = (widget) => {
    switch (widget.id) {
      case 'ai-insights':
        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <AIInsights insights={generateInsights(feedbacks)} />
            </CardContent>
          </Card>
        );
      case 'sentiment-distribution':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'sentiment-trend':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Positive" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Negative" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="Neutral" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'top-categories':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Top Feedback Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'feedback-volume':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={feedbackVolumeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      case 'word-cloud':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Word Cloud</CardTitle>
            </CardHeader>
            <CardContent>
              <TagCloud
                minSize={12}
                maxSize={35}
                tags={wordCloudTags}
                onClick={(tag) => console.log(`'${tag.value}' was selected!`)}
              />
            </CardContent>
          </Card>
        );
      case 'comparative-analysis':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Comparative Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Implement comparative analysis visualization here</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Select onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Last week</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <QuickStatCard title="Total Feedback" value={totalFeedbacks} icon={<MessageSquare className="h-6 w-6" />} />
        <QuickStatCard title="Positive Sentiment" value={`${Math.round((positiveFeedbacks / totalFeedbacks) * 100)}%`} icon={<CheckCircle className="h-6 w-6" />} />
        <QuickStatCard title="Negative Sentiment" value={`${Math.round((negativeFeedbacks / totalFeedbacks) * 100)}%`} icon={<XCircle className="h-6 w-6" />} />
        <QuickStatCard title="Average Sentiment" value={averageSentiment.toFixed(2)} icon={<TrendingUp className="h-6 w-6" />} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {renderWidget(widget)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

function QuickStatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}