import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck, XCircle } from 'lucide-react';

const STATUS_COPY = {
  loading: 'Đang tải hàng đợi moderation…',
  forbidden: 'Bạn không có quyền truy cập khu vực quản trị.',
  error: 'Không thể tải hàng đợi moderation. Vui lòng thử lại.',
};

function riskClass(level) {
  if (level === 'critical' || level === 'high') return 'bg-rose-100 text-rose-700 border-rose-200';
  if (level === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
}

export default function AdminModeration() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState('loading');
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadQueue = useCallback(async () => {
    setState('loading');
    try {
      const response = await fetch('/api/admin/moderation/queue', { credentials: 'include' });
      if (response.status === 401 || response.status === 403) {
        setState('forbidden');
        return;
      }
      if (!response.ok) throw new Error('queue unavailable');
      const payload = await response.json();
      setItems(Array.isArray(payload.items) ? payload.items : []);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  const visibleItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.risk_level === filter);
  }, [filter, items]);

  async function resolveItem(id, decision) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/moderation/queue/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (!response.ok) throw new Error('resolution failed');
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setState('error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck className="h-4 w-4" /> Admin safety desk
            </div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Moderation queue</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Xem xét các nội dung được AI đánh dấu trước khi chúng được dịch hoặc phân phối tiếp.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'high', 'critical', 'medium'].map((value) => (
              <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${filter === value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'}`}>
                {value === 'all' ? 'Tất cả' : value}
              </button>
            ))}
            <button type="button" onClick={loadQueue} className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-900">Làm mới</button>
          </div>
        </header>

        {state === 'loading' && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">{STATUS_COPY.loading}</div>}
        {state === 'forbidden' && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-sm text-rose-700">{STATUS_COPY.forbidden}</div>}
        {state === 'error' && <div className="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center text-sm text-amber-700">{STATUS_COPY.error}</div>}

        {state === 'ready' && (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-3">
              <Stat icon={<Clock3 className="h-5 w-5" />} label="Chờ xử lý" value={items.length} />
              <Stat icon={<AlertTriangle className="h-5 w-5" />} label="Mức cao/nghiêm trọng" value={items.filter((item) => item.risk_level === 'high' || item.risk_level === 'critical').length} />
              <Stat icon={<ShieldCheck className="h-5 w-5" />} label="Policy engine" value="Active" />
            </section>
            {visibleItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-14 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" /><p className="mt-3 font-medium">Không có mục nào trong bộ lọc này.</p><p className="mt-1 text-sm text-slate-500">Hàng đợi sạch là tín hiệu tốt.</p></div>
            ) : (
              <section className="grid gap-5 xl:grid-cols-2">
                {visibleItems.map((item) => <ModerationCard key={item.id} item={item} busy={busyId === item.id} onResolve={resolveItem} />)}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Stat({ icon, label, value }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div><div className="mt-3 text-2xl font-semibold">{value}</div></div>;
}

function ModerationCard({ item, busy, onResolve }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${riskClass(item.risk_level)}`}>{item.risk_level || 'unknown'} risk</span><span className="text-xs text-slate-400">{item.reason_code || 'policy review'}</span></div><time className="text-xs text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</time></div><p className="mt-5 whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item.content || 'Nội dung đã được ẩn hoặc không còn khả dụng.'}</p><div className="mt-4 flex flex-wrap gap-2">{(Array.isArray(item.categories) ? item.categories : []).map((category) => <span key={category} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{category}</span>)}</div><div className="mt-6 flex flex-col gap-2 sm:flex-row"><button type="button" disabled={busy} onClick={() => onResolve(item.id, 'approve')} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> Cho phép</button><button type="button" disabled={busy} onClick={() => onResolve(item.id, 'reject')} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"><XCircle className="h-4 w-4" /> Từ chối</button></div></article>;
}
