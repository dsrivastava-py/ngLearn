/*
 * Layered top-to-bottom layout for the section flowcharts.
 * Ranks come from a Kahn pass over the real edge list; nodes left over after
 * the pass (cycles) are appended below so nothing silently disappears.
 */

const SIZES = {
  decision: { w: 208, h: 104 },
  terminator: { w: 188, h: 58 },
  delay: { w: 198, h: 64 },
  process: { w: 216, h: 68 },
};

const GAP_X = 40;
const GAP_Y = 76;
const PAD = 48;

export function layoutFlow(nodes, edges) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const live = edges.filter((e) => byId.has(e.from) && byId.has(e.to) && e.from !== e.to);

  const indeg = new Map(nodes.map((n) => [n.id, 0]));
  const out = new Map(nodes.map((n) => [n.id, []]));
  live.forEach((e) => {
    indeg.set(e.to, indeg.get(e.to) + 1);
    out.get(e.from).push(e.to);
  });

  // longest-path ranking via Kahn; leftovers (cycles / isolates) go last
  const rank = new Map();
  const queue = nodes.filter((n) => indeg.get(n.id) === 0).map((n) => n.id);
  queue.forEach((id) => rank.set(id, 0));
  const deg = new Map(indeg);
  let head = 0;
  while (head < queue.length) {
    const id = queue[head++];
    for (const next of out.get(id)) {
      rank.set(next, Math.max(rank.get(next) ?? 0, (rank.get(id) ?? 0) + 1));
      deg.set(next, deg.get(next) - 1);
      if (deg.get(next) === 0) queue.push(next);
    }
  }
  let maxRank = 0;
  rank.forEach((r) => { maxRank = Math.max(maxRank, r); });
  nodes.forEach((n) => { if (!rank.has(n.id)) rank.set(n.id, maxRank + 1); });

  // group by rank, keep the diagram's own ordering inside a rank
  const rows = new Map();
  nodes.forEach((n, i) => {
    const r = rank.get(n.id);
    if (!rows.has(r)) rows.set(r, []);
    rows.get(r).push({ ...n, _i: i });
  });
  const rowKeys = [...rows.keys()].sort((a, b) => a - b);

  // barycentre pass so children sit under their parents instead of in file order
  const placed = new Map();
  rowKeys.forEach((r) => {
    const row = rows.get(r);
    row.forEach((n) => {
      const parents = live.filter((e) => e.to === n.id).map((e) => placed.get(e.from)).filter((p) => p != null);
      n._bary = parents.length ? parents.reduce((a, b) => a + b, 0) / parents.length : Number.MAX_SAFE_INTEGER;
    });
    row.sort((a, b) => (a._bary - b._bary) || (a._i - b._i));
    row.forEach((n, i) => placed.set(n.id, i));
  });

  const rowWidths = rowKeys.map((r) =>
    rows.get(r).reduce((w, n) => w + (SIZES[n.shape] || SIZES.process).w + GAP_X, -GAP_X)
  );
  const canvasW = Math.max(560, Math.max(...rowWidths, 0)) + PAD * 2;

  const laid = [];
  let y = PAD;
  rowKeys.forEach((r, ri) => {
    const row = rows.get(r);
    const rowH = Math.max(...row.map((n) => (SIZES[n.shape] || SIZES.process).h));
    let x = PAD + (canvasW - PAD * 2 - rowWidths[ri]) / 2;
    row.forEach((n) => {
      const s = SIZES[n.shape] || SIZES.process;
      laid.push({ ...n, x, y: y + (rowH - s.h) / 2, w: s.w, h: s.h, rank: r });
      x += s.w + GAP_X;
    });
    y += rowH + GAP_Y;
  });

  const canvasH = y - GAP_Y + PAD;
  const pos = new Map(laid.map((n) => [n.id, n]));

  const paths = live.map((e, i) => {
    const a = pos.get(e.from);
    const b = pos.get(e.to);
    const forward = b.y > a.y + a.h - 1;
    let d;
    let labelAt;
    if (forward) {
      const sx = a.x + a.w / 2;
      const sy = a.y + a.h;
      const tx = b.x + b.w / 2;
      const ty = b.y;
      const my = sy + Math.max(18, (ty - sy) / 2);
      d = `M ${sx} ${sy} L ${sx} ${my} L ${tx} ${my} L ${tx} ${ty}`;
      labelAt = { x: (sx + tx) / 2, y: my - 6 };
    } else {
      // backward / sideways edge: route through a channel on the right
      const sx = a.x + a.w;
      const sy = a.y + a.h / 2;
      const tx = b.x + b.w;
      const ty = b.y + b.h / 2;
      const ch = Math.max(sx, tx) + 34 + (i % 3) * 16;
      d = `M ${sx} ${sy} L ${ch} ${sy} L ${ch} ${ty} L ${tx} ${ty}`;
      labelAt = { x: ch + 6, y: (sy + ty) / 2 };
    }
    return { id: `${e.from}->${e.to}-${i}`, from: e.from, to: e.to, label: e.label, d, labelAt, forward };
  });

  // side-routed edges use a channel to the right of everything — widen for them
  const channelMax = paths.reduce((m, p) => {
    if (p.forward) return m;
    const xs = [...p.d.matchAll(/L (-?\d+(?:\.\d+)?)/g)].map((x) => Number(x[1]));
    return Math.max(m, ...xs);
  }, 0);

  return {
    nodes: laid,
    paths,
    width: Math.max(canvasW, channelMax + PAD),
    height: canvasH,
  };
}
