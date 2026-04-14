import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllPortfolioData, updatePortfolioData } from '@/hooks/usePortfolioData';
import { MediaUpload, MultiMediaUpload } from '@/components/MediaUpload';
import { toast } from 'sonner';

const ADMIN_NAME = 'dasu';
const ADMIN_PASS = 'dasuprabhu42@';

interface AdminPortalProps {
  open: boolean;
  onClose: () => void;
}

export const AdminPortal = ({ open, onClose }: AdminPortalProps) => {
  const [authed, setAuthed] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [allData, setAllData] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState('hero');
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

  const updateSection = (section: string, data: any) => {
    setAllData(prev => ({ ...prev, [section]: data }));
  };

  const updateField = (section: string, path: string, value: any) => {
    setAllData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[section]) copy[section] = {};
      const keys = path.split('.');
      let obj = copy[section];
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  if (!open) return null;

  const sections = [
    { key: 'hero', label: 'Hero' },
    { key: 'professional_summary', label: 'Summary' },
    { key: 'about', label: 'About' },
    { key: 'education', label: 'Education' },
    { key: 'internships', label: 'Internships' },
    { key: 'core_focus', label: 'Core Focus' },
    { key: 'case_studies', label: 'Case Studies' },
    { key: 'projects', label: 'Projects' },
    { key: 'tech_stack', label: 'Tech Stack' },
    { key: 'skills', label: 'Skills' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'learning_timeline', label: 'Learning' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'currently_building', label: 'Building' },
    { key: 'contact', label: 'Contact' },
    { key: 'footer', label: 'Footer' },
    { key: 'media_manager', label: 'Media' },
  ];

  const initSectionIfEmpty = (key: string) => {
    if (allData[key]) return;
    const defaults: Record<string, any> = {
      hero: { name: 'DASU\nPrabhukumar', tagline: 'Data Science • AI • Automation', subtitle: 'I design intelligent systems, automate workflows,\nand build structured data-driven solutions.', profileImage: '', backgroundVideo: '' },
      professional_summary: { statement: '', highlights: [] },
      about: { heading: '', description: '' },
      education: [],
      internships: [],
      core_focus: [],
      case_studies: [],
      projects: [],
      tech_stack: [],
      skills: { left: [], right: [] },
      certifications: [],
      learning_timeline: [],
      achievements: [],
      currently_building: [],
      contact: { email: '', phone: '', linkedin: '', github: '', heading: '', subtext: '' },
      footer: { text: '' },
    };
    if (defaults[key]) updateSection(key, defaults[key]);
  };

  const renderEditor = () => {
    initSectionIfEmpty(activeSection);
    const d = allData[activeSection];
    if (!d) return <p className="text-sm text-muted-foreground">No data. Click Save to initialize.</p>;

    switch (activeSection) {
      case 'hero': return <HeroEditor data={d} onChange={(k, v) => updateField('hero', k, v)} />;
      case 'professional_summary': return <SummaryEditor data={d} onChange={(k, v) => updateField('professional_summary', k, v)} />;
      case 'about': return <ObjectEditor data={d} fields={[
        { key: 'heading', label: 'Heading', multiline: true },
        { key: 'description', label: 'Description', multiline: true },
      ]} onChange={(k, v) => updateField('about', k, v)} />;
      case 'education': return <ListEditor data={d} fields={[
        { key: 'title', label: 'Degree / Title' },
        { key: 'institution', label: 'Institution' },
        { key: 'period', label: 'Period' },
      ]} template={{ title: '', institution: '', period: '' }} onChange={data => updateSection('education', data)} />;
      case 'internships': return <InternshipsEditor data={d} onChange={data => updateSection('internships', data)} />;
      case 'core_focus': return <ListEditor data={d} fields={[
        { key: 'num', label: 'Number' },
        { key: 'title', label: 'Title' },
        { key: 'desc', label: 'Description', multiline: true },
      ]} template={{ num: '', title: '', desc: '' }} onChange={data => updateSection('core_focus', data)} />;
      case 'case_studies': return <CaseStudiesEditor data={d} onChange={data => updateSection('case_studies', data)} />;
      case 'projects': return <ProjectsEditorFull data={d} onChange={data => updateSection('projects', data)} />;
      case 'tech_stack': return <TechStackEditor data={d} onChange={data => updateSection('tech_stack', data)} />;
      case 'skills': return <SkillsEditor data={d} onChange={(k, v) => updateField('skills', k, v)} />;
      case 'certifications': return <CertificationsEditor data={d} onChange={data => updateSection('certifications', data)} />;
      case 'learning_timeline': return <ListEditor data={d} fields={[
        { key: 'year', label: 'Year' },
        { key: 'milestone', label: 'Milestone', multiline: true },
      ]} template={{ year: '', milestone: '' }} onChange={data => updateSection('learning_timeline', data)} />;
      case 'achievements': return <ListEditor data={d} fields={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'year', label: 'Year' },
      ]} template={{ title: '', description: '', year: '' }} onChange={data => updateSection('achievements', data)} />;
      case 'currently_building': return <ListEditor data={d} fields={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description', multiline: true },
        { key: 'progress', label: 'Progress (0-100)' },
      ]} template={{ title: '', description: '', progress: 0 }} onChange={data => updateSection('currently_building', data)} />;
      case 'contact': return <ObjectEditor data={d} fields={[
        { key: 'heading', label: 'Heading', multiline: true },
        { key: 'subtext', label: 'Subtext' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'linkedin', label: 'LinkedIn URL' },
        { key: 'github', label: 'GitHub URL' },
      ]} onChange={(k, v) => updateField('contact', k, v)} />;
      case 'footer': return <ObjectEditor data={d} fields={[
        { key: 'text', label: 'Footer Text' },
      ]} onChange={(k, v) => updateField('footer', k, v)} />;
      case 'media_manager': return <MediaManagerPanel />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl overflow-hidden flex flex-col" style={{ background: 'hsl(var(--card))' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{authed ? 'Admin Portal' : 'Admin Login'}</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {!authed ? (
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-2 bg-transparent border-b border-border px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="Enter name" autoFocus />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-2 bg-transparent border-b border-border px-0 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-0 top-1/2 -translate-y-1/2 mt-1 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M1 1l22 22"/><path d="M14.12 14.12a3 3 0 11-4.24-4.24"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-foreground text-background font-medium text-sm tracking-wider uppercase hover:scale-[1.02] transition-transform">Login</button>
          </form>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <p className="text-muted-foreground text-sm">Loading data...</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-40 shrink-0 border-r border-border overflow-y-auto py-2">
              {sections.map(s => (
                <button key={s.key} onClick={() => setActiveSection(s.key)} className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${activeSection === s.key ? 'text-foreground bg-accent/50 font-semibold' : 'text-muted-foreground hover:text-foreground'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {renderEditor()}
              <div className="pt-4">
                <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-foreground text-background font-medium text-sm tracking-wider uppercase hover:scale-[1.02] transition-transform disabled:opacity-50">
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

/* ========== Reusable Field Components ========== */

const Field = ({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) => (
  <div className="mb-3">
    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
    {multiline ? (
      <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} rows={3} placeholder={placeholder} className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors resize-none" />
    ) : (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors" />
    )}
  </div>
);

const ArrayField = ({ label, value, onChange, placeholder }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) => (
  <div className="mb-3">
    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
    <input value={(value || []).join(', ')} onChange={e => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder={placeholder || 'Comma-separated values'} className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground transition-colors" />
  </div>
);

const ImageField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <MediaUpload label={label} value={value ?? ''} onChange={onChange} accept="image/*,.pdf" />
);

const CardWrapper = ({ index, total, onRemove, onMoveUp, onMoveDown, children }: { index: number; total?: number; onRemove: () => void; onMoveUp?: () => void; onMoveDown?: () => void; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg p-4 relative mb-4 group/card">
    <div className="absolute top-2 right-2 flex items-center gap-1.5">
      {onMoveUp && index > 0 && (
        <button onClick={onMoveUp} title="Move up" className="text-muted-foreground hover:text-foreground text-xs transition-colors px-1">▲</button>
      )}
      {onMoveDown && total !== undefined && index < total - 1 && (
        <button onClick={onMoveDown} title="Move down" className="text-muted-foreground hover:text-foreground text-xs transition-colors px-1">▼</button>
      )}
      <button onClick={onRemove} className="text-muted-foreground hover:text-red-400 text-xs transition-colors ml-1">Remove</button>
    </div>
    <span className="text-[10px] text-muted-foreground font-mono mb-2 block">#{index + 1}</span>
    {children}
  </div>
);

const AddButton = ({ onClick, label }: { onClick: () => void; label?: string }) => (
  <button onClick={onClick} className="text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg px-4 py-2 w-full transition-colors">
    + {label || 'Add Item'}
  </button>
);

/* ========== Section Editors ========== */

const ObjectEditor = ({ data, fields, onChange }: { data: Record<string, any>; fields: { key: string; label: string; multiline?: boolean }[]; onChange: (key: string, val: any) => void }) => (
  <div>
    {fields.map(f => (
      <Field key={f.key} label={f.label} value={String(data[f.key] ?? '')} onChange={v => onChange(f.key, v)} multiline={f.multiline} />
    ))}
  </div>
);

const HeroEditor = ({ data, onChange }: { data: any; onChange: (key: string, val: any) => void }) => (
  <div>
    <Field label="Name (use \n for line break)" value={data.name ?? ''} onChange={v => onChange('name', v)} multiline />
    <Field label="Tagline" value={data.tagline ?? ''} onChange={v => onChange('tagline', v)} />
    <Field label="Subtitle" value={data.subtitle ?? ''} onChange={v => onChange('subtitle', v)} multiline />
    <MediaUpload label="Profile Image" value={data.profileImage ?? ''} onChange={v => onChange('profileImage', v)} accept="image/*" />
    <MediaUpload label="Background Video (optional)" value={data.backgroundVideo ?? ''} onChange={v => onChange('backgroundVideo', v)} accept="video/*" maxSizeMB={50} />
  </div>
);

const SummaryEditor = ({ data, onChange }: { data: any; onChange: (key: string, val: any) => void }) => (
  <div>
    <Field label="Statement" value={data.statement ?? ''} onChange={v => onChange('statement', v)} multiline />
    <ArrayField label="Highlighted Phrases" value={data.highlights ?? []} onChange={v => onChange('highlights', v)} />
  </div>
);

interface ListFieldDef { key: string; label: string; multiline?: boolean }

const swapItems = (arr: any[], a: number, b: number) => {
  const copy = [...arr];
  [copy[a], copy[b]] = [copy[b], copy[a]];
  return copy;
};

const ListEditor = ({ data, fields, template, onChange }: { data: any[]; fields: ListFieldDef[]; template: any; onChange: (data: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];
  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const add = () => onChange([...items, { ...template }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((item, i) => (
        <CardWrapper key={i} index={i} total={items.length} onRemove={() => remove(i)} onMoveUp={() => onChange(swapItems(items, i, i - 1))} onMoveDown={() => onChange(swapItems(items, i, i + 1))}>
          {fields.map(f => (
            <Field key={f.key} label={f.label} value={String(item[f.key] ?? '')} onChange={v => update(i, f.key, f.key === 'progress' ? Number(v) || 0 : v)} multiline={f.multiline} />
          ))}
        </CardWrapper>
      ))}
      <AddButton onClick={add} />
    </div>
  );
};

const InternshipsEditor = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];
  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const add = () => onChange([...items, { role: '', organization: '', duration: '', location: '', responsibilities: [], tools: [], contributions: '', learned: '', problem: '', outcome: '', offerLetterImg: '', completionCertImg: '', companyLogo: '', workScreenshots: [], internshipVideo: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((item, i) => (
        <CardWrapper key={i} index={i} onRemove={() => remove(i)}>
          <Field label="Role / Title" value={item.role ?? ''} onChange={v => update(i, 'role', v)} />
          <Field label="Company / Organization" value={item.organization ?? ''} onChange={v => update(i, 'organization', v)} />
          <Field label="Duration" value={item.duration ?? ''} onChange={v => update(i, 'duration', v)} />
          <Field label="Location" value={item.location ?? ''} onChange={v => update(i, 'location', v)} />
          <MediaUpload label="Company Logo" value={item.companyLogo ?? ''} onChange={v => update(i, 'companyLogo', v)} accept="image/*" />
          <ArrayField label="Responsibilities" value={item.responsibilities ?? []} onChange={v => update(i, 'responsibilities', v)} />
          <ArrayField label="Tools Used" value={item.tools ?? []} onChange={v => update(i, 'tools', v)} />
          <Field label="Problem Statement" value={item.problem ?? ''} onChange={v => update(i, 'problem', v)} multiline />
          <Field label="Key Contributions" value={item.contributions ?? ''} onChange={v => update(i, 'contributions', v)} multiline />
          <Field label="What I Learned" value={item.learned ?? ''} onChange={v => update(i, 'learned', v)} multiline />
          <Field label="Outcome" value={item.outcome ?? ''} onChange={v => update(i, 'outcome', v)} multiline />
          <MediaUpload label="Offer Letter (Image/PDF)" value={item.offerLetterImg ?? ''} onChange={v => update(i, 'offerLetterImg', v)} accept="image/*,.pdf" />
          <MediaUpload label="Completion Certificate (Image/PDF)" value={item.completionCertImg ?? ''} onChange={v => update(i, 'completionCertImg', v)} accept="image/*,.pdf" />
          <MultiMediaUpload label="Work Screenshots" values={item.workScreenshots ?? []} onChange={v => update(i, 'workScreenshots', v)} accept="image/*" />
          <MediaUpload label="Internship Video (optional)" value={item.internshipVideo ?? ''} onChange={v => update(i, 'internshipVideo', v)} accept="video/*" maxSizeMB={50} />
        </CardWrapper>
      ))}
      <AddButton onClick={add} label="Add Internship" />
    </div>
  );
};

const CaseStudiesEditor = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];
  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const add = () => onChange([...items, { name: '', problem: '', approach: '', outcome: '', technologies: [], features: [] }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((item, i) => (
        <CardWrapper key={i} index={i} onRemove={() => remove(i)}>
          <Field label="Project Name" value={item.name ?? ''} onChange={v => update(i, 'name', v)} />
          <Field label="Problem" value={item.problem ?? ''} onChange={v => update(i, 'problem', v)} multiline />
          <Field label="Approach" value={item.approach ?? ''} onChange={v => update(i, 'approach', v)} multiline />
          <Field label="Outcome" value={item.outcome ?? ''} onChange={v => update(i, 'outcome', v)} multiline />
          <ArrayField label="Technologies" value={item.technologies ?? []} onChange={v => update(i, 'technologies', v)} />
          <ArrayField label="Features" value={item.features ?? []} onChange={v => update(i, 'features', v)} />
        </CardWrapper>
      ))}
      <AddButton onClick={add} label="Add Case Study" />
    </div>
  );
};

const ProjectsEditorFull = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];
  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const add = () => onChange([...items, { num: String(items.length + 1).padStart(2, '0'), title: '', description: '', problem: '', approach: '', tech: [], features: [], githubLink: '', liveLink: '', images: [], demoVideo: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((item, i) => (
        <CardWrapper key={i} index={i} onRemove={() => remove(i)}>
          <Field label="Number" value={item.num ?? ''} onChange={v => update(i, 'num', v)} />
          <Field label="Project Title" value={item.title ?? ''} onChange={v => update(i, 'title', v)} />
          <Field label="Description" value={item.description ?? ''} onChange={v => update(i, 'description', v)} multiline />
          <Field label="Problem Statement" value={item.problem ?? ''} onChange={v => update(i, 'problem', v)} multiline />
          <Field label="Approach" value={item.approach ?? ''} onChange={v => update(i, 'approach', v)} multiline />
          <ArrayField label="Tech Stack" value={item.tech ?? []} onChange={v => update(i, 'tech', v)} />
          <ArrayField label="Features" value={item.features ?? []} onChange={v => update(i, 'features', v)} />
          <Field label="GitHub Link" value={item.githubLink ?? ''} onChange={v => update(i, 'githubLink', v)} />
          <Field label="Live Demo Link" value={item.liveLink ?? ''} onChange={v => update(i, 'liveLink', v)} />
          <MultiMediaUpload label="Project Images" values={item.images ?? []} onChange={v => update(i, 'images', v)} accept="image/*" />
          <MediaUpload label="Demo Video (optional)" value={item.demoVideo ?? ''} onChange={v => update(i, 'demoVideo', v)} accept="video/*" maxSizeMB={50} />
        </CardWrapper>
      ))}
      <AddButton onClick={add} label="Add Project" />
    </div>
  );
};

const TechStackEditor = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];

  const updateCategory = (gi: number, key: string, val: any) => {
    const copy = [...items];
    copy[gi] = { ...copy[gi], [key]: val };
    onChange(copy);
  };

  const updateItem = (gi: number, ii: number, key: string, val: string) => {
    const copy = JSON.parse(JSON.stringify(items));
    if (!copy[gi].items) copy[gi].items = [];
    if (!copy[gi].items[ii]) copy[gi].items[ii] = { name: '', context: '' };
    copy[gi].items[ii][key] = val;
    onChange(copy);
  };

  const addCategory = () => onChange([...items, { category: '', items: [] }]);
  const removeCategory = (gi: number) => onChange(items.filter((_, idx) => idx !== gi));

  const addItem = (gi: number) => {
    const copy = JSON.parse(JSON.stringify(items));
    if (!copy[gi].items) copy[gi].items = [];
    copy[gi].items.push({ name: '', context: '' });
    onChange(copy);
  };

  const removeItem = (gi: number, ii: number) => {
    const copy = JSON.parse(JSON.stringify(items));
    copy[gi].items.splice(ii, 1);
    onChange(copy);
  };

  return (
    <div>
      {items.map((group, gi) => (
        <CardWrapper key={gi} index={gi} onRemove={() => removeCategory(gi)}>
          <Field label="Category Name" value={group.category ?? ''} onChange={v => updateCategory(gi, 'category', v)} />
          <div className="mt-3 ml-4 space-y-3">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider block">Skills in this category</label>
            {(group.items || []).map((item: any, ii: number) => {
              const skill = typeof item === 'string' ? { name: item, context: '' } : item;
              return (
                <div key={ii} className="border border-border/50 rounded p-3 relative">
                  <button onClick={() => removeItem(gi, ii)} className="absolute top-1 right-2 text-[10px] text-muted-foreground hover:text-red-400">x</button>
                  <Field label="Skill Name" value={skill.name ?? ''} onChange={v => updateItem(gi, ii, 'name', v)} />
                  <Field label="Description (shown on click)" value={skill.context ?? ''} onChange={v => updateItem(gi, ii, 'context', v)} multiline />
                </div>
              );
            })}
            <button onClick={() => addItem(gi)} className="text-[10px] text-muted-foreground hover:text-foreground border border-dashed border-border/50 rounded px-3 py-1 transition-colors">
              + Add Skill
            </button>
          </div>
        </CardWrapper>
      ))}
      <AddButton onClick={addCategory} label="Add Category" />
    </div>
  );
};

