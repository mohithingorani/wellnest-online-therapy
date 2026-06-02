import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-10">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
