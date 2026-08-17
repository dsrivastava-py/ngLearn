# Video 2 — The Stock Process

## MODULE 1 — THE STOCK PROCESS

### 1.1 Why this process exists
Before a single plant reaches a shelf, someone has to decide *how much* of it to send to *which* store. That's what the Stock process governs — it is the weekly rhythm of pulling sales data, comparing it to targets, and placing replenishment orders.

### 1.2 Step-by-step walkthrough (left to right)

**Step 1 — Weekly Stock Review** *(cadence: Every Saturday)*
The cycle kicks off with a scheduled weekly review. As the meeting transcript explains, "Saturday we make the rough plan and Monday we make the final plan" — so Saturday is drafting day, Monday is confirmation day.

**Step 2 — Fetch data from HC portal**
The team logs into the retail partner's (Home Center's) portal to pull raw numbers.
> 🟡 **Sticky note attached here:** *"Add URL + screenshots — HC portal not working."* This is a live operational risk flagged in the diagram itself: the partner portal has had migration issues before, and when it's down, the team has no direct access and becomes **dependent on the partner sending data manually** (confirmed in the transcript: *"because of their migration thing... currently we don't have the portal access... every Monday it's like we will get the SOH on the sales report"*).

**Step 3 — Download stock report & last week sales**
Two data points are extracted together: **SOH (Stock On Hand)** and the **previous week's sales**.

**Step 4 — Download store-level data**
The same figures, broken down **per individual store** (not just company-wide), because replenishment decisions are made store-by-store, not in bulk.

**Step 5 — Decision Diamond: "Stock available as per MDQ at store level?"**
This is the first major fork in the process. **MDQ = Minimum Display Quantity** — the ideal stock level a store should be holding for a given SKU. The system checks current stock against MDQ and classifies the result into one of two output paths:

- **`<70%` of MDQ** → the store is critically under-stocked. This is treated as an *exception*, not routine replenishment.
- **`70%–110%` of MDQ** → this is the "normal" band, and it feeds into ordinary Replenishment Planning.