const CertificationsEditor = ({ data, onChange }: { data: any[]; onChange: (d: any[]) => void }) => {
  const items = Array.isArray(data) ? data : [];
  const update = (i: number, key: string, val: any) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };
  const add = () => onChange([...items, { title: '', platform: '', date: '', description: '', skillsLearned: '', relevance: '', link: '', certificateImg: '', proofVideo: '' }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((item, i) => (
        <CardWrapper key={i} index={i} onRemove={() => remove(i)}>
          <Field label="Certificate Title" value={item.title ?? ''} onChange={v => update(i, 'title', v)} />
          <Field label="Platform" value={item.platform ?? ''} onChange={v => update(i, 'platform', v)} />
          <Field label="Year / Date" value={item.date ?? ''} onChange={v => update(i, 'date', v)} />
          <Field label="Description" value={item.description ?? ''} onChange={v => update(i, 'description', v)} multiline />
          <ArrayField label="Skills Learned" value={typeof item.skillsLearned === 'string' ? (item.skillsLearned ? item.skillsLearned.split(',').map((s: string) => s.trim()) : []) : (item.skillsLearned ?? [])} onChange={v => update(i, 'skillsLearned', v.join(', '))} />
          <Field label="Relevance" value={item.relevance ?? ''} onChange={v => update(i, 'relevance', v)} multiline />
          <Field label="Verification Link" value={item.link ?? ''} onChange={v => update(i, 'link', v)} />
          <MediaUpload label="Certificate Image" value={item.certificateImg ?? ''} onChange={v => update(i, 'certificateImg', v)} accept="image/*,.pdf" />
          <MediaUpload label="Proof Video (optional)" value={item.proofVideo ?? ''} onChange={v => update(i, 'proofVideo', v)} accept="video/*" maxSizeMB={50} />
        </CardWrapper>
      ))}
      <AddButton onClick={add} label="Add Certification" />
    </div>
  );
};

