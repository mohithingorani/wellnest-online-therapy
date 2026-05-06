import { useEffect, useState } from "react";
import { adminApi } from "../../services/adminApi";
import type { Therapist } from "../../services/adminApi";
import { DataTable } from "../../components/admin/DataTable";
import { SearchInput } from "../../components/admin/SearchInput";
import { Modal } from "../../components/admin/Modal";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";
import { TableSkeleton } from "../../components/admin/Skeleton";
import { EmptyState } from "../../components/admin/EmptyState";
import { useToast } from "../../components/admin/Toast";

export default function TherapistManagement() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", experience: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<Therapist | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    loadTherapists();
  }, []);

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
        <div className="font-medium text-white">{t.name}</div>
      ),
    },
    {
      key: "experience",
      header: "Experience",
      render: (t: Therapist) => <span className="text-gray-400">{t.experience} years</span>,
    },
    {
      key: "specialities",
      header: "Specialties",
      render: (t: Therapist) => (
        <div className="flex flex-wrap gap-1">
          {t.specialities.slice(0, 3).map((s) => (
            <span key={s.id} className="px-2 py-0.5 bg-[#47898E]/10 text-[#47898E] rounded-full text-xs">
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
          t.status === "active" ? "bg-emerald-900/30 text-emerald-400" : "bg-amber-900/30 text-amber-400"
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
            className="p-1.5 rounded-lg text-gray-500 hover:bg-[#1f1f1f] transition-colors"
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
        <h1 className="text-2xl font-bold text-white font-playfair mb-6">Therapists</h1>
        <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f]">
          <TableSkeleton rows={8} cols={5} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white font-playfair">Therapists</h1>
        <div className="w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Search therapists..." />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 text-red-400 rounded-xl font-nunito text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f] overflow-hidden">
        {filteredTherapists.length === 0 ? (
          <EmptyState icon="therapists" title="No therapists found" description={search ? "Try adjusting your search" : "Therapists will appear here once registered"} />
        ) : (
          <DataTable columns={columns} data={filteredTherapists} keyExtractor={(t) => t.id} />
        )}
      </div>

      <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit Therapist" size="md">
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
            <label className="block text-sm font-medium text-gray-300 mb-1 font-nunito">Experience (years)</label>
            <input
              type="number"
              value={editForm.experience}
              onChange={(e) => setEditForm({ ...editForm, experience: parseInt(e.target.value) || 0 })}
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
        title="Delete Therapist"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}