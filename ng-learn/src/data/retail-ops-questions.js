/*
 * Retail Ops Questionnaire — 70 MCQs
 * 10 questions per section, parsed from Retail-Ops-Questionnaire.md
 * correctIndex is 0-based (A=0, B=1, C=2, D=3)
 */

export const SECTION_IDS = [
  'orientation',
  'stock-process',
  'staff-process',
  'display-process',
  'communication-1',
  'communication-2',
  'big-picture',
];

export const questionPool = [
  // ── Section 1: Orientation (Q1–Q10) ──
  { id: 'q1', sectionId: 'orientation', prompt: 'What are the four core processes that make up Retail Ops?', options: ['Indent, Dispatch, GRN, RTV', 'Planning, Execution, Review, Escalation', 'Stock, Staff, Display, Communication', 'Sales, Marketing, Finance, HR'], correctIndex: 2 },
  { id: 'q2', sectionId: 'orientation', prompt: 'In the process map, who carries "Primary Responsibility" across all four modules?', options: ['AM (Area Manager)', 'Store Supervisor', 'CEO', 'HR'], correctIndex: 0 },
  { id: 'q3', sectionId: 'orientation', prompt: 'Who is the "Secondary Responsibility" owner across all four modules?', options: ['NPD Team', 'AGM Sales', 'Purchase Head', 'CCA'], correctIndex: 1 },
  { id: 'q4', sectionId: 'orientation', prompt: 'What does a green arrow represent on the process diagram?', options: ['A hand-off to another process', 'A definition or formula', 'A cadence/timing rule', 'The "Yes" / positive path'], correctIndex: 3 },
  { id: 'q5', sectionId: 'orientation', prompt: 'What does a red arrow represent on the process diagram?', options: ['A decision point', 'An escalation to CEO only', 'The "No" / problem path', 'A completed process'], correctIndex: 2 },
  { id: 'q6', sectionId: 'orientation', prompt: 'What do the yellow sticky notes on the chart represent?', options: ['Names of responsible employees', 'Definitions, formulas, or extra rules attached to a nearby box', 'Customer feedback', 'Deadlines only'], correctIndex: 1 },
  { id: 'q7', sectionId: 'orientation', prompt: 'What does an orange/red box (like "Retail O2D Process") signify?', options: ['A quality check failure', 'A cancelled step', 'An error in the process', 'A hand-off to another, separate process'], correctIndex: 3 },
  { id: 'q8', sectionId: 'orientation', prompt: 'In what order does the coursework walk through the four modules?', options: ['Display → Communication → Stock → Staff', 'Stock → Staff → Display → Communication', 'Staff → Stock → Communication → Display', 'Communication → Display → Staff → Stock'], correctIndex: 1 },
  { id: 'q9', sectionId: 'orientation', prompt: 'What do diamonds represent in the process diagram?', options: ['An action step', 'A hand-off', 'A cadence rule', 'A decision point'], correctIndex: 3 },
  { id: 'q10', sectionId: 'orientation', prompt: 'Which term refers to the retail partner (Home Center) in this coursework?', options: ['DRR', 'HC', 'NPD', 'VM'], correctIndex: 1 },

  // ── Section 2: Stock Process (Q11–Q20) ──
  { id: 'q11', sectionId: 'stock-process', prompt: 'What is the weekly stock review cadence?', options: ['Every Friday', 'Every Wednesday', 'Every Saturday', 'Every Monday'], correctIndex: 2 },
  { id: 'q12', sectionId: 'stock-process', prompt: 'What does MDQ stand for?', options: ['Minimum Display Quantity', 'Minimum Dispatch Quota', 'Monthly Demand Quota', 'Maximum Delivery Quantity'], correctIndex: 0 },
  { id: 'q13', sectionId: 'stock-process', prompt: 'Below what percentage of MDQ does a store trigger the "priority replenishment" red-flag path?', options: ['Below 70%', 'Below 60%', 'Below 50%', 'Below 80%'], correctIndex: 0 },
  { id: 'q14', sectionId: 'stock-process', prompt: 'What are the four actions taken together when a store falls below the MDQ threshold?', options: ['Contact NPD, update planogram, notify store partner', 'Highlight in dashboard, compare with last week\'s sales, do RCA, share RCA with AGM Sales', 'Reshelf, RTV, prune, clean', 'Escalate to CEO, hold PO, cancel indent, notify HR'], correctIndex: 1 },
  { id: 'q15', sectionId: 'stock-process', prompt: 'What is the "normal" MDQ band that feeds into standard Replenishment Planning?', options: ['50%–70%', '80%–100%', '70%–110%', '90%–120%'], correctIndex: 2 },
  { id: 'q16', sectionId: 'stock-process', prompt: 'What happens if warehouse stock is unavailable for an indent?', options: ['It escalates to Purchase Head and AGM Sales, expected resolution in t+2 days', 'The order is cancelled permanently', 'The store is closed temporarily', 'It\'s automatically written off'], correctIndex: 0 },
  { id: 'q17', sectionId: 'stock-process', prompt: 'What two conditions can trigger a PO to be released instead of held for combination with the next dispatch?', options: ['Store rating >= 8 OR CEO approval', 'Value >= 1 lac OR 90% vehicle capacity', 'MDQ >= 110% OR DOC >= 30 days', 'Value >= 5 lacs OR 100% vehicle capacity'], correctIndex: 1 },
  { id: 'q18', sectionId: 'stock-process', prompt: 'What is the formula for DOC (Days of Cover)?', options: ['DOC = MDQ / SOS', 'DOC = SOS / DRR', 'DOC = DRR / SOS', 'DOC = SOS x DRR'], correctIndex: 1 },
  { id: 'q19', sectionId: 'stock-process', prompt: 'What does DRR stand for?', options: ['Daily Run Rate', 'Documented Replenishment Report', 'Dispatch Response Rate', 'Daily Return Rate'], correctIndex: 0 },
  { id: 'q20', sectionId: 'stock-process', prompt: 'By what day must the Purchase Order be released each week?', options: ['Sunday', 'Tuesday', 'Wednesday', 'Monday'], correctIndex: 3 },

  // ── Section 3: Staff Process (Q21–Q30) ──
  { id: 'q21', sectionId: 'staff-process', prompt: 'On what day does HR induction happen, per the fixed weekly cadence?', options: ['Monday', 'Friday', 'Wednesday', 'Tuesday'], correctIndex: 2 },
  { id: 'q22', sectionId: 'staff-process', prompt: 'What are the three training tracks, in order?', options: ['Sales, Product, Hygiene', 'Basic Hygiene, Product Training, Sales Training', 'Grooming, Selling, Testing', 'Induction, Floor Training, Testing'], correctIndex: 1 },
  { id: 'q23', sectionId: 'staff-process', prompt: 'What mode is used to deliver Basic Hygiene Training?', options: ['Video lecture', 'PDF Guidelines', 'Live webinar', 'In-person only'], correctIndex: 1 },
  { id: 'q24', sectionId: 'staff-process', prompt: 'What is the duration of Floor Training (Practical) under the Product Training track?', options: ['15–20 days', '8–10 days', '3–5 days', '5–7 days'], correctIndex: 1 },
  { id: 'q25', sectionId: 'staff-process', prompt: 'How many questions does the Product Knowledge Test contain?', options: ['40–45', '10–15', '20–25', '30–35'], correctIndex: 3 },
  { id: 'q26', sectionId: 'staff-process', prompt: 'Which of these is an example of "upselling," per the coursework\'s own definition?', options: ['Explaining a plant\'s emotional/lifestyle benefits', 'Recommending a ceramic self-watering planter instead of a basic pot', 'Suggesting fertilizer along with a plant', 'Offering a discount coupon'], correctIndex: 1 },
  { id: 'q27', sectionId: 'staff-process', prompt: 'Who conducts the Sales Training track?', options: ['AM / AGM', 'NPD Team', 'Store Supervisor only', 'HR only'], correctIndex: 0 },
  { id: 'q28', sectionId: 'staff-process', prompt: 'What is the minimum passing rating required after testing?', options: ['6', '7', '5', '8'], correctIndex: 1 },
  { id: 'q29', sectionId: 'staff-process', prompt: 'What happens if an employee is not rated satisfactorily within 45 days of re-training?', options: ['Inform HR for termination', 'Mandatory transfer to another store', 'Automatic promotion', 'Salary is withheld'], correctIndex: 0 },
  { id: 'q30', sectionId: 'staff-process', prompt: 'What are the four fixed evaluation checkpoint days?', options: ['Day 0, 10, 20, 30', 'Day 7, 14, 21, 28', 'Day 1, 30, 60, 90', 'Day 0, 15, 30, 45'], correctIndex: 3 },

  // ── Section 4: Display Process (Q31–Q40) ──
  { id: 'q31', sectionId: 'display-process', prompt: 'What is a "planogram"?', options: ['A customer feedback form', 'A staff training schedule', 'The store-specific visual map of what product goes where', 'A pricing document'], correctIndex: 2 },
  { id: 'q32', sectionId: 'display-process', prompt: 'If a planogram is not available for a store, who is contacted first?', options: ['AGM Sales', 'NPD / Design Team', 'HR', 'CEO'], correctIndex: 1 },
  { id: 'q33', sectionId: 'display-process', prompt: 'What is the RTV (Return to Vendor) cap per trip?', options: ['30 pieces or INR 10,000, whichever is lower', '100 pieces or INR 20,000, whichever is lower', '20 pieces or INR 5,000, whichever is higher', '50 pieces or INR 15,000, whichever is higher'], correctIndex: 3 },
  { id: 'q34', sectionId: 'display-process', prompt: 'What are the three steps of "Reshelf" when a plant is repairable?', options: ['Trim, Water, Relabel', 'Prune, Clean, Shine Spray', 'Wash, Dry, Pack', 'Inspect, Repot, Display'], correctIndex: 1 },
  { id: 'q35', sectionId: 'display-process', prompt: 'Which display tier is reserved strictly for PP199-coded products?', options: ['Secondary', 'Cash Counter', 'Primary', 'PDQ'], correctIndex: 3 },
  { id: 'q36', sectionId: 'display-process', prompt: 'Which display tier is granted at the Home Center\'s own discretion, not guaranteed to NG?', options: ['PDQ', 'Cash Counter', 'Secondary (VM display)', 'Primary'], correctIndex: 2 },
  { id: 'q37', sectionId: 'display-process', prompt: 'What is the cadence for capturing display photos?', options: ['Monthly', 'Daily', 'Quarterly', 'Weekly'], correctIndex: 3 },
  { id: 'q38', sectionId: 'display-process', prompt: 'Who submits the display photo to whom, per the sticky note on the chart?', options: ['AM to CEO', 'NPD to AGM', 'HR to AM', 'CCA to Store Supervisor'], correctIndex: 3 },
  { id: 'q39', sectionId: 'display-process', prompt: 'What happens if display photos are not received in a given week?', options: ['Nothing — it\'s optional', 'The store is automatically fined', 'Follow-up by AM, then action per picture-not-received/incorrect VM', 'The store is delisted'], correctIndex: 2 },
  { id: 'q40', sectionId: 'display-process', prompt: 'If a non-saleable plant cannot be repaired and RTV is not currently possible, what happens to it?', options: ['It\'s moved to back of shelf until RTV can be done', 'It\'s marked down for clearance sale', 'It\'s returned to the customer', 'It\'s discarded immediately'], correctIndex: 0 },

  // ── Section 5: Communication Part 1 (Q41–Q50) ──
  { id: 'q41', sectionId: 'communication-1', prompt: 'What four things does the Communication "Session Brief" cover?', options: ['Brand Knowledge, Concept Knowledge, Product Knowledge, Offers Knowledge', 'Hygiene, Grooming, Uniform, Cleanliness', 'Sales targets, Pricing, Discounts, Logistics', 'MDQ, DOC, DRR, SOS'], correctIndex: 0 },
  { id: 'q42', sectionId: 'communication-1', prompt: 'Per the chart\'s own definition, what does Brand Communication cover?', options: ['Staff training materials', 'Only pricing communication', 'Only social media posts', 'All brand visual and messaging elements (logo, banners, signage, offers) used in-store'], correctIndex: 3 },
  { id: 'q43', sectionId: 'communication-1', prompt: 'What is the resolution SLA when brand signage issues are first escalated to the AM?', options: ['7 days', '5 days', '10 days', '3 days'], correctIndex: 0 },
  { id: 'q44', sectionId: 'communication-1', prompt: 'If the AM\'s escalation isn\'t resolved in time, what\'s the next step in the ladder?', options: ['AM escalates to AGM, then to CEO within a 15-day SLA', 'Directly to CEO', 'No further escalation exists', 'Store is shut down'], correctIndex: 0 },
  { id: 'q45', sectionId: 'communication-1', prompt: 'Who is responsible for physically mounting/activating brand signage at the store, per the coursework?', options: ['NPD Team', 'NG\'s own installation team', 'The retail store\'s own team (Activation with Store Supervisor)', 'The CCA alone'], correctIndex: 2 },
  { id: 'q46', sectionId: 'communication-1', prompt: 'What is the minimum number of Category/Concept communication ideas required annually?', options: ['10+', '3+', '6+', '4+'], correctIndex: 2 },
  { id: 'q47', sectionId: 'communication-1', prompt: 'Who supplies the Category/Concept communication ideas?', options: ['NPD and Social media teams', 'CEO and AGM', 'Store Supervisors only', 'HR and Finance'], correctIndex: 0 },
  { id: 'q48', sectionId: 'communication-1', prompt: 'What\'s an example of a good Category Name given in the coursework?', options: ['Category A', 'Premium Tier 1', 'SKU 4471', 'Low-Maintenance Plants'], correctIndex: 3 },
  { id: 'q49', sectionId: 'communication-1', prompt: 'If "Check monthly implementation" for Category/Concept communication comes back "No," what\'s the next step?', options: ['Escalate to AM, then align with NPD/Social Team', 'Terminate process', 'Immediately mark for RTV', 'Skip to Offer Communication'], correctIndex: 0 },
  { id: 'q50', sectionId: 'communication-1', prompt: 'In the Brand Communication compliance loop, what happens if the signage is checked and found fully visible with correct entry visibility and clear line of sight?', options: ['Re-train the CCA', 'Mark for RTV', 'Terminate process (compliant, nothing further needed)', 'Escalate to CEO'], correctIndex: 2 },

  // ── Section 6: Communication Part 2 (Q51–Q60) ──
  { id: 'q51', sectionId: 'communication-2', prompt: 'What four pieces of information must a product talker display?', options: ['Product name, Category, Care requirements, Price range', 'Discount %, CTA, Validity, Terms', 'Supervisor name, Date, Store code, Signature', 'SKU code, Warehouse location, Batch number, Expiry'], correctIndex: 0 },
  { id: 'q52', sectionId: 'communication-2', prompt: 'How is correct product-to-communication mapping verified, per the chart?', options: ['Via CEO sign-off', 'Via O2O, plant family level', 'Via customer survey', 'Via annual audit only'], correctIndex: 1 },
  { id: 'q53', sectionId: 'communication-2', prompt: 'If a product talker is found NOT correctly mapped to its product, what\'s the immediate next step?', options: ['Terminate process', 'Re-arrange, then Check by Supervisor', 'Mark for RTV', 'Escalate straight to CEO'], correctIndex: 1 },
  { id: 'q54', sectionId: 'communication-2', prompt: 'According to the coursework, what enhancement has been added to some product families (e.g., Syngonium) beyond standard talkers?', options: ['A holographic display', 'An in-store audio announcement', 'A QR code linking to a YouTube explainer video', 'A printed catalogue'], correctIndex: 2 },
  { id: 'q55', sectionId: 'communication-2', prompt: 'What are the four possible offer types listed on the chart?', options: ['Discount, Bundle, Seasonal Sale, Festive Promotion', 'Cashback, Loyalty Points, Referral, Gift Card', 'Coupon, Voucher, Rebate, Trade-in', 'BOGO, Clearance, Flash Sale, Membership'], correctIndex: 0 },
  { id: 'q56', sectionId: 'communication-2', prompt: 'What\'s the clarity test an offer must pass?', options: ['It must be approved by three managers', 'It must be understandable in a single read', 'It must include a QR code', 'It must be printed in three languages'], correctIndex: 1 },
  { id: 'q57', sectionId: 'communication-2', prompt: 'If an offer is NOT easy to understand in a single read, what happens?', options: ['It\'s immediately terminated', 'It\'s escalated to CEO directly', 'The product is pulled from shelves', 'Coordinate with design team to simplify wording and redesign'], correctIndex: 3 },
  { id: 'q58', sectionId: 'communication-2', prompt: 'Where should offer communication be physically placed, per the chart\'s rule?', options: ['Only at the cash counter', 'Anywhere convenient', 'Near the product, with entry visibility', 'Only at the store entrance'], correctIndex: 2 },
  { id: 'q59', sectionId: 'communication-2', prompt: 'What does "Is Product offer Linkage correct?" actually verify?', options: ['That the offer matches a competitor\'s price', 'That the offer is clearly mapped to the product, so the customer knows which product → which offer', 'That the offer has expired', 'That the offer is profitable'], correctIndex: 1 },
  { id: 'q60', sectionId: 'communication-2', prompt: 'Per the meeting context, what real business impact can missing offer talkers have?', options: ['It can negatively affect a store team\'s individual KPI rating', 'None — it\'s purely cosmetic', 'It only affects the Communication team\'s KPIs, not the store\'s', 'It automatically triggers a stock recall'], correctIndex: 0 },

  // ── Section 7: Big Picture & Glossary (Q61–Q70) ──
  { id: 'q61', sectionId: 'big-picture', prompt: 'How does Stock feed into Display, per the "Big Picture" section?', options: ['Stock only affects Staff, not Display', 'Display determines stock levels, not the other way around', 'You can\'t execute a planogram correctly if the SKU isn\'t physically at the store', 'They are entirely unrelated'], correctIndex: 2 },
  { id: 'q62', sectionId: 'big-picture', prompt: 'Through what common escalation chain do all four modules eventually report upward?', options: ['Supervisor → AM → AGM Sales → (if unresolved) CEO', 'Store Partner → Warehouse → CEO', 'CCA → NPD → Design → CEO', 'HR → Finance → CEO'], correctIndex: 0 },
  { id: 'q63', sectionId: 'big-picture', prompt: 'What does "GRN" stand for?', options: ['Global Retail Network', 'Goods Receipt Note', 'General Reporting Note', 'Guaranteed Return Notice'], correctIndex: 1 },
  { id: 'q64', sectionId: 'big-picture', prompt: 'What does "POD" stand for in the context of receiving stock at a store?', options: ['Point of Delivery', 'Product Order Data', 'Proof of Delivery', 'Purchase Order Document'], correctIndex: 2 },
  { id: 'q65', sectionId: 'big-picture', prompt: 'What is a "PI Sheet"?', options: ['A Preliminary Indent worksheet, built before the formal PO', 'A performance improvement sheet for staff', 'A product inspection sheet for QC', 'A pricing information sheet for customers'], correctIndex: 0 },
  { id: 'q66', sectionId: 'big-picture', prompt: 'What is flagged as an unresolved gap regarding "general code" usage?', options: ['It has been fully resolved already', 'It only works for certain warehouses', 'It\'s too expensive to implement', 'It creates a sales-tracking blind spot — sales can\'t be traced back to the exact SKU/pot variant'], correctIndex: 3 },
  { id: 'q67', sectionId: 'big-picture', prompt: 'What open item exists around staff testing, per the coursework\'s "Open Items" section?', options: ['All testing is now fully automated with no human input', 'Testing frequency has been reduced to once a year', 'Testing has been completely eliminated', 'HR is still building a standardized, objective monthly testing process to replace subjective supervisor-led evaluation'], correctIndex: 3 },
  { id: 'q68', sectionId: 'big-picture', prompt: 'Which process\'s ownership still needs confirmation with the Operations team?', options: ['GRN process ownership', 'Communication Team\'s role', 'Sales Training Team\'s role', 'NPD Team\'s role'], correctIndex: 0 },
  { id: 'q69', sectionId: 'big-picture', prompt: 'What does "EOS" stand for in the Offer Communication context?', options: ['End of Sale', 'End of Season Sale', 'Exclusive Online Sale', 'Extended Offer Scheme'], correctIndex: 1 },
  { id: 'q70', sectionId: 'big-picture', prompt: 'What does "VM" stand for throughout the coursework?', options: ['Value Metrics', 'Vendor Management', 'Volume Monitoring', 'Visual Merchandising'], correctIndex: 3 },
];

/** Get questions for a specific section */
export function getQuestionsForSection(sectionId) {
  return questionPool.filter(q => q.sectionId === sectionId);
}
