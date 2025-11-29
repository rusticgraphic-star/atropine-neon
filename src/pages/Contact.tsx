import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-panel rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="contact-name" className="text-foreground">Name</Label>
                <Input
                  id="contact-name"
                  placeholder="Your name"
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="contact-email" className="text-foreground">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="contact-subject" className="text-foreground">Subject</Label>
                <Input
                  id="contact-subject"
                  placeholder="How can we help?"
                  className="mt-2 bg-background border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="contact-message" className="text-foreground">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us more about your inquiry..."
                  className="mt-2 bg-background border-border text-foreground"
                  rows={6}
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow text-primary-foreground py-6 text-lg shadow-neon"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-panel rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp Support</h3>
                    <a 
                      href="https://wa.me/919527120377" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 95271 20377
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">24/7 instant support</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a 
                      href="mailto:support@atropine.in"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      support@atropine.in
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">We'll reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl p-8 border border-primary/30">
              <h3 className="text-xl font-bold text-foreground mb-3">Looking for Quick Answers?</h3>
              <p className="text-muted-foreground mb-6">
                Check out our FAQ section for instant answers to common questions.
              </p>
              <Button 
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10"
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
