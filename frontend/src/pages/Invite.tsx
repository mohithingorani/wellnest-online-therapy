import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReferralStats } from "../services/assessments";
import { ACHIEVEMENT_META } from "../services/seeds";

export default function Invite() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ code: string | null; uses: number; referredCount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getReferralStats().then(setStats).catch(() => navigate("/join", { state: { from: "/invite" } }));
  }, [navigate]);

  const link = stats?.code ? `${window.location.origin}/join?ref=${stats.code}` : "";

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (!stats) return (
    <div className="bg-bg min-h-[calc(100vh-68px)] grid place-items-center">
      <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
    </div>
  );

  return (
    <div className="bg-bg min-h-[calc(100vh-68px)]">
      <div className="mx-auto max-w-[680px] px-5 md:px-8 py-10 md:py-14 animate-page space-y-6">

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">Referrals</p>
          <h1 className="mt-2 font-display text-[2rem] font-medium text-fg-strong tracking-[-0.03em]">Invite a friend</h1>
          <p className="mt-2 text-sm text-fg-muted">You earn <span className="font-semibold text-fg-strong">75 Seeds</span> for every friend who signs up with your link. They start with a warm welcome too.</p>
        </div>

        {/* stat */}
        <div className="grid grid-cols-2 gap-4">
          <div className="surface-raised rounded-[1.4rem] p-5 text-center">
            <div className="font-display text-[2.8rem] font-semibold text-fg-strong leading-none">{stats.referredCount}</div>
            <div className="mt-2 text-xs text-fg-muted">Friends referred</div>
          </div>
          <div className="surface-raised rounded-[1.4rem] p-5 text-center">
            <div className="font-display text-[2.8rem] font-semibold text-accent leading-none">{stats.referredCount * 75}</div>
            <div className="mt-2 text-xs text-fg-muted">Seeds earned from referrals</div>
          </div>
        </div>

        {/* link card */}
        <div className="surface-raised rounded-[1.6rem] p-6 space-y-4">
          <p className="text-sm font-semibold text-fg-strong">Your referral link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 min-w-0 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-fg-muted outline-none select-all"
            />
            <button
              onClick={copy}
              className="h-10 px-4 rounded-xl bg-accent text-primary-fg text-sm font-semibold hover:bg-accent-hover transition-all shrink-0"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I've been using WellNest for mental wellness — it's free and really good. Check it out: ${link}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl ring-1 ring-border text-sm font-medium text-fg hover:bg-surface-2 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Looking after your mental health is the best investment you can make. WellNest makes it easy to start. Try it free: ${link}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl ring-1 ring-border text-sm font-medium text-fg hover:bg-surface-2 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              X / Twitter
            </a>
          </div>
        </div>

        {/* how it works */}
        <div className="surface-raised rounded-[1.6rem] p-6">
          <h3 className="font-display text-lg text-fg-strong mb-4">How it works</h3>
          <div className="space-y-4">
            {[
              { n: "1", t: "Share your link", d: "Send it to a friend who might benefit from WellNest." },
              { n: "2", t: "They sign up", d: "When they create an account using your link, it's tracked." },
              { n: "3", t: "Both of you earn", d: "You get 75 Seeds. They get a warm welcome into their wellness journey." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-accent/15 text-accent grid place-items-center text-[11px] font-bold shrink-0 mt-0.5">{s.n}</span>
                <div>
                  <div className="text-sm font-semibold text-fg-strong">{s.t}</div>
                  <div className="text-xs text-fg-muted mt-0.5">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* achievement tease */}
        <div className="flex items-center gap-3 rounded-2xl bg-sage-100/70 ring-1 ring-sage-200/60 px-5 py-3.5">
          <span className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-600 grid place-items-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
          <div>
            <div className="text-sm font-semibold text-fg-strong">{ACHIEVEMENT_META.connector.label} badge</div>
            <div className="text-xs text-fg-muted">{ACHIEVEMENT_META.connector.desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
