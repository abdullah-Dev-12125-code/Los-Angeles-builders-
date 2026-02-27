import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const userType = localStorage.getItem("userType");
  const redirectPath = userType === "user" ? "/user-dashboard" : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="p-8 md:p-12 text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to={redirectPath}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-blue-700">
            Go to {userType === "user" ? "Dashboard" : "Dashboard"}
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
