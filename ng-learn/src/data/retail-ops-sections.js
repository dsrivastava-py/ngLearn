/*
 * Retail Ops Module — 7 Sections
 * Content parsed from courses/retail-ops/retail-ops-course-content/*.md
 * Video mapping from courses/retail-ops/videos/
 */

export const MODULE_TITLE = 'Retail Operations';
export const MODULE_SUBTITLE = 'Offline Sales — Complete Process Training';
export const MODULE_DESCRIPTION = 'A ground-up training course covering the four core processes of Retail Ops: Stock, Staff, Display, and Communication. Built from the official Lucidchart process map and cross-checked against the department\'s process-review meeting.';

export const SECTIONS = [
  {
    id: 'orientation',
    order: 1,
    title: 'Orientation',
    subtitle: 'What is Retail Ops & the 4-module map',
    icon: 'target',
    estimatedMinutes: 15,
    videoFile: '1.mp4',
    hasVideo: true,
    overview: 'Retail Ops (Offline Sales) is the team responsible for everything that happens to a product after it\'s made and before it reaches a customer\'s hands inside a physical retail partner store (e.g., Home Center). This orientation maps out the four core processes and explains the diagram conventions used throughout the course.',
    steps: [
      {
        title: 'The Four Core Processes',
        content: 'The master diagram splits Retail Ops into four core processes, meant to be learned in order: **Stock** (right quantity → right store → on time), **Staff** (hiring, training, testing, rating), **Display** (correct arrangement, looks saleable, properly counted), **Communication** (signage, offers, product info visible and accurate).',
        type: 'info',
      },
      {
        title: 'Primary & Secondary Responsibility',
        content: 'Every box in every process carries a banner: **Primary Responsibility – AM (Area Manager)** and **Secondary Responsibility – AGM Sales.** The AM owns execution of everything; the AGM Sales is the backstop/escalation point.',
        type: 'key-point',
      },
    ],
    keyPoints: [
      'Four core processes: Stock → Staff → Display → Communication',
      'AM (Area Manager) = Primary Responsibility across all modules',
      'AGM Sales = Secondary Responsibility / escalation point',
      'Home Center is referred to as HC or NG throughout the course',
    ],
    diagramLegend: [
      { color: 'white', label: 'White/black boxes', meaning: 'Action or process step' },
      { color: 'diamond', label: 'Diamonds', meaning: 'Decision point (usually Yes/No)' },
      { color: 'yellow', label: 'Yellow sticky notes', meaning: 'Definitions, formulas, or extra rules' },
      { color: 'green', label: 'Green arrows', meaning: 'The "Yes" / positive path' },
      { color: 'red', label: 'Red arrows', meaning: 'The "No" / problem path' },
      { color: 'beige', label: 'Tan/beige boxes', meaning: 'Cadence or timing rule' },
      { color: 'orange', label: 'Orange/red box', meaning: 'Hand-off to another process' },
    ],
    recap: [
      'Retail Ops = everything post-production, pre-customer in physical retail stores',
      'Four modules in order: Stock → Staff → Display → Communication',
      'AM owns execution; AGM Sales is the escalation backstop',
      'Diagram uses color-coded boxes, diamonds, sticky notes, and arrows',
    ],
  },

  {
    id: 'stock-process',
    order: 2,
    title: 'Stock Process',
    subtitle: 'Weekly cycle, MDQ/DOC, escalation ladder',
    icon: 'package',
    estimatedMinutes: 25,
    videoFile: '2.mp4',
    hasVideo: true,
    overview: 'Before a single plant reaches a shelf, someone has to decide how much of it to send to which store. The Stock process governs the weekly rhythm of pulling sales data, comparing it to targets, and placing replenishment orders.',
    steps: [
      {
        title: 'Step 1 — Weekly Stock Review',
        cadence: 'Every Saturday',
        content: 'The cycle kicks off with a scheduled weekly review. "Saturday we make the rough plan and Monday we make the final plan" — Saturday is drafting day, Monday is confirmation day.',
        type: 'step',
      },
      {
        title: 'Step 2 — Fetch data from HC portal',
        content: 'The team logs into the retail partner\'s (Home Center) portal to pull raw numbers.',
        stickyNote: 'HC portal has had migration issues — when down, the team depends on the partner sending data manually.',
        type: 'step',
      },
      {
        title: 'Step 3 — Download stock report & last week sales',
        content: 'Two data points extracted together: **SOH (Stock On Hand)** and the **previous week\'s sales**.',
        type: 'step',
      },
      {
        title: 'Step 4 — Download store-level data',
        content: 'Same figures, broken down **per individual store** — replenishment decisions are store-by-store, not in bulk.',
        type: 'step',
      },
      {
        title: 'Step 5 — Decision: Stock vs MDQ',
        content: '**MDQ = Minimum Display Quantity.** Current stock is classified: **<70% of MDQ** → critically under-stocked (exception path). **70%–110% of MDQ** → normal replenishment band.',
        type: 'decision',
      },
      {
        title: 'Step 5a — The <70% Red Flag Branch',
        content: 'Four actions happen together: **Highlight in dashboard**, **Compare with last week\'s sales**, **Do RCA (Root Cause Analysis)**, **Share RCA with AGM Sales.** These stores jump the queue for priority replenishment before the normal cycle.',
        type: 'alert',
      },
      {
        title: 'Step 5b — The 70%–110% Normal Branch',
        content: 'Flows into standard **Replenishment Planning** — the weekly indenting process.',
        type: 'step',
      },
      {
        title: 'Step 6 — Check Warehouse Stock',
        content: 'Both branches converge: does the warehouse actually have stock to send? **Yes** → Indent Planning. **No** → Escalate to Purchase Head and AGM Sales.',
        type: 'decision',
      },
      {
        title: 'Step 6a — Warehouse stock unavailable',
        content: 'Expected resolution in **t+2 days.** If not resolved → **Escalate to CEO.** Store-facing fallback: **Provide alternate or arrange stock.**',
        stickyNote: 'When a specific SKU+pot-color isn\'t available, the warehouse uses a "general code" — a catch-all code that keeps the store stocked but creates a downstream reporting blind spot.',
        type: 'alert',
      },
      {
        title: 'Step 7 — Indent Planning',
        content: 'The quantity-decision step. Plan indent based on: **Last Week Sales**, **SKU performance**, **MDQ Range (70%–110%)**.',
        type: 'step',
      },
      {
        title: 'Step 8 — Dispatch Efficiency Check',
        content: 'Before releasing a PO: is this order big enough? **Value ≥ ₹1 lac OR 90% vehicle capacity** → Release PO. Otherwise → **Hold / combine with next dispatch.**',
        type: 'decision',
      },
      {
        title: 'Step 9 — Release PO by Monday',
        content: 'Hard deadline. Matches the "Saturday rough plan, Monday final plan" cadence.',
        type: 'step',
      },
      {
        title: 'Step 10 — Hand-off: Retail O2D Process',
        content: 'The order leaves Stock planning and enters **Order-to-Delivery (O2D)** execution — dispatch, GRN, logistics.',
        type: 'handoff',
      },
      {
        title: 'Step 11–12 — Monitor & Repeat',
        content: 'Track via dashboard at store level and sales trend. Stock optimized → repeat weekly.',
        type: 'step',
      },
    ],
    sideTrack: {
      title: 'MDQ, DOC & Reviews',
      content: 'Running parallel: **Check MDQ → Check Sales Trend at DRR → Calculate DOC → Attach Store-level MDQ list → Reviewed monthly/quarterly.**',
      formulas: [
        { name: 'DRR', definition: 'Daily Run Rate — average units sold per day' },
        { name: 'DOC', definition: 'Days of Cover = SOS / DRR (Stock on Shelf ÷ Daily Run Rate)' },
      ],
    },
    keyPoints: [
      'Weekly cycle: Saturday (draft) → Monday (final PO)',
      'MDQ <70% = urgent RCA + priority replenishment',
      '70%–110% = normal replenishment band',
      'Dispatch gate: ₹1 lac value OR 90% vehicle capacity',
      'DOC = SOS ÷ DRR',
      'Known risk: HC portal downtime',
      'Known gap: general code masking SKU-level sales data',
    ],
    recap: [
      'Weekly cycle: Saturday (draft) → Monday (final PO)',
      'Core decision: stock vs. MDQ → <70% = urgent RCA; 70–110% = normal replenishment',
      'Big-order efficiency gate: ₹1 lac or 90% vehicle capacity',
      'DOC = SOS ÷ DRR',
      'Known live risk: HC portal downtime',
      'Known open gap: general code masking SKU-level sales data',
    ],
  },

  {
    id: 'staff-process',
    order: 3,
    title: 'Staff Process',
    subtitle: 'Hiring → 3 training tracks → rating/termination',
    icon: 'users',
    estimatedMinutes: 30,
    videoFile: '3.mp4',
    hasVideo: true,
    overview: 'A well-stocked, well-displayed store still fails if the person at the counter can\'t explain the product. This process governs the full lifecycle of a CCA (Customer Care Associate) — from hiring through ongoing performance rating.',
    steps: [
      {
        title: 'Step 1 — Training Methodology',
        content: 'The framework: **Training modules** (Basic Hygiene, Product Training, Sales Training), **Format** (Google Meet / in-person Floor Training), **Timeline** (Day 0/15/30/45 checkpoints).',
        type: 'info',
      },
      {
        title: 'Step 2 — Induction with HR',
        cadence: 'Every Wednesday',
        content: 'Induction happens on a **fixed weekly cadence — every Wednesday** — regardless of actual hire date.',
        type: 'step',
      },
      {
        title: 'Step 3 — Connect with Area Manager',
        content: 'New hire routed to their AM or city supervisor — this person owns their training from here on.',
        type: 'step',
      },
      {
        title: 'Track A — Basic Hygiene Training',
        content: '**Conducted by:** Supervisor/AM. **Mode:** PDF Guidelines (same for every new hire). **Covers:** Grooming, Uniform, Cleanliness Standard. Must pass "Hygiene Standard Understood?" check — if No, loop back for re-training.',
        type: 'training',
      },
      {
        title: 'Track B — Product Training',
        content: '**Conducted by:** Supervisor/AM. **Mode:** Online meet + Product Knowledge Session (plant usage, care instructions). Then **Floor Training (Practical)** by Store Supervisor, **8–10 days duration** (customer handling, product placement). Followed by **Product Knowledge Test: 30–35 questions.**',
        type: 'training',
      },
      {
        title: 'Track C — Sales Training',
        content: 'The most conceptually rich track — teaches *how to sell*, not just what to say. Three techniques: **Storytelling** (lifestyle + emotional + benefit-driven), **Upselling** (premium version), **Cross-selling** (related products). **Conducted by:** AM/AGM. **Test:** Sales Pitch Test by HR — a live 5-minute role-play.',
        type: 'training',
      },
      {
        title: 'Sales Techniques Defined',
        content: '**Storytelling:** "This is a Snake Plant — perfect for bedrooms, releases oxygen at night, needs very little care."\n**Upselling:** "This comes in a basic pot, but this ceramic self-watering planter will keep it healthy longer."\n**Cross-selling:** "Along with this plant, you can take this organic fertilizer — it helps it grow faster."',
        type: 'example',
      },
      {
        title: 'Step 5 — Performance Tracking',
        content: 'All three tracks converge. Checkpoints: **Day 0 (Joining) → Day 15 → Day 30 → Day 45.**',
        type: 'step',
      },
      {
        title: 'Step 6–7 — Rating',
        content: 'Rating parameters = **Product Knowledge Test + Sales Pitch Test.** Scoring: 7 = bare minimum pass, 8 = needs continuous improvement, **9+ = OK.**',
        type: 'step',
      },
      {
        title: 'Step 8 — Decision: Rating ≥ 7?',
        content: '**Yes** → Share feedback with HR → Employee confirmation. **No** → Re-training → 1-on-1 with AM.',
        type: 'decision',
      },
      {
        title: 'Step 9 — Re-training Loop',
        content: 'Identify gaps (Product Knowledge, Communication, Confidence, Sales Skills, Hygiene) → Create Improvement Plan → Schedule Re-training → **Decision: Satisfactory in 45 days?** **No** → **Inform HR for termination.** **Yes** → Employee confirmation.',
        stickyNote: 'The scoring mechanism itself is still being finalized by HR — currently "subjective" with a goal to make it "objective going forward."',
        type: 'alert',
      },
    ],
    keyPoints: [
      'Fixed induction day: every Wednesday',
      'Three training tracks in order: Hygiene → Product → Sales',
      'Floor training duration: 8–10 days',
      'Passing rating: ≥7 (but 9+ is the real target)',
      'Evaluation checkpoints: Day 0 / 15 / 30 / 45',
      'Improvement window before termination risk: 45 days',
      'Sales Pitch Test = live 5-minute role-play',
    ],
    recap: [
      'Fixed induction day: every Wednesday',
      'Three training tracks: Hygiene → Product → Sales',
      'Floor training: 8–10 days',
      'Passing: ≥7 (9+ is "good")',
      'Checkpoints: Day 0/15/30/45',
      '45-day window before termination risk',
    ],
  },

  {
    id: 'display-process',
    order: 4,
    title: 'Display Process',
    subtitle: 'Planogram, QC, RTV, 4 placement tiers',
    icon: 'layout',
    estimatedMinutes: 25,
    videoFile: '4.mp4',
    hasVideo: true,
    overview: 'This process ensures that what the customer sees on the shelf matches company standards — correct arrangement, no unsaleable stock left in view, correct placement tier, and a documented photo trail proving compliance.',
    steps: [
      {
        title: 'Step 1 — Planogram Check',
        content: 'A **planogram** is the VM (visual merchandising) blueprint — the exact map of what goes where. **No planogram?** → Contact NPD/Design Team → Get updated planogram → Share with store partner for approval → Implementation by AM. **Has planogram?** → Display Execution (arrange per planogram).',
        type: 'decision',
      },
      {
        title: 'Planogram Nuance',
        content: 'Planograms are **not identical across stores** — they vary by physical infrastructure (walls, shelf types) and store tier (High/Medium/Low throughput). New products (NPD) are slotted into existing categories at eye-level/focal placement until sales performance is tracked.',
        type: 'info',
      },
      {
        title: 'Step 2 — Display Setup Complete?',
        content: '**No** → Re-arrange per planogram → loop back. **Yes** → Move to visual check.',
        type: 'decision',
      },
      {
        title: 'Step 3 — Quality Check: Non-saleable plants?',
        content: 'Visual check guidelines: (1) products as per specs, (2) as per planogram at category level, (3) not too cluttered or too distanced.',
        type: 'step',
      },
      {
        title: 'Step 3a — Non-saleable plants found',
        content: 'Move to back of shelf (within 1 day) → Check by supervisor → **Is Repair Possible?** **Yes** → **Reshelf: 1. Prune → 2. Clean → 3. Shine Spray.** **No** → **Mark for RTV** (Return to Vendor).',
        type: 'alert',
      },
      {
        title: 'RTV Rules',
        content: '**RTV cap: 50 pieces or INR 15,000, whichever is higher (per trip).** If RTV not currently possible → **Move to back of shelf until RTV can be done.** Daily check SLA governs frequency.',
        type: 'key-point',
      },
      {
        title: 'Step 4 — Category Level Placement',
        content: 'Four display tiers: **Primary** (main counter), **Secondary** (VM display — at HC\'s discretion), **PDQ** (PP199 code only — impulse-buy unit), **Cash Counter** (PP99/109 entry price — not available at every outlet).',
        type: 'step',
      },
      {
        title: 'Step 5–6 — Photo Compliance Cycle',
        cadence: 'Weekly',
        content: '**CCA captures display photos → submits to Store Supervisor.** **Photos received?** **Yes** → Supervisor visit check. **No** → Follow-up by AM → Action per picture-not-received/incorrect VM.',
        type: 'step',
      },
    ],
    keyPoints: [
      'No planogram → escalate to NPD/Design, get store partner approval',
      'Reshelf = Prune → Clean → Shine Spray',
      'RTV cap: 50 pcs or ₹15,000/trip (whichever is higher)',
      'Four placement tiers: Primary, Secondary, PDQ (PP199), Cash Counter (PP99)',
      'Weekly photo compliance cycle',
      'Planograms vary by store infrastructure and throughput tier',
    ],
    recap: [
      'No planogram? → NPD/Design team → store partner approval → implement',
      'Non-saleable: repair (prune/clean/shine) or RTV (50 pcs / ₹15K cap)',
      'Four tiers: Primary, Secondary, PDQ (PP199), Cash Counter (PP99)',
      'Weekly photo cycle, AM follows up on missing photos',
    ],
  },

  {
    id: 'communication-1',
    order: 5,
    title: 'Communication Pt.1',
    subtitle: 'Brand + Category/Concept comms',
    icon: 'megaphone',
    estimatedMinutes: 20,
    videoFile: null,
    hasVideo: false,
    overview: '"Communication" here means every piece of in-store messaging the customer sees: brand signage, category concepts, product info tags, and promotional offers. This section covers Brand and Category/Concept communication.',
    steps: [
      {
        title: 'Step 1 — Communication Planning',
        content: '**Planogram available?** **No** → Check if planogram has talker/dangler guidance → Arrange from NPD/Design team. **Yes** → Supervisor conducts brief session covering: **Brand Knowledge, Concept Knowledge, Product Knowledge, Offers Knowledge.**',
        type: 'decision',
      },
      {
        title: 'Types of Communications',
        content: 'Four categories: **Brand, Category/Concept, Product, Offer.** These apply across: Table Top Plants, Floor Plants, Flowering Plants, Gifting Range, Planters, Stands, Plant Care.',
        type: 'info',
      },
      {
        title: 'Brand Communication',
        content: '**Definition:** "All brand visual and messaging elements (logo, banners, signage, offers) used in-store to inform, attract, and influence customer\'s brand recall."',
        type: 'key-point',
      },
      {
        title: 'Brand Compliance Flow',
        content: '**NG Branding visible?** **No** → Escalate to AM (7-day SLA). **Yes** → **Brand signage present?** **No** → Escalate to AM (7-day SLA). **Yes** → Check signage + LED powered on → **Visible?** **No** → Check entry visibility + clear line of sight. **Yes** → Terminate (compliant).',
        type: 'step',
      },
      {
        title: 'Escalation Ladder',
        content: 'If AM escalation fails (7-day SLA): **AM escalates to AGM** → if still unresolved → **Escalate to CEO within 15-day SLA.** Note: NG supplies signage design/dimensions — physical mounting is managed by the retail store\'s own team.',
        type: 'alert',
      },
      {
        title: 'Category/Concept Communication',
        content: 'Thematic storytelling at category level — e.g., positioning plants around an "air-purifying" concept. Category names must be simple and clear (example: "Low-Maintenance Plants").',
        type: 'info',
      },
      {
        title: 'Category Annual Target',
        content: '**Minimum 6+ concept ideas per year**, sourced from **NPD and Social media teams.** Monthly implementation check: **No** → Escalate to AM → Align with NPD/Social Team. **Yes** → Check VM placement → Photograph → Verify.',
        type: 'step',
      },
    ],
    keyPoints: [
      'Four communication types: Brand, Category/Concept, Product, Offer',
      'Brand signage SLA: AM (7 days) → AGM → CEO (15 days)',
      'NG supplies signage design; store team handles physical mounting',
      'Category/Concept: minimum 6+ ideas/year from NPD & Social teams',
      'Category names must be simple (e.g., "Low-Maintenance Plants")',
      'Session brief covers: Brand, Concept, Product, Offers knowledge',
    ],
    recap: [
      'Brand signage non-compliance: AM (7 days) → AGM → CEO (15 days)',
      'Category/Concept ideas: min 6+/year from NPD & Social teams',
      'Monthly implementation checks with photo verification',
      'All branches end in: photograph → verify → terminate or re-arrange',
    ],
  },

  {
    id: 'communication-2',
    order: 6,
    title: 'Communication Pt.2',
    subtitle: 'Product + Offer comms',
    icon: 'bell',
    estimatedMinutes: 20,
    videoFile: null,
    hasVideo: false,
    overview: 'This section covers the remaining two communication types: individual Product talkers (shelf signs) and Offer communication (discount/promotional signage). Both have specific compliance standards and verification loops.',
    steps: [
      {
        title: 'Product Communication — Talker Content',
        content: 'A product talker must display: **Product name, Category** (Indoor/Outdoor/Gifting/Premium), **Care requirements** (sunlight, water), **Price range.**',
        type: 'key-point',
      },
      {
        title: 'Product Mapping Verification',
        content: 'Check talkers placed with right category → **Communication correctly mapped to product?** (verified "via O2O, plant family level"). **Yes** → Photograph → Verify placement. **No** → Re-arrange → Supervisor check → loop back.',
        type: 'step',
      },
      {
        title: 'QR Code Enhancement',
        content: 'For some product families (e.g., Syngonium), NG has added a **QR code directly on the plant tag** linking to a YouTube explainer covering care instructions, benefits, and use-case.',
        type: 'info',
      },
      {
        title: 'Offer Communication',
        content: 'Two layers: **"core" offers running all year** on specific SKUs, plus **seasonal campaigns** like the twice-yearly **EOS (End of Season Sale).**',
        type: 'info',
      },
      {
        title: 'Offer Clarity Test',
        content: '**"Is offer easy to understand in a single read?"** **Yes** → Offer types: Discount / Bundle / Seasonal Sale / Festive Promotion. Example: "Buy 2 Get 1, Flat 20% Off — clear CTA, no confusion." **No** → **Coordinate with design team to simplify wording and redesign.**',
        type: 'decision',
      },
      {
        title: 'Offer Placement Rule',
        content: '**Near the product, with entry visibility.** Offer must be clearly mapped to product — customer knows "which product → which offer."',
        type: 'key-point',
      },
      {
        title: 'Business Impact',
        content: 'Offer-communication compliance directly affects a store team\'s individual **KPI rating.** Missing offer talkers have caused real negative impact on team performance ratings — important for both customer experience and brand performance tracking.',
        stickyNote: 'This is explicitly framed as being important for both the customer experience and the brand\'s own performance tracking.',
        type: 'alert',
      },
    ],
    keyPoints: [
      'Product talker must show: name, category, care needs, price',
      'Mapping verified via O2O at plant family level',
      'Some products have QR codes linking to YouTube explainers',
      'Offers: core (year-round) + seasonal (EOS twice yearly)',
      'Clarity test: understandable in a single read',
      'Placement: near product, with entry visibility',
      'Missing offer talkers = negative KPI impact for store teams',
    ],
    recap: [
      'Product talkers: name, category, care, price',
      'Offer clarity: single-read test, else redesign with design team',
      'Placement: near product, entry visibility, clearly mapped',
      'Nearly every branch: photograph → verify → terminate or re-arrange',
    ],
  },

  {
    id: 'big-picture',
    order: 7,
    title: 'Big Picture + Glossary',
    subtitle: 'How modules connect, glossary, open gaps',
    icon: 'map',
    estimatedMinutes: 15,
    videoFile: null,
    hasVideo: false,
    overview: 'Although the chart presents Stock, Staff, Display, and Communication as separate swim-lanes, they are deeply interdependent in practice. This section connects the dots, provides a master glossary, and flags open items still being resolved.',
    steps: [
      {
        title: 'Stock feeds Display',
        content: 'You can\'t execute a planogram correctly if the SKU isn\'t physically at the store — the Display process checks "SOH versus physical" stock during replenishment visits.',
        type: 'connection',
      },
      {
        title: 'Staff feeds Communication',
        content: 'A trained CCA is the one expected to explain the storytelling/upselling narrative that Product and Category Communication signage reinforces.',
        type: 'connection',
      },
      {
        title: 'Display feeds Communication',
        content: 'Offer and product talkers are placed at the display — a non-compliant display often means non-compliant communication too.',
        type: 'connection',
      },
      {
        title: 'Common Escalation Chain',
        content: 'All four modules report upward through the same chain: **Supervisor → AM → AGM Sales → (in serious/unresolved cases) CEO.**',
        type: 'key-point',
      },
    ],
    glossary: [
      { term: 'AM', meaning: 'Area Manager — primary process owner across all four modules' },
      { term: 'AGM (Sales)', meaning: 'Assistant General Manager, Sales — secondary owner / first escalation point' },
      { term: 'CCA', meaning: 'Customer Care Associate — front-line store staff' },
      { term: 'HC / NG', meaning: 'Home Center — the retail partner; "NG" refers to the brand itself' },
      { term: 'SOH', meaning: 'Stock On Hand' },
      { term: 'MDQ', meaning: 'Minimum Display Quantity' },
      { term: 'DRR', meaning: 'Daily Run Rate (avg. units sold/day)' },
      { term: 'DOC', meaning: 'Days of Cover = SOS ÷ DRR' },
      { term: 'PI Sheet', meaning: 'Preliminary Indent worksheet, built before the formal PO' },
      { term: 'PO', meaning: 'Purchase Order' },
      { term: 'SO', meaning: 'Sales Order (punched in ERP to trigger production)' },
      { term: 'O2D', meaning: 'Order-to-Delivery process' },
      { term: 'POD', meaning: 'Proof of Delivery (manual count/discrepancy log at receiving)' },
      { term: 'GRN', meaning: 'Goods Receipt Note (created by HC team; owned by Operations)' },
      { term: 'RTV', meaning: 'Return to Vendor/Warehouse' },
      { term: 'VM', meaning: 'Visual Merchandising' },
      { term: 'Planogram', meaning: 'Store-specific visual map of what product goes where' },
      { term: 'PDQ', meaning: 'Small dedicated impulse-purchase display unit/box' },
      { term: 'NPD', meaning: 'New Product Development team' },
      { term: 'EOS', meaning: 'End of Season Sale (twice-yearly offer campaign)' },
      { term: 'Talker / Dangler', meaning: 'Small shelf sign (talker) or hanging sign (dangler)' },
      { term: 'General Code', meaning: 'Catch-all SKU code when exact pot/color variant unavailable — creates sales-tracking blind spot' },
    ],
    openItems: [
      { title: 'General code tracking gap', description: 'No standardized way yet to trace sales back to exact SKU/pot variant when substituted under a general code.' },
      { title: 'Objective staff testing mechanism', description: 'HR is still building a standardized, time-boxed monthly testing process to replace the current, more subjective supervisor-led evaluation.' },
      { title: 'GRN ownership confirmation', description: 'To be verified directly with the Operations team, since it\'s a shared stakeholder process.' },
    ],
    keyPoints: [
      'Stock → Display: can\'t execute planogram without physical stock',
      'Staff → Communication: trained CCA delivers the storytelling narrative',
      'Display → Communication: talkers are placed at the display',
      'All modules: Supervisor → AM → AGM Sales → CEO',
      '3 open items: general code gap, objective testing, GRN ownership',
    ],
    recap: [
      'The four modules are deeply interdependent, not siloed',
      'Common escalation chain across all modules',
      'Master glossary: 22 key terms to memorize',
      '3 open items flagged during process review',
    ],
  },
];

/** Get a section by ID */
export function getSection(id) {
  return SECTIONS.find(s => s.id === id) || null;
}

/** Get next/previous section */
export function getAdjacentSections(id) {
  const idx = SECTIONS.findIndex(s => s.id === id);
  return {
    prev: idx > 0 ? SECTIONS[idx - 1] : null,
    next: idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null,
  };
}
