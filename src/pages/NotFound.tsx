import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Seo
        title="Page Not Found | DeploriX Technologies"
        description="The page you are looking for does not exist on DeploriX Technologies."
        canonical="https://deplorixtechnologies.site/404"
      />
      <Navbar />

      <main id="main-content" className="flex-1 flex items-center justify-center px-6 py-28 md:py-36">
        <div className="text-center max-w-md mx-auto">
          <span className="pill-label mb-4 inline-block">Error 404</span>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-foreground">
            404
          </h1>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="hero" className="gap-2">
              <Link to="/">
                <Home size={16} /> Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/explore">
                <ArrowLeft size={16} /> Explore Divisions
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
