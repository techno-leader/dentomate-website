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

Fifteen minutes, output goes into the Topic Queue below:

1. Check what changed in the sources that move our topics (list in section 5).
2. Check Search Console for queries where we already rank 8-30. A page ranking 11th for a
   real query is worth more than a new page ranking nowhere.
3. Write one line into the queue: the question, who is asking it, and the source that
   answers it. If no source answers it, it is not a topic yet.

The queue needs a running buffer of at least four sourced topics. Below that, the daily
research is not keeping up with the publishing rate and the rate comes down, not the bar.

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
   DCI guidance and the Consumer Protection Act limitation period. Sources: DCI Code of
   Ethics Regulations, CPA 2019.
3. **The real cost of a no-show, and the three messages that reduce it.** We can be
   concrete about timing because the reminder window is in our own code.
4. **Registering for the WhatsApp Business API in India, step by step.** The Meta
   onboarding flow, business verification, and what a display-name rejection means.
5. **Dental clinic pricing in India: how to present a treatment plan patients accept.**
   Consent, itemisation, and staged treatment.

**Needs a source before it can be written**

6. Average patient lifetime value for an Indian dental practice. Only publish if a
   citable industry figure exists. Do not model one and present it as fact.
7. Insurance and cashless dental claims in India. Genuinely complex, high search volume,
   and easy to get wrong.

**Rank-improvement candidates, not new posts**

8. Whatever Search Console shows at positions 8-30 once it is connected. Improving an
   existing page usually beats writing a new one.

---

## 5. Daily research sources

- **Meta WhatsApp Business pricing** for India conversation and per-message rates. This
  changes and our cost article goes stale silently when it does.
- **MeitY / PIB** for DPDP Act rules and enforcement dates.
- **CBIC** notifications for anything touching GST on healthcare services.
- **Dental Council of India** circulars for practice and record-keeping obligations.
- **NPCI** for UPI limits and deep-link behaviour.
- **Search Console** for queries we already surface on.
- **Reddit r/india dentists, IDA forums, dental Facebook groups** for the questions
  practitioners ask each other. This is where topic 5 came from.

---

## 6. Maintenance

An article is not finished when it ships.

- **Quarterly:** re-check every price, rate and legal date in the live posts. Update the
  figure, bump `dateModified`, and say in the post what changed and when. A visibly
  maintained page outranks a stale one on the same topic.
- **When the product changes:** any post naming a plan limit or price gets re-checked
  against `utils/plan_guard.py` and `blueprints/payments/routes.py` the same day.
- **When a claim can no longer be sourced:** remove the claim. Do not soften it.
