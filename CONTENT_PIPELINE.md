# Resources content pipeline

How new articles get researched, written and published on dentomate.in/resources/.

Four articles are live. This file exists so the fifth and the fiftieth cost the same
amount of thinking, and so nothing ships that we cannot stand behind.

---

## 1. Two posts a week, research daily

Daily publishing is the wrong target and it will cost us traffic rather than earn it.

- Google's helpful-content signals penalise volume without substance. Seven thin posts a
  week rank worse than two that answer questions nobody else has answered properly.
- Our topics are money, law and clinical practice. Every claim has to be checked against a
  primary source. That check is the expensive part, and it does not compress into a day.
- We have a real advantage the competition cannot copy: we can quote what the product
  actually does, at file-and-line accuracy. Spending that advantage on filler wastes it.

**The cadence:** research runs daily and feeds a queue. Publishing runs twice a week and
draws from that queue. Two genuinely useful 1,200-word articles a week is 104 indexable
pages a year, every one of them defensible.

Pick two days and hold them, so the crawl rhythm is predictable. If the queue only has one
item with confirmed sources when a publish day comes round, **ship one.** Never fill the
second slot with something unsourced.

### The daily half

A structured research pass across five blocks. Output is a 3-4 page intelligence brief
plus 2-3 new queue entries. Every finding names its source URL and the specific claim it
supports or contradicts. Each block takes 5-10 minutes; the full pass is under an hour.

**Block A: Regulatory and platform pulse**
Check each source below for anything that changed since yesterday. For every change,
state what moved, the date, and whether it invalidates a number or date in a live article.
Name the file and line for every invalidation -- do not silently fix, surface it.

**Block B: Industry news**
Search for dental industry coverage published in the last 7 days across trade press, IDA,
NABH, and general health media. Flag anything that signals a shift in how Indian dentists
or patients think about cost, compliance, or technology.

**Block C: Competitor content gaps**
Check what Clinicea, Practo Manage, Dentulu, Care.clinic, and major international vendors
(Curve Dental, Dentrix, Carestream) are writing about for Indian practices. A topic they
cover that we do not is a gap. A topic we both cover is a chance to confirm we are more
accurate and more India-specific.

**Block D: Practitioner questions**
Pull 3-5 verbatim questions or thread titles from Reddit (r/DentalStudentsIndia,
r/india health flair, r/AskIndia), Quora India, IDA Facebook groups, and Practo Q&A.
A question appearing in multiple places with no good answer is a strong topic candidate.

**Block E: Article accuracy check**
Cross-check every figure in the four live articles against Block A findings. Verify
Dentomate plan prices against `blueprints/payments/routes.py` and plan limits against
`utils/plan_guard.py` in the app repo. Flag mismatches as STALE with file, line, current
claim, correct value, and source.

After the five blocks, add 2-3 entries to the queue in section 4. The queue needs a
running buffer of at least four sourced topics. Below that, the publishing rate comes
down, not the bar.

### The publishing half

Twice a week, take the top item off the queue and ship it end to end using section 3.

---

## 2. What makes an article worth publishing

An article passes only if all five are true:

1. **It answers a question an Indian dentist actually types.** Not "dental practice
   management best practices". More like "how much does WhatsApp API cost in India".
2. **Every number has a source.** Meta's pricing page, the Gazette notification, the DCI
   circular. Link it inline. If we cannot source it, the sentence comes out.
3. **Product claims match the code.** Prices come from `blueprints/payments/routes.py`,
   plan limits from `utils/plan_guard.py` in the app repo. Never from another marketing
   page, which is how the ₹499/₹999 tier got invented once already.
4. **No invented proof.** No fabricated testimonials, no made-up clinic names, no
   percentages we did not measure. This has bitten the site before.
5. **It is useful to someone who never buys.** The pitch belongs in one section near the
   end, honestly labelled.

House style: no em dashes, sentence-case prose, Title Case for `h1`-`h4`, brand casing
preserved (WhatsApp, DPDP, GST, UPI, Dentomate, Razorpay).

---

## 3. Publishing checklist

A new post is not one file. It is one new file and four registrations, and skipping any of
the four is how a page ends up orphaned and unindexed.

### 3.1 The article

Copy `resources/whatsapp-cost-india/index.html` as the template. It is the most complete
one. Then replace, in order:

- `<title>` (aim for 50-60 characters) and `<meta name="description">` (70-165).
- `<link rel="canonical">`, `og:url`, `og:title`, `og:description`, `og:image`.
- The `BreadcrumbList` JSON-LD, position 3.
- The `Article` JSON-LD: `headline`, `description`, `image`, `datePublished`,
  `dateModified`. Both dates are the publish date on day one.
- The body. Structure that works: one `h1.d2`, then `h2` sections, then a `Keep Reading`
  list of three internal links, then the closing CTA section.
