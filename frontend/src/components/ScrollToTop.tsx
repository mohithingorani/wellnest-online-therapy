import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/* React Router (non-data router) doesn't reset scroll on navigation, and the
   browser's own scroll-restoration can re-apply a previous offset — so new
   pages open mid-scroll. Standard fix:
     1. Take scroll restoration off "auto" so the browser stops restoring.
     2. Reset to the top on every path change, in a layout effect (synchronous,
        before paint) so the new page never flashes at the old offset.
   Keyed on pathname only — ?query changes (e.g. directory filters) must NOT
   yank the page to the top. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Fallbacks for browsers that scroll the element rather than the window.
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
