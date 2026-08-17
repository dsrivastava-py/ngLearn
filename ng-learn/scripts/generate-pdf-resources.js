import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const outDir = 'public/resources';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createStyledPDF(title, docId, subtitle) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Header Banner
  doc.setFillColor(0, 122, 135); // Brand Teal
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NURTURING GREEN', 15, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('NG Learn · Standard Operating Procedure', 15, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(docId, 195, 15, { align: 'right' });

  // Document Title
  doc.setTextColor(0, 77, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 15, 36);

  doc.setTextColor(100, 110, 115);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(subtitle, 15, 42);

  doc.setDrawColor(220, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(15, 46, 195, 46);

  return doc;
}

function addFooter(doc) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(220, 230, 230);
  doc.line(15, pageHeight - 16, 195, pageHeight - 16);

  doc.setTextColor(140, 150, 155);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Nurturing Green Operations Manual © Internal Training Documentation · NG Learn', 105, pageHeight - 10, { align: 'center' });
}

// 1. MDQ Matrix PDF
{
  const doc = createStyledPDF('Retail MDQ & Indent Calculation Matrix', 'DOC-SOP-RET-01 · Rev 2.4', 'Standard calculation rules, safety stock parameters, and dispatch thresholds.');
  let y = 54;

  // Section 1
  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Primary Replenishment Formula', 15, y);
  y += 7;

  doc.setFillColor(240, 248, 248);
  doc.setDrawColor(0, 122, 135);
  doc.roundedRect(15, y, 180, 16, 2, 2, 'FD');
  doc.setTextColor(0, 60, 68);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text('Indent = [Target (Safety + Cycle)] - Current SOH - Stock in Transit', 19, y + 10);
  y += 24;

  // Section 2
  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Category Minimum Dispatch Quantity (MDQ) Table', 15, y);
  y += 6;

  // Table
  const headers = ['Category', 'Product Type', 'MDQ Unit', 'Review Cadence'];
  const rows = [
    ['Live Plants (A-Tier)', 'Bonsai, Sansevieria, Money Plant', '6 Units / SKU', 'Twice Weekly (Mon & Thu)'],
    ['Live Plants (B-Tier)', 'Flowering Plants, Ferns, Succulents', '12 Units / SKU', 'Twice Weekly'],
    ['Planters & Ceramic', 'Designer Ceramic Pots, Self-Watering', '4 Units / Box', 'Weekly (Tuesday)'],
    ['Care & Nutrition', 'Organic Fertilizer, Plant Food, Misters', '10 Units / Carton', 'Bi-Weekly'],
  ];

  doc.setFillColor(0, 122, 135);
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(headers[0], 18, y + 5.5);
  doc.text(headers[1], 58, y + 5.5);
  doc.text(headers[2], 125, y + 5.5);
  doc.text(headers[3], 155, y + 5.5);
  y += 8;

  rows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 250 : 242, 250, 250);
    doc.rect(15, y, 180, 9, 'F');
    doc.setDrawColor(230, 235, 235);
    doc.rect(15, y, 180, 9, 'S');

    doc.setTextColor(40, 50, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 58, y + 6);
    doc.text(row[2], 125, y + 6);
    doc.text(row[3], 155, y + 6);
    y += 9;
  });
  y += 10;

  // Section 3
  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Indent Verification Guidelines', 15, y);
  y += 6;

  doc.setTextColor(50, 60, 65);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('• Cut-off Time: Store managers must submit indents before 14:00 hrs on review days.', 18, y);
  y += 6;
  doc.text('• Approval SLA: Area Retail Manager must approve indents within 4 hours of cut-off.', 18, y);
  y += 6;
  doc.text('• Nursery Buffer: ±3% variance allowed for pot size variations during picking.', 18, y);

  addFooter(doc);
  fs.writeFileSync(path.join(outDir, 'Retail-MDQ-Indent-Matrix.pdf'), Buffer.from(doc.output('arraybuffer')));
}

