import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { User } from "../../services/adminApi";
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

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (u: User) => <div className="font-medium text-white">{u.name}</div>,
    },
    {
      key: "email",
      header: "Email",
      render: (u: User) => <span className="text-gray-400">{u.email}</span>,
    },
    {
      key: "sessions",
      header: "Sessions",
      render: (u: User) => <span className="text-gray-400">{u.sessionCount}</span>,
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (u: User) => <span className="text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u: User) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          u.status === "active" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
        }`}>
          {u.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(u);
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-[#1f1f1f] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(u);
            }}
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white font-playfair mb-6">Users</h1>
        <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f]">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white font-playfair">Users</h1>
        <div className="flex items-center gap-4">
          <div className="w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
          </div>
          <button
            onClick={() => setCreateMode(true)}
            className="px-4 py-2.5 bg-[#47898E] text-white font-nunito font-medium rounded-xl hover:bg-[#3d787d] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-xl font-nunito text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden">
        {filteredUsers.length === 0 ? (
          <EmptyState icon="users" title="No users found" description={search ? "Try adjusting your search" : "Users will appear here once registered"} />
        ) : (
          <DataTable columns={columns} data={filteredUsers} keyExtractor={(u) => u.id} />
        )}
      </div>

      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setEditMode(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#1f1f1f] text-gray-300 font-nunito font-medium hover:bg-[#1f1f1f] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#47898E] text-white font-nunito font-medium hover:bg-[#3d787d] transition-colors"
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

      <Modal isOpen={createMode} onClose={() => setCreateMode(false)} title="Add New User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Name</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Email</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Password</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] text-white font-nunito text-sm focus:border-[#47898E] focus:ring-2 focus:ring-[#47898E]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setCreateMode(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#1f1f1f] text-gray-300 font-nunito font-medium hover:bg-[#1f1f1f] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#47898E] text-white font-nunito font-medium hover:bg-[#3d787d] transition-colors"
            >
              Create User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}