const SkillsEditor = ({ data, onChange }: { data: { left: string[]; right: string[] }; onChange: (key: string, val: any) => void }) => (
  <div className="space-y-4">
    <ArrayField label="Left Column Skills" value={data.left ?? []} onChange={v => onChange('left', v)} />
    <ArrayField label="Right Column Skills" value={data.right ?? []} onChange={v => onChange('right', v)} />
  </div>
);

const MediaManagerPanel = () => {
  const [files, setFiles] = useState<{ name: string; id: string; metadata: any; created_at: string }[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
  const [search, setSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'video' | 'pdf'>('image');

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase.storage.from('portfolio-media').list('uploads', {
        limit: 500,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (!error && data) {
        // Filter out .emptyFolderPlaceholder
        setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
      }
    } catch {
      toast.error('Failed to load media files');
    }
    setLoadingFiles(false);
  };

  useEffect(() => { loadFiles(); }, []);

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}"? This cannot be undone.`)) return;
    setDeleting(fileName);
    const { error } = await supabase.storage.from('portfolio-media').remove([`uploads/${fileName}`]);
    if (error) { toast.error('Delete failed: ' + error.message); }
    else { toast.success('File deleted'); setFiles(prev => prev.filter(f => f.name !== fileName)); }
    setDeleting(null);
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(`uploads/${fileName}`);
    return data.publicUrl;
  };

  const isImage = (name: string) => /\.(webp|jpg|jpeg|png|gif|svg|bmp)$/i.test(name);
  const isVideo = (name: string) => /\.(mp4|webm|mov|avi)$/i.test(name);
  const isPdf = (name: string) => /\.pdf$/i.test(name);

  const copyUrl = (fileName: string) => {
    navigator.clipboard.writeText(getPublicUrl(fileName));
    toast.success('URL copied to clipboard!');
  };

  const openPreview = (fileName: string) => {
    setPreviewUrl(getPublicUrl(fileName));
    setPreviewType(isImage(fileName) ? 'image' : isVideo(fileName) ? 'video' : 'pdf');
  };

  const formatSize = (metadata: any) => {
    const bytes = metadata?.size || metadata?.contentLength;
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString(); } catch { return '—'; }
  };

  const filteredFiles = files.filter(f => {
    if (filter === 'image' && !isImage(f.name)) return false;
    if (filter === 'video' && !isVideo(f.name)) return false;
    if (filter === 'pdf' && !isPdf(f.name)) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleUploadComplete = (url: string) => {
    if (url) {
      toast.success('Upload complete!');
      // Delay reload slightly to ensure storage is consistent
      setTimeout(() => loadFiles(), 500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Media Manager</h3>
          <p className="text-[10px] text-muted-foreground">Upload, preview, and manage all portfolio assets.</p>
        </div>
        <button onClick={loadFiles} className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-1 transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Upload area */}
      <MediaUpload label="Upload New File" value="" onChange={handleUploadComplete} accept="image/*,video/*,.pdf" maxSizeMB={50} />

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {(['all', 'image', 'video', 'pdf'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              {f === 'all' ? 'All' : f === 'image' ? 'Images' : f === 'video' ? 'Videos' : 'PDFs'}
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="flex-1 min-w-[120px] bg-transparent border border-border rounded-lg px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors" />
      </div>

      {/* File grid */}
      {loadingFiles ? (
        <p className="text-xs text-muted-foreground py-8 text-center">Loading files...</p>
      ) : filteredFiles.length === 0 ? (
        <p className="text-xs text-muted-foreground py-8 text-center">{files.length === 0 ? 'No files uploaded yet.' : 'No files match your filter.'}</p>
      ) : (
        <div>
          <p className="text-[10px] text-muted-foreground mb-2">{filteredFiles.length} file(s)</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredFiles.map(file => (
              <div key={file.name} className="border border-border rounded-lg overflow-hidden group relative">
                <div className="aspect-square bg-accent/20 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => openPreview(file.name)}>
                  {isImage(file.name) ? (
                    <img src={getPublicUrl(file.name)} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : isVideo(file.name) ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                      <video src={getPublicUrl(file.name)} className="w-full h-full object-cover" muted preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-foreground/80 rounded-full flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="hsl(var(--background))"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      </div>
                    </div>
                  ) : isPdf(file.name) ? (
                    <svg className="text-muted-foreground" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  ) : (
                    <svg className="text-muted-foreground" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/></svg>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[9px] text-foreground truncate font-medium">{file.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[8px] text-muted-foreground">{formatSize(file.metadata)}</span>
                    <span className="text-[8px] text-muted-foreground">{formatDate(file.created_at)}</span>
                  </div>
                </div>
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 pointer-events-none group-hover:pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); openPreview(file.name); }} className="px-2 py-1 bg-foreground/90 text-background text-[9px] rounded hover:bg-foreground transition-colors">Preview</button>
                  <button onClick={(e) => { e.stopPropagation(); copyUrl(file.name); }} className="px-2 py-1 bg-foreground/90 text-background text-[9px] rounded hover:bg-foreground transition-colors">Copy URL</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }} disabled={deleting === file.name} className="px-2 py-1 bg-red-500/90 text-white text-[9px] rounded hover:bg-red-500 transition-colors disabled:opacity-50">
                    {deleting === file.name ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setPreviewUrl(null)} onKeyDown={e => e.key === 'Escape' && setPreviewUrl(null)}>
          <div className="relative max-w-3xl max-h-[80vh] mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)} className="absolute -top-8 right-0 text-white/80 hover:text-white text-sm transition-colors">✕ Close</button>
            {previewType === 'image' && (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
            )}
            {previewType === 'video' && (
              <video src={previewUrl} className="max-w-full max-h-[80vh] rounded-lg" controls autoPlay muted />
            )}
            {previewType === 'pdf' && (
              <iframe src={previewUrl} className="w-[80vw] max-w-2xl h-[75vh] rounded-lg bg-white" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