- Any FAQ block must have its `<summary>` text match the FAQPage JSON-LD `name` exactly,
  character for character, or the schema is invalid.

### 3.2 Inline glossary: the (i) term

Our topics are full of terms a dentist has no reason to know: template message, service
conversation, data fiduciary. Stopping to explain each one in the sentence makes the
sentence unreadable, and linking out loses the reader. The `.define` component solves
both: the term carries a small (i), and clicking it opens the definition in place.

The CSS is `assets/css/style.css:182-191` and the behaviour is in `assets/js/main.js:60-95`.
Both are already loaded on every article page, so there is nothing to import.

```html
<span class="define"><button type="button" class="define-t" aria-expanded="false"
  aria-controls="def-template">template message<svg class="define-i" viewBox="0 0 256 256"
  aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"/></svg></button><span
  class="define-box" id="def-template" role="tooltip" hidden>A message you write in advance
  and submit to Meta for approval. Only an approved template can start a conversation with a
  patient who has not messaged you recently.</span></span>
```

Rules:

- **Two to four per article, on first mention only.** More than that and the paragraph
  turns into a field of dotted underlines, which is worse than not explaining anything.
- `aria-controls` and the box `id` must match, and the id has to be unique on the page.
  Convention is `def-<term>`.
- One or two sentences in the box. If it needs three, it is a section, not a definition.
- The icon is an inline `svg`, not a Lucide `<i>`, deliberately. It renders before the
  Lucide script runs, so the term never reflows after paint.
- It opens on **click, not hover**, so it works on touch. Do not add a hover handler.
- **Not usable on the homepage.** `index.html` is self-contained and does not load
  `main.js`, so the button would render and do nothing.

### 3.3 Images

Two per post, in `assets/images/blog/`:

- `<slug>-card.jpg` at 720x405 for the grid card.
- `<slug>.jpg` for `og:image`.

Both need honest, descriptive `alt` text. Product screenshots must show real UI, and any
patient data in them must be demo data. Card images carry `width="720" height="405"` and
`loading="lazy"` so the grid reserves its box and does not shift.

**Never ship a placeholder.** A flat coloured rectangle with a credit line promising real
photography later is worse than no image, and it has already happened twice: the GST post
and the records post shipped byte-identical blank blue files, one of them credited to
Unsplash, which was not true. If there is no image, the post is not ready.

**Use an openly licensed photograph, not a generated diagram.** A hero built from the
article's own comparison ends up answering the question in the card, so a reader scrolling
the grid has no reason to open the post. A photograph sets the subject without spending the
argument. Pick something literal to the topic: a panoramic radiograph is itself a clinical
record, a curing light is itself a dental service.

Sourcing, in order:

1. **Wikimedia Commons.** Every file has a named author and a checkable licence tag on its
   own description page, so the credit can be verified instead of guessed. Search it with
   `/home/my-computer/site-tools/commons-find.py "query"`.
2. **Openverse** (`openverse-find.py`) for anything Commons does not cover. Keyless API over
   Flickr, Wikimedia and others.
3. Unsplash **cannot be browsed from here.** It sits behind an Anubis proof-of-work bot
   check that returns a 7.6 KB "Making sure you're not a bot" page to curl and to WebFetch
   alike, and solving that check is off limits. Do not keep retrying it.

Two licence exclusions, both deliberate:

- **No CC BY-SA.** Cropping a source to 16:9 makes a derivative, and share-alike would then
  attach to the crop. Accept CC0, public domain, and plain CC BY only.
- **No `plus.unsplash.com` ids.** Those are Unsplash+, a paid licence, and they appear mixed
  into ordinary search results.

Crop with `/home/my-computer/site-tools/make-blog-photo.py SOURCE STEM [bias]`, which emits
both sizes from one 16:9 frame. `bias` shifts the crop window vertically from 0 (keep the
top) to 1 (keep the bottom); the subject of a photo is almost never at the exact middle.
Trim any black border off the source first, or the 16:9 window spends its height on it.

**The credit must name the photographer.** `Photo: Unsplash` is not a credit, it is a brand
mention, and three older posts still carry it. The line is author, licence, source, each
linked:

```html
<p class="article-credit">Photo: <a href="https://commons.wikimedia.org/wiki/File:Dental_Panorama_X-ray.jpg">Farhang Amini</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>, via Wikimedia Commons.</p>
```

A diagram is still the right call when the post turns on a shape a photograph cannot carry,
such as two rates side by side. For that case use `/home/my-computer/site-tools/blog-image-builder.html`. It is a
1200x675 canvas that loads the site's own stylesheet, so the render uses real Open Runde
and real tokens rather than approximations. It carries a `?v=card` mode that strips the
fine detail and enlarges the type, because the grid renders a card at roughly 371px where
16px label text lands at about 5px and reads as grey noise.

