import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { Therapist, Specialty } from "../../services/adminApi";
import { DataTable } from "../../components/admin/DataTable";
import { SearchInput } from "../../components/admin/SearchInput";
import { Modal } from "../../components/admin/Modal";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { TableSkeleton } from "../../components/admin/Skeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { useToast } from "../../components/admin/Toast";

export default function TherapistManagement() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", experience: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<Therapist | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", experience: 0, specialtyIds: [] as string[] });
  const { addToast } = useToast();

  useEffect(() => {
    loadTherapists();
    loadSpecialties();
  }, []);

  const loadSpecialties = () => {
    adminApi.getSpecialties().then((res) => {
      if (res.success) setSpecialties(res.data);
    });
  };

  const loadTherapists = () => {
    adminApi
      .getTherapists()
      .then((res) => {
        if (res.success) setTherapists(res.data);
      })
      .catch((e) => {
        setError(e.message);
        addToast("Failed to load therapists", "error");
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (t: Therapist) => {
    setSelectedTherapist(t);
    setEditForm({ name: t.name, experience: t.experience });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!selectedTherapist) return;
    try {
      await adminApi.updateTherapist(selectedTherapist.id, editForm);
      addToast("Therapist updated successfully", "success");
      setEditMode(false);
      setSelectedTherapist(null);
      loadTherapists();
    } catch (e) {
      addToast("Failed to update therapist", "error");
    }
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.experience) {
      addToast("Name and experience are required", "error");
      return;
    }
    try {
      await adminApi.createTherapist(createForm);
      addToast("Therapist created successfully", "success");
      setCreateMode(false);
      setCreateForm({ name: "", experience: 0, specialtyIds: [] });
      loadTherapists();
    } catch (e) {
      addToast("Failed to create therapist", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await adminApi.deleteTherapist(deleteConfirm.id);
      addToast("Therapist deleted successfully", "success");
      loadTherapists();
    } catch (e) {
      addToast("Failed to delete therapist", "error");
    }
  };

  const filteredTherapists = therapists.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (t: Therapist) => (
        <div className="font-medium text-fg-strong">{t.name}</div>
      ),
    },
    {
      key: "experience",
      header: "Experience",
      render: (t: Therapist) => <span className="text-fg-muted">{t.experience} years</span>,
    },
    {
      key: "specialities",
      header: "Specialties",
      render: (t: Therapist) => (
        <div className="flex flex-wrap gap-1">
          {t.specialities.slice(0, 3).map((s) => (
            <span key={s.id} className="px-2 py-0.5 bg-[#4a6b52]/10 text-[#4a6b52] rounded-full text-xs">
              {s.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t: Therapist) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          t.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        }`}>
          {t.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (t: Therapist) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(t);
            }}
            className="p-1.5 rounded-lg text-fg-muted hover:bg-[#e4dccb] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(t);
            }}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
        <h1 className="text-2xl font-bold text-fg-strong font-display mb-6">Therapists</h1>
        <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb]">
          <TableSkeleton rows={8} cols={5} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg-strong font-display">Therapists</h1>
        <div className="flex items-center gap-4">
          <div className="w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Search therapists..." />
          </div>
          <button
            onClick={() => setCreateMode(true)}
            className="px-4 py-2.5 bg-[#4a6b52] text-white font-body font-medium rounded-xl hover:bg-[#3b5642] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Therapist
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#fffefb] rounded-2xl border border-[#e4dccb] overflow-hidden">
        {filteredTherapists.length === 0 ? (
          <EmptyState icon="therapists" title="No therapists found" description={search ? "Try adjusting your search" : "Therapists will appear here once registered"} />
        ) : (
          <DataTable columns={columns} data={filteredTherapists} keyExtractor={(t) => t.id} />
        )}
      </div>

      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit Therapist" size="md">
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
            <label className="block text-sm font-medium text-fg mb-1 font-body">Experience (years)</label>
            <input
              type="number"
              value={editForm.experience}
              onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) || 0 })}
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
        title="Delete Therapist"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <Modal isOpen={createMode} onClose={() => setCreateMode(false)} title="Add New Therapist" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Name</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="Dr. John Smith"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1 font-body">Experience (years)</label>
            <input
              type="number"
              value={createForm.experience || ""}
              onChange={(e) => setCreateForm({ ...createForm, experience: parseInt(e.target.value) || 0 })}
              placeholder="5"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e4dccb] bg-[#f7f4ec] text-fg-strong font-body text-sm focus:border-[#4a6b52] focus:ring-2 focus:ring-[#4a6b52]/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-2 font-body">Specialties (optional)</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    const ids = createForm.specialtyIds.includes(s.id)
                      ? createForm.specialtyIds.filter((id) => id !== s.id)
                      : [...createForm.specialtyIds, s.id];
                    setCreateForm({ ...createForm, specialtyIds: ids });
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                    createForm.specialtyIds.includes(s.id)
                      ? "bg-[#4a6b52] text-white"
                      : "bg-[#e4dccb] text-fg-muted hover:bg-[#ded4c0]"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
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
              Create Therapist
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}