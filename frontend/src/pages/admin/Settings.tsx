import { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useToast } from "../../components/admin/Toast";
import { adminApi } from "../../services/adminApi";

export default function Settings() {
  const { admin, updateAdmin } = useAdminAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityAlerts, setActivityAlerts] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await adminApi.updateProfile(form);
      if (res.success) {
        updateAdmin(res.data);
        addToast("Profile updated successfully", "success");
      }
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to update profile",
        "error",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      addToast("New password must be at least 8 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await adminApi.changePassword({ currentPassword, newPassword });
      if (res.success) {
        addToast("Password updated successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Failed to update password",
        "error",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all";
  const labelClass =
    "block text-sm font-medium text-fg mb-1 font-body";
  const cardClass =
    "bg-[#fffefb] rounded-2xl p-6 border border-[#e4dccb]";
  const buttonClass =
    "w-full px-4 py-2.5 rounded-xl bg-[#4a6b52] text-white font-body font-medium hover:bg-[#3b5642] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <h1 className="text-2xl font-bold text-fg-strong font-display mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-fg-strong font-body mb-6">
            Profile Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className={buttonClass}
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-fg-strong font-body mb-6">
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={savingPassword}
              className={buttonClass}
            >
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-fg-strong font-body mb-6">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-fg-strong font-body">
                  Email Notifications
                </div>
                <div className="text-xs text-fg-muted font-body">
                  Receive email notifications for important updates
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications((v) => !v)}
                aria-pressed={emailNotifications}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  emailNotifications ? "bg-[#4a6b52]" : "bg-[#e4dccb]"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-fg-strong font-body">
                  Activity Alerts
                </div>
                <div className="text-xs text-fg-muted font-body">
                  Get notified about new user registrations
                </div>
              </div>
              <button
                onClick={() => setActivityAlerts((v) => !v)}
                aria-pressed={activityAlerts}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  activityAlerts ? "bg-[#4a6b52]" : "bg-[#e4dccb]"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    activityAlerts ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-fg-muted font-body pt-2">
              Notification delivery is coming soon — these preferences are saved
              for your session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
