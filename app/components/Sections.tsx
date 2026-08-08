"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Search, Trash2 } from "lucide-react";
import { useI18n } from "../lib/i18n";
import { useLessonProgress, useNotes } from "../lib/notes";
import type { Organ, OrganId } from "../lib/anatomy-data";
import { DirArrow, OrganArt } from "./shared";

/** Groups organs by their `system` field, in first-seen order, so the layout
 *  follows the same order as the organ library rather than re-sorting it. */
function useSystemGroups(organs: Organ[]) {
  return useMemo(() => {
    const map = new Map<string, Organ[]>();
    for (const organ of organs) {
      const list = map.get(organ.system);
      if (list) list.push(organ);
      else map.set(organ.system, [organ]);
    }
    return Array.from(map.entries());
  }, [organs]);
}

export function SystemsView({ organs, onSelectOrgan }: { organs: Organ[]; onSelectOrgan: (id: OrganId) => void }) {
  const { t } = useI18n();
  const groups = useSystemGroups(organs);

  return (
    <section className="page-view systems-view" aria-label={t.sections.systems.title}>
      <header className="page-view-header">
        <h1>{t.sections.systems.title}</h1>
        <p>{t.sections.systems.subtitle}</p>
      </header>
      <div className="systems-grid">
        {groups.map(([system, list]) => (
          <article key={system} className="system-group">
            <header>
              <h2>{system}</h2>
              <span>{t.sections.systems.organCount(list.length)}</span>
            </header>
            <div className="system-organ-list">
              {list.map((organ) => (
                <button
                  type="button"
                  key={organ.id}
                  className="system-organ-chip"
                  onClick={() => onSelectOrgan(organ.id)}
                  style={{ "--item-accent": organ.accent } as React.CSSProperties}
                >
                  <span className="organ-glyph"><OrganArt organ={organ} asset="thumb" alt="" size={38} /></span>
                  {organ.name}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LessonsView({ organs, onStartLesson }: { organs: Organ[]; onStartLesson: (id: OrganId) => void }) {
  const { t } = useI18n();
  const { completed, markComplete } = useLessonProgress();
  const doneCount = organs.filter((organ) => completed.includes(organ.id)).length;
  const progressPercent = organs.length ? Math.round((doneCount / organs.length) * 100) : 0;

  const handleStart = (id: OrganId) => {
    markComplete(id);
    onStartLesson(id);
  };

  return (
    <section className="page-view lessons-view" aria-label={t.sections.lessons.title}>
      <header className="page-view-header">
        <h1>{t.sections.lessons.title}</h1>
        <p>{t.sections.lessons.subtitle}</p>
        <div className="lesson-progress">
          <div className="lesson-progress-track"><i style={{ width: `${progressPercent}%` }} /></div>
          <span>{t.sections.lessons.progress(doneCount, organs.length)}</span>
        </div>
      </header>
      <div className="lessons-grid">
        {organs.map((organ) => {
          const isDone = completed.includes(organ.id);
          return (
            <article
              key={organ.id}
              className={`lesson-card ${isDone ? "done" : ""}`}
              style={{ "--item-accent": organ.accent } as React.CSSProperties}
            >
              {isDone && <span className="lesson-badge"><CheckCircle2 size={13} /> {t.sections.lessons.completed}</span>}
              <span className="organ-glyph"><OrganArt organ={organ} asset="thumb" alt="" size={54} /></span>
              <h3>{organ.name}</h3>
              <em>{organ.poetic}</em>
              <p>{organ.description}</p>
              <button type="button" onClick={() => handleStart(organ.id)}>
                {isDone ? t.sections.lessons.review : t.sections.lessons.start} <DirArrow size={14} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LibraryView({ organs, onSelectOrgan }: { organs: Organ[]; onSelectOrgan: (id: OrganId) => void }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      organs.filter((organ) =>
        `${organ.name} ${organ.system} ${organ.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [organs, query],
  );

  return (
    <section className="page-view library-view" aria-label={t.sections.library.title}>
      <header className="page-view-header">
        <h1>{t.sections.library.title}</h1>
        <p>{t.sections.library.subtitle}</p>
        <label className="search-box library-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.sections.library.searchPlaceholder} />
        </label>
      </header>
      {filtered.length === 0 ? (
        <p className="empty-state">{t.sections.library.empty}</p>
      ) : (
        <div className="library-grid">
          {filtered.map((organ) => (
            <article key={organ.id} className="library-card" style={{ "--item-accent": organ.accent } as React.CSSProperties}>
              <div className="library-card-art"><OrganArt organ={organ} asset="organ" alt={t.organIllustration(organ.name)} /></div>
              <h3>{organ.name}</h3>
              <em>{organ.system}</em>
              <p>{organ.description}</p>
              <dl>
                <div><dt>{t.facts.size}</dt><dd>{organ.size}</dd></div>
                <div><dt>{t.facts.function}</dt><dd>{organ.function}</dd></div>
              </dl>
              <button type="button" onClick={() => onSelectOrgan(organ.id)}>{t.sections.library.viewIn3d} <DirArrow size={14} /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function NotesView({ organs }: { organs: Organ[] }) {
  const { t, locale } = useI18n();
  const { notes, addNote, removeNote } = useNotes();
  const [organId, setOrganId] = useState<OrganId>(organs[0].id);
  const [text, setText] = useState("");
  const organById = useMemo(
    () => Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>,
    [organs],
  );
  const selectedOrgan = organById[organId] ?? organs[0];
  const formatter = useMemo(
    () => new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", { dateStyle: "medium", timeStyle: "short" }),
    [locale],
  );

  const handleSave = () => {
    if (!text.trim()) return;
    addNote(organId, text);
    setText("");
  };

  return (
    <section className="page-view notes-view" aria-label={t.sections.notes.title}>
      <header className="page-view-header">
        <h1>{t.sections.notes.title}</h1>
        <p>{t.sections.notes.subtitle}</p>
      </header>

      <div className="note-composer">
        {/* Previews the artwork of whichever organ is selected, so the choice
            is visible before the note is saved rather than only after. */}
        <div className="note-organ-picker">
          <span className="note-organ-art" style={{ "--item-accent": selectedOrgan.accent } as React.CSSProperties}>
            <OrganArt organ={selectedOrgan} asset="organ" alt="" size={44} />
          </span>
          <select value={organId} onChange={(event) => setOrganId(event.target.value as OrganId)} aria-label={t.sections.notes.organLabel}>
            {organs.map((organ) => (
              <option key={organ.id} value={organ.id}>{organ.name}</option>
            ))}
          </select>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={t.sections.notes.placeholder}
          rows={3}
        />
        <button type="button" onClick={handleSave} disabled={!text.trim()}>{t.sections.notes.save}</button>
      </div>

      {notes.length === 0 ? (
        <p className="empty-state">{t.sections.notes.empty}</p>
      ) : (
        <>
          <p className="notes-count">{t.sections.notes.countLabel(notes.length)}</p>
          <ul className="notes-list">
            {notes.map((note) => {
              const organ = organById[note.organId];
              return (
                <li key={note.id} style={{ "--item-accent": organ?.accent ?? "#8d847c" } as React.CSSProperties}>
                  {organ && (
                    <span className="note-organ-art">
                      <OrganArt organ={organ} asset="organ" alt={t.organIllustration(organ.name)} size={56} />
                    </span>
                  )}
                  <div className="note-body">
                    <div className="note-meta">
                      <span className="note-organ-tag">{organ?.name ?? note.organId}</span>
                      <time>{t.sections.notes.savedOn} {formatter.format(note.createdAt)}</time>
                    </div>
                    <p>{note.text}</p>
                  </div>
                  <button type="button" className="note-delete" onClick={() => removeNote(note.id)} aria-label={t.sections.notes.delete}>
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
