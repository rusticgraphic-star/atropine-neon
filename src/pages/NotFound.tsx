import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary neon-text">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link to="/">
            <Button className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-neon">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="border-border text-foreground hover:bg-primary/10">
              View Indicators
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
