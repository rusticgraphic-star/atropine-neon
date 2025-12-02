import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Terms & Conditions</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Your affirmative act of using our website signifies that you agree to the following terms and conditions. If you do not agree, do not use this website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">1. Changes to the Terms and Conditions</h2>
          <p>
            We may change these Terms and Conditions at any time. If you continue to use our website after we post any changes to these Terms and conditions, you are signifying your acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">2. Changes to Our Website</h2>
          <p>
            We may discontinue or change any service or feature on this website at any time without any notice. We do not guarantee backward compatibility of our services and Application Programming Interface (API) in this case.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">3. Ownership of Information</h2>
          <p>
            You may not use any data mining, robots or similar data gathering and extraction tools on the content available on our website, frame any portion of website or its content, sublicense, assign, transfer, sell, loan, or otherwise distribute for payment the content without our prior written consent.
          </p>
          <p>
            Except as otherwise expressly permitted by additional agreement, we do not permit commercial usage of any of our services or APIs. We make no warranty and assume no obligation or liability for third party services or software.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">4. Disclaimer Regarding Investment Decisions and Trading</h2>
          <p>
            Decisions to buy, sell, hold or trade in securities, commodities and other investments involve risk and are best made based on the advice of qualified financial professionals. Any trading in securities or other investments involves a risk of substantial losses. The practice of "Day Trading" involves particularly high risks and can cause you to lose substantial sums of money.
          </p>
          <p>
            Before undertaking any trading program, you should consult a qualified financial professional. Under no circumstances shall we be liable for any loss or damage you or anyone else incurs as a result of any trading or investment activity that you or anyone else engages in based on any information or material you receive through our services.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">5. Access and Security</h2>
          <p>
            You accept responsibility for the confidentiality and use of any username and email address that use to register for your access to and use of our services. You are responsible for maintaining the confidentiality of your password and account and are fully responsible for all activities that occur under your password or account.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">6. Payment and Cancellation of Service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>By ordering any subscription, you confirm that you have read and accepted our Terms and Conditions.</li>
            <li>We do NOT offer refunds once access is delivered. All sales are final after the TradingView activation link is sent.</li>
            <li>If you cancel the service before the end of your current paid up period, your subscription will remain active until the subscription period ends.</li>
            <li>We do not offer refunds for any wrong data provided by you.</li>
            <li>We do not offer refunds for upgrades to other plans or longer subscription periods.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-8">7. Emails</h2>
          <p>
            By creating an account with Atropine, you agree that we can use your email address to send you marketing materials, service-related notices, important information messages, and special offers. You can unsubscribe from this by clicking on the link provided in the emails.
          </p>

          <p className="mt-8 text-sm">
            Atropine may update these Terms at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
