"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuthContext } from '@/components/AuthProvider';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      <main className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Image src="/logo.svg" alt="Sentim8 Logo" width={80} height={80} className="mr-4" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">Sentim8</h1>
        </div>
        <p className="text-2xl mb-8 max-w-2xl">Unlock the power of customer sentiment to drive product improvements and boost satisfaction</p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 mb-12">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
            <Link href="/auth/signin">Get Started <ArrowRight className="ml-2" /></Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            icon={<MessageCircle className="w-10 h-10 text-blue-600" />}
            title="Sentiment Analysis"
            description="Analyze customer feedback from multiple sources to gauge overall sentiment."
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-teal-600" />}
            title="Trend Tracking"
            description="Track sentiment trends over time to identify areas of improvement."
          />
          <FeatureCard
            icon={<BarChart2 className="w-10 h-10 text-purple-600" />}
            title="Actionable Insights"
            description="Get data-driven recommendations to enhance customer satisfaction."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}