*(Note: nothing above 110% is called out separately on the chart — anything comfortably at or above 110% simply doesn't need a replenishment action that week.)*

**Step 5a — The `<70%` (Red Flag) branch**
When a store falls below 70% availability, four things happen together, captured in one yellow note:
- **Highlight in dashboard** — it gets flagged visually for management attention
- **Compare with last week's sales** — is the shortage due to unexpectedly high sell-through, or a supply failure?
- **Do RCA (Root Cause Analysis)** — figure out *why* it dropped below threshold
- **Share RCA with AGM Sales** — the finding gets escalated upward, not just logged

This feeds into **"Plan priority replenishment, before cycle commencement"** — meaning stores below 70% jump the queue and get restocked *before* the normal weekly cycle even starts.

**Step 5b — The `70%–110%` (Normal) branch**
This simply flows into **Replenishment Planning** — the standard weekly indenting process, explained next.

**Step 6 — Check Warehouse (WH) Stock Availability**
Regardless of which branch you came from, both paths converge into one shared checkpoint: *does the warehouse actually have the stock to send?*

- **Yes** → proceed to **Indent Planning**
- **No** → **Escalate to Purchase Head and AGM Sales**

**Step 6a — If warehouse stock is unavailable**
- Issue is expected to be **Resolved in t+2 days** (i.e., within 2 days)
- If not resolved → **Escalate to CEO**
- Store-facing fallback: **Provide alternate or arrange stock** (so the shelf isn't left empty while the supply issue is sorted)

> 💡 **Real-world nuance (from the meeting, not shown on the chart):** when a specific SKU + pot-color combination isn't available, the warehouse team substitutes it using a **"general code"** — a catch-all code for that plant category, regardless of exact pot color. This keeps the store stocked, but it creates a downstream reporting blind spot: sales booked under a general code can't be traced back to which exact pot color sold. As one speaker put it, *"you will see the PP99 K sale in general code but you will not [know] which plant it was or which pot it was."* This is flagged in the meeting as an **unresolved process gap** with no current standard fix — worth remembering as a fresher, because you may be asked to help formalize it.

**Step 7 — Indent Planning**
> 🟡 **Sticky note — "Plan Indent Based on":**
> - Last Week Sales
> - SKU performance
> - MDQ Range (70%–110%)

This is the actual quantity-decision step — how much of each SKU to formally request.

**Step 8 — Decision: "Value >= 1 lac or 90% vehicle capacity?"**
This is a **dispatch efficiency check.** Before releasing a purchase order, the system asks: is this order big enough (either ₹1,00,000+ in value, or filling 90%+ of a delivery vehicle) to justify its own trip?

- **Yes** → **Update in retail logistics plan** → **Store level update** → **Release PO by Monday**
- **No** → **Hold / combine with next dispatch** (small orders get batched together rather than sent half-empty, saving logistics cost)

**Step 9 — Release PO by Monday**
This is a hard deadline built into the process — matches the transcript's *"Saturday rough plan, Monday final plan."*

**Step 10 — Hand-off: "Retail O2D Process"**
This orange box is a **deliberate hand-off point** — the order now leaves the Stock-planning process and enters **Order-to-Delivery (O2D)** execution, which is a separate, larger process (dispatch, GRN, logistics — discussed below in section 1.4).

**Step 11 — Monitor & control stock levels**
> 🟡 **Sticky note — "Track via dashboard":** store level, sales trend

**Step 12 — Stock optimized and upgraded → Repeat Weekly**
The loop closes here — and starts again next Saturday.

### 1.3 The side-track: MDQ, DOC & Reviews
Running parallel underneath the main flow is a smaller but essential calculation chain:

**Check MDQ → Check Sales Trend at DRR → Calculate DOC → Attach Store-level MDQ list → Reviewed monthly/quarterly**

Two terms you must know cold:
- **DRR = Daily Run Rate** (average units sold per day)
- **DOC = Days of Cover**, calculated with the formula shown directly on the chart:

> 🟡 **Formula:** `DOC = SOS / DRR`
> (Stock on Shelf ÷ Daily Run Rate = how many days the current stock will last at the current sales pace)

This DOC calculation and the resulting **store-level MDQ list** is what gets reviewed on a monthly/quarterly cadence — a slower, more strategic check layered on top of the fast weekly replenishment cycle.

### 1.4 What happens after the PO — the parts *outside* this specific diagram
The meeting clarifies steps that exist in real life but sit just past the edge of this chart (and are explicitly logged as "to be confirmed with the Operations team" rather than owned by Retail Ops):
1. **PI Sheet creation** — a preliminary indent worksheet built by referring to SOH, display pictures, and staff-flagged requirements, *before* the formal PO
2. **SO (Sales Order) punched in ERP** — triggers the backend production team
3. **Dispatch planning** — coordinated with the backend/logistics team
4. **Physical receiving at store** — staff manually counts incoming stock; discrepancies are logged in a **POD (Proof of Delivery)** entry
5. **GRN (Goods Receipt Note)** — created by the Home Center's own team once stock is received; the meeting is explicit that *"this is something that falls primarily on the operations team"* even though Retail Ops has partial stake in it, and it will be verified in a separate discussion with Operations.

### ✅ Module 1 Quick Recap
- Weekly cycle: **Saturday (draft) → Monday (final PO)**
- Core decision: **stock vs. MDQ** → `<70%` = urgent RCA + priority replenishment; `70–110%` = normal replenishment
- Big-order efficiency gate: **₹1 lac or 90% vehicle capacity**
- **DOC = SOS ÷ DRR**
- Known live risk: **HC portal downtime**
- Known open gap: **general code masking SKU-level sales data**

### 🧠 Checkpoint Quiz — Module 1
1. If a store's stock is at 55% of MDQ, which two actions happen *in addition to* replenishment planning?
2. What two conditions can independently trigger a PO to be released rather than held?
3. What does DOC stand for, and what's the formula?
4. Who does an unresolved warehouse-stock shortage escalate to, and in what timeframe?

---

