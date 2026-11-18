# Katiadi Government College — Blogger Theme

Premium, upload-ready Blogger (Blogspot) XML theme for **Katiadi Government College (কাটিয়াদী সরকারি কলেজ)**.

- **EIIN:** 110434
- **Location:** Katiadi, Kishoreganj, Bangladesh
- **Language:** Bengali + English
- **Platform:** Blogger only — no React / Next.js / PHP / WordPress, no fake login, no fake admin dashboard. Blogger's own admin is the admin.

## Files in this folder

| File | What it is |
|---|---|
| `katiadi-blogger-theme.xml` | The complete theme — **52,278 bytes**, valid XML (verified with Python `xml.etree`) |
| `README.md` | This file — upload steps, page/label setup, placeholders |
| `SETUP-CONTENT.md` | Copy-paste content for all 16 Pages and the 6 notice labels, plus example posts |

## What is verified vs. placeholder

**Verified (safe to publish as-is):**
- College name: Katiadi Government College / কাটিয়াদী সরকারি কলেজ
- EIIN: 110434
- Location: Katiadi, Kishoreganj, Bangladesh
- Official external domains in the theme: `dshe.gov.bd`, `educationboard.gov.bd`, `nu.ac.bd`, `moedu.gov.bd`, `bangladesh.gov.bd`