```bash
cp /home/my-computer/site-tools/blog-image-builder.html ./_build.html   # must be served
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,900 --virtual-time-budget=8000 \
  --screenshot=/home/my-computer/site-tools/hero-raw.png \
  http://localhost:8099/_build.html
```

Render at `--window-size=1200,900` and crop to `(0,0,2400,1350)` rather than sizing the
window to 1200x675. The headless viewport comes back about 97px shorter than the window,
which silently cut the footer off the first render. Downscale the 2x capture to 1200x675
with LANCZOS and save at JPEG quality 88. Delete `_build.html` when done; it is gitignored
so it cannot be published by accident.

Do not try to capture these with `preview_screenshot`. It caps at about 800px wide and
hangs on this canvas even after a server restart. Headless Chrome is the reliable path.

Check the result at the size it will actually be seen, not at full size. Anything below
about 0.5 render scale is unreadable. The hero lands at 0.63 in the article column and the
card at 0.78 in the grid.

### 3.4 Register it in four places

| # | File | What to add |
|---|---|---|
| 1 | `resources/index.html` | a `.resource-card` anchor, copying the block at line 84 |
| 2 | `index.html` | only if it displaces one of the four homepage cards; swap, never append |
| 3 | `sitemap.xml` | a `<url>` entry with today's `<lastmod>` |
| 4 | the 2-3 most related existing articles | a line in their `Keep Reading` list |

Item 4 is the one that gets forgotten. Internal links are how a new page gets crawled and
how authority moves to it. A post with no inbound internal link is invisible.

**The homepage grid holds exactly four cards, and the fourth is desktop-hidden.** The
layout is responsive in card count, not just in columns:

| Width | Columns | Cards shown |
|---|---|---|
| above 1100px | 3 | first three; the fourth is `display:none` |
| 761-1100px | 2 | all four, as a 2x2 |
| 760px and below | 1 | all four, stacked, clamp released |

Three across is the desktop row, so a fourth card would open a second row holding one
card. Two across needs a fourth to close the square. The rule that satisfies both is
`.resources-grid > :nth-child(4){display:none}`, lifted inside the 1100px query.

Keep the fourth card in the markup. Removing it would empty the tablet and phone grids,
and it is a real internal link: Google renders at phone width, where the card is visible,
so the link is still crawled.

**The breakpoints are 1100 and 760, not the shared 960 and 600 the rest of the page
uses, and that is deliberate.** What limits this component is headline length, not
viewport width. The longest current headline needs 276px to fit the two lines the card
clamps to, so a card has to be at least 316px wide. Three across falls under that at
about 1036px and two across at about 700px. Both switches sit above their limit with
room to spare. Hand the grid the shared breakpoints instead and headlines truncate in a
band just above each one: at 961px the cards land at 286px and two of three clip; at
601px they land at 267px and three of four clip. If you ever retune this, check the
column count and the clipping at the width just above each breakpoint, not just at 1440,
768 and 375.

**Order matters more than it looks.** Card four is the one desktop visitors never see, so
it takes the post that needs the homepage least. Product walkthroughs go there; the first
three slots go to the questions people search before they know we exist. When a new post
earns a slot, reorder the four, do not append a fifth.

### 3.5 Verify before committing

Serve the site with the `Dentomate Website (static)` preview config on port 8099, then:

- The new URL returns 200, and so does every link in its `Keep Reading` list.
- `json.loads` succeeds on every JSON-LD block on the page.
- Console shows zero errors, and every `svg.lucide` has rendered children.
- Every `.define-t` opens its box on click, and every `aria-controls` resolves to an
  element that exists:
  `[...document.querySelectorAll('.define-t')].filter(t=>!document.getElementById(t.getAttribute('aria-controls'))).length === 0`
- The card renders correctly at 1440, 768 and 375.
- `grep -c '&mdash;\|—'` on the new file returns 0.
- `grep -c '<loc>' sitemap.xml` went up by exactly one.

---

## 4. Topic queue

Ordered by what a clinic owner is most likely to search for. Each needs its sources
confirmed before it is written, not after.

**Ready to write**

1. **GST on dental services in India: what is exempt and what is not.** Healthcare by a
   clinical establishment is exempt; cosmetic procedures are not, and the line between them
   is where clinics get it wrong. Sources: Notification 12/2017-Central Tax (Rate),
   SAC 9993. Ties directly to the GST invoicing feature.
2. **What a dental clinic legally has to keep, and for how long.** Record retention under
   National Dental Commission (NDC) guidance and the Consumer Protection Act limitation
   period. Sources: NDC Act 2026 (DCI dissolved 19 March 2026), CPA 2019. NOTE: the
   original source listed here was "DCI Code of Ethics Regulations" -- DCI is dissolved;
   reconfirm which NDC body (Ethics and Dental Registration Board) now owns this.
