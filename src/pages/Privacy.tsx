import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Comments</h2>
          <p>
            When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Media</h2>
          <p>
            If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Cookies</h2>
          <p>
            If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
          </p>
          <p>
            If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
          </p>
          <p>
            When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Embedded Content from Other Websites</h2>
          <p>
            Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
          </p>
          <p>
            These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Who We Share Your Data With</h2>
          <p>
            If you request a password reset, your IP address will be included in the reset email.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">How Long We Retain Your Data</h2>
          <p>
            If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
          </p>
          <p>
            For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">What Rights You Have Over Your Data</h2>
          <p>
            If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8">Where We Send Your Data</h2>
          <p>
            Visitor comments may be checked through an automated spam detection service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