**NOT verified — labelled “তথ্য যাচাই করা হয়নি / To be confirmed” everywhere in the theme and in SETUP-CONTENT.md. Do not publish as fact until the college confirms them:**
- Principal's name and message, governing-body members, teachers & staff names/posts
- Founding year / history dates, student/teacher counts
- Phone number, email address, full postal address, office hours
- Department list (Science / Humanities / Business Studies are shown as *standard* departments, to be confirmed)
- Admission dates/fees, routine dates, result dates
- Official Facebook / YouTube page URLs (theme links to *search* pages, not official pages)
- Gallery photos (Unsplash representative campus photos, not the college's real photos)
- Google Form URL (no form URL is invented — replace the placeholder box with the college's real form)
- Google Maps pin (map shows Katiadi, Kishoreganj generally, not the verified college building pin)

## 1. Create the Blogger site

1. Go to [blogger.com](https://www.blogger.com) and sign in with the college's authorized Google account.
2. Left menu → **Create a new blog** (or the blog switcher ▾ → **Create a new blog**).
3. **Title:** `Katiadi Government College`
4. **Address:** pick an available address, e.g. `katiadigovtcollege` → `katiadigovtcollege.blogspot.com`. If taken, try `katiadi-govt-college` or `kgc110434`.
5. Choose any temporary theme — it will be replaced in the next step. Click **Create blog**.

> If Blogger asks you to verify the account or shows a limit, stop and use the account owner to complete it. Do not create the blog under a personal account you do not control for the college.

## 2. Upload and activate the theme (exact steps)

1. In Blogger, open the new blog → left menu → **Theme**.
2. Click the **▼ arrow next to “Customize”** (top-right) → **Restore**.
   - In the newer interface this is **Theme → ⋮ (three dots) → Restore**, or **Customize → Advanced → Restore**. The wording varies slightly by Blogger version; the action is always **Restore / Upload a theme file**.
3. Click **Upload** / **Choose file** and select `katiadi-blogger-theme.xml` from this folder.
4. Click **Restore** / **Upload**. Blogger validates the XML. If it reports an error, do **not** edit the XML by hand in Blogger — report the exact error message and fix it in the source file, then re-upload.
5. After a successful restore, click **View blog** to confirm the blue/white design, header, hero, ticker and footer appear.

**Expected result:** homepage shows the hero, “জরুরি নোটিশ” ticker, About card, and an empty-posts message (“এখনো কোনো পোস্ট প্রকাশ করা হয়নি”) until the first post is published. That empty message is normal.

### If upload fails

- “XML parsing error” → the file was edited or re-saved in a way that broke it. Re-download the original `katiadi-blogger-theme.xml` and upload that unchanged file.
- “Widget … is missing / invalid” → Blogger versions occasionally rename a widget. Note the exact widget ID in the error and fix only that widget in the source file.
- The file was validated locally with `python3 -c "import xml.etree.ElementTree as ET; ET.parse('katiadi-blogger-theme.xml')"` — **XML PARSE: OK**.

## 3. Configure homepage layout

1. **Theme → Customize** (optional): check **Layout** after upload.
   - `Header` — college name (keep; the visible header is styled by the theme).
   - `Blog Posts (Blog1)` — main post list. In **Blog Posts → Edit**, set **“Number of posts on main page”** to **7** (or 10).
   - `BlogSearch`, `LinkList (নোটিশের বিভাগ)`, `PopularPosts`, `Labels`, `গুরুত্বপূর্ণ লিংক` — sidebar widgets. Drag to reorder if needed; do not delete `Blog1` or `Header1`.
   - `Breaking Notice Ticker (HTML900)` — the marquee text. Edit its links only if you change label names.
   - `Footer note (HTML902)` — leave empty unless you add footer widgets.
2. **Settings → Basic → Title:** `Katiadi Government College`, **Description:** `কাটিয়াদী সরকারি কলেজ — EIIN 110434, কাটিয়াদী, কিশোরগঞ্জ। নোটিশ, ভর্তি, রুটিন, ফলাফল ও সংবাদ।`
3. **Settings → Meta tags → Enable search description:** ON. Paste the description above as the blog search description.
4. **Settings → Crawlers and indexing → Enable custom robots header tags:** leave default unless you know SEO settings.

## 4. Create the 16 Pages

**Pages → New page** for each one below. Copy the content from `SETUP-CONTENT.md` (each page has a ready-to-paste Bengali + English draft). Use the exact titles so the theme's navigation links work:

| # | Page title (use exactly) | Theme link |
|---|---|---|
| 1 | Home | `/` (homepage — no Page needed) |
| 2 | About College | `/p/about-college.html` |
| 3 | College History | `/p/college-history.html` |
| 4 | Principal's Message | `/p/principals-message.html` |
| 5 | Governing Body | `/p/governing-body.html` |
| 6 | Teachers & Staff | `/p/teachers-staff.html` |
| 7 | Departments | `/p/departments.html` |
| 8 | Academic Programs | `/p/academic-programs.html` |
| 9 | Admission | `/p/admission.html` |
| 10 | Class Routine | `/p/class-routine.html` |
| 11 | Examination Routine | `/p/examination-routine.html` |
| 12 | Examination Results | `/p/examination-results.html` |
| 13 | Notice Board | `/p/notice-board.html` |
| 14 | News & Events | `/p/news-events.html` |
| 15 | Photo Gallery | `/p/photo-gallery.html` |
| 16 | Contact Us | `/p/contact-us.html` |

Notes:
- After creating a Page, Blogger gives it a URL like `/p/about-college.html`. If Blogger generates a different slug (e.g. `/p/about-college-1.html`), either rename the Page title until the slug matches, or update that one link in the theme (search the XML for the old slug) and re-upload.
- Page order: **Pages → ⋮ → “Show pages as” / navigation** — the theme's main nav is a fixed HTML menu, so Page order in Blogger does not change the top nav; the links above are what visitors use.
- Keep Pages in **Draft** until the placeholder facts on that page are confirmed, then **Publish**.

## 5. Notice management — Labels (the only system you need)

Notices are **Posts + Labels**. No separate notice plugin exists in Blogger.

**Create a post:** Posts → **New post** → write title + body → on the right, **Labels** → type the label exactly → **Publish**.

**Use these 6 labels exactly (case-sensitive — copy them):**

| Label (exact) | Use for |
|---|---|
| `General Notices` | General notices |
| `Admission Notices` | Admission notices |
| `Examination Notices` | Exam notices, exam routines |
| `Class Routine` | Class routine posts |
| `Results` | Results |
| `Important Announcements` | Breaking/urgent — feeds the homepage ticker |

Also add the generic label `Notice` to every notice post so `/search/label/Notice` lists them all, and `News` to news posts.

**PDF links in a post:**
1. Upload the PDF to Google Drive → right-click → **Share → Anyone with the link → Viewer** → **Copy link**.
2. In the Blogger post editor, select the text (e.g. “PDF ডাউনলোড করুন”) → link icon → paste the Drive link → **Apply**.
3. In the post body you can also paste the raw Drive link; the theme styles PDF links and opens them in a new tab. Test the link in an incognito window to confirm “Anyone with the link” works.

**Featured / pinned notice:** to feature a post, give it the label `Important Announcements` (ticker) and link it from the homepage hero or Notice Board page. Blogger has no native “pin to top”; the newest post is always on top.

## 6. Contact form (Google Form — replace the placeholder)

The theme does **not** invent a form URL. The Contact section shows a clearly marked placeholder box.

1. In Google Forms (same Google account), create a form: Name, Phone/Email, Subject, Message.
2. **Send → Embed (`< >`)** → copy the `<iframe …>` code.
3. Edit the **Contact Us** Page and the homepage contact box: replace the placeholder box with the iframe. In Blogger Page editor, switch to **HTML view** and paste the iframe.
4. Test-submit the form once and confirm the response arrives in Forms → **Responses**.

## 7. Gallery, Maps, social links

- **Gallery:** replace the 4 Unsplash images in the Photo Gallery Page with the college's real photos (upload via Posts/Pages → image icon). Do not present Unsplash photos as the college's own.
- **Maps:** the embedded map is `google.com/maps?q=Katiadi, Kishoreganj`. Once the exact college location is confirmed, replace `q=…` with the college's Google Maps “Share → Embed a map” iframe.
- **Social:** replace the Facebook/YouTube *search* links in the footer with the college's verified official page URLs only after confirming them. Until then, leave them as search links or remove them.

## 8. Test checklist (before announcing the site)

- [ ] Homepage loads on desktop and on a phone (menu ☰ opens, hero and cards stack).
- [ ] Dark/light toggle (🌙 / ◐ button, top-right) switches colours and remembers the choice after reload.
- [ ] Search: type “ভর্তি” → results page appears.
- [ ] Each label link works: `/search/label/Admission%20Notices`, `/search/label/Results`, etc.
- [ ] One test notice post with a PDF link: opens the PDF in a new tab.
- [ ] All 16 Pages open (no 404); a wrong URL shows the custom Bengali 404 page.
- [ ] Pagination: with 8+ posts, “পুরনো পোস্ট →” appears at the bottom.
- [ ] A post's Facebook / WhatsApp share buttons open the share dialog.
- [ ] Maps embed loads; contact form (after replacement) submits.
- [ ] No placeholder fact is presented as verified — every “তথ্য যাচাই করা হয়নি” note is still visible where the fact is unconfirmed.

## 9. Day-to-day use (for the admin)

- **New notice:** Posts → New post → label it → Publish. It appears on the homepage, the Notice Board, its label page and search automatically.
- **Edit a Page:** Pages → click the page → edit → Update.
- **Change the menu:** only by editing the theme XML (`main-nav` block) and re-uploading. Do not edit the live theme in Blogger's editor unless you keep a backup copy of this XML.
- **Back up:** before any theme change, **Theme → ▼ → Backup → Download theme**.

## Theme features (summary)

- Blogger XML v2, `b:skin` + `b:template-skin`, `Blog1` / `Header1` / `BlogSearch` / `Labels` / `PopularPosts` / `LinkList` / `HTML` widgets, `b:section` layout
- Dynamic homepage: `<b:loop values='data:posts'>`, `data:blog` metadata, label pages `/search/label/…`, search `/search?q=…`
- Post cards with date, labels, snippet, featured image; single-post layout with share buttons; PDF-link styling
- Pagination (newer/older), custom Bengali 404, SEO meta + Open Graph + canonical, responsive images
- Light/dark mode (localStorage), mobile hamburger menu, hover animations, Hind Siliguri + Noto Serif Bengali
- Fast loading: only Google Fonts + Font Awesome CDN; no other heavy external JS

## Limitations (honest)

- Blogger cannot do a real login/admin dashboard, database, or server-side routine/result system — notices, routines and results are Posts/Pages/PDFs, which is the correct Blogger-native approach.
- The theme was validated as XML locally; it has **not** been uploaded to a live Blogger account in this build (no Blogger deployment was attempted). Upload it following §2 and run the §8 checklist on the live URL.
- If Blogger's editor rejects a widget on upload, the error message names the widget — fix only that widget and re-upload.
