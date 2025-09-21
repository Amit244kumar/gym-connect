import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  // Redirect to home page after a delay if user doesn't take action
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <CardTitle className="text-white text-center text-2xl">404 - Page Not Found</CardTitle>
            <CardDescription className="text-center text-slate-400">
              The page you're looking for doesn't exist or has been moved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-2">
                <p className="text-slate-400 mb-4">
                  We couldn't find the page you were looking for. This might be because:
                </p>
                <ul className="text-left text-slate-400 space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    You mistyped the URL
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    The page has been moved or deleted
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    There was a temporary problem with the server
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleGoHome}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                >
                  Go Back
                </Button>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <p className="text-center text-slate-400 text-sm">
                  Looking for something specific?{" "}
                  <button
                    onClick={() => {
                      // You could implement a search functionality here
                      console.log("Search clicked");
                    }}
                    className="text-orange-400 hover:text-orange-300 inline-flex items-center"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Search our site
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            You'll be redirected to the homepage in 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
}