const API = import.meta.env.VITE_API_URL ?? "/api";
const authFetch = (path: string, init?: RequestInit) =>
  fetch(`${API}${path}`, { credentials: "include", ...init });

export interface AssessmentResult {
  id: number; type: string; score: number; band: string; answers: Record<string, number>; createdAt: string;
}

export async function saveAssessment(
  type: string, score: number, band: string, answers: Record<string, number>
): Promise<{ assessment: AssessmentResult; seedsAwarded: boolean }> {
  const res = await authFetch("/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, score, band, answers }),
  });
  const json = await res.json();
  return json.data;
}

export async function getAssessmentHistory(): Promise<AssessmentResult[]> {
  const res = await authFetch("/assessments/history");
  const json = await res.json();
  return json.data ?? [];
}

export async function getLatestAssessments(): Promise<Record<string, AssessmentResult | null>> {
  const res = await authFetch("/assessments/latest");
  const json = await res.json();
  return json.data ?? {};
}

export async function getReferralCode(): Promise<{ code: string; uses: number }> {
  const res = await authFetch("/referrals/me");
  const json = await res.json();
  return json.data;
}

export async function getReferralStats(): Promise<{ code: string | null; uses: number; referredCount: number }> {
  const res = await authFetch("/referrals/stats");
  const json = await res.json();
  return json.data;
}
