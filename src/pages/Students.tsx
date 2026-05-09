import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import PageHero from "@/components/shared/PageHero";
import StudentCard from "@/components/students/StudentCard";
import AddStudentModal from "@/components/students/AddStudentModal";
import EmptyState from "@/components/shared/EmptyState";
import Button from "@/components/shared/Button";
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
        eyebrow="Roster"
        title="Your students."
        subtitle="Pick the active one in the top bar to tailor every generator."
        right={
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>
            Add student
          </Button>
        }
      />

      {students.length === 0 ? (
        <EmptyState
          title="Nothing here yet — add one."
          message="Add a student to start generating tailored content."
          action={
            <Button variant="primary" size="md" icon={<UserPlus className="w-4 h-4" />} onClick={() => setOpen(true)}>
              Add your first student
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <StudentCard student={s} onRemove={handleRemove} />
            </motion.div>
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
