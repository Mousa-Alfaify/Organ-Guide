"use client";

import { useState } from "react";
import type { OrganId } from "./anatomy-data";

export type Note = {
  id: string;
  organId: OrganId;
  text: string;
  createdAt: number;
};

const NOTES_KEY = "organ-guide-notes";
const LESSONS_KEY = "organ-guide-completed-lessons";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — the update still
    // applies for this session even though it won't survive a reload.
  }
}

// These hooks only ever render inside client-only views (Notes / Lessons),
// which start hidden behind the "explore" default view — so reading
// localStorage in the initializer never diverges from the server render.
//
// Persistence happens inside the state updaters themselves rather than a
// `useEffect` keyed on the state: several call sites (e.g. "Start lesson")
// update this state and navigate away in the same click, unmounting the
// view before a `[state]`-effect would ever get to run.

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => readJSON(NOTES_KEY, []));

  const addNote = (organId: OrganId, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setNotes((prev) => {
      const next = [{ id: crypto.randomUUID(), organId, text: trimmed, createdAt: Date.now() }, ...prev];
      writeJSON(NOTES_KEY, next);
      return next;
    });
  };

  const removeNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((note) => note.id !== id);
      writeJSON(NOTES_KEY, next);
      return next;
    });
  };

  const clearNotes = () => {
    setNotes([]);
    writeJSON(NOTES_KEY, []);
  };

  return { notes, addNote, removeNote, clearNotes };
}

export function useLessonProgress() {
  const [completed, setCompleted] = useState<OrganId[]>(() => readJSON(LESSONS_KEY, []));

  const markComplete = (organId: OrganId) => {
    setCompleted((prev) => {
      if (prev.includes(organId)) return prev;
      const next = [...prev, organId];
      writeJSON(LESSONS_KEY, next);
      return next;
    });
  };

  const clearProgress = () => {
    setCompleted([]);
    writeJSON(LESSONS_KEY, []);
  };

  return { completed, markComplete, clearProgress };
}