3. **The real cost of a no-show, and the three messages that reduce it.** We can be
   concrete about timing because the reminder window is in our own code.
4. **Registering for the WhatsApp Business API in India, step by step.** The Meta
   onboarding flow, business verification, and what a display-name rejection means.
5. **Dental clinic pricing in India: how to present a treatment plan patients accept.**
   Consent, itemisation, and staged treatment.
6. **WhatsApp patient replies will cost money from October 2026: what Indian clinics need
   to do now.** From 1 October 2026, Meta ends free service conversations and free
   utility templates inside the 24-hour customer service window -- the two free-tier
   rules the cost article is built around. Clinic owners on the API asking "will I be
   charged for replying to patients?" Source: Meta WhatsApp Business Platform pricing
   documentation, October 2026 change. Urgent: invalidates resources/whatsapp-cost-india/
   lines 119-120 and the def-csw tooltip before those lines go false on 1 October.
7. **Is NABH accreditation worth it for a small dental clinic?** Clinic owners weighing
   whether to pursue NABH certification to qualify for CGHS, ECHS, and Ayushman Bharat
   empanelment -- which now carries a 15% higher CGHS reimbursement tariff for accredited
   clinics. No competitor has written this for a small-practice audience. Sources: nabh.co
   dental healthcare accreditation standards, CGHS rate schedule for NABH clinics.
8. **The Dental Council of India is gone: what the National Dental Commission means for
   your practice.** DCI dissolved 19 March 2026, replaced by NDC with three new boards
   (Undergraduate/PG Education, Assessment and Rating, Ethics and Registration). Dentists
   Act 1948 repealed. High-search, zero competitor coverage for clinical audience. Source:
   NDC gazette notification March 2026, PMC article PMC13056220, omnicuris.com coverage.
9. **Is the DPDP Data Protection Board actually running yet, and does it matter for your
   clinic?** DPB Chairperson and Members were appointed on 6 June 2026 (MeitY
   notification); the live grievance portal is now open. The earlier framing -- "delay
   gives clinics more time" -- is no longer valid. The article should answer: yes it is
   running, here is what it can do (inquire into breaches, issue directions, impose
   penalties), and the May 2027 obligation deadline is unchanged. NOTE: update the
   dpdp-checklist article line 101 to reflect that the Board was constituted in November
   2025 but members were not appointed until June 2026.
   Sources: MeitY June 2026 notification (meity.gov.in), mickai.co.uk/articles/india-
   dpdp-first-enforcement-localisation, judicio.ai enforcement tracker.

10. **Is my DCI dentist registration still valid after the NDC took over?** Practising
    dentists who registered under DCI (pre-March 2026) are asking whether their licence
    continues, what the transition period looks like, and whether they need to re-register
    with the Ethics and Dental Registration Board. NDC Act 2023 Section 47 contains the
    transition provision (existing registrations deemed to continue). No competitor has
    written this for the practising-dentist audience. Sources: NDC Act 2023
    (indiacode.nic.in/handle/123456789/19795), PIB notification March 2026
    (pib.gov.in/PressReleasePage.aspx?PRID=2242888), PMC article PMC13056220.
11. **How to collect WhatsApp patient consent that is DPDP-compliant for recall and
    marketing.** Dentists setting up WhatsApp-based recall are asking what exactly they
    need to record before sending the first message. Practical article: what the consent
    notice must say, how to record it, and what opt-out looks like inside a WhatsApp
    workflow. Ties the DPDP checklist directly to the recall guide. Sources: DPDP
    Rules 2025 (pib.gov.in), Meta WhatsApp Business Policy.
12. **What is ABDM and does my dental clinic need to register with the Health Facility
    Registry?** Dentists seeking NABH accreditation or government scheme empanelment
    (Ayushman Bharat, CGHS, ECHS) now effectively must register on the Health Facility
    Registry (HFR) and Healthcare Professionals Registry (HPR) under the Ayushman
    Bharat Digital Mission. NABH 5th edition standards require HFR registration as part
    of accreditation. For a private clinic not seeking empanelment, registration is not
    legally mandatory today but competitors are writing about it as though it is, which
    creates confusion. The article should explain the actual obligation, what registration
    involves, and what the ABHA ID requirement means for patient records. No competitor
    has a dental-specific, accurately scoped version of this. Sources: abdm.gov.in
    (Health Facility Registry guide), tatvacare.in/blog ABDM mandates post (Sept 2026),
    easyclinic.io ABDM compliance guide (2026).

