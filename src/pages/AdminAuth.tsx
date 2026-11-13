import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin/certificates", { replace: true });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate("/admin/certificates", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto bg-card border border-border rounded-3xl p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-bold mb-1">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to manage internship certificates.
          </p>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-6">
            Only accounts with the admin role can manage certificates.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminAuth;
