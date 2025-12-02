import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Cancellation Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Subscription Cancellation</h2>
          <p>
            If you wish to cancel your subscription, please note the following:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Active Until Period End:</strong> If you cancel the service before the end of your current paid-up period, your subscription will remain active until the subscription period ends, after which your subscription will be stopped.
            </li>
            <li>
              <strong>No Refunds:</strong> We do NOT offer refunds once access is delivered. All sales are final after the TradingView activation link is sent.
            </li>
            <li>
              <strong>No Partial Refunds:</strong> There are no refunds for any plans, even if the subscription is cancelled on the same day as the payment has gone through.
            </li>
            <li>
              <strong>Incorrect Information:</strong> We do not offer refunds for any wrong data provided by you. Please make sure that the order is correct before the payment is made.
            </li>
            <li>
              <strong>Plan Upgrades:</strong> We do not offer refunds for upgrades to other plans or longer subscription periods.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8">How to Cancel</h2>
          <p>
            To cancel your subscription or for any queries regarding cancellation, please contact us through:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              WhatsApp:{' '}
              <a 
                href="https://wa.me/918668657835" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +91 8668657835
              </a>
            </li>
            <li>
              <Link to="/contact" className="text-primary hover:underline">
                Contact Page
              </Link>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Important Note</h2>
          <p className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <strong>We do NOT offer refunds once access is delivered.</strong> All sales are final after the TradingView activation link is sent. Please ensure you understand this policy before making a purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
