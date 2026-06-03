/** Centralized icon library — clean SVG icons replacing emoji throughout the app */

type IconProps = { className?: string; strokeWidth?: number };
const d = (path: string, sw = 1.7) =>
  ({ className, strokeWidth = sw }: IconProps) => (
    <svg className={className ?? "w-5 h-5"} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );

export const IcFlame    = d("M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 10 6 13a6 6 0 0012 0c0-5-6-11-6-11z");
export const IcPen      = d("M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z");
export const IcWind     = d("M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2");
export const IcTarget   = d("M22 12h-4m-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-6 0h.01");
export const IcBook     = d("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253");
export const IcCalendar = d("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z");
export const IcUsers    = d("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z");
export const IcLeaf     = d("M12 21C12 21 4 15 4 9a8 8 0 0116 0c0 6-8 12-8 12z");
export const IcStar     = d("M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z");
export const IcCheck    = d("M5 13l4 4L19 7", 2.5);
export const IcShield   = d("M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z");
export const IcTicket   = d("M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z");
export const IcPhone    = d("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z");
export const IcGift     = d("M12 8v13m0-13V6a4 4 0 00-4-4 2 2 0 000 4h4zm0 0V6a4 4 0 014-4 2 2 0 010 4h-4zm-7 4h14M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7");
export const IcSearch   = d("M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z");
export const IcSpark    = d("M13 10V3L4 14h7v7l9-11h-7z");
export const IcMoon     = d("M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z");
