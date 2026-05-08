import { create } from "zustand";
import type {
  LibraryItem,
  NewAttempt,
  NewLibraryItem,
  NewStudent,
  QuizAttempt,
  Student,
} from "@/lib/types";
import { syncState, type GetAllResponse } from "@/lib/api";

type Store = {
  students: Student[];
  libraryItems: LibraryItem[];
  attempts: QuizAttempt[];
  activeStudentId: string | null;
  isHydrated: boolean;
  hydrateError: string | null;

  hydrate: () => Promise<void>;
  setActiveStudent: (id: string) => void;
  addStudent: (student: NewStudent) => Promise<Student>;
  removeStudent: (id: string) => Promise<void>;
  saveLibraryItem: (item: NewLibraryItem) => Promise<LibraryItem>;
  saveAttempt: (attempt: NewAttempt) => Promise<QuizAttempt>;
};

export const useStore = create<Store>((set, get) => ({
  students: [],
  libraryItems: [],
  attempts: [],
  activeStudentId: null,
  isHydrated: false,
  hydrateError: null,

  hydrate: async () => {
    try {
      const data = (await syncState("getAll")) as GetAllResponse;
      const sortedItems = [...data.libraryItems].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
      const sortedAttempts = [...data.attempts].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );
      const activeId = data.students[0]?.id ?? null;
      set({
        students: data.students,
        libraryItems: sortedItems,
        attempts: sortedAttempts,
        activeStudentId: activeId,
        isHydrated: true,
        hydrateError: null,
      });
    } catch (e) {
      set({
        isHydrated: true,
        hydrateError: e instanceof Error ? e.message : "Hydration failed.",
      });
    }
  },

  setActiveStudent: (id) => set({ activeStudentId: id }),

  addStudent: async (student) => {
    const created = (await syncState("createStudent", student)) as Student;
    set((s) => ({ students: [...s.students, created] }));
    return created;
  },

  removeStudent: async (id) => {
    await syncState("deleteStudent", id);
    set((s) => {
      const next = s.students.filter((x) => x.id !== id);
      const newActive =
        s.activeStudentId === id ? next[0]?.id ?? null : s.activeStudentId;
      return { students: next, activeStudentId: newActive };
    });
  },

  saveLibraryItem: async (item) => {
    const created = (await syncState("saveLibraryItem", item)) as LibraryItem;
    set((s) => ({ libraryItems: [created, ...s.libraryItems] }));
    return created;
  },

  saveAttempt: async (attempt) => {
    const created = (await syncState("saveAttempt", attempt)) as QuizAttempt;
    set((s) => ({ attempts: [...s.attempts, created] }));
    return created;
  },
}));

export const useActiveStudent = () => {
  const { students, activeStudentId } = useStore();
  return students.find((s) => s.id === activeStudentId) ?? null;
};
