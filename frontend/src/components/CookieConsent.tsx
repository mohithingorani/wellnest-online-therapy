import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-6 md:max-w-md z-50 animate-fade-in-up">
      <div className="surface-raised rounded-2xl p-5">
        <p className="text-sm text-fg leading-relaxed">
          We use cookies to improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={handleDecline}
            className="px-4 h-10 text-sm font-semibold rounded-full text-fg-strong hover:bg-surface-2 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 h-10 text-sm font-semibold rounded-full btn-material text-primary-fg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}