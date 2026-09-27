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

**Published** (removed from write queue; kept here for reference)

- GST on dental services in India (published 2026-09-08, /resources/gst-on-dental-services-india/)
- What a dental clinic legally has to keep (published, /resources/dental-records-india/)
- The real cost of a no-show (published, /resources/no-show-dental-clinic/)
- Registering for the WhatsApp Business API (published 2026-09-24, /resources/whatsapp-api-registration-india/)
- WhatsApp patient replies will cost money from October 2026 (published, /resources/whatsapp-october-2026/)
- Is NABH accreditation worth it (published, /resources/nabh-dental-accreditation-india/)
- The Dental Council of India is gone (published 2026-09-24, /resources/national-dental-commission-india/)

**Ready to write**

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

37. **WhatsApp message template rejected by Meta: what to do if your dental clinic recall
    template is declined.** Dentists who have completed WABA registration and business
    verification hit a second wall: Meta rejects templates that read as promotional even
    when the intent is purely clinical. Common reasons for rejection include phrases that
    imply urgency ("act now", "limited time"), comparisons to competitors, and vague
    placeholders that Meta cannot evaluate during review. The article covers: the four
    rejection categories Meta uses, how to rewrite a recall template that will pass without
    losing its specificity, what to do when a rejection reason is marked "other", and how
    long re-review takes (24-48 hours in India as of 2026). Companion to queue item 4
    (registration guide) and the first-recall-campaign article. Sources: Meta WhatsApp
    Business Platform template quality guidelines (developers.facebook.com), confirmed via
    DentinCloud 2026 guide and Denzif 2026 guide reviewed today.

41. **What is a WhatsApp Business quality rating, and what happens to my dental clinic's recall
    messages when it drops to Red?** Clinics that send recall campaigns are subject to Meta's
    per-number quality rating system: Green (good), Yellow (degraded), Red (message sending
    restricted). A rating falls when patients mark messages as spam or block the number. A Red
    rating limits the number of new conversations a business can start per day, which directly
    caps recall throughput. The article covers: what causes a rating drop, how long a
    restriction lasts, what to do while restricted (respond to inbound conversations, do not
    send outbound templates), and how to recover (improve template relevance, honour opt-outs,
    pause sending). Relevant for every clinic that asks "why have my recall messages stopped
    delivering?" No competitor has published a dental-specific explainer that ties the quality
    rating mechanics to the actual recall workflow. Companion to queue items 4 and 37. Sources:
    Meta WhatsApp Business Platform quality rating documentation
    (developers.facebook.com/docs/whatsapp/overview/messages-and-conversations/), confirmed
    present in the Meta developer docs as of September 2026.

46. **Do dental clinics pay the new 0.4 percent UPI MDR from 15 October 2026, or does the
    small-merchant exemption cover them?** From 15 October 2026, NPCI charges a 0.4% Merchant
    Discount Rate on person-to-merchant UPI transactions above INR 2,000, capped at INR 300
    per transaction for amounts at or above INR 75,000. Dentists using static QR codes, UPI
    payment links, and collect requests are asking whether this cost falls on them. The
    small-merchant exemption is the decisive fact: any business whose total UPI QR-code receipts
    are below INR 1 lakh per month pays no MDR at all. Most solo dental clinics are likely under
    that threshold. For clinics above it, the article should show the practical arithmetic: INR 20
    on a INR 5,000 filling visit; INR 300 cap on a INR 80,000 full-mouth rehabilitation. Healthcare
    is not carved out as an exempted sector -- the concessional categories are railways, fuel,
    agriculture, utilities, telecom, insurance, credit-card dues and tax payments, which each pay
    a flat INR 5 above the threshold rather than 0.4%. Dental clinics do not qualify for that
    carveout. The charge falls on the merchant; merchants cannot pass it to patients. Companion to
    queue items 36, 40, and 45 (which remain blocked on the dental MCC confirmation for the
    INR 5 lakh per-transaction limit; this article covers the MDR question, which is now
    answerable). Sources: NPCI MDR FAQ published 16 September 2026
    (scconline.com/blog/post/2026/09/16/npci-released-upi-mdr-faqs-explained/),
    vajiramandravi.com/current-affairs/upi-mdr-2026/, indianewsnetwork.com 16 September 2026
    report confirming effective date and small-merchant bracket.

51. **Can a dental clinic call patients over WhatsApp using the Business API, and what does
    it cost?** WhatsApp launched voice calling for Business Platform (API) users and it is
    now available in India. Dentists who already use WhatsApp for recall messages are asking
    whether they can replace their standard phone line with WhatsApp calls for appointment
    confirmations, follow-up consultations, and post-treatment check-ins, and whether the
    same 24-hour window and per-message billing rules apply to calls. The article should
    explain: what WhatsApp Business Calling is (voice calls initiated from the API), how it
    differs from free WhatsApp calls on the personal app, how calls are billed (per-minute
    vs per-message), whether the same template and opt-in rules apply, and what a small
    Indian dental clinic actually needs to set it up. No competitor has published a
    dental-specific explainer. The practitioner question "Can I call my patients on
    WhatsApp?" appeared in multiple Q&A searches as of September 2026 with no clean answer.
    Companion to the whatsapp-cost-india article and queue items 4 and 37. Sources: WATI
    blog post on WhatsApp Business Calling Pricing confirmed September 2026
    (wati.io/en/blog/whatsapp-business-calling-pricing/); Meta WhatsApp Business Platform
    calling documentation (developers.facebook.com).

