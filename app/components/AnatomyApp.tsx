"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Heart,
  LibraryBig,
  Mail,
  Microscope,
  NotebookPen,
  Phone,
  Play,
  Search,
  Share2,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { getOrganMap, getOrgans, type Organ, type OrganId } from "../lib/anatomy-data";
import { useI18n } from "../lib/i18n";
import { CONTACT } from "../lib/contact";
import { useLessonProgress, useNotes } from "../lib/notes";
import { DirArrow, LinkedinIcon, OrganArt, WhatsappIcon } from "./shared";
import { LessonsView, LibraryView, NotesView, SystemsView } from "./Sections";

type Modal = "lesson" | "quiz" | "animation" | "system" | null;
type View = "explore" | "systems" | "lessons" | "library" | "notes";

export function AnatomyApp() {
  const { locale, setLocale, t } = useI18n();
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [autoRotate, setAutoRotate] = useState(true);
  const [compare, setCompare] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [view, setView] = useState<View>("explore");
  const [profileOpen, setProfileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organs = useMemo(() => getOrgans(locale), [locale]);
  const organById = useMemo(() => getOrganMap(locale), [locale]);
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];
  const filteredOrgans = useMemo(
    () => organs.filter((item) => `${item.name} ${item.system}`.toLowerCase().includes(query.toLowerCase())),
    [query, organs],
  );
  const { completed: completedLessons, clearProgress } = useLessonProgress();
  const { notes, clearNotes } = useNotes();

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  // Closes the profile popover on an outside click or Escape, same pattern
  // any menu/dropdown needs since it isn't a native <dialog>.
  useEffect(() => {
    if (!profileOpen) return;
    const handlePointer = (event: PointerEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [profileOpen]);

  const handleResetProgress = () => {
    if (!window.confirm(t.profileMenu.resetConfirm)) return;
    clearProgress();
    clearNotes();
    setProfileOpen(false);
  };

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      ["organ", "microscopic", "compare", "location"].forEach((asset) => {
        const image = new Image();
        image.src = `/anatomy/${id}/${asset}.webp`;
      });
    }
    setOrganId(id);
    setMobileLibrary(false);
    setCompare(false);
  };

  // Used by the Systems and Library views, whose cards live outside the
  // Explore workspace — picking an organ there should also bring the viewer
  // back into view rather than leaving the reader on the section page.
  const goToOrgan = (id: OrganId) => {
    selectOrgan(id);
    setView("explore");
  };

  const startLesson = (id: OrganId) => {
    selectOrgan(id);
    setView("explore");
    setModal("lesson");
  };

  // Warms the model in the HTTP cache while the pointer is still travelling,
  // so the switch usually renders without a visible loading pass.
  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => goToOrgan("heart")} aria-label={t.brandHome}>
          <strong>{t.brandName}<sup>{t.brandMark}</sup></strong>
          <em>{t.tagline}</em>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className={view === "explore" ? "active" : ""} onClick={() => setView("explore")}><Compass size={17} /> {t.nav.explore}</button>
          <button className={view === "systems" ? "active" : ""} onClick={() => setView("systems")}><BrainCircuit size={17} /> {t.nav.systems}</button>
          <button className={view === "lessons" ? "active" : ""} onClick={() => setView("lessons")}><BookOpen size={17} /> {t.nav.lessons}</button>
          <button className={view === "library" ? "active" : ""} onClick={() => setView("library")}><LibraryBig size={17} /> {t.nav.library}</button>
          <button className={view === "notes" ? "active" : ""} onClick={() => setView("notes")}><NotebookPen size={17} /> {t.nav.notes}</button>
        </nav>
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
        </label>
        <button className="lang-switch" type="button" onClick={() => setLocale(locale === "en" ? "ar" : "en")} aria-label={t.langSwitchAria}>
          {t.langSwitchLabel}
        </button>
        <div className="profile-wrap" ref={profileRef}>
          <button
            className="profile"
            aria-label={t.openLearnerProfile}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span>{t.profileInitials}</span><ChevronDown size={15} />
          </button>
          {profileOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-menu-header">
                <span className="profile-menu-avatar">{t.profileInitials}</span>
                <strong>{t.profileMenu.title}</strong>
              </div>
              <button
                type="button"
                className="profile-menu-row"
                onClick={() => { setView("lessons"); setProfileOpen(false); }}
              >
                <BookOpen size={15} />
                <span>
                  <b>{t.profileMenu.lessonsLabel}</b>
                  <small>{t.profileMenu.lessonsProgress(completedLessons.length, organs.length)}</small>
                </span>
                <DirArrow size={13} />
              </button>
              <button
                type="button"
                className="profile-menu-row"
                onClick={() => { setView("notes"); setProfileOpen(false); }}
              >
                <NotebookPen size={15} />
                <span>
                  <b>{t.profileMenu.notesLabel}</b>
                  <small>{t.profileMenu.notesCount(notes.length)}</small>
                </span>
                <DirArrow size={13} />
              </button>
              <button type="button" className="profile-menu-reset" onClick={handleResetProgress}>
                {t.profileMenu.reset}
              </button>
            </div>
          )}
        </div>
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label={t.openLibrary}><LibraryBig size={20} /></button>
      </header>

      {view === "systems" && <SystemsView organs={organs} onSelectOrgan={goToOrgan} />}
      {view === "lessons" && <LessonsView organs={organs} onStartLesson={startLesson} />}
      {view === "library" && <LibraryView organs={organs} onSelectOrgan={goToOrgan} />}
      {view === "notes" && <NotesView organs={organs} />}

      {view === "explore" && <>
      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>{t.organLibrary}</span>
            <button aria-label={t.closeLibrary} className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
            <button aria-label={t.savedOrgans}><Bookmark size={17} /></button>
          </div>
          <div className="organ-list">
            {filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} asset="thumb" alt={t.organThumbnail(item.name)} size={47} />
                </span>
                <span><b>{item.name}</b><small>{item.system}</small></span>
                {organId === item.id && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
          </div>
          <button className="view-all" onClick={() => setQuery("")}>{t.viewAll} <DirArrow size={14} /></button>
          <blockquote>
            <Sparkles size={18} />
            <p>{t.curiosity.line1}<br />{t.curiosity.line2}</p>
            <em>{t.curiosity.sub}</em>
          </blockquote>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          compare={compare}
          onCompare={() => setCompare(!compare)}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> {t.theOrgan(organ.name)}</div>
          <div className="info-title-row" data-reveal>
            <div><h1>{organ.name}</h1><em>{organ.poetic}</em></div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} asset="organ" alt={t.organIllustration(organ.name)} size={92} />
            </span>
          </div>
          <p className="description" data-reveal>{organ.description}</p>
          <div className="rule" />
          <h2 data-reveal>{t.keyFacts}</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> {t.facts.size}</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> {t.facts.weight}</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> {t.facts.daily}</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> {t.facts.location}</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> {t.facts.bloodSupply}</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> {t.facts.function}</dt><dd>{organ.function}</dd></div>
          </dl>
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>{t.medicalImportance}</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>{t.didYouKnow}</b>{organ.funFact}</p></div>
          <button className="lesson-button" data-reveal onClick={() => setModal("lesson")}>{t.viewLesson} <DirArrow size={16} /></button>
          <div className="action-grid" data-reveal>
            <button onClick={() => setModal("animation")}><Play size={15} /> {t.animate}</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> {t.quiz}</button>
            <button onClick={() => setCompare(!compare)} className={compare ? "active" : ""}><Share2 size={15} /> {t.compare}</button>
          </div>
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label="Organ comparison">
          <div className="compare-organ"><OrganArt organ={organ} asset="thumb" alt="" /><span>{t.comparing}</span><strong>{organ.name}</strong><small>{organ.system}</small></div>
          <b>vs.</b>
          <div className="compare-organ"><OrganArt organ={reference} asset="thumb" alt="" /><span>{t.reference}</span><strong>{reference.name}</strong><small>{reference.system}</small></div>
          <dl><div><dt>{t.primaryRole}</dt><dd>{organ.function}</dd></div><div><dt>{t.scale}</dt><dd>{organ.size}</dd></div></dl>
          <button onClick={() => setCompare(false)} aria-label={t.closeComparison}><X size={16} /></button>
        </section>
      )}

      <section className="learning-cards" aria-label={t.learningResources(organ.name)}>
        <article className="curiosity-card contact-card">
          <ul className="contact-list">
            <li>
              <a className="contact-row" href={`mailto:${CONTACT.email}`} aria-label={t.contact.email}>
                <Mail size={15} /> <span>{CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a className="contact-row" href={CONTACT.phoneHref} aria-label={t.contact.phone}>
                <Phone size={15} /> <span dir="ltr">{CONTACT.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a className="contact-row" href={CONTACT.linkedinHref} target="_blank" rel="noopener noreferrer" aria-label={t.contact.linkedin}>
                <LinkedinIcon size={15} /> <span dir="ltr">{CONTACT.linkedinDisplay}</span>
              </a>
            </li>
            <li>
              <a className="contact-row" href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={t.contact.whatsapp}>
                <WhatsappIcon size={15} /> <span>{t.contact.whatsapp}</span>
              </a>
            </li>
          </ul>
        </article>
        <article>
          <header><div><em>{t.microscopicView}</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
          <div className="microscope-visual organ-card-image"><OrganArt organ={organ} asset="microscopic" alt={t.microscopicAlt(organ.name)} /></div>
          <button onClick={() => setModal("lesson")}>{t.exploreTissue} <DirArrow size={14} /></button>
        </article>
        <article>
          <header><div><em>{t.compareOrgans}</em><h3>{organ.comparison}</h3></div><Share2 size={17} /></header>
          <div className="comparison-visual organ-card-image"><OrganArt organ={organ} asset="compare" alt={t.comparisonAlt(organ.comparison)} /></div>
          <button onClick={() => setCompare(true)}>{t.openComparison} <DirArrow size={14} /></button>
        </article>
        <article>
          <header><div><em>{t.functionAnimation}</em><h3>{organ.function}</h3></div><Play size={17} /></header>
          {/* The artwork itself is the control, so the play badge inside it is
              decorative rather than a nested button. */}
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => setModal("animation")}
            aria-label={t.playFunctionAnimation(organ.name)}
          >
            <OrganArt organ={organ} asset="organ" alt="" />
            <i className="function-pulse" />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => setModal("animation")}>{t.playAnimation} <DirArrow size={14} /></button>
        </article>
        <article>
          <header><div><em>{t.clinicalNotes}</em><h3>{t.commonConditions}</h3></div><FileText size={17} /></header>
          <ul>{organ.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
          <button onClick={() => setModal("lesson")}>{t.seeAll} <DirArrow size={14} /></button>
        </article>
        <article className="system-card">
          <header><div><em>{t.whereItWorks}</em><h3>{organ.system}</h3></div><BrainCircuit size={17} /></header>
          <button
            type="button"
            className="system-visual organ-card-image"
            onClick={() => setModal("system")}
            aria-label={t.seeInBody(organ.name)}
          >
            <OrganArt organ={organ} asset="location" alt="" />
          </button>
          <button onClick={() => setModal("system")}>{t.seeSystem} <DirArrow size={14} /></button>
        </article>
      </section>
      </>}

      {modal && <LearningModal type={modal} organ={organ} onClose={() => setModal(null)} />}
      {mobileLibrary && <button className="drawer-backdrop" aria-label={t.closeLibrary} onClick={() => setMobileLibrary(false)} />}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  quiz: "?",
  animation: "▶",
  system: "⌖",
  lesson: "✦",
};

