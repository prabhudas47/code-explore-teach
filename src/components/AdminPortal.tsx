import { useState, useEffect } from 'react';
import { fetchAllPortfolioData, updatePortfolioData } from '@/hooks/usePortfolioData';
import { toast } from 'sonner';

const ADMIN_NAME = 'Prabhu';
const ADMIN_PASS = 'Prabhudasu42@';

interface AdminPortalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminPortal = ({ open, onClose }: AdminPortalProps) => {
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [allData, setAllData] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState('about');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && authed) {
      setLoading(true);
      fetchAllPortfolioData().then(d => { setAllData(d); setLoading(false); });
    }
  }, [open, authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === ADMIN_NAME && password === ADMIN_PASS) {
      setAuthed(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleClose = () => {
    setAuthed(false);
    setName('');
    setPassword('');
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(allData).map(([section, data]) => updatePortfolioData(section, data))
      );
      toast.success('Portfolio updated successfully!');
    } catch {
      toast.error('Failed to save changes');
    }
    setSaving(false);
  };

  const updateField = (section: string, path: string, value: any) => {
    setAllData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy[section];
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const addArrayItem = (section: string, template: any) => {
    setAllData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (Array.isArray(copy[section])) {
        copy[section].push(template);
      }
      return copy;
    });
  };

  const removeArrayItem = (section: string, index: number) => {
    setAllData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (Array.isArray(copy[section])) {
        copy[section].splice(index, 1);
      }
      return copy;
    });
  };

  if (!open) return null;

  const sections = [
    { key: 'about', label: 'About' },
    { key: 'education', label: 'Education' },
    { key: 'core_focus', label: 'Core Focus' },
    { key: 'projects', label: 'Projects' },
    { key: 'skills', label: 'Skills' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'contact', label: 'Contact' },
    { key: 'footer', label: 'Footer' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'hsl(var(--card))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {authed ? '⚡ Admin Portal' : '🔐 Admin Login'}
          </h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!authed ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mt-2 bg-transparent border-b border-border px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="Enter name"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-2 bg-transparent border-b border-border px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                placeholder="Enter password"
              />
            </div>
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-foreground text-background font-medium text-sm tracking-wider uppercase hover:scale-[1.02] transition-transform"
            >
              Login
            </button>
          </form>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <p className="text-muted-foreground text-sm">Loading data...</p>
          </div>
        ) : (
          /* Editor */
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-40 shrink-0 border-r border-border overflow-y-auto py-2">
              {sections.map(s => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                    activeSection === s.key
                      ? 'text-foreground bg-accent/50 font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeSection === 'about' && allData.about && (
                <AboutEditor data={allData.about} onChange={(path, val) => updateField('about', path, val)} />
              )}
              {activeSection === 'education' && allData.education && (
                <ArrayEditor
                  data={allData.education}
                  fields={['period', 'title', 'institution']}
                  onChange={(path, val) => updateField('education', path, val)}
                  onAdd={() => addArrayItem('education', { period: '', title: '', institution: '' })}
                  onRemove={(i) => removeArrayItem('education', i)}
                />
              )}
              {activeSection === 'core_focus' && allData.core_focus && (
                <ArrayEditor
                  data={allData.core_focus}
                  fields={['num', 'title', 'desc']}
                  onChange={(path, val) => updateField('core_focus', path, val)}
                  onAdd={() => addArrayItem('core_focus', { num: '', title: '', desc: '' })}
                  onRemove={(i) => removeArrayItem('core_focus', i)}
                />
              )}
              {activeSection === 'projects' && allData.projects && (
                <ProjectsEditor
                  data={allData.projects}
                  onChange={(path, val) => updateField('projects', path, val)}
                  onAdd={() => addArrayItem('projects', { num: '', title: '', description: '', tech: [] })}
                  onRemove={(i) => removeArrayItem('projects', i)}
                />
              )}
              {activeSection === 'skills' && allData.skills && (
                <SkillsEditor data={allData.skills} onChange={(path, val) => updateField('skills', path, val)} />
              )}
              {activeSection === 'certifications' && allData.certifications && (
                <ArrayEditor
                  data={allData.certifications}
                  fields={['icon', 'title']}
                  onChange={(path, val) => updateField('certifications', path, val)}
                  onAdd={() => addArrayItem('certifications', { title: '', icon: '' })}
                  onRemove={(i) => removeArrayItem('certifications', i)}
                />
              )}
              {activeSection === 'contact' && allData.contact && (
                <AboutEditor data={allData.contact} onChange={(path, val) => updateField('contact', path, val)} />
              )}
              {activeSection === 'footer' && allData.footer && (
                <AboutEditor data={allData.footer} onChange={(path, val) => updateField('footer', path, val)} />
              )}

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-foreground text-background font-medium text-sm tracking-wider uppercase hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Sub-editors */

const FieldInput = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div className="mb-3">
    <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full mt-1 bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full mt-1 bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
      />
    )}
  </div>
);