52. **NExT-Dental mandatory exit test: can my dental clinic hire a fresh BDS graduate before
    they pass the exam?** The National Dental Commission now requires all BDS graduates to
    pass the National Exit Test for Dental (NExT-Dental) before they may practice
    independently or enrol in a postgraduate programme. Dental clinic owners planning to
    hire a fresh graduate or take on an associate are asking: can the new dentist start
    seeing patients before the exam result, or must they wait? The article should explain
    the NExT-Dental requirement, the transition provision in the NDC Act that covers
    graduates who completed their BDS before the exam was in force, what the Ethics and
    Dental Registration Board now requires for registration, and what a clinic owner should
    check before a new hire starts. Distinct from queue item 34 (provisional registration
    certificate removal, which concerns interns) and queue item 10 (existing registrations
    continuing under the NDC). No competitor has written this for the clinic-owner audience.
    Sources: Dental Tribune India "Indian dental revamp to bring mandatory graduate test"
    (dental-tribune.com/news/indian-dental-revamp-to-bring-mandatory-graduate-test/),
    PIB press release PRID=2242888 (pib.gov.in/PressReleasePage.aspx?PRID=2242888),
    NDC Act 2023 and NDC gazette notification March 19, 2026.

57. **Two billing rule changes hit Indian dental clinics in October 2026: what the WhatsApp
    and UPI changes actually cost a small practice.** WhatsApp stops giving free service
    replies on 1 October 2026 (₹0.115/message after 1,000 free per number per month); NPCI
    starts charging a 0.4% UPI MDR on P2M transactions above ₹2,000 from 15 October 2026
    (capped at ₹300, small merchants receiving under ₹1 lakh/month via UPI QR are fully
    exempt). Both changes are generating dentist anxiety from notices they cannot interpret.
    A 25-patient-per-day general practice sends roughly 500-750 WhatsApp service messages per
    month -- safely within the 1,000 free tier -- and most chair-side UPI transactions (scaling,
    fillings, cleanings) are below ₹2,000 per payment. The article does the arithmetic for
    a typical Indian general practice and answers the question dentists are actually asking:
    will I owe more money in October? For most solo clinics: no on both. For clinics above
    the thresholds, the article shows the actual rupee amounts. Ship before 1 October 2026.
    Companion to the live whatsapp-october-2026 article and queue item 46. Sources: Meta
    WhatsApp Business Platform pricing documentation (developers.facebook.com, October 2026
    rate card, service message ₹0.115 after 1,000 free -- confirmed today via WATI, SendPulse,
    and Mark360 September 2026 guides); NPCI MDR FAQ published 16 September 2026
    (scconline.com/blog/post/2026/09/16/npci-released-upi-mdr-faqs-explained/, small merchant
    exemption under ₹1 lakh/month confirmed; drishtiias.com coverage of same FAQ). Both sources
    confirmed primary or credible secondary today, 24 September 2026.

60. **How to set up automatic WhatsApp appointment reminders in an Indian dental clinic, and why they reduce no-shows better than SMS or phone calls.** Receptionists at most Indian dental clinics spend two or more hours a day confirming appointments manually over WhatsApp -- a pain point confirmed across multiple dental software review sources in September 2026. Indian patients respond reliably to WhatsApp messages and largely ignore SMS or email, which makes automated WhatsApp reminders the highest-leverage intervention for reducing no-shows without adding front-desk workload. The article should explain the difference between a recall message (to a lapsed patient with no appointment) and an appointment reminder (to a patient with a confirmed booking), which is a distinction the recall guide draws but does not act on; explain that Dentomate sends a WhatsApp reminder automatically the day before the appointment for Starter and Pro plans; walk through what the reminder message looks like from the patient's side; and link to the no-show article for the ROI case. This is a genuine gap: the no-show article (`/resources/no-show-dental-clinic/`) covers the cost and the three-message logic but not the Dentomate-specific setup. The first-recall-campaign article covers outbound campaigns, not inbound-appointment confirmations. Source: Dentomate `appointment_reminders` feature confirmed as a Starter-plan feature in `utils/plan_guard.py` line 30; appointment confirmation WhatsApp template confirmed operational in commit b0c9b3d; practitioner pain point (2+ hours/day on manual confirmations) confirmed in MolarPlus, Codingclave, and SmartDentalDesk September 2026 buyer guides. Ready to write.