13. **The 1,000 free WhatsApp replies per month: how many does a dental clinic actually use?** From 1 October 2026, Meta charges ₹0.1150 per service message beyond a free allowance of 1,000 service messages per month per phone number. A small clinic replying to 20-50 patients a day sends 400-1,000 service messages a month and may stay entirely within the free tier. Dentists who read the October 2026 price-change notices are asking "will I be charged for every patient reply?" The article answers that with arithmetic: most clinics will not exceed 1,000, so the practical impact is zero on replies, while recall campaigns (template messages that start a conversation) are unaffected by the free-service-message count. Ties to the whatsapp-cost-india article, which needs its lines 119-120 updated before this article ships. Sources: Meta WhatsApp Business Platform pricing documentation (September 2026 rate card, developers.facebook.com/documentation/business-messaging/whatsapp/pricing), ChatMaxima October 2026 rate guide (chatmaxima.com/blog/whatsapp-service-message-pricing-october-2026/). Note: ship queue item 6 first, or ship both together, since this article references the October change that item 6 explains.

25. **What does a dental clinic DPDP consent notice actually have to say?** Dentists
    preparing a DPDP notice for their reception desk or registration form ahead of the May
    2027 deadline are asking what exact elements the notice must contain. The DPDP Rules
    2025 Rule 3 prescribes this: identity and contact details of the data fiduciary, a
    description of each category of personal data to be collected, the specific purpose of
    each collection, the rights the patient can exercise, and how to reach the clinic for
    grievances. No competitor has published a dental-specific notice template that calls
    out each required element against the Rule text, with examples of what "specific
    purpose" means for a dental context (appointment scheduling is different from recall
    messaging). The article should show a before (the typical bundled registration-form
    line) and an after (a DPDP-compliant notice, element by element). Sources: DPDP
    Rules 2025 Rule 3 (pib.gov.in notification November 2025). Companion articles: DPDP
    checklist (links to item 4 on that checklist) and WhatsApp consent article (queue
    item 11).

31. **What is the NABH Entry Level Certification for a small dental clinic, and is it
    different from full NABH accreditation?** Clinic owners evaluating NABH ask "where do I
    start?" rather than "should I bother?" The Entry Level Certification is the specific first
    rung: designed for clinics with 1 to 8 dental chairs, it satisfies the CGHS and ECHS
    empanelment requirement and qualifies the clinic for the 15% CGHS tariff uplift. Full
    NABH accreditation is a second, more demanding stage. No competitor has written a
    dental-specific article that distinguishes the two tiers, explains what Entry Level
    actually requires, and shows the tariff difference in rupees on common procedures. The
    article should answer: what Entry Level covers, the typical document list, the audit
    timeline, and whether a solo-dentist practice can realistically achieve it without a
    consultant. Companion to queue item 7 (is NABH worth it?). Sources: nabh.co dental
    healthcare entry-level accreditation standards,
    aurasafety.com/blog/how-to-get-nabh-certification-for-your-dental-clinic (confirmed
    today, September 2026), cghshospitals.com/dental-clinics (34% NABH rate among 414
    CGHS-empanelled dental clinics, confirmed today).

**Needs a source before it can be written**

14. Average patient lifetime value for an Indian dental practice. Only publish if a
    citable industry figure exists. Do not model one and present it as fact.
15. Insurance and cashless dental claims in India. Genuinely complex, high search volume,
    and easy to get wrong.
16. UPI verified merchant limit for healthcare clinics (Rs.10 lakh/day). Source needed:
    primary NPCI circular confirming the MCC classification for dental clinics and the
    exact verification process. Do not publish until that circular is confirmed.
17. **Does the new UPI Rs.5 lakh per-transaction cap from September 2026 affect dental
    clinic patient collections?** Healthcare is not listed in the capped categories
    (insurance, investments, education, travel), but dentists collecting large implant
    or orthodontics bills via UPI are asking. Answer is likely no, but only a primary
    NPCI circular confirming the healthcare MCC exclusion makes it publishable. Secondary
    sources so far: pinelabs.com UPI rules guide, razorpay.com blog (Sept 2026).
18. **Do dental implants, lab-made crowns and consumable materials attract GST even
    when the dental treatment itself is exempt?** The clinical service falls under SAC
    9993 at 0%, but the implant fixture, prosthetic components, and lab materials may
    attract 12% or 18% GST when supplied as goods rather than as part of an inseparable
    clinical service. Multiple software blogs say "implants are not exempt" without
    citing the specific CBIC advance ruling or notification number that draws the line.
    Dentists who handle implants at volume are being caught on this in GST audits. Source
    needed: specific CBIC advance ruling or notification clarifying the treatment of
    dental implant hardware and lab-fabricated prosthetics as distinct from the clinical
    SAC 9993 exemption.
19. **Does a dental clinic in India have to register under the Clinical Establishments
    (Registration and Regulation) Act, and which states enforce it?** This is a genuine
    compliance obligation separate from NDC registration, DPDP, and GST. The Act (2010)
    applies only in states that have adopted it, implementation varies widely, and the
    answer for a clinic in Maharashtra differs from one in Tamil Nadu. High search volume
    ("clinical establishment registration dental clinic"), no clean India-wide answer
    exists anywhere. Source needed: MoHFW state implementation status list and at least
    two state-specific notification links before this can be written accurately.

