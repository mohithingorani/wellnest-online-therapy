import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { User, UserDetail } from "../../services/adminApi";
import { DataTable } from "../../components/admin/DataTable";
import { SearchInput } from "../../components/admin/SearchInput";
import { Modal } from "../../components/admin/Modal";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { TableSkeleton } from "../../components/admin/Skeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { useToast } from "../../components/admin/Toast";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
  const [detailUserId, setDetailUserId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    adminApi
      .getUsers()
      .then((res) => {
        if (res.success) setUsers(res.data);
      })
      .catch((e) => {
        setError(e.message);
        addToast("Failed to load users", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setEditForm({ name: u.name, email: u.email });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.updateUser(selectedUser.id, editForm);
      addToast("User updated successfully", "success");
      setEditMode(false);
      setSelectedUser(null);
      loadUsers();
    } catch (e) {
      addToast("Failed to update user", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteUser(deleteConfirm.id);
      addToast("User deleted successfully", "success");
      loadUsers();
    } catch (e) {
      addToast("Failed to delete user", "error");
    }
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      addToast("Name, email, and password are required", "error");
      return;
    }
    try {
      await adminApi.createUser(createForm);
      addToast("User created successfully", "success");
      setCreateMode(false);
      setCreateForm({ name: "", email: "", password: "" });
      loadUsers();
    } catch (e) {
      addToast("Failed to create user", "error");
    }
  };

  const openDetail = (id: number) => {
    setDetailUserId(id);
    setUserDetail(null);
    setDetailLoading(true);
    adminApi.getUserDetail(id)
      .then((r) => { if (r.success) setUserDetail(r.data); })
      .catch(() => addToast("Failed to load user details", "error"))
      .finally(() => setDetailLoading(false));
  };

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (u: User) => <div className="font-medium text-fg-strong">{u.name}</div>,
    },
    {
      key: "email",
      header: "Email",
      render: (u: User) => <span className="text-fg-muted">{u.email}</span>,
    },
    {
      key: "sessions",
      header: "Sessions",
      render: (u: User) => <span className="text-fg-muted">{u.sessionCount}</span>,
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (u: User) => <span className="text-fg-muted">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u: User) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          u.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        }`}>
          {u.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u: User) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); openDetail(u.id); }}
            className="p-1.5 rounded-lg text-[#4a6b52] hover:bg-[#4a6b52]/10 transition-colors"
            title="View profile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-12.458 0C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(u); }}
            className="p-1.5 rounded-lg text-fg-muted hover:bg-[#e4dccb] transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(u); }}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-fg-strong font-display mb-6">Users</h1>
        <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb]">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg-strong font-display">Users</h1>
        <div className="flex items-center gap-4">
          <div className="w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
          </div>
          <button
            onClick={() => setCreateMode(true)}
            className="px-4 py-2.5 bg-[#4a6b52] text-white font-body font-medium rounded-xl hover:bg-[#3b5642] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] overflow-hidden">
        {filteredUsers.length === 0 ? (
          <EmptyState icon="users" title="No users found" description={search ? "Try adjusting your search" : "Users will appear here once registered"} />
        ) : (
          <DataTable columns={columns} data={filteredUsers} keyExtractor={(u) => u.id} />
        )}
      </div>

      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e4dccb] text-fg font-body font-medium hover:bg-[#e4dccb] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#4a6b52] text-white font-body font-medium hover:bg-[#3b5642] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* ── User detail modal ── */}
      <Modal isOpen={detailUserId !== null} onClose={() => { setDetailUserId(null); setUserDetail(null); }} title="User Profile" size="lg">
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-[#e4dccb] border-t-[#4a6b52] animate-spin" />
          </div>
        ) : userDetail ? (
          <div className="space-y-6">
            {/* header */}
            <div className="flex items-center gap-4 pb-5 border-b border-[#e4dccb]">
              <div className="w-12 h-12 rounded-full bg-[#4a6b52]/15 text-[#4a6b52] grid place-items-center font-bold text-lg font-display">
                {userDetail.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-fg-strong">{userDetail.user.name}</div>
                <div className="text-sm text-fg-muted">{userDetail.user.email}</div>
                <div className="text-xs text-fg-muted/60 mt-0.5">Joined {new Date(userDetail.user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
              </div>
            </div>

            {/* stats row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Seeds",         value: userDetail.seeds?.total ?? 0 },
                { label: "Lifetime Seeds", value: userDetail.seeds?.lifetimeEarned ?? 0 },
                { label: "Journal",        value: userDetail.journalCount },
                { label: "Achievements",   value: userDetail.achievements.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-[#f7f4ec] p-3 text-center">
                  <div className="font-display font-semibold text-xl text-fg-strong">{s.value}</div>
                  <div className="text-[11px] text-fg-muted mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* assessments */}
            {userDetail.assessments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-fg-strong mb-3">Assessment History</h3>
                <div className="rounded-xl border border-[#e4dccb] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#f7f4ec] border-b border-[#e4dccb]">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">Type</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">Score</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">Band</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4dccb]">
                      {userDetail.assessments.map((a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-2.5 font-medium text-fg-strong capitalize">{a.type === "gad7" ? "Anxiety" : a.type}</td>
                          <td className="px-4 py-2.5 text-fg-muted">{a.score}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              a.band === "minimal" ? "bg-green-50 text-green-600" :
                              a.band === "mild"    ? "bg-yellow-50 text-yellow-600" :
                              a.band === "moderate" ? "bg-orange-50 text-orange-600" :
                              "bg-red-50 text-red-600"
                            }`}>{a.band}</span>
                          </td>
                          <td className="px-4 py-2.5 text-fg-muted text-xs">{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* achievements */}
            {userDetail.achievements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-fg-strong mb-3">Achievements ({userDetail.achievements.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {userDetail.achievements.map((a) => (
                    <span key={a.id} className="px-3 py-1.5 rounded-full bg-[#4a6b52]/10 text-[#4a6b52] text-xs font-semibold capitalize">
                      {a.slug.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {userDetail.assessments.length === 0 && userDetail.journalCount === 0 && (
              <p className="text-sm text-fg-muted text-center py-4">This user hasn't used any features yet.</p>
            )}
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={createMode} onClose={() => setCreateMode(false)} title="Add New User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Name</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Email</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Password</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setCreateMode(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#e4dccb] text-fg font-body font-medium hover:bg-[#e4dccb] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#4a6b52] text-white font-body font-medium hover:bg-[#3b5642] transition-colors"
            >
              Create User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}