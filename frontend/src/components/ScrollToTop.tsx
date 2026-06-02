import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* React Router doesn't reset scroll on navigation, so new pages can open
   mid-scroll. This scrolls to the top whenever the path changes — but NOT on
   ?query changes (e.g. directory filters update the URL and shouldn't jump). */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