20. **Is tele-dentistry legal in India in 2026, and can I consult patients by video?** The
    NDC Act 2023 and the NDC's stated mandate reference digital health and tele-dentistry
    as priorities, and the commission's establishment in March 2026 has raised practitioner
    interest. No specific tele-dentistry circular has been issued by the NDC or the Ethics
    and Dental Registration Board as of September 2026. The 2020 Telemedicine Practice
    Guidelines (MoH) are the current applicable document and were drafted without
    dental-specific guidance. Dentists asking "can I legally diagnose over video" need
    the answer framed for their profession. Source needed: specific NDC circular or
    Ministry of Health tele-dentistry guidance for dentists, or a confirmed legal opinion
    that the 2020 Guidelines cover dental practice without amendment. Do not publish
    until that guidance is confirmed; the current answer ("2020 Guidelines apply but are
    silent on dentistry specifically") is not settled enough to be authoritative.

21. **Patient data breach at a dental clinic: what to do in the first 72 hours under DPDP.**
    The DPDP Rules 2025 include breach notification obligations: inform the affected
    patients in plain language and report to the Data Protection Board within a defined
    window framed around 72 hours. No competitor has published a step-by-step breach
    response guide for dental clinics. Dentists asking "what happens if my system is
    hacked under the new law?" have nowhere to go. The article covers: what counts as a
    reportable breach, what to tell patients, what to report to the DPB and when, and
    the practical first actions (isolate the system, identify the scope, preserve the
    audit trail). Source needed: specific breach notification provisions in DPDP Rules
    2025 (Rule 7 and Schedule I of the Rules as notified November 2025, pib.gov.in)
    with the exact timeframes and mandatory content confirmed from the gazette text before
    any figure is published.

22. **How to respond to a patient complaint or negative online review as an Indian dentist
    without breaking privacy law.** Dentists on Practo, NirogStreet and Google Maps are
    unsure what they can legally say in a public response to a negative review -- patient
    name, diagnosis, or treatment details may constitute personal data under DPDP. The
    article covers: what a grievance officer obligation means for a small clinic, how to
    respond professionally without disclosing protected data, the Consumer Protection Act
    2019 complaint process, and what the NDC Ethics and Dental Registration Board might
    say about public conduct. No competitor has written a compliance-aware guide for
    this. Source needed: DPDP Rules 2025 Rule 13 (grievance mechanism obligations for
    small data fiduciaries), Consumer Protection Act 2019 guidance on healthcare
    providers, and at least one NDC or DCI ethics circular on public communications.

23. **Does my dental clinic software need to be ABDM-compliant, and what does that
    actually mean in practice?** Queue item 12 covers whether the clinic itself must
    register on the Health Facility Registry. This article covers the software layer:
    what "ABDM-compliant software" vendors are actually selling, what the FHIR-based
    health records API integration requires, whether a private clinic not seeking
    government empanelment has any obligation to push records to the national registry,
    and what ABHA ID generation for patients involves. Multiple dental software vendors
    market ABDM compliance as a premium feature without explaining the actual obligation,
    which is creating confusion among buyers. Sources: abdm.gov.in Health Facility
    Registry integration guide, tatvacare.in/blog ABDM mandates post (Sept 2026),
    easyclinic.io ABDM compliance guide (2026). Confirm HFR mandatory vs. optional
    status for private dental clinics before writing.

24. **What to do when a patient stops responding mid-treatment plan: the clinical,
    legal and financial steps for Indian dental clinics.** A common practice management
    situation with no good published answer for Indian dentists: patient owes money,
    is mid-treatment, and has stopped replying. The article covers: patient abandonment
    documentation protocol (clinical record, certified letter), Consumer Protection Act
    risk of proceeding or refusing to proceed, legitimate debt follow-up under the DPDP
    framework (marketing consent cannot be used for debt recovery), small claims
    alternatives, and what to record if the case reaches a consumer forum. No competitor
    has written this for a dental audience. Source needed: Consumer Protection Act 2019
    guidance on healthcare providers, a medico-legal reference on patient abandonment
    documentation standards, and confirmation of whether the DPDP's legitimate-use
    basis covers debt recovery communications.

26. **How do I contact the National Dental Commission and update my practice registration
    now that DCI is gone?** Practising dentists who were registered under DCI and need to
    update their address, clinic details, or handle a licensing query are unsure who to
    contact under the new structure. NDC was constituted 19 March 2026 and the Ethics and
    Dental Registration Board (EDRB) now handles registration matters, but no public EDRB
    contact process or online portal was confirmed in searches as of September 2026. The
    dciindia.gov.in domain shows NDC branding. No competitor has written a practical
    "what to do with your DCI registration now" guide for the practising dentist. Source
    needed: NDC EDRB contact details and registration update procedure from the official
    NDC portal (dciindia.gov.in or any successor domain), or a PIB notification describing
    the post-transition registration process. Do not publish until the specific EDRB
    contact mechanism is confirmed from a primary source.

27. **Do I charge GST on dental treatment for a foreign patient or NRI visiting my clinic?**
    Dental clinic owners seeing patients from the Middle East, UK, or NRI patients receive
    the question: does the SAC 9993 GST exemption still apply, or does serving a foreign
    national change the tax treatment? Under the IGST place-of-supply rules (Section 12
    IGST Act), healthcare services rendered to a patient physically in India are treated as
    intra-India supplies, so the SAC 9993 exemption for clinical dental services should
    apply regardless of the patient's nationality. Cosmetic procedures attract 5% GST for
    all patients equally. This is not obvious to clinic owners and no competitor has
    written a dental-specific answer. Source needed: CBIC advance ruling or circular
    confirming the place-of-supply analysis for healthcare services rendered to foreign
    nationals physically present in India, with explicit reference to SAC 9993 exemption
    applicability. Do not publish without a primary CBIC source.

28. **Does my dental clinic need to appoint a Data Protection Officer under the DPDP
    Rules 2025?** Clinics reading compliance guides are encountering the term "DPO" and
    asking whether they must designate one. Under the DPDP Act, a Data Protection Officer
    obligation applies only to entities notified as Significant Data Fiduciaries (SDFs) by
    the government. As of September 2026, no notification designating dental clinics as
    SDFs has been confirmed in public sources. The article should answer: what makes an
    entity an SDF, whether a dental clinic is likely to qualify, and what smaller data
    fiduciaries must do instead (name a grievance officer, which is a different and
    lighter obligation). No competitor has written a dental-specific answer that
    distinguishes the DPO obligation from the grievance-officer obligation. Source needed:
    DPDP Rules 2025 Rule 10 text (pib.gov.in) confirming that SDF designation requires a
    government notification and that no such notification covers dental clinics; and DPDP
    Act Section 14 on grievance officers for non-SDF fiduciaries. Do not publish until
    the absence of an SDF dental-clinic notification is confirmed from the official gazette.

29. **What does a CGHS dental rate schedule actually pay, and does NABH accreditation
    increase it?** Dentists evaluating CGHS empanelment want to know whether the
    government rates cover their costs and whether NABH accreditation produces a
    meaningful income difference. Secondary sources confirmed today (cghshospitals.com,
    aurasafety.com, adrine.in) that NABH-accredited dental clinics receive up to 15%
    higher CGHS and ECHS reimbursement tariffs, and that 34% of the 414 CGHS-empanelled
    dental clinics in India are NABH-accredited. The article should show the specific
    tariff rates for common dental procedures under CGHS, the delta for NABH-accredited
    clinics, and the process for empanelment. Companion to queue item 7 (NABH
    accreditation article). Source needed: the current CGHS dental procedure rate schedule
    from cghs.gov.in or the CGHS circular that established the 15% NABH uplift, with a
    specific notification or circular number. Do not publish until the rate schedule is
    confirmed from a primary government source, because a misquoted tariff is a legal
    claim a clinic might act on.

30. **Why do nearly half of Indian dentists still fear switching to electronic records,
    and are those fears justified?** A 2023 paper in the SRM Journal of Research in
    Dental Sciences reported that 47.5% of Indian dental practitioners cited data loss
    as their primary fear about adopting electronic dental records. In 2026 this is a
    live obstacle -- clinics evaluating software repeatedly mention power cuts, hacking,
    and migration difficulty. The article should state each fear clearly, then answer it
    with what current software and data practices actually offer: cloud backup, offline
    mode, encryption, and what DPDP breach notification obligations would apply to a
    paper register just as much as to a digital one. No competitor has written a
    fear-by-fear rebuttal aimed at the undecided Indian dentist. Source needed: confirm
    the 47.5% figure and its methodology from the primary paper (SRM Journal of Research
    in Dental Sciences, Jan 2023, doaj.org/article/5d170aab47a040edb02ee0007a9c449f) and
    verify whether a more recent Indian survey exists with a higher-quality sample before
    anchoring the article on the 2023 figure.

32. **Does a dental clinic in India need a GST registration even if dental treatment is
    exempt?** Dentists who know that clinical dental services are exempt under SAC 9993 still
    ask whether they must register for GST at all, and what invoice format to use for
    patients (a tax invoice vs a bill of supply, the format an unregistered or exempt
    supplier must issue). The answer depends on total annual turnover across all income
    streams and whether the clinic sells any taxable goods (consumables, medicines,
    whitening kits) separately. Multiple dental software blogs claim "dental is GST-free"
    without addressing the registration threshold question or the bill-of-supply obligation,
    which leaves clinic owners uncertain. Source needed: CBIC guidance or FAQ confirming the
    registration threshold for service providers whose principal supply is exempt, and the
    bill-of-supply requirement for exempt-service providers under CGST Rules Rule 49. Do not
    publish until both the threshold rule and the invoice format requirement are confirmed
    from a primary CBIC or gazette source.

33. **How do I register a dental X-ray machine with AERB before opening my clinic?**
    Every dental clinic operating an intraoral X-ray unit, OPG machine, or CBCT must
    register the equipment with the Atomic Energy Regulatory Board before use. This is
    mandatory under the Atomic Energy (Radiation Protection) Rules 2004 and is distinct
    from NDC registration, state clinical establishment licensing, and GST compliance.
    It surprises first-time clinic owners because it requires an application before the
    equipment is switched on, not after. Multiple Quora answers on opening a dental clinic
    in India mention "AERB clearance for radiation safety" as a prerequisite without
    explaining the steps. No competitor has written a dental-specific guide covering the
    specific form, the radiation safety officer requirement, the inspection process, and
    the timeline. Source needed: aerb.gov.in registration forms and instructions for dental
    diagnostic X-ray equipment under Radiation Protection Rules 2004, and any NDC or
    predecessor DCI circular on radiation safety in dental practice. Do not publish until
    the specific form number and online application portal are confirmed from aerb.gov.in
    directly.

**Rank-improvement candidates, not new posts**

8. Whatever Search Console shows at positions 8-30 once it is connected. Improving an
   existing page usually beats writing a new one.

---

## 5. Daily research sources

### Regulatory and platform (Block A)

- **Meta WhatsApp Business pricing** -- per-message rates, conversation categories,
  free-window rules, upcoming announced changes. Primary: Meta developer pricing docs.
  Secondary: Interakt, WATI, Gupshup, Blueticks, Zoko blogs (they track the official
  rate card and publish date-stamped changelogs).
- **MeitY / PIB** -- DPDP Act gazette notifications, enforcement dates, Data Protection
  Board appointments, consent manager framework. pib.gov.in, meity.gov.in.
- **CBIC** -- notifications and advance rulings touching SAC 9993 (healthcare services),
  cosmetic vs clinical exemption boundary, dental implants and prosthetics GST. cbic.gov.in.
- **Dental Council of India** -- circulars on record-keeping, qualification requirements,
  tele-dentistry rules, practice standards. dciindia.gov.in.
- **NPCI / RBI** -- UPI transaction limit changes, merchant category rules, deep-link
  and collect-request behaviour, interchange updates. npci.org.in, rbi.org.in.
- **Health Ministry / NHP / Ayushman Bharat** -- PMJAY dental coverage changes, NABH
  accreditation updates, Clinical Establishments Act notifications. mohfw.gov.in,
  nhp.gov.in, nabh.co.

### Industry news (Block B)

- **Dental Tribune India** -- dental-tribune.com/india
- **Dental Asia** -- dentalasia.net
- **Indian Dental Association** -- ida.org.in and IDA social channels
- **General health media** -- Times of India Health, Mint, Indian Express on dental
  costs, dental tourism, oral health policy, health insurance changes
- **NABH** -- nabh.co for clinic accreditation standards relevant to small practices

### Competitor content (Block C)

- **Clinicea** -- clinicea.com/blog
- **Practo Manage / Practo health blog** -- practo.com
- **Dentulu, Care.clinic, Klinik** -- newer entrants in Indian dental software
- **Curve Dental, Dentrix, Carestream** -- international vendors writing content aimed
  at Indian practices or practices that match Indian market patterns

### Practitioner questions (Block D)

- **Reddit** -- r/DentalStudentsIndia, r/india (health flair), r/AskIndia
- **Quora India** -- "dental clinic" OR "dentist India" questions with recent activity
- **IDA Facebook groups** -- public posts from the last 30 days
- **Practo Q&A, NirogStreet forums** -- patient and practitioner questions

### Search Console (ongoing)

Queries where we already rank 8-30 are worth more than new pages ranking nowhere. Once
Search Console is connected, check it daily for those positions.

---

## 6. Maintenance

An article is not finished when it ships.

- **Quarterly:** re-check every price, rate and legal date in the live posts. Update the
  figure, bump `dateModified`, and say in the post what changed and when. A visibly
  maintained page outranks a stale one on the same topic.
- **When the product changes:** any post naming a plan limit or price gets re-checked
  against `utils/plan_guard.py` and `blueprints/payments/routes.py` the same day.
- **When a claim can no longer be sourced:** remove the claim. Do not soften it.
