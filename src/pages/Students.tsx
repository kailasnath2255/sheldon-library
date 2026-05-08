import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHero from "@/components/shared/PageHero";
import StudentCard from "@/components/students/StudentCard";
import AddStudentModal from "@/components/students/AddStudentModal";
import EmptyState from "@/components/shared/EmptyState";
import { useStore } from "@/store/useStore";
import type { Student } from "@/lib/types";

export default function Students() {
  const { students, addStudent, removeStudent } = useStore();
  const [open, setOpen] = useState(false);

  const handleRemove = async (s: Student) => {
    if (!confirm(`This can't be undone. Remove ${s.name}?`)) return;
    try {
      await removeStudent(s.id);
      toast.success(`${s.name} removed.`);
    } catch (e) {
      toast.error("Something broke — try again.");
    }
  };

  return (
    <div>
      <PageHero
        title="Students"
        subtitle="Your roster. Pick the active one in the top bar to tailor every generator."
        right={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 active:scale-[0.98] transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add student
          </button>
        }
      />

      {students.length === 0 ? (
        <EmptyState
          title="Nothing here yet — add one."
          message="Add a student to start generating tailored content."
          action={
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition"
            >
              <Plus className="w-4 h-4" /> Add your first student
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <StudentCard key={s.id} student={s} onRemove={handleRemove} />
          ))}
        </div>
      )}

      <AddStudentModal
        open={open}
        onClose={() => setOpen(false)}
        defaultIndex={students.length}
        onSave={async (s) => {
          try {
            await addStudent(s);
            toast.success("Saved!");
          } catch {
            toast.error("Something broke — try again.");
            throw new Error("save failed");
          }
        }}
      />
    </div>
  );
}
