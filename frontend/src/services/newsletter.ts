const API = import.meta.env.VITE_API_URL ?? "/api";

export interface NewsletterResponse {
  success: boolean;
  data?: { alreadySubscribed?: boolean };
  message?: string;
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<NewsletterResponse> {
  const res = await fetch(`${API}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return res.json();
}
