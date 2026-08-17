import fs from 'fs';
import path from 'path';

const outDir = 'public/resources';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Retail MDQ & Indent Calculation Matrix
const mdqHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nurturing Green - Retail MDQ & Indent Matrix SOP</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #11211F; line-height: 1.6; }
    .header { border-bottom: 2px solid #007A87; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 20px; font-weight: 800; color: #007A87; }
    .doc-id { font-size: 12px; color: #666; font-family: monospace; }
    h1 { color: #004D55; margin: 0 0 8px; font-size: 24px; }
    h2 { color: #007A87; margin-top: 24px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; }
    th { background: #f0f7f6; color: #004D55; font-weight: 700; }
    .formula-box { background: #E6F5F4; border-left: 4px solid #007A87; padding: 14px 18px; margin: 16px 0; border-radius: 4px; font-family: monospace; font-size: 15px; }
    .badge { display: inline-block; background: #007A87; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 12px; color: #777; text-align: center; }
    @media print { body { margin: 20px; } button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nurturing Green &middot; NG Learn</div>
    <div class="doc-id">DOC-SOP-RET-01 &middot; Rev 2.4</div>
  </div>

  <h1>Retail MDQ &amp; Indent Matrix SOP</h1>
  <p>Standard Operating Procedure for store replenishment calculation, safety stock parameters, and dispatch thresholds across retail outlets.</p>

  <h2>1. Primary Replenishment Formula</h2>
  <div class="formula-box">
    <strong>Indent Quantity</strong> = [Target Stock (Safety Stock + Cycle Stock)] - [Current Stock on Hand (SOH)] - [Stock in Transit]
  </div>
  <p><em>Note: If Indent Quantity is greater than 0 but less than MDQ, round up to the nearest integer multiple of MDQ.</em></p>

  <h2>2. Category Minimum Dispatch Quantity (MDQ) Table</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Product Type</th>
        <th>MDQ Unit</th>
        <th>Review Cadence</th>
        <th>Shelf Life SLA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Live Plants (A-Tier)</strong></td>
        <td>Bonsai, Sansevieria, Money Plant</td>
        <td>6 Units / SKU</td>
        <td>Twice Weekly (Mon &amp; Thu)</td>
        <td>60 Days in Store</td>
      </tr>
      <tr>
        <td><strong>Live Plants (B-Tier)</strong></td>
        <td>Flowering Plants, Ferns, Succulents</td>
        <td>12 Units / SKU</td>
        <td>Twice Weekly</td>
        <td>30 Days in Store</td>
      </tr>
      <tr>
        <td><strong>Planters &amp; Ceramic</strong></td>
        <td>Designer Ceramic Pots, Self-Watering</td>
        <td>4 Units / Box</td>
        <td>Weekly (Tuesday)</td>
        <td>Indefinite (QC Check)</td>
      </tr>
      <tr>
        <td><strong>Care &amp; Nutrition</strong></td>
        <td>Organic Fertilizer, Plant Food, Misters</td>
        <td>10 Units / Carton</td>
        <td>Bi-Weekly</td>
        <td>18 Months</td>
      </tr>
    </tbody>
  </table>

  <h2>3. Indent Submission &amp; Gatepass Verification Timeline</h2>
  <ul>
    <li><strong>Cut-off Time:</strong> Indents must be logged into the ERP before 14:00 hrs on scheduled review days.</li>
    <li><strong>Approval Authority:</strong> Store Manager &rarr; Area Retail Manager approval within 4 hours.</li>
    <li><strong>Discrepancy Buffer:</strong> &plusmn;3% variance allowed for live plant pot sizes during warehouse picking.</li>
  </ul>

  <div class="footer">
    Nurturing Green Operations Manual &copy; Internal Training Documentation &middot; NG Learn
  </div>
</body>
</html>`;

// 2. Planogram Compliance & RTV Guide
const planogramHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nurturing Green - Planogram Compliance & RTV Guide</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #11211F; line-height: 1.6; }
    .header { border-bottom: 2px solid #007A87; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 20px; font-weight: 800; color: #007A87; }
    .doc-id { font-size: 12px; color: #666; font-family: monospace; }
    h1 { color: #004D55; margin: 0 0 8px; font-size: 24px; }
    h2 { color: #007A87; margin-top: 24px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; }
    th { background: #f0f7f6; color: #004D55; font-weight: 700; }
    .rule-card { background: #F8FAF9; border: 1px solid #007A87; padding: 14px 18px; margin: 12px 0; border-radius: 6px; }
    .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 12px; color: #777; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nurturing Green &middot; NG Learn</div>
    <div class="doc-id">DOC-SOP-VM-03 &middot; Rev 1.9</div>
  </div>

  <h1>Planogram Compliance &amp; RTV Guide</h1>
  <p>Standard Operating Procedure for retail visual merchandising, eye-level shelf hierarchy, defective stock triage, and Return to Vendor (RTV) protocols.</p>

  <h2>1. 4-Tier Planogram Visual Display Standards</h2>
  <div class="rule-card">
    <strong>Tier 1 — Eye-Level Hero Plants (Height: 120cm - 150cm):</strong> Premium Bonsais, Exotic Pachira, Ficus Microcarpa. Facing forward with branded ceramic planters.
  </div>
  <div class="rule-card">
    <strong>Tier 2 — Table-Top &amp; Workdesk Range (Height: 80cm - 110cm):</strong> Air-Purifying collection (Snake Plant, ZZ, Syngonium). Grouped in sets of 3 with clear benefit badges.
  </div>
  <div class="rule-card">
    <strong>Tier 3 — Decorative Planters &amp; Ceramic Stack (Height: 40cm - 70cm):</strong> Matte finish pots arranged by color gradient (Terracotta, Emerald, Ivory, Charcoal).
  </div>
  <div class="rule-card">
    <strong>Tier 4 — Floor Base &amp; Large Foliage:</strong> Areca Palm, Monstera Deliciosa, Rubber Plant in heavy planters.
  </div>

  <h2>2. Return to Vendor (RTV) &amp; Discard Protocol</h2>
  <table>
    <thead>
      <tr>
        <th>Defect Classification</th>
        <th>Visual Criteria</th>
        <th>Action Required</th>
        <th>Max SLA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Dead on Arrival (DOA)</strong></td>
        <td>Stem snapped during transit, cracked pot</td>
        <td>Immediate gatepass photo upload to ERP</td>
        <td>Within 2 Hours of Inward</td>
      </tr>
      <tr>
        <td><strong>Foliage Yellowing / Chlorosis</strong></td>
        <td>&gt;30% yellow leaves, severe overwatering</td>
        <td>Transfer to recovery bay; tag for markdown/RTV</td>
        <td>Daily 09:30 Audit</td>
      </tr>
      <tr>
        <td><strong>Packaging / Barcode Missing</strong></td>
        <td>Torn care-tag or missing EAN code</td>
        <td>Store-level barcode reprint</td>
        <td>Same Day</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Nurturing Green Operations Manual &copy; Internal Training Documentation &middot; NG Learn
  </div>
</body>
</html>`;

// 3. Store Staff Hiring & Audit Rubric
const staffHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nurturing Green - Store Staff Hiring & Daily Audit Rubric</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #11211F; line-height: 1.6; }
    .header { border-bottom: 2px solid #007A87; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 20px; font-weight: 800; color: #007A87; }
    .doc-id { font-size: 12px; color: #666; font-family: monospace; }
    h1 { color: #004D55; margin: 0 0 8px; font-size: 24px; }
    h2 { color: #007A87; margin-top: 24px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; }
    th { background: #f0f7f6; color: #004D55; font-weight: 700; }
    .checklist-item { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    .box { width: 16px; height: 16px; border: 2px solid #007A87; border-radius: 3px; display: inline-block; }
    .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 12px; color: #777; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nurturing Green &middot; NG Learn</div>
    <div class="doc-id">DOC-SOP-HR-04 &middot; Rev 3.0</div>
  </div>

  <h1>Store Staff Hiring, Grooming &amp; Daily Audit Rubric</h1>
  <p>Standard Operating Procedure for Customer Care Associate (CCA) recruitment evaluation, grooming standards, and daily 15-point store opening audit.</p>

  <h2>1. Candidate Evaluation Scoring Matrix (Scale 1 - 5)</h2>
  <table>
    <thead>
      <tr>
        <th>Competency Area</th>
        <th>Evaluation Focus</th>
        <th>Benchmark (Min 4/5 Required)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Plant Knowledge &amp; Care</strong></td>
        <td>Sunlight, watering cycles, repotting techniques</td>
        <td>Can explain care guides for top 10 SKUs</td>
      </tr>
      <tr>
        <td><strong>Customer Consultation</strong></td>
        <td>Plant-gifting pitch, identifying customer home lighting</td>
        <td>Empathetic consultative selling approach</td>
      </tr>
      <tr>
        <td><strong>POS &amp; Inventory Accuracy</strong></td>
        <td>Billing, RTV logging, physical stock reconciliation</td>
        <td>Basic arithmetic &amp; ERP familiarity</td>
      </tr>
      <tr>
        <td><strong>Store Grooming &amp; Energy</strong></td>
        <td>Uniform compliance, clean apron, name badge</td>
        <td>Punctual, energetic, and brand-aligned</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Daily Store Opening 15-Minute Checklist</h2>
  <div class="checklist-item"><span class="box"></span> <strong>09:30 AM:</strong> Store shutter opened, lighting and HVAC operational.</div>
  <div class="checklist-item"><span class="box"></span> <strong>09:40 AM:</strong> All live plants inspected; misting completed for tropical foliage.</div>
  <div class="checklist-item"><span class="box"></span> <strong>09:50 AM:</strong> Display glass wiped clean; price tags facing customer forward.</div>
  <div class="checklist-item"><span class="box"></span> <strong>10:00 AM:</strong> Cash register float checked; POS terminal logged in. Ready for business.</div>

  <div class="footer">
    Nurturing Green Operations Manual &copy; Internal Training Documentation &middot; NG Learn
  </div>
</body>
</html>`;

// 4. Retail Ops Master Glossary
const glossaryHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Nurturing Green - Retail Operations Master Glossary</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #11211F; line-height: 1.6; }
    .header { border-bottom: 2px solid #007A87; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 20px; font-weight: 800; color: #007A87; }
    .doc-id { font-size: 12px; color: #666; font-family: monospace; }
    h1 { color: #004D55; margin: 0 0 8px; font-size: 24px; }
    h2 { color: #007A87; margin-top: 24px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    dl { display: grid; grid-template-columns: 200px 1fr; gap: 12px 20px; font-size: 14px; margin-top: 16px; }
    dt { font-weight: 700; color: #007A87; border-bottom: 1px dashed #ddd; padding-bottom: 4px; }
    dd { margin: 0; color: #333; border-bottom: 1px solid #f0f0f0; padding-bottom: 4px; }
    .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 12px; color: #777; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Nurturing Green &middot; NG Learn</div>
    <div class="doc-id">DOC-GLOSS-01 &middot; Master Reference</div>
  </div>

  <h1>Retail Operations Master Glossary (22 Operational Terms)</h1>
  <p>Official terminology definitions for standard store procedures, supply chain handoffs, and visual merchandising.</p>

  <dl>
    <dt>MDQ</dt><dd>Minimum Dispatch Quantity — The smallest batch size a warehouse will dispatch to a retail store.</dd>
    <dt>SOH</dt><dd>Stock on Hand — Physical sellable inventory present at the store location.</dd>
    <dt>RTV</dt><dd>Return to Vendor — Procedural flow to return damaged or dead plants to central nursery/vendor.</dd>
    <dt>DOA</dt><dd>Dead on Arrival — Severe plant mortality or ceramic breakage detected at inward unboxing.</dd>
    <dt>Planogram</dt><dd>Visual diagram specifying exact SKU placement, shelf heights, and color blocking on store racks.</dd>
    <dt>CCA</dt><dd>Customer Care Associate — Frontline store associate responsible for plant care, consultation, and POS.</dd>
    <dt>Indent</dt><dd>Formal replenishment purchase request created by store based on inventory run-rate.</dd>
    <dt>Safety Stock</dt><dd>Buffer inventory maintained to prevent stock-outs during replenishment transit delays.</dd>
    <dt>FIFO</dt><dd>First In, First Out — Inventory rotation ensuring older nursery batches are sold first.</dd>
    <dt>Chlorosis</dt><dd>Foliage yellowing caused by insufficient chlorophyll, over-watering, or nutrient deficiency.</dd>
  </dl>

  <div class="footer">
    Nurturing Green Operations Manual &copy; Internal Training Documentation &middot; NG Learn
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'Retail-MDQ-Indent-Matrix.html'), mdqHTML);
fs.writeFileSync(path.join(outDir, 'Planogram-Compliance-RTV-Guide.html'), planogramHTML);
fs.writeFileSync(path.join(outDir, 'Store-Staff-Hiring-Audit-Rubric.html'), staffHTML);
fs.writeFileSync(path.join(outDir, 'Retail-Ops-Master-Glossary.html'), glossaryHTML);

// Copy SVG
if (fs.existsSync('public/original-process-map.svg')) {
  fs.copyFileSync('public/original-process-map.svg', path.join(outDir, 'Master-Operations-Process-Map.svg'));
}

console.log('Successfully generated 5 downloadable and previewable SOP resources in public/resources!');