61. **What to look for when choosing dental clinic software in India in 2026: five questions that matter more than the feature list.** Multiple software vendors (MolarPlus, Simpld, Codingclave, Dontin, Dento365, Cliniify) are publishing "best dental software India 2026" comparison articles, all of which rank their own product first. Dentists in evaluation mode searching this keyword have no neutral buyer's framework. The article should provide a decision framework rather than a product ranking: (1) Does the software handle Indian billing correctly -- GST-exempt clinical services, taxable goods separately, bill of supply vs tax invoice? (2) Does it use WhatsApp for patient communication, or only SMS and email, and who controls the WhatsApp Business Account? (3) Where is patient data stored -- Indian or international servers -- and what does that mean for DPDP? (4) Does pricing include all the features you actually need, or are reminders, campaigns, and UPI links locked behind the highest tier? (5) Can you export your data if you switch? The article is not a product comparison and should not rank competitors -- it is a framework article that positions Dentomate in the evaluation conversation by addressing the questions a careful buyer asks. Dentomate's India-specific features (GST-aware billing on Pro, WhatsApp reminder on Starter, UPI link on Starter, DPDP position on dpdp page) are stated as concrete answers to the framework questions, not as comparative claims. Source: Dentomate feature set confirmed from `utils/plan_guard.py` and `blueprints/payments/routes.py` today; practitioner evaluation criteria confirmed from MolarPlus, Simpld, and Codingclave September 2026 buyer guides; ABDM and GST handling confirmed as differentiating factors from GitHub dentalpin issue #145 (September 2026). Ready to write.

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

34. **Do I still need a provisional registration certificate before a BDS intern starts
    at my clinic?** Clinic owners hiring fresh BDS graduates to work during their
    Compulsory Rotatory Internship faced a procedural bottleneck: State Dental Councils
    previously required a provisional registration certificate before internship began,
    and that certificate was a precondition for permanent registration after graduation.
    The National Dental Commission removed this requirement entirely in its meeting of
    9 July 2026. State Dental Councils now grant permanent registration directly on
    completion of the BDS course and internship, without insisting on a provisional
    certificate. Clinic owners hiring interns are still asking whether they need to check
    for this document at the start of an internship. The answer changed this July, and
    no dental practice management site has written an India-specific explainer aimed at
    the clinic owner rather than the student. Sources: NDC meeting resolution dated 9 July
    2026 (medicaldialogues.in coverage confirmed; NDC press release on dciindia.gov.in).
    Companion to queue item 8 (DCI to NDC transition article).

35. **Has the DPDP compliance deadline been moved from May 2027 to November 2026?**
    In a January 2026 MeitY stakeholder consultation, industry groups were told the
    ministry is considering cutting the 18-month transition to 12 months, which would
    bring full obligations to November 2026. If enacted, the May 2027 dates in the live
    dpdp-checklist article (line 103) would become wrong 15 months early, and the
    queue item 25 consent notice article would become urgent. Multiple compliance
    advisory blogs are treating the shortened deadline as probable rather than confirmed.
    No gazette notification has been found in searches as of 16 September 2026. Source
    needed: MeitY gazette notification or official press release confirming the final
    compliance deadline before this can be reported as settled. If the shortened deadline
    is enacted, update dpdp-checklist line 103 the same day.

36. **Does a dental clinic qualify as a verified healthcare merchant under NPCI's UPI
    Rs.10 lakh daily limit?** NPCI raised the verified merchant payment limit to Rs.10
    lakh per day for healthcare and other eligible sectors. Dentists collecting large
    treatment bills (implants, orthodontics, full-mouth rehabilitation) via UPI are asking
    whether their clinic qualifies for this limit and how to get verified. Secondary
    sources (Pine Labs, Razorpay) confirm healthcare is an eligible sector but do not name
    the Merchant Category Code that covers dental clinics or the verification application
    process. Source needed: primary NPCI merchant category circular that specifies the
    MCC for dental clinics under the healthcare category and the step-by-step verification
    process for UPI verified merchant status. Do not publish until the specific MCC and
    application pathway are confirmed from npci.org.in directly. Companion to queue
    item 16.

38. **How do I apply for CGHS empanelment as a dental clinic, and what documents do I need?**
    Dentists outside CGHS-empanelled networks are asking how to join after the June 2026
    fresh empanelment round added 140 dental centres in Delhi NCR. The question splits into
    two: (a) basic empanelment eligibility and application process for any dental clinic,
    and (b) the additional NABH uplift that raises reimbursement by 15%. The article should
    answer: what minimum criteria a dental clinic must meet, which CGHS office processes
    the application, what documents are required, and how the empanelment validity (three
    years from date of issue, per the June 2026 OM) and renewal work. Companion to queue
    items 7, 29, and 31. Source needed: official CGHS empanelment application form and
    eligibility criteria for dental centres from cghs.gov.in or the specific CGHS O.M.
    (June 2026, Delhi NCR). The staffnews.in June 2026 report confirms the empanelment
    happened but does not contain the application process. Do not publish without the
    primary CGHS source confirming eligibility criteria and document list.

39. **Can I share a patient's dental records with a specialist for a referral without
    getting fresh consent under DPDP?** Indian dentists regularly refer patients to
    periodontists, oral surgeons, and general physicians and pass clinical records along
    with the referral. Under DPDP, sharing personal data with a third party requires either
    consent or a valid legitimate-use ground. Healthcare treatment is often cited as a
    legitimate-use basis, but the DPDP Act's Section 7 list of legitimate uses does not
    explicitly name treatment referrals in the same way, and no NDC or MoH guidance has
    been issued to clarify the position for dental referrals specifically. Clinic owners
    want a straight answer: do they need a separate consent checkbox for specialist
    referral data, or is the original treatment consent sufficient? No competitor has
    published a dental-specific answer that cites the Act text rather than a generic "you
    need consent" summary. Companion to the dpdp-checklist article (item 2 on separating
    consent types). Source needed: DPDP Act Section 7 text confirming whether treatment
    referrals fall within a legitimate-use ground; any MoH or NDC circular on inter-
    practitioner data sharing for healthcare; and, if Section 7 does not cover referrals
    explicitly, confirmation from a primary legal source that the treatment consent at
    registration is sufficient to cover onward referral sharing.

