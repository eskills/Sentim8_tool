import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals and small teams just getting started',
    features: [
      'Basic sentiment analysis',
      'Up to 100 feedbacks/month',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/auth/register?plan=free',
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For growing businesses with advanced needs',
    features: [
      'Advanced sentiment analysis',
      'Up to 1000 feedbacks/month',
      'Priority email support',
      'Trend analysis',
      'API access',
    ],
    cta: 'Start Free Trial',
    href: '/auth/register?plan=pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific requirements',
    features: [
      'Custom sentiment models',
      'Unlimited feedbacks',
      '24/7 phone & email support',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Pricing Plans</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Choose the perfect plan for your business needs
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={plan.highlighted ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">{plan.price}</p>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}