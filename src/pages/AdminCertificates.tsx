import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Download, FileDown, Loader2, LogOut, Pencil, Plus, QrCode, Search, Trash2,
} from "lucide-react";
import type { Certificate } from "@/lib/certificate";
import { generateCertificatePdf, generateQrDataUrl, VERIFY_BASE_URL } from "@/lib/certificate";

const empty: Certificate = {
  certificate_id: "",
  student_name: "",
  domain: "",
  college_name: "Srinivas University Institute of Engineering & Technology (SUIET)",
  internship_start_date: "2026-06-01",
  internship_end_date: "2026-06-30",
  issue_date: "2026-06-30",
  certificate_status: "Verified",
};

const AdminCertificates = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState<Certificate>(empty);
  const [open, setOpen] = useState(false);
  const [qrId, setQrId] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const admin = !!roles?.some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
      setAuthChecked(true);
      if (admin) load();
      else setLoading(false);
    };
    init();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("internship_certificates")
      .select("certificate_id, student_name, domain, college_name, internship_start_date, internship_end_date, issue_date, certificate_status")
      .order("certificate_id");
    if (error) toast.error(error.message);
    setRows((data ?? []) as Certificate[]);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.certificate_id.toLowerCase().includes(q) ||
        r.student_name.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (c: Certificate) => {
    setEditing(c);
    setForm(c);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const { error } = await supabase
        .from("internship_certificates")
        .update(form)
        .eq("certificate_id", editing.certificate_id);
      if (error) return toast.error(error.message);
      toast.success("Certificate updated");
    } else {
      const { error } = await supabase.from("internship_certificates").insert(form);
      if (error) return toast.error(error.message);
      toast.success("Certificate added");
    }
    setOpen(false);
    load();
  };

  const remove = async (c: Certificate) => {
    if (!confirm(`Delete certificate ${c.certificate_id}?`)) return;
    const { error } = await supabase
      .from("internship_certificates")
      .delete()
      .eq("certificate_id", c.certificate_id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const showQr = async (c: Certificate) => {
    setQrId(c.certificate_id);
    setQrDataUrl(await generateQrDataUrl(c.certificate_id));
  };

  const handleDownloadPdf = async (c: Certificate) => {
    try {
      toast.loading("Generating certificate PDF…", { id: `pdf-${c.certificate_id}` });
      await generateCertificatePdf(c);
      toast.success("Certificate downloaded", { id: `pdf-${c.certificate_id}` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate PDF";
      toast.error(msg, { id: `pdf-${c.certificate_id}` });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main-content" className="pt-28 px-6 max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-muted-foreground mt-2">
            Your account doesn't have the admin role. Ask an existing admin to grant it
            in the backend dashboard ({"user_roles"} table → add a row with your user id and role
            <code className="mx-1">admin</code>).
          </p>
          <Button className="mt-6" onClick={signOut}>Sign out</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                DeploriX Admin
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Internship Certificates</h1>
              <p className="text-muted-foreground mt-1">Add, edit, delete, and issue certificates.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
              <Button variant="hero" onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" /> Add Certificate
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 bg-card border border-border rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, student, or domain"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 px-0"
            />
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-4 w-4 inline animate-spin mr-2" /> Loading…
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No certificates found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.certificate_id}>
                      <TableCell className="font-mono text-sm">{c.certificate_id}</TableCell>
                      <TableCell>{c.student_name}</TableCell>
                      <TableCell>{c.domain}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                          {c.certificate_status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost" title="QR Code" onClick={() => showQr(c)}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Download PDF" onClick={() => handleDownloadPdf(c)}>
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => openEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Delete" onClick={() => remove(c)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Add/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Certificate ID</Label>
              <Input
                required
                value={form.certificate_id}
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, certificate_id: e.target.value })}
                placeholder="DTX-2026-SU01"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Student Name</Label>
              <Input required value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
            </div>
            <div>
              <Label>Domain</Label>
              <Input required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Input required value={form.certificate_status} onChange={(e) => setForm({ ...form, certificate_status: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>College Name</Label>
              <Input required value={form.college_name} onChange={(e) => setForm({ ...form, college_name: e.target.value })} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" required value={form.internship_start_date} onChange={(e) => setForm({ ...form, internship_start_date: e.target.value })} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" required value={form.internship_end_date} onChange={(e) => setForm({ ...form, internship_end_date: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Issue Date</Label>
              <Input type="date" required value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
            </div>
            <DialogFooter className="md:col-span-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="hero">{editing ? "Save Changes" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR dialog */}
      <Dialog open={!!qrId} onOpenChange={(o) => !o && setQrId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code · {qrId}</DialogTitle>
          </DialogHeader>
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-3">
              <img src={qrDataUrl} alt={`QR for ${qrId}`} className="w-64 h-64" />
              <div className="text-xs text-muted-foreground break-all text-center">
                {VERIFY_BASE_URL}/{qrId}
              </div>
              <a href={qrDataUrl} download={`DeploriX-QR-${qrId}.png`}>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Download QR</Button>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCertificates;
