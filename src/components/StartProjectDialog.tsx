import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StartProjectDialog = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent("New Project Inquiry - DeploriX Technologies");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`
    );
    window.location.href = `mailto:deplorixtechnologies@gmail.com?subject=${subject}&body=${body}`;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Start a project</DialogTitle>
          <DialogDescription>
            Tell us about yourself and we'll reach out to discuss your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          <div>
            <Label htmlFor="proj-name">Full Name</Label>
            <Input
              id="proj-name"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="proj-email">Email Address</Label>
            <Input
              id="proj-email"
              required
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="proj-phone">Phone Number</Label>
            <Input
              id="proj-phone"
              required
              autoComplete="tel"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            variant="brand"
            className="h-12 w-full"
            size="lg"
            disabled={!form.name || !form.email || !form.phone}
          >
            Continue to email <ArrowRight size={16} />
          </Button>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            We’ll prepare a new project email for you to review before sending.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartProjectDialog;
