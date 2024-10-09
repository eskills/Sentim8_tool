"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { CheckCircle, XCircle, TrendingUp, MessageSquare, Users, BarChart2 } from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { getDummyFeedback, Feedback } from '@/lib/dummyData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Suppress recharts warnings
const CustomizedXAxis = (props) => <XAxis {...props} />;
const CustomizedYAxis = (props) => <YAxis {...props} />;

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [timeRange, setTimeRange] = useState('all');
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedMetrics, setSelectedMetrics] = useState(['sentiment', 'categories', 'trend']);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    } else {
      fetchFeedbacks();
    }
  }, [user, router, timeRange, dateRange]);

  const fetchFeedbacks = () => {
    const data = getDummyFeedback(timeRange, dateRange.from, dateRange.to);
    setFeedbacks(data);
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

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
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

      <div className="flex flex-wrap gap-4 mb-6">
        <Checkbox 
          id="sentiment" 
          checked={selectedMetrics.includes('sentiment')}
          onCheckedChange={(checked) => {
            if (checked) setSelectedMetrics([...selectedMetrics, 'sentiment'])
            else setSelectedMetrics(selectedMetrics.filter(m => m !== 'sentiment'))
          }}
        />
        <label htmlFor="sentiment">Sentiment Distribution</label>

        <Checkbox 
          id="categories" 
          checked={selectedMetrics.includes('categories')}
          onCheckedChange={(checked) => {
            if (checked) setSelectedMetrics([...selectedMetrics, 'categories'])
            else setSelectedMetrics(selectedMetrics.filter(m => m !== 'categories'))
          }}
        />
        <label htmlFor="categories">Top Categories</label>

        <Checkbox 
          id="trend" 
          checked={selectedMetrics.includes('trend')}
          onCheckedChange={(checked) => {
            if (checked) setSelectedMetrics([...selectedMetrics, 'trend'])
            else setSelectedMetrics(selectedMetrics.filter(m => m !== 'trend'))
          }}
        />
        <label htmlFor="trend">Sentiment Trend</label>

        <Checkbox 
          id="volume" 
          checked={selectedMetrics.includes('volume')}
          onCheckedChange={(checked) => {
            if (checked) setSelectedMetrics([...selectedMetrics, 'volume'])
            else setSelectedMetrics(selectedMetrics.filter(m => m !== 'volume'))
          }}
        />
        <label htmlFor="volume">Feedback Volume</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard title="Total Feedback" value={totalFeedbacks} icon={<MessageSquare className="h-6 w-6" />} />
        <QuickStatCard title="Positive Sentiment" value={`${Math.round((positiveFeedbacks / totalFeedbacks) * 100)}%`} icon={<CheckCircle className="h-6 w-6" />} />
        <QuickStatCard title="Negative Sentiment" value={`${Math.round((negativeFeedbacks / totalFeedbacks) * 100)}%`} icon={<XCircle className="h-6 w-6" />} />
        <QuickStatCard title="Average Sentiment" value={averageSentiment.toFixed(2)} icon={<TrendingUp className="h-6 w-6" />} />
      </div>

      {selectedMetrics.includes('sentiment') && (
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
      )}

      {selectedMetrics.includes('trend') && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <CustomizedXAxis dataKey="date" />
                <CustomizedYAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Positive" stroke="#8884d8" />
                <Line type="monotone" dataKey="Negative" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Neutral" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {selectedMetrics.includes('categories') && (
        <Card>
          <CardHeader>
            <CardTitle>Top Feedback Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <CustomizedXAxis dataKey="name" />
                <CustomizedYAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {selectedMetrics.includes('volume') && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={feedbackVolumeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <CustomizedXAxis dataKey="date" />
                <CustomizedYAxis />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
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