40. **Does India's April 2026 UPI two-factor authentication requirement change how my dental
    clinic collects patient payments at the front desk?** From 1 April 2026, all domestic
    digital payments including UPI must use two authentication factors from different
    categories (PIN, registered device, or biometric), with at least one dynamic factor per
    transaction. The practical question for a dental clinic: does this change the patient
    payment flow at the counter, does it affect UPI collect requests sent to patients, and
    does the existing app-based UPI already satisfy the requirement without changes? Secondary
    sources (Pine Labs, OxiGen) confirm the rule but do not describe the dental-clinic
    workflow impact specifically. Source needed: primary RBI circular or NPCI operational
    guideline text confirming the two-factor mandate, the effective date, and whether
    collect-request UPI flows already comply. Do not publish until the specific RBI/NPCI
    circular number is confirmed from npci.org.in or rbi.org.in. Companion to queue
    items 16 and 36.

42. **What happens to patient records if I close my dental clinic in India -- what do DPDP
    and NDC require?** Dentists retiring, relocating, or closing a branch face a records
    handover question with no published answer for Indian practice: what to do with clinical
    files, how long to keep them, whether patients must be notified, and whether the data
    must be erased. DPDP Rules 2025 Rule 8 covers erasure of personal data when the purpose
    expires, but clinical records have a separate retention obligation (NDC successor to DCI
    Code of Ethics; Consumer Protection Act 2019 limitation period of three years from cause
    of action). The article should answer: the minimum retention period for clinical records,
    what DPDP requires on erasure of marketing data versus clinical data, how to notify
    patients of a closure, and what to do with paper registers. Distinct from queue item 2
    (ongoing retention for a running clinic) because closure involves a definite end-date
    and a transfer-or-destroy decision. No competitor has a dental-specific closure-records
    guide. Source needed: DPDP Rules 2025 Rule 8 text from the gazette (pib.gov.in) and the
    NDC or predecessor DCI retention period for clinical dental records confirmed from a
    primary NDC or MoH document, not from secondary legal summaries.

43. **Does Ayushman Bharat cover dental treatment at a private clinic, and what does the
    exclusion list mean for my patients?** Dentists asking whether PMJAY-card patients
    can receive treatment at their clinic and whether to seek empanelment. PMJAY excludes
    most routine dental procedures: fillings, root canals, extractions, periodontal
    treatment, implants, prosthetics, and cosmetic work. Coverage exists only for dental
    procedures requiring hospitalisation because of trauma or tumour -- a narrow exception
    that most general practices will never trigger. Multiple community Q&A sites
    (HexaHealth, Quora) carry this question with wrong or partial answers; no competitor
    has written a dental-specific explainer aimed at private clinic owners. The article
    should explain the exclusion clearly, describe the narrow inpatient exception, and
    compare what CGHS and ECHS (separate government employee schemes) cover compared to
    PMJAY. Companion to queue items 29 and 38 (CGHS empanelment). Source needed: primary
    PMJAY Health Benefit Package list from nhpm.gov.in or the scheme's official benefit
    document, with the specific package codes that cover and those that exclude dental
    procedures. Do not publish until the specific package code list is confirmed from the
    PMJAY primary source. Secondary sources (angelone.in exclusion list, hexahealth.com
    Q&A) confirm the exclusion pattern but do not provide official package code numbers.

44. **What GST rate applies when a dental clinic supplies dental instruments or prosthetics
    as goods rather than as services?** Dentists who sell whitening kits, mouth guards, or
    whose labs supply crowns and bridges separately are asking whether these attract GST
    even when the clinical service is exempt under SAC 9993. The September 2025 GST
    Council meeting (effective 22 September 2025) reduced dental instruments and equipment
    under HSN 9018 from 12% to 5% GST. Dental prosthetics, implants and artificial teeth
    under HSN 9021 continue at 5% when supplied as goods. The clinical service exemption
    under SAC 9993 does not extend to goods supplied separately. No competitor has written
    a dental-specific explainer that distinguishes goods supply (HSN rate) from service
    supply (SAC exemption) after the September 2025 rate change. Companion to queue items
    1 and 18 (GST on dental services; implant hardware GST). Source needed: specific CBIC
    notification number and gazette text for the 22 September 2025 HSN 9018 rate
    reduction; and confirmation that HSN 9021 remains at 5% and was not changed in the
    same notification. The newsonair.gov.in report of 9 September 2025 confirms rate cuts
    effective 22 September 2025 but does not list HSN codes. Do not publish until the
    CBIC notification number is confirmed from cbic.gov.in.

45. **How do I accept UPI payments from patients at my dental clinic, and what is the
    difference between a QR code, a payment link, and a collect request?** Dentists
    moving away from cash receipts ask which UPI mechanism suits a clinic front desk:
    static QR on the counter, a per-bill payment link sent to the patient's phone, or a
    UPI collect request pushed from clinic software. The three differ in how the patient
    pays, how the receipt appears in the bank statement, and whether they work without a
    payment gateway integration. Pine Labs and Razorpay 2026 guides confirm healthcare
    merchants can accept up to Rs.5 lakh per transaction and Rs.10 lakh per day, but do
    not explain the clinic workflow. The article should walk through each method, explain
    which requires a payment gateway (collect requests), which works with a bank-provided
    merchant QR alone, and what MDR applies to each. Companion to queue items 16, 36, and
    40. Source needed: NPCI merchant category code classification confirming dental clinics
    fall within the healthcare Rs.5 lakh per-transaction category, and the verification
    process for that limit. Do not publish limit claims until the dental MCC is confirmed
    from npci.org.in or a primary NPCI circular. Secondary sources (pinelabs.com,
    razorpay.com blog September 2026) confirm the healthcare category but do not name the
    MCC for dental clinics specifically.

47. **What changes when a solo dental clinic adds a second dentist: NDC registration, DPDP
    multi-login obligations, and GST entity structure?** India's dental practice landscape is
    shifting from solo to multi-dentist practices, a trend confirmed in the India Dental Devices
    Market 2026 report (Mordor Intelligence: USD 318.65M market, 6.64% CAGR, group practice
    momentum noted in industry coverage September 2026). When a clinic owner adds a second
    dentist, three compliance questions arise that no competitor has addressed together: (a) does
    the NDC Ethics and Dental Registration Board require any change to the clinic's registration
    when a second clinician joins; (b) does DPDP's access-control obligation (individual logins,
    role-based permissions per DPDP Rules 2025) become more pressing with multiple clinicians
    sharing patient records; and (c) does adding a partner change the GST entity from sole
    proprietorship to partnership, requiring a fresh GSTIN application. This is the compliance
    lifecycle question at the moment a growing clinic looks for new software -- the Dentomate
    multi-clinic Pro feature is directly relevant. No competitor has published an India-specific
    guide addressing all three at once. Source needed: NDC Ethics and Dental Registration Board
    guidance on multi-practitioner clinic registration from dciindia.gov.in or an NDC circular;
    DPDP Act on access controls for healthcare data fiduciaries with multiple authorised users
    (Act Section 8 and Rules 2025); and CBIC or MCA guidance on the GST/PAN implications of
    converting a sole-proprietorship dental clinic to a partnership or LLP.

48. **Why does my WhatsApp appointment confirmation cost 7x less than my recall message,
    and how do I make sure Meta classifies my templates correctly?** Dentists using the
    WhatsApp Business Platform are surprised to find that the same billing event --
    reaching one patient -- costs ₹0.1150 for an appointment confirmation and ₹0.8631
    for a "we miss you" recall message. The difference is Meta's template category: Utility
    (transactional messages about an existing interaction) versus Marketing (any message
    that promotes, reminds, or re-engages without a pending transaction). A recall message
    to a patient who has not visited in six months is Marketing by definition; an appointment
    confirmation sent after the patient books is Utility. The category is set at template
    submission and cannot be changed after approval -- submitting a recall template as
    Utility will result in rejection, not a discount. The article answers: the three category
    definitions, which common dental clinic messages map to which category, what language
    triggers a Marketing classification even in a Utility submission, and what to do when
    Meta's category decision seems wrong. Companion to queue items 4 (WABA registration),
    37 (template rejection recovery), and the live whatsapp-cost-india article. Sources:
    Meta WhatsApp Business Platform template category guidelines
    (developers.facebook.com/documentation/whatsapp/message-templates/), confirmed current
    via Blueticks 2026 guide (blueticks.co/blog/whatsapp-business-api-pricing-2026) and
    Engagelab 2026 guide (engagelab.com/blog/whatsapp-business-api-pricing). SmartDentalDesk
    published a WhatsApp marketing guide for dental clinics in 2026 that does not explain
    the category system; this article fills that gap with the cost arithmetic that makes the
    distinction matter.

49. **Is a dental clinic liable under DPDP if a receptionist shares a patient record on
    their personal WhatsApp?** The DPDP checklist article (item 3 in the list) names
    patient conversations on personal phones as one of the three most common compliance
    failures. Dentists reading it are asking the follow-up: does a staff member's
    individual act create liability for the clinic, and what safeguards does the clinic
    need to document so it is not held responsible for an employee going outside their
    authorised role? DPDP Act Section 8 requires a data fiduciary to implement reasonable
    security safeguards and to ensure that authorised persons process personal data only
    on lawful instructions. The article should explain: what Section 8 requires in
    practical terms for a dental clinic, whether a staff member using a personal phone
    constitutes an authorised person acting outside lawful instructions, what safeguards
    (acceptable-use policy, clinic-issued devices, access revocation on departure) reduce
    the clinic's exposure, and what the Data Protection Board could impose in a worst-case
    complaint. No competitor has written a dental-specific liability guide for this
    scenario. Source needed: DPDP Act Section 8 text from the gazette (pib.gov.in) and
    DPDP Rules 2025 Rule 6 on security safeguards, with the specific obligations confirmed
    from the primary gazette text rather than a secondary summary; and any MeitY guidance
    or early DPB direction on what "reasonable security safeguards" means for small data
    fiduciaries. Do not publish until the Act/Rules language is confirmed from primary
    sources and a qualified reading of whether personal-phone use by authorised staff
    triggers clinic liability is sourced from a primary legal reference.

