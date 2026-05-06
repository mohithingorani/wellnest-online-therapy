import { useState } from "react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useToast } from "../../components/admin/Toast";

export default function Settings() {
  const { admin } = useAdminAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: admin?.name || "", email: admin?.email || "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    addToast("Settings saved successfully", "success");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-playfair mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-6">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-nunito">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-nunito">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full px-4 py-2.5 rounded-xl bg-[#47898E] text-white font-nunito font-medium hover:bg-[#3d787d] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-6">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-nunito">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-nunito">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 font-nunito">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => addToast("Password updated successfully", "success")}
              className="w-full px-4 py-2.5 rounded-xl bg-[#47898E] text-white font-nunito font-medium hover:bg-[#3d787d] transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-6">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white font-nunito">Email Notifications</div>
                <div className="text-xs text-slate-500 font-nunito">Receive email notifications for important updates</div>
              </div>
              <button className="relative w-11 h-6 bg-[#47898E] rounded-full transition-colors">
                <span className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white font-nunito">Activity Alerts</div>
                <div className="text-xs text-slate-500 font-nunito">Get notified about new user registrations</div>
              </div>
              <button className="relative w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full transition-colors">
                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white font-nunito mb-6">Danger Zone</h2>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <div className="text-sm font-medium text-red-600 dark:text-red-400 font-nunito mb-2">Delete Account</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-nunito mb-3">Once you delete your account, there is no going back.</div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-nunito hover:bg-red-600 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}