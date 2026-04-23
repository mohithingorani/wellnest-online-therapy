import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signin from "./pages/Signin.tsx";
import TherapistsPage from "./pages/Therapists.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="sign-in" element={<Signin />} />
      <Route path="therapists" element={<TherapistsPage />} />
    </Routes>
  </BrowserRouter>,
);
