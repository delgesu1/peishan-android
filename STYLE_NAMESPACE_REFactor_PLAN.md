# CSS Namespace & Utility Refactor Plan

_Author: Cascade AI Assistant – 2025-06-23_

## 1. Problem Statement

1. Legacy global selectors in `css/styles.css` (e.g. `.article-link::before`, `.article-link:hover`) unintentionally override section-specific styles.
2. Every new component/section needs higher-specificity or `!important` overrides to fight these rules – fragile and easy to forget.
3. Browser caching sometimes serves stale CSS, hiding recent edits.

## 2. Goals

* Eliminate hidden style clashes once-and-for-all.
* Adopt predictable, maintainable styling architecture:
  * **Section-scoped namespaces** (`#press`, `#contact`, `#teaching`, …).
  * **Opt-in utility classes** for cross-section effects (e.g. dark overlay).
* Introduce a lightweight cache-busting convention.

## 3. Existing Conflicts

| File | Selector | Side-Effect |
|------|----------|-------------|
| `css/styles.css` | `.article-link::before` | Dark gradient overlay on hover – masks custom button gradients |
| `css/styles.css` | `.article-link:hover` | Generic transform / shadow – overrides per-section tweaks |
| (various) | Broad `button, input, textarea` resets | Previously killed contact-form outlines |

## 4. Proposed Architecture

### 4.1 Section Namespace Pattern

```html
<section id="press"> … </section>
<section id="contact"> … </section>
```

```css
/* press-overrides.css */
#press .article-link { … }
#press .article-link:hover { … }
```
*Benefits*: beats generic selectors without `!important`, localises styles.

### 4.2 Utility / Token Classes

| Utility | Purpose |
|---------|---------|
| `.link-dark-overlay` | Adds dark hover overlay (old behaviour) |
| `.btn-primary` | Accent→lavender gradient button |
| `.blur-glass` | Glassmorphism background |

Utilities are **opt-in** – only used where explicitly added in the HTML.

### 4.3 Cache-Busting Convention

* Append `?v=YYYYMMDD` to custom CSS/JS links whenever those files change.
* Example already applied:
  ```html
  <link rel="stylesheet" href="css/press-overrides.css?v=20250623">
  ```

## 5. Implementation Steps

1. **Audit global styles**
   * Search for selectors that are generic element names or generic classes (`a`, `button`, `.article-link*`, etc.).
2. **Create utilities**
   * Move reusable effects into utility classes in `css/utilities.css`.
3. **Refactor HTML**
   * Where old global effects are desired (rare), add the new utility class to the element.
4. **Delete or neuter global rules**
   * Remove `.article-link::before`, `.article-link:hover` etc. from `styles.css` once utilities are wired.
5. **Ensure load order**
   * `styles.css` → `utilities.css` → section files (`press-overrides.css`, etc.).
6. **Regression Test**
   * Visual pass on all sections (desktop & mobile).
   * Use browser DevTools → "Disable cache" → hard-reload.
7. **Ship** – commit + push; bump version strings.

## 6. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Missed references to deleted global rule | Grep search before deletion; unit visual test |
| Caching issues | Version query strings; instruct end users to hard-refresh |
| Specificity wars inside a section | Namespace still subject to internal conflicts – stick to BEM-ish naming within section |

## 7. Timeline Estimate

* Audit + utility extraction              : **1–2 h**
* HTML updates (5 sections)                : **1 h**
* QA / regression pass                     : **0.5 h**
* Total                                    : **≈ 3.5 h**

## 8. Next Actions

1. Approve this plan.
2. If approved, I will:
   * Create `css/utilities.css` and migrate overlay code.
   * Refactor `styles.css` & update markup.
   * Purge old conflicting selectors.
   * Push with cache-busted links.
3. Schedule QA pass.

---
_Once done, future style changes will be isolated to their sections, and global clashes will be a thing of the past._