50. **What does AI dental diagnosis software actually do, and does a small Indian clinic
    need it in 2026?** The IDA Delhi State Conference (September 2026) included AI
    diagnostics as a featured topic. Indian startup scanO AI is receiving press coverage
    for contactless AI dental screening. Dental software vendors including Cliniify market
    "AI Copilot" features. Dentists are asking: what is AI dental diagnosis, how does it
    differ from the "AI suggestions" built into practice management software, is there
    clinical evidence that it improves outcomes or reduces missed diagnoses, and what does
    it actually cost for a solo clinic? The article should explain the two distinct product
    categories -- AI diagnostic screening tools (hardware and imaging AI, separate from
    practice software) versus AI-assisted clinical note and treatment suggestion features
    built into software -- explain the difference between CE-marked/CDSCO-cleared medical
    devices and unregulated software features, and give dentists a framework for evaluating
    vendor claims. No competitor has published a clinical-evidence-based explainer for an
    Indian general dentist audience. Source needed: a peer-reviewed Indian clinical study
    or validation paper comparing AI dental screening accuracy to a trained radiographer
    (IDA, JIDA, or indexed Indian dental journal); CDSCO clearance status or CE marking
    for at least one AI dental diagnostic tool offered in India; and confirmation that no
    NDC circular on AI diagnostics has been issued as of the publish date. Do not publish
    until a validated primary clinical source is confirmed -- the claim that AI can support
    or replace a diagnostic step requires an evidence source, not a vendor data sheet.
    Companion to queue item 8 (NDC regulatory context) and the digital-records topic (item
    30). Sources to check: PubMed/PMC for Indian AI dental diagnosis studies, CDSCO.gov.in
    medical device registration database, NDC gazette notifications.