const AboutEditor = ({ data, onChange }: { data: Record<string, any>; onChange: (path: string, val: any) => void }) => (
  <div>
    {Object.entries(data).map(([key, val]) => (
      <FieldInput
        key={key}
        label={key}
        value={String(val)}
        onChange={v => onChange(key, v)}
        multiline={String(val).length > 60}
      />
    ))}
  </div>
);

const ArrayEditor = ({
  data, fields, onChange, onAdd, onRemove,
}: {
  data: any[];
  fields: string[];
  onChange: (path: string, val: any) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) => (
  <div className="space-y-4">
    {data.map((item, i) => (
      <div key={i} className="border border-border rounded-lg p-4 relative">
        <button
          onClick={() => onRemove(i)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 text-xs"
        >
          ✕
        </button>
        {fields.map(f => (
          <FieldInput
            key={f}
            label={f}
            value={String(item[f] ?? '')}
            onChange={v => onChange(`${i}.${f}`, v)}
            multiline={f === 'desc' || f === 'description'}
          />
        ))}
      </div>
    ))}
    <button
      onClick={onAdd}
      className="text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-4 py-2 w-full transition-colors"
    >
      + Add Item
    </button>
  </div>
);

const ProjectsEditor = ({
  data, onChange, onAdd, onRemove,
}: {
  data: any[];
  onChange: (path: string, val: any) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) => (
  <div className="space-y-4">
    {data.map((item, i) => (
      <div key={i} className="border border-border rounded-lg p-4 relative">
        <button
          onClick={() => onRemove(i)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 text-xs"
        >
          ✕
        </button>
        <FieldInput label="num" value={item.num} onChange={v => onChange(`${i}.num`, v)} />
        <FieldInput label="title" value={item.title} onChange={v => onChange(`${i}.title`, v)} />
        <FieldInput label="description" value={item.description} onChange={v => onChange(`${i}.description`, v)} multiline />
        <FieldInput
          label="tech (comma-separated)"
          value={(item.tech || []).join(', ')}
          onChange={v => onChange(`${i}.tech`, v.split(',').map((s: string) => s.trim()).filter(Boolean))}
        />
      </div>
    ))}
    <button
      onClick={onAdd}
      className="text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-4 py-2 w-full transition-colors"
    >
      + Add Project
    </button>
  </div>
);

const SkillsEditor = ({ data, onChange }: { data: { left: string[]; right: string[] }; onChange: (path: string, val: any) => void }) => (
  <div className="space-y-4">
    <FieldInput
      label="Left column (comma-separated)"
      value={data.left.join(', ')}
      onChange={v => onChange('left', v.split(',').map(s => s.trim()).filter(Boolean))}
    />
    <FieldInput
      label="Right column (comma-separated)"
      value={data.right.join(', ')}
      onChange={v => onChange('right', v.split(',').map(s => s.trim()).filter(Boolean))}
    />
  </div>
);
