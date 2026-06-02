/* Local bookings store. Frontend-only: there is no booking backend yet, so we
   persist to localStorage to make the booking → confirmation → my-bookings flow
   fully functional and demoable. Swap these for API calls when the backend exists. */

export interface Booking {
  id: string;
  therapistId: number;
  therapistName: string;
  sessionType: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  price: string;
  cancelled: boolean;
  createdAt: string;
}

const KEY = "wellnest_bookings";

function read(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(list: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const bookings = {
  list(): Booking[] {
    return read().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },
  get(id: string): Booking | undefined {
    return read().find((b) => b.id === id);
  },
  create(data: Omit<Booking, "id" | "cancelled" | "createdAt">): Booking {
    const booking: Booking = {
      ...data,
      id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      cancelled: false,
      createdAt: new Date().toISOString(),
    };
    write([...read(), booking]);
    return booking;
  },
  cancel(id: string) {
    write(read().map((b) => (b.id === id ? { ...b, cancelled: true } : b)));
  },
};

/** Upcoming if not cancelled and the date/time is in the future. */
export function isUpcoming(b: Booking): boolean {
  if (b.cancelled) return false;
  return new Date(`${b.date}T${b.time}`).getTime() >= Date.now();
}
