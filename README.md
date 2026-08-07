# Organ Guide · دليل الأعضاء

An interactive 3D human anatomy guide, fully bilingual in **English** and **Arabic**, with a distinct visual theme for each language.

دليل تفاعلي ثلاثي الأبعاد لأعضاء جسم الإنسان، ثنائي اللغة بالكامل (**العربية** و**الإنجليزية**)، مع ثيم بصري مختلف لكل لغة.

---

## Features · المزايا

- **9 organs in interactive 3D** — heart, brain, lungs, liver, kidneys, eye, intestine, pancreas, and skin. Rotate, zoom, isolate, cross-section, and layer each specimen, with clickable hotspots on the anatomical structures.
- **Full bilingual content** — every organ's description, key facts, clinical conditions, and hotspot labels are authored in both languages, not machine-translated at runtime.
- **Two themes** — English uses a warm cream "atelier" palette; Arabic switches to a gold-and-teal "illuminated manuscript" palette, with full RTL layout mirroring.
- **Five sections**
  - **Explore** — the 3D viewer with the organ library and detail panel
  - **Systems** — organs grouped by body system
  - **Lessons** — one guided lesson per organ, with progress saved locally
  - **Library** — the full illustrated reference grid with search
  - **Notes** — write and save personal study notes per organ
- **Learner profile** — a summary of lesson progress and saved notes, with a reset option.

## Tech stack · التقنيات

- [Next.js](https://nextjs.org) on [vinext](https://github.com/cloudflare/vinext) (Vite)
- [Three.js](https://threejs.org) for the WebGL viewer (Draco + Basis compressed assets)
- [GSAP](https://gsap.com) for panel transitions
- [Tailwind CSS](https://tailwindcss.com) plus custom CSS variables for theming
- Typeface: **Thmanyah Serif Text** (خط ثمانية), loaded locally via `next/font/local`

## Running locally · التشغيل محلياً

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Then open http://localhost:3000

```bash
npm run build   # production build
npm test        # build + rendered-HTML tests
```

## Project structure · بنية المشروع

```
app/
  components/
    AnatomyApp.tsx     # shell: topbar, nav, explore workspace, modals
    OrganViewer.tsx    # 3D viewer surface and its controls
    Sections.tsx       # Systems / Lessons / Library / Notes views
    shared.tsx         # shared artwork + icon components
  lib/
    anatomy-data.ts    # all organ content, English and Arabic
    i18n.tsx           # locale context, dictionaries, direction handling
    notes.ts           # localStorage-backed notes and lesson progress
    contact.ts         # contact details shown in the contact card
    three/             # viewer internals (loaders, hotspots, materials)
  fonts/               # Thmanyah Serif Text (woff2)
public/
  models/              # .glb organ models
  anatomy/<organ>/     # illustration set per organ
```

## Adding an organ · إضافة عضو جديد

Each organ needs three things:

1. A `.glb` model at `public/models/<id>.glb`
2. Five illustrations at `public/anatomy/<id>/` — `thumb`, `organ`, `microscopic`, `compare`, `location` (`.webp`)
3. An entry in **both** the English and Arabic arrays in `app/lib/anatomy-data.ts`, including hotspot positions in model space

Organs without illustrations can set `illustrated: false` to fall back to an accent glyph.

## Notes on assets · ملاحظة حول الأصول

The 3D models, anatomical illustrations, and the Thmanyah typeface are included for this project's use. If you fork or redistribute this repository, check the licensing terms of each asset set independently.

النماذج ثلاثية الأبعاد والرسوم التشريحية وخط ثمانية مُضمّنة لاستخدام هذا المشروع. عند نسخ المستودع أو إعادة توزيعه، يُرجى التحقق من شروط ترخيص كل مجموعة أصول على حدة.
