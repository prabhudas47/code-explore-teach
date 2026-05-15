import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
type Status = 'open' | 'ignored' | 'fixed';

interface Finding {
  id: string;
  title: string;
  description: string | null;
  severity: Severity;
  status: Status;
  source: string;
  ignored_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface ScanRun {
  id: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  passed: number;
  failed: number;
  results: Array<{ name: string; passed: boolean; detail: string }>;
  trigger: string;
}

const sevColor: Record<Severity, string> = {
  info: 'bg-muted text-muted-foreground',
  low: 'bg-blue-500/20 text-blue-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  high: 'bg-orange-500/20 text-orange-300',
  critical: 'bg-red-500/20 text-red-300',
};

const statusColor: Record<Status, string> = {
  open: 'bg-red-500/20 text-red-300',
  ignored: 'bg-muted text-muted-foreground',
  fixed: 'bg-green-500/20 text-green-300',
};

export default function SecurityDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [runs, setRuns] = useState<ScanRun[]>([]);
  const [running, setRunning] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '', severity: 'medium' as Severity });

  useEffect(() => {
    document.title = 'Security Dashboard';
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setAuthed(false); return; }
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
      setAuthed(!!isAdmin);
    })();
  }, []);

  useEffect(() => {
    if (authed) { void load(); }
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast.error(error.message);
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
    if (!isAdmin) { await supabase.auth.signOut(); return toast.error('Admin only'); }
    setAuthed(true);
  }

  async function load() {
    const [f, r] = await Promise.all([
      supabase.from('security_findings').select('*').order('created_at', { ascending: false }),
      supabase.from('security_scan_runs').select('*').order('started_at', { ascending: false }).limit(20),
    ]);
    if (f.data) setFindings(f.data as Finding[]);
    if (r.data) setRuns(r.data as ScanRun[]);
  }

  async function addFinding() {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from('security_findings').insert({
      title: draft.title, description: draft.description, severity: draft.severity, source: 'manual',
    });
    if (error) return toast.error(error.message);
    setDraft({ title: '', description: '', severity: 'medium' });
    void load();
  }

  async function updateFinding(id: string, patch: Partial<Finding>) {
    const { error } = await supabase.from('security_findings').update(patch).eq('id', id);
    if (error) return toast.error(error.message);
    void load();
  }

  async function runScanNow() {
    setRunning(true);
    try {
      const { error } = await supabase.functions.invoke('security-self-check', {
        headers: { 'x-trigger': 'manual' },
      });
      if (error) toast.error(error.message); else toast.success('Scan complete');
      void load();
    } finally {
      setRunning(false);
    }
  }

  if (authed === null) return <div className="p-8 text-center text-muted-foreground">Loading…</div>;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={login} className="w-full max-w-sm space-y-3 p-6 border border-border rounded-lg bg-card">
          <h1 className="text-xl font-semibold">Security Dashboard</h1>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <Input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <Button onClick={runScanNow} disabled={running}>{running ? 'Running…' : 'Run scan now'}</Button>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent automated scans</h2>
        {runs.length === 0 && <p className="text-muted-foreground text-sm">No runs yet — click "Run scan now".</p>}
        {runs.map((r) => (
          <Card key={r.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{new Date(r.started_at).toLocaleString()}</span>
              <span className="flex gap-2">
                <Badge className={r.status === 'passed' ? 'bg-green-500/20 text-green-300' : r.status === 'failed' ? 'bg-red-500/20 text-red-300' : ''}>{r.status}</Badge>
                <Badge variant="outline">{r.trigger}</Badge>
                <span className="text-muted-foreground">{r.passed} passed · {r.failed} failed</span>
              </span>
            </div>
            <details>
              <summary className="cursor-pointer text-sm text-muted-foreground">Details</summary>
              <ul className="mt-2 space-y-1 text-sm">
                {r.results?.map((c) => (
                  <li key={c.name} className="flex gap-2">
                    <span className={c.passed ? 'text-green-400' : 'text-red-400'}>{c.passed ? '✓' : '✗'}</span>
                    <span className="font-mono">{c.name}</span>
                    <span className="text-muted-foreground">{c.detail}</span>
                  </li>
                ))}
              </ul>
            </details>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Log a finding / exception</h2>
        <Card className="p-4 space-y-3">
          <Input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          <div className="flex gap-2">
            <Select value={draft.severity} onValueChange={(v) => setDraft({ ...draft, severity: v as Severity })}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['info', 'low', 'medium', 'high', 'critical'] as Severity[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addFinding}>Add finding</Button>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Findings ({findings.length})</h2>
        {findings.map((f) => (
          <Card key={f.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-medium">{f.title}</h3>
                {f.description && <p className="text-sm text-muted-foreground">{f.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge className={sevColor[f.severity]}>{f.severity}</Badge>
                <Badge className={statusColor[f.status]}>{f.status}</Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center text-sm">
              <Select value={f.status} onValueChange={(v) => updateFinding(f.id, { status: v as Status })}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">open</SelectItem>
                  <SelectItem value="ignored">ignored</SelectItem>
                  <SelectItem value="fixed">fixed</SelectItem>
                </SelectContent>
              </Select>
              {f.status === 'ignored' && (
                <Input
                  placeholder="Why is this being ignored?"
                  defaultValue={f.ignored_reason ?? ''}
                  onBlur={(e) => updateFinding(f.id, { ignored_reason: e.target.value })}
                  className="flex-1 min-w-[240px]"
                />
              )}
              <Button variant="ghost" size="sm" onClick={() => updateFinding(f.id, { status: 'fixed' })}>Mark fixed</Button>
            </div>

            <Textarea
              placeholder="Notes / explanation"
              defaultValue={f.notes ?? ''}
              onBlur={(e) => updateFinding(f.id, { notes: e.target.value })}
              className="text-sm"
            />
          </Card>
        ))}
      </section>
    </div>
  );
}
