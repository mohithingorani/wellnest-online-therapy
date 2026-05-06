import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signin from "./pages/Signin.tsx";
import SignUp from "./pages/SignUp.tsx";
import TherapistsPage from "./pages/Therapists.tsx";
import TherapistPage2 from "./Therapist.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/therapists" element={<TherapistsPage />} />
      <Route path="/therapists/:id" element={<TherapistPage2/>}/>
    </Routes>
  </BrowserRouter>,
);
