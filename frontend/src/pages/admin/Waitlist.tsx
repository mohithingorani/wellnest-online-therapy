import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { WaitlistEntry } from "../../services/adminApi";
import { useToast } from "../../components/admin/Toast";

const CONCERN_LABELS: Record<string, string> = {
  burnout: "Burnout", gad7: "Anxiety", stress: "Stress", mood: "Mood",
};

export default function Waitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterConcern, setFilterConcern] = useState("all");
  const [deleting, setDeleting] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    adminApi.getWaitlist()
      .then((r) => { if (r.success) setEntries(r.data); })
      .catch(() => addToast("Failed to load waitlist", "error"))
      .finally(() => setLoading(false));
  }, [addToast]);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this entry from the waitlist?")) return;
    setDeleting(id);
    try {
      await adminApi.deleteWaitlistEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      addToast("Entry removed", "success");
    } catch {
      addToast("Failed to remove entry", "error");
    } finally {
      setDeleting(null);
    }
  };

  const exportCsv = () => {
    const rows = [["Email", "Concern", "City", "Joined"]];
    filtered.forEach((e) => rows.push([e.email, e.concern ?? "", e.city ?? "", new Date(e.createdAt).toLocaleDateString()]));
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const concerns = ["all", ...Array.from(new Set(entries.map((e) => e.concern).filter(Boolean))) as string[]];
  const filtered = entries.filter((e) => {
    const matchSearch = !search || e.email.toLowerCase().includes(search.toLowerCase()) || (e.city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchConcern = filterConcern === "all" || e.concern === filterConcern;
    return matchSearch && matchConcern;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-fg-strong font-display">Waitlist</h1>
          <p className="text-sm text-fg-muted mt-0.5">{entries.length} people waiting for a therapist match</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#4a6b52] text-white text-sm font-semibold hover:bg-[#3a5540] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export CSV
        </button>
      </div>

      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search email or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 pr-4 rounded-xl border border-[#e4dccb] bg-[#fffefb] text-sm text-fg-strong placeholder:text-fg-muted outline-none focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/15 transition-all w-64"
          />
        </div>
        <select
          value={filterConcern}
          onChange={(e) => setFilterConcern(e.target.value)}
          className="h-9 px-3 rounded-xl border border-[#e4dccb] bg-[#fffefb] text-sm text-fg-strong outline-none focus:border-[#4a6b52] transition-colors"
        >
          {concerns.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All concerns" : CONCERN_LABELS[c] ?? c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-[#e4dccb] flex gap-4">
              <div className="h-4 w-48 bg-[#e4dccb] rounded animate-pulse" />
              <div className="h-4 w-20 bg-[#e4dccb] rounded animate-pulse" />
              <div className="h-4 w-24 bg-[#e4dccb] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] py-16 text-center text-fg-muted">
          {entries.length === 0 ? "No waitlist entries yet" : "No entries match your filters"}
        </div>
      ) : (
        <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e4dccb] bg-[#f7f4ec]">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Concern</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">City</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Joined</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4dccb]">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#f7f4ec] transition-colors">
                  <td className="px-6 py-3.5 font-medium text-fg-strong">{entry.email}</td>
                  <td className="px-4 py-3.5">
                    {entry.concern ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#4a6b52]/10 text-[#4a6b52] text-xs font-semibold">
                        {CONCERN_LABELS[entry.concern] ?? entry.concern}
                      </span>
                    ) : <span className="text-fg-muted/50">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-fg-muted">{entry.city || "—"}</td>
                  <td className="px-4 py-3.5 text-fg-muted">{new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="p-1.5 rounded-lg text-fg-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-[#e4dccb] text-xs text-fg-muted">
            Showing {filtered.length} of {entries.length} entries
          </div>
        </div>
      )}
    </div>
  );
}
