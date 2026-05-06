const API_URL = "http://localhost:3000/api";

export interface Therapist {
  id: number;
  name: string;
  experience: number;
  gender: string;
  specialities: { id: string; name: string }[];
  sessionTypes: { id: number; name: string }[];
  therapyTypes: { id: number; name: string }[];
  languages: { id: number; name: string }[];
}

export async function fetchTherapists(): Promise<Therapist[]> {
  const res = await fetch(`${API_URL}/therapists`);
  if (!res.ok) throw new Error("Failed to fetch therapists");
  const data = await res.json();
  return data.data;
}

export async function fetchTherapist(id: number): Promise<Therapist> {
  const res = await fetch(`${API_URL}/therapists/${id}`);
  if (!res.ok) throw new Error("Failed to fetch therapist");
  const data = await res.json();
  return data.data;
}