// 2. Planogram Guide PDF
{
  const doc = createStyledPDF('Planogram Compliance & RTV Protocol Guide', 'DOC-SOP-VM-03 · Rev 1.9', 'Visual merchandising hierarchy, display standards, and RTV defect SLAs.');
  let y = 54;

  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. 4-Tier Shelf Visual Merchandising Hierarchy', 15, y);
  y += 7;

  const tiers = [
    { title: 'Tier 1 — Eye-Level Hero Plants (120 - 150cm)', desc: 'Premium Bonsais, Exotic Pachira, Ficus Microcarpa in branded ceramic planters.' },
    { title: 'Tier 2 — Table-Top & Workdesk Range (80 - 110cm)', desc: 'Air-Purifying collection (Snake Plant, ZZ, Syngonium) in trios with benefit tags.' },
    { title: 'Tier 3 — Decorative Planters & Ceramic Stack (40 - 70cm)', desc: 'Arranged by color gradient (Terracotta, Emerald, Ivory, Charcoal).' },
    { title: 'Tier 4 — Floor Base & Large Foliage', desc: 'Areca Palm, Monstera Deliciosa, and Rubber Plant in heavy floor planters.' },
  ];

  tiers.forEach(t => {
    doc.setFillColor(248, 252, 252);
    doc.setDrawColor(210, 230, 230);
    doc.roundedRect(15, y, 180, 12, 1.5, 1.5, 'FD');
    doc.setTextColor(0, 77, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(t.title, 18, y + 4.5);
    doc.setTextColor(70, 80, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(t.desc, 18, y + 9);
    y += 14;
  });
  y += 6;

  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Return to Vendor (RTV) & Defect Protocols', 15, y);
  y += 6;

  const rtvHeaders = ['Defect Classification', 'Visual Criteria', 'Resolution SLA'];
  const rtvRows = [
    ['Dead on Arrival (DOA)', 'Stem snapped during transit, cracked pot', 'Within 2 Hours (ERP Upload)'],
    ['Foliage Chlorosis', '>30% yellow leaves, overwatered root rot', 'Daily 09:30 AM Audit'],
    ['Missing Barcode', 'Torn care-tag or missing EAN barcode', 'Same Day Store Reprint'],
  ];

  doc.setFillColor(0, 122, 135);
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(rtvHeaders[0], 18, y + 5.5);
  doc.text(rtvHeaders[1], 70, y + 5.5);
  doc.text(rtvHeaders[2], 145, y + 5.5);
  y += 8;

  rtvRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 250 : 242, 250, 250);
    doc.rect(15, y, 180, 9, 'F');
    doc.setDrawColor(230, 235, 235);
    doc.rect(15, y, 180, 9, 'S');

    doc.setTextColor(40, 50, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 70, y + 6);
    doc.text(row[2], 145, y + 6);
    y += 9;
  });

  addFooter(doc);
  fs.writeFileSync(path.join(outDir, 'Planogram-Compliance-RTV-Guide.pdf'), Buffer.from(doc.output('arraybuffer')));
}

// 3. Staff Hiring & Audit Rubric PDF
{
  const doc = createStyledPDF('Store Staff Hiring & Daily Audit Rubric', 'DOC-SOP-HR-04 · Rev 3.0', 'Customer Care Associate (CCA) recruitment evaluation matrix and opening audit.');
  let y = 54;

  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Candidate Evaluation Matrix (Min 4/5 Required)', 15, y);
  y += 6;

  const benchHeaders = ['Competency Area', 'Evaluation Focus', 'Passing Benchmark'];
  const benchRows = [
    ['Plant Knowledge & Care', 'Sunlight, watering cycles, repotting advice', 'Top 10 SKUs (Min 4/5)'],
    ['Customer Consultation', 'Plant-gifting pitch & light requirements', 'Consultative approach'],
    ['POS & Inventory Accuracy', 'Physical stock reconciliation & billing', 'ERP & math accuracy'],
    ['Store Grooming & Energy', 'Clean apron, name badge, positive energy', 'Punctual & brand-aligned'],
  ];

  doc.setFillColor(0, 122, 135);
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(benchHeaders[0], 18, y + 5.5);
  doc.text(benchHeaders[1], 72, y + 5.5);
  doc.text(benchHeaders[2], 145, y + 5.5);
  y += 8;

  benchRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 250 : 242, 250, 250);
    doc.rect(15, y, 180, 9, 'F');
    doc.setDrawColor(230, 235, 235);
    doc.rect(15, y, 180, 9, 'S');

    doc.setTextColor(40, 50, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], 72, y + 6);
    doc.text(row[2], 145, y + 6);
    y += 9;
  });
  y += 12;

  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Daily 15-Point Store Opening Checklist (09:30 - 10:00 AM)', 15, y);
  y += 7;

  const checks = [
    '09:30 AM — Store shutter unlocked; HVAC and ambient showroom lighting switched on.',
    '09:40 AM — Live plant health check; morning foliage misting completed for tropical plants.',
    '09:50 AM — Display glass wiped clean; shelf care tags and prices facing customer forward.',
    '10:00 AM — Cash register float verified; POS terminal logged in. Open for business.',
  ];

  checks.forEach(c => {
    doc.setFillColor(245, 250, 250);
    doc.roundedRect(15, y, 180, 8, 1, 1, 'F');
    doc.setDrawColor(0, 122, 135);
    doc.rect(18, y + 2, 4, 4, 'S');
    doc.setTextColor(50, 60, 65);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(c, 26, y + 5.5);
    y += 10;
  });

  addFooter(doc);
  fs.writeFileSync(path.join(outDir, 'Store-Staff-Hiring-Audit-Rubric.pdf'), Buffer.from(doc.output('arraybuffer')));
}