53. **What licenses, registrations, and permits does a dentist need before opening a new
    dental clinic in India in 2026?** This is the single most-searched pre-opening question
    on Quora and NirogStreet ("what are the various permissions needed to open a dental
    clinic in India"), and every existing answer is either incomplete or pre-NDC. The 2026
    answer is different from the 2025 answer because the Dental Council of India is
    dissolved and the National Dental Commission's Ethics and Dental Registration Board now
    handles practitioner registration. The article should be a structured checklist covering:
    (1) NDC/EDRB practitioner registration, (2) state Clinical Establishments Act
    registration (where the state has adopted the CEA 2010), (3) AERB radiation equipment
    registration before the first X-ray unit is switched on, (4) bio-medical waste
    management authorisation under BMW Rules 2016, (5) GST registration threshold question
    (is treatment income exempt enough to stay below threshold), (6) DPDP-ready consent
    notice and access-log process from day one, and (7) NPCI UPI merchant registration if
    accepting payments via QR or payment link. Individual items in each category are already
    in the queue as standalone articles (items 19, 33, 32, 45), but no competitor has
    published a single-page opening checklist that covers all seven in the context of the
    2026 regulatory environment. Sources needed: (a) NDC EDRB registration process and
    portal from dciindia.gov.in or an NDC circular, (b) state-level CEA adoption list from
    MoHFW for at least the five largest states (confirmed from mohfw.gov.in), (c) AERB
    dental X-ray registration form and steps from aerb.gov.in, (d) BMW authorisation process
    from CPCB or state pollution board. Do not publish until (a) and (c) are confirmed from
    primary government sources; (b) is confirmed for at least Maharashtra, Karnataka, Delhi,
    Rajasthan, and UP; and the checklist has been reviewed for accuracy by at least one
    Indian health-law secondary source.

54. **What bio-medical waste rules apply to a dental clinic in India, and what must I do before
    opening?** Dental clinics generate clinical waste covered by the Bio-Medical Waste Management
    Rules 2016 (Ministry of Environment, Forest and Climate Change): used gloves, extracted teeth,
    sharps (needles, scalpel blades), and soiled dressings each fall into specific colour-coded
    categories that must be segregated, stored, and handed to an authorised collection agency. An
    authorisation from the state Pollution Control Board (SPCB or PCCB) is required before a clinic
    can generate BMW. Dentists opening a new clinic consistently ask this question on Quora and
    healthcare startup forums alongside the AERB radiation registration question, and no dental-
    specific explainer covers the specific bag colours, categories, and authorisation steps for a
    dental clinic. Queue item 53 (opening checklist) lists BMW authorisation as one of seven
    checklist items but does not explain the mechanics. Source needed: BMW Management Rules 2016
    Schedule I (category and colour-coding table) from the Ministry of Environment gazette
    (egazette.gov.in or cpcb.nic.in), the specific SPCB online application process for a small
    dental clinic, and the penalty provisions for operating without authorisation. Do not publish
    until the category table and at least one state SPCB application pathway are confirmed from
    primary sources.

55. **Has NABH changed its dental clinic accreditation requirements in 2026, and does my earlier
    certification still hold?** Dentists who hold NABH accreditation under a previous edition or
    who are applying for the first time are asking whether the 5th edition standards introduced new
    requirements and, if so, whether existing accreditation must be updated. Confirmed today
    (adrine.in, NABH Accreditation for Dental Clinics India 2026; ichelonconsulting.com, ABDM 2026
    rollout): NABH's 5th edition standards now require Health Facility Registry (HFR) registration
    under the Ayushman Bharat Digital Mission as part of the accreditation process. This is a new
    requirement that was not present in earlier editions. Dentists who are NABH-certified under a
    prior edition need to know whether this triggers a re-audit or whether it is satisfied at the
    next renewal cycle. The article should explain: what changed in the 5th edition that is
    specifically relevant to a dental clinic, what HFR registration involves and how to do it, and
    whether CGHS and ECHS empanelment still recognises certifications granted under earlier
    editions while renewal is pending. Companion to queue items 7, 12, and 31. Source needed:
    primary NABH 5th edition dental healthcare standards document from nabh.co confirming the HFR
    requirement and the edition transition timeline; and a MoHFW or NABH circular on whether
    existing certifications under prior editions remain valid during the transition. Do not publish
    until the primary NABH standards document is confirmed.

56. **How do I move my dental clinic's patient records from paper registers to software without
    losing data or violating DPDP?** Dentists evaluating practice management software are blocked
    not by the decision to switch but by the first practical step: how to get years of paper
    records into the new system. The question splits into two parts that practitioners ask
    separately but need answered together: (a) what is the safe way to digitise records (scan,
    manual entry, or both), and (b) does re-entering patient data into a new system require fresh
    patient consent under DPDP, or is the original treatment consent sufficient? The DPDP data-
    minimisation obligation (retain only what the purpose requires) also means migration is an
    opportunity to stop carrying stale data, but only if the clinic knows how to identify and
    dispose of it correctly. No competitor has published a DPDP-aware data migration guide for
    dental clinics. Queue item 30 covers why dentists fear switching; this article covers what to
    do once the decision is made. Source needed: DPDP Act Section 6 on consent for processing
    already-held data (whether historical records fall under legacy processing or require fresh
    consent), DPDP Rules 2025 on data minimisation obligations, and practical guidance from any
    MeitY or industry body on migrating legacy healthcare records under the DPDP framework. Do not
    publish until the consent-for-historical-data question is confirmed from the Act text or an
    authoritative legal reading, as the answer changes the migration workflow for every clinic.

58. **Can my receptionist use the free WhatsApp app to voice-call patients, and does DPDP
    treat phone calls the same as text messages?** Most Indian dental clinics make free
    WhatsApp voice calls from a receptionist's personal phone for appointment reminders and
    follow-ups, treating it as zero-cost and DPDP-separate from the API messaging that the
    dpdp-checklist article flags. The checklist article (item 3) explicitly names patient
    conversations on personal phones as a top compliance failure, but focuses on messaging.
    Voice calls create an audio record in the recipient's call log and involve personal data
    (the number dialled, the call duration, the verbal content). The question dentists are now
    asking: does calling a patient on personal WhatsApp create the same DPDP exposure as
    texting them, and can a verbal agreement during a call count as a valid consent record for
    a recall campaign? Queue item 51 covers WhatsApp Business Calling via the API (commercial
    feature); this article covers the free personal-app calling scenario used by the majority
    of small clinics. No competitor has published a dental-specific answer. Found in multiple
    practitioner Q&A searches September 2026 with no clean existing answer. Source needed:
    DPDP Act Section 2 definition of "personal data" as applied to call logs and audio
    communications; DPDP Rules 2025 Rule 6 on security safeguards confirming whether voice
    calls via personal messaging apps require the same safeguards as text; any MeitY guidance
    or Data Protection Board direction distinguishing audio from text for data-fiduciary
    purposes; and a legal reading confirming whether verbal consent during a call is
    recordable as consent evidence under the DPDP framework.

59. **What dental insurance plans in India actually cover private clinic visits, and is
    it worth a solo dentist empanelling with any insurer?** A 2025 Frontiers in Dental
    Medicine paper on India's oral health outlook reports that fewer than 5% of Indians
    have any form of dental insurance coverage -- one of the lowest rates among large
    economies. Dentists are asked daily by patients whether their health insurance covers
    the treatment, and the correct answer ("almost certainly not, for a private clinic")
    is rarely documented clearly. Corporate group health policies increasingly include
    preventive dental riders; Star Health and Care Insurance both offer individual dental
    plans in India. The article should answer: which specific insurer products cover private
    dental clinic visits (not just hospital dental departments), what empanelment with those
    insurers involves for a solo practice, what the reimbursement rates look like for common
    procedures, and whether the administrative overhead of cashless claims is justified by
    the patient volumes a typical solo clinic would see. Distinct from queue item 15
    (insurance and cashless claims generally) because this article focuses specifically on
    private insurers covering private clinic visits -- the practical question at the reception
    desk -- rather than the broader regulatory framework. Distinct from queue items 29, 38,
    and 43 (CGHS/ECHS/PMJAY, all government schemes). Source needed: Star Health dental
    plan policy document confirming coverage for empanelled private dental clinics; at least
    one other individual dental plan from an IRDAI-registered insurer; the Frontiers in
    Dental Medicine 2025 paper confirmed on PubMed (search "India oral health outlook
    Frontiers") for the <5% penetration figure and its methodology; and IRDAI circular or
    insurer empanelment guide confirming the application process for private dental clinics.
    Do not publish until at least two insurer policy documents and the primary epidemiological
    source are confirmed from primary or peer-reviewed sources.

62. **Does mandatory GST e-invoicing apply to my dental clinic?** The government has progressively lowered the turnover threshold for mandatory GST e-invoicing (B2B electronic invoice reporting to the IRP portal). Dentists who have read about these expansions are asking whether their clinic must now generate e-invoices for patient bills. The correct answer for most dental clinics is no, for two independent reasons: (a) e-invoicing applies only to B2B supplies to GST-registered recipients, and the overwhelming majority of dental patients are unregistered individuals; (b) clinical dental treatment is exempt under SAC 9993, and exempt supplies do not require an e-invoice regardless of the recipient's registration status. Consumable goods sold separately (whitening kits, mouth guards) to a GST-registered buyer above the turnover threshold are a different matter. No competitor has published a dental-specific explainer that separates these two grounds and gives clinic owners a clear answer. The question appeared explicitly in a September 2026 GitHub issue (dentalpin/dentalpin #145) alongside DPDP and ABDM compliance questions, confirming it is live in the practitioner community. Companion to queue items 32 (GST registration threshold) and 44 (goods GST rates). Source needed: CBIC e-invoicing exemption notification confirming that B2C supplies are outside the mandate (Notification 13/2020-CT as amended, or the current consolidated CBIC FAQ on e-invoicing exemptions from cbic.gov.in); and CBIC confirmation that exempt supplies under SAC 9993 do not require e-invoices even if the turnover threshold is crossed. Do not publish until both grounds are confirmed from cbic.gov.in or a primary gazette notification -- a wrong answer here could cause a clinic to pay unnecessary compliance overhead or, worse, skip a genuine obligation.

63. **Are at-home dental treatments like clear aligner fitting and teeth whitening legal in India, and what does the NDC say about remote dental services?** Dental Tribune India published a feature in September 2026 on the rise of unethical at-home dental services, noting that the original DCI criticism of companies like Toothsi and makeO was based on the Dentists Act 1948 and the Revised Dentists Code of Ethics Regulations 2014 -- both now repealed with DCI's dissolution in March 2026. Under the NDC Act 2023, the Ethics and Dental Registration Board now handles professional conduct. The question for a clinic owner is both regulatory (what can a licensed dentist legally do at a patient's home) and competitive (can a startup offering at-home teeth whitening or aligner supervision operate without an NDC-registered dentist on-site). No competitor has published a post-NDC explainer on this. Source needed: NDC Act 2023 Section on scope of dental practice and practice settings (indiacode.nic.in/handle/123456789/19795); any EDRB circular or NDC guidance on mobile or home dental practice issued after March 2026 (dciindia.gov.in gazette list); and a confirmation of whether the 2014 Code of Ethics Regulations have been replaced by an NDC equivalent. Do not publish until the post-NDC regulatory position is confirmed from a primary NDC source -- the DCI-era criticism of Toothsi is no longer the operative legal framework. Source: dental-tribune.com/news/rise-of-unethical-at-home-dental-services-in-india/

64. **What happens when a patient asks my dental clinic to delete their data under the DPDP Act?** Under the Digital Personal Data Protection Act, a data principal (patient) can withdraw consent and request that the clinic erase personal data collected for that purpose. For a dental clinic, this creates a direct conflict: clinical dental records have their own retention obligation (the NDC successor to the DCI code of ethics; Consumer Protection Act 2019 limitation period of three years from cause of action), which the DPDP Act cannot override for data collected for lawful health treatment. No competitor has published a dental-specific guide that distinguishes which patient data a clinic must delete on request (marketing consent records, contact details collected for recall) from which it must retain regardless of the request (clinical notes, X-rays, treatment history). Practitioners asking "can a patient force me to delete their records?" need a straight answer to both halves of the question. Source needed: DPDP Act Section 12 text (right of data principal to withdraw consent and request erasure, from gazette.gov.in or pib.gov.in); DPDP Rules 2025 Rule 8 on data retention confirming the lawful-purpose exception; and the applicable clinical record retention period from the NDC Act 2023 or any EDRB circular, or, until an EDRB circular is issued, the DCI Code of Ethics 2014 Regulation 1.1.7 as the last operative standard. Do not publish until the DPDP Act text and the current NDC retention standard are both confirmed from primary sources.

65. **Rising dental litigation in India: what documentation should a dental clinic keep to defend a consumer complaint?** Dental Tribune India published a feature on rising dental litigation in India (in.dental-tribune.com/news/rising-dental-litigation-in-india-what-dentists-need-to-know/). The Consumer Protection Act 2019 raised the pecuniary limit of District Consumer Commissions to Rs 1 crore, bringing more dental disputes into the forum and significantly increasing dentist exposure. Dentists ask what records protect them: a signed treatment plan, X-rays showing pre-existing conditions, informed consent for extractions and surgical procedures, and a contemporaneous clinical note for every visit. The article should explain what the Consumer Protection Act requires a practitioner to produce in a complaint, what the NDC Ethics and Dental Registration Board may additionally require, and what the absence of a contemporaneous record means for a clinic's defence. Distinct from queue item 22 (how to respond to a negative online review) because this covers the legal complaint process, not the public-response question. No competitor has published a documentation-defence guide aimed at Indian dental clinic owners in the post-2019 CPA environment. Source needed: Consumer Protection Act 2019 Section 47 on District Commission jurisdiction and Section 49 on deficiency-of-service standard, confirmed from indiacode.nic.in; and any NCDRC or State Commission order in a dental case that discusses what clinical documentation was decisive, confirmed from ncdrc.nic.in or the judgment text.

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