function LearningModal({ type, organ, onClose }: { type: Exclude<Modal, null>; organ: Organ; onClose: () => void }) {
  const { t } = useI18n();
  const organName = organ.name;
  const title = t.modalTitles[type](organName);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`learning-modal ${type === "system" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label={t.close}><X size={18} /></button>
        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>{t.guidedDiscovery}</em>
        <h2 id="modal-title">{title}</h2>
        {type === "quiz" ? (
          <div className="quiz-options">
            <p>{t.quizQuestion(organName)}</p>
            {t.quizOptions.map((option) => (
              <button key={option} onClick={onClose}>{option}</button>
            ))}
          </div>
        ) : type === "system" ? (
          <>
            <p>{t.systemTrace(organ.location, organName)}</p>
            {/* Shown whole rather than cropped into the circular demo — the
                point of this view is the figure and its vessels. */}
            <figure className="modal-figure">
              <OrganArt organ={organ} asset="location" alt={t.systemFigureAlt(organName, organ.system)} />
            </figure>
            <dl className="modal-facts">
              <div><dt>{t.systemLabel}</dt><dd>{organ.system}</dd></div>
              <div><dt>{t.primaryRole}</dt><dd>{organ.function}</dd></div>
              <div><dt>{t.facts.bloodSupply}</dt><dd>{organ.bloodSupply}</dd></div>
            </dl>
            <button className="lesson-button" onClick={onClose}>{t.continueExploring} <DirArrow size={16} /></button>
          </>
        ) : (
          <>
            <p>{t.lessonBody}</p>
            <div className={`modal-demo ${type === "animation" ? "moving" : ""}`}><OrganArt organ={organ} asset="organ" alt={t.lessonIllustrationAlt(organName)} /></div>
            <button className="lesson-button" onClick={onClose}>{t.continueExploring} <DirArrow size={16} /></button>
          </>
        )}
      </section>
    </div>
  );
}