// 4. Master Glossary PDF
{
  const doc = createStyledPDF('Retail Operations Master Glossary', 'DOC-GLOSS-01 · Master Terms', 'Official operational vocabulary definitions for store staff and supply chain.');
  let y = 54;

  const terms = [
    { t: 'MDQ (Minimum Dispatch Quantity)', d: 'Smallest batch size the warehouse will dispatch to a retail store location.' },
    { t: 'SOH (Stock on Hand)', d: 'Physical, sellable plant and ceramic inventory present on store premises.' },
    { t: 'RTV (Return to Vendor)', d: 'Formal return flow for defective, dying, or unmarketable plants back to central nursery.' },
    { t: 'DOA (Dead on Arrival)', d: 'Severe plant mortality or ceramic breakage detected during inward unboxing audit.' },
    { t: 'Planogram', d: 'Visual diagram specifying exact SKU placement, shelf heights, and visual hierarchy on store fixtures.' },
    { t: 'CCA (Customer Care Associate)', d: 'Frontline store associate responsible for plant care, customer consultations, and POS transactions.' },
    { t: 'Indent', d: 'Replenishment order created by the store manager based on run-rate and safety stock.' },
    { t: 'FIFO (First In, First Out)', d: 'Inventory rotation protocol ensuring older plant batches are sold before newer arrivals.' },
    { t: 'Chlorosis', d: 'Foliage yellowing resulting from root rot, poor light, or overwatering; triggers recovery bay triage.' },
  ];

  terms.forEach((item, i) => {
    doc.setTextColor(0, 122, 135);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(item.t, 15, y);

    doc.setTextColor(60, 70, 75);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(item.d, 15, y + 4.5);
    y += 11.5;
  });

  addFooter(doc);
  fs.writeFileSync(path.join(outDir, 'Retail-Ops-Master-Glossary.pdf'), Buffer.from(doc.output('arraybuffer')));
}

// 5. Master Process Architecture PDF
{
  const doc = createStyledPDF('Nurturing Green Master Process Architecture', 'NG-ARCH-MAP-2026', 'Complete operational process flow mapping 34 sub-flows across 5 domains.');
  let y = 54;

  doc.setTextColor(0, 122, 135);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Master Process Flow Blueprint (34 Sub-Flows)', 15, y);
  y += 7;

  doc.setTextColor(50, 60, 65);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('This document certifies the complete operational blueprint exported from the master architecture.', 15, y);
  y += 10;

  const domains = [
    { name: '1. Offline Retail Sales SOP (Active)', count: '7 Modules', desc: 'Stock replenishment, MDQ, CCA onboarding, Planograms, and Brand signage.' },
    { name: '2. Quick Commerce O2C Flows', count: '8 Marketplaces', desc: 'Blinkit, Zepto, Instamart, and BigBasket order-to-cash & fill rate SLAs.' },
    { name: '3. Warehousing & Inward Logistics', count: '6 Sub-Flows', desc: 'Raw material procurement, production gatepass, and vendor discrepancy audits.' },
    { name: '4. New Product Development (NPD)', count: '5 Sub-Flows', desc: 'Ideation, vendor allocation, product spec sheets, and retail rollout.' },
    { name: '5. E-Commerce & Amazon Last-Mile', count: '7 Sub-Flows', desc: 'Direct fulfillment uploads, listing suppression RCA, and deal calendars.' },
  ];

  domains.forEach(d => {
    doc.setFillColor(245, 250, 250);
    doc.setDrawColor(0, 122, 135);
    doc.roundedRect(15, y, 180, 14, 2, 2, 'FD');

    doc.setTextColor(0, 77, 85);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(d.name, 18, y + 5.5);

    doc.setTextColor(0, 122, 135);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(d.count, 190, y + 5.5, { align: 'right' });

    doc.setTextColor(70, 80, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(d.desc, 18, y + 10.5);

    y += 17;
  });

  addFooter(doc);
  fs.writeFileSync(path.join(outDir, 'Nurturing-Green-Master-Process-Map.pdf'), Buffer.from(doc.output('arraybuffer')));
}

console.log('Successfully generated all 5 professional PDFs in public/resources!');
