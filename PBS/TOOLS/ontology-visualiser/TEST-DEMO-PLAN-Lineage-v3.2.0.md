# Test & Demo Plan — VE/PE Lineage Chain Features (v3.2.0)

**Date:** 2026-02-06
**PR:** #51
**Branch:** `feature/lineage-chain-visualisation`
**Stories:** R.1.4, R.1.5, X.3.2, X.3.3, X.3.5, X.3.6, X.3.7

---

## Part 1: Test Plan

### Pre-requisites

- Open the visualiser in a browser (hosted or local HTTP server)
- Browser console (F12) open to catch errors
- No cached data from previous sessions (clear IndexedDB if needed)

---

### T1: Lineage Toggle Buttons — Visibility

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T1.1 | Open visualiser, do NOT load registry | Lineage toggle buttons (VE Chain, PE Chain, Both) and Cross-refs Only button are **not visible** | |
| T1.2 | Drag-drop a single ontology JSON file | Lineage buttons remain **hidden** (single-ontology mode) | |
| T1.3 | Click **Load Registry** | After loading completes, Tier 0 series view appears. Lineage toggle buttons and Cross-refs Only button are now **visible** in the breadcrumb bar | |
| T1.4 | Double-click a series node to drill to Tier 1 | Lineage buttons remain **visible** | |
| T1.5 | Double-click an ontology node to drill to Tier 2 (entity graph) | Lineage buttons are **hidden** (lineage not applicable at entity level) | |
| T1.6 | Click breadcrumb to return to Tier 1 | Lineage buttons reappear | |
| T1.7 | Click Home to return to Tier 0 | Lineage buttons visible | |
| T1.8 | Toggle to "Ontologies (23)" view | Lineage buttons remain visible | |
| T1.9 | Toggle to "Connections" view | Lineage buttons remain visible | |

---

### T2: VE Lineage Chain Highlighting (R.1.4, X.3.2)

**Pre-condition:** Registry loaded, Tier 0 series view active.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T2.1 | Click **VE Chain** button | Button activates (gold background). VE-Series and PE-Series nodes get gold border glow (both contain VE chain members). Cross-series edges between them styled as gold solid lines | |
| T2.2 | Verify non-VE cross-series edges | Edges not involving VE lineage are dimmed (grey, thin) | |
| T2.3 | Check legend | Legend shows "VE Lineage" item with gold dot | |
| T2.4 | Drill to VE-Series (Tier 1) | VE chain ontology nodes visible (VSOM, OKR, VP, PMF). Cross-ontology edges between consecutive VE chain members (VSOM-OKR, OKR-VP, VP-PMF, PMF-EFS) styled as **gold solid thick lines** | |
| T2.5 | Verify non-VE edges at Tier 1 | Other cross-ontology edges at Tier 1 are dimmed | |
| T2.6 | EFS node (if visible as context) | EFS node shows convergence styling (orange border glow) since it belongs to both chains | |
| T2.7 | Click **VE Chain** button again | Toggle off — all edges return to default styling, button deactivates | |

---

### T3: PE Lineage Chain Highlighting (R.1.5, X.3.3)

**Pre-condition:** Registry loaded, Tier 0 series view active.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T3.1 | Click **PE Chain** button | Button activates (copper background). PE-Series node gets copper border glow | |
| T3.2 | Drill to PE-Series (Tier 1) | PE chain ontology nodes visible (PPM, PE, EFS, EA). Cross-ontology edges between consecutive PE chain members styled as **copper solid thick lines** | |
| T3.3 | Verify chain direction | PPM→PE, PE→EFS, EFS→EA edges are copper. Other edges dimmed | |
| T3.4 | Check legend | Legend shows "PE Lineage" item with copper dot | |
| T3.5 | Click **PE Chain** button again | Toggle off | |

---

### T4: Both Lineage Chains + EFS Convergence

**Pre-condition:** Registry loaded, any multi-ontology view.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T4.1 | Click **Both** button | Button activates (orange-red background). Both VE and PE toggle buttons also highlight | |
| T4.2 | Verify VE edges | VSOM→OKR→VP→PMF→EFS edges styled as gold solid | |
| T4.3 | Verify PE edges | PPM→PE→EFS→EA edges styled as copper solid | |
| T4.4 | Verify EFS convergence node | EFS node has: dual-colour border (orange-red #FF6B35), larger size (1.3x), shadow glow, tooltip containing "CONVERGENCE POINT" | |
| T4.5 | Verify convergence edges | Edges touching EFS that belong to both chains show convergence colour (#FF6B35) | |
| T4.6 | Check legend | Legend shows VE Lineage (gold), PE Lineage (copper), and Convergence (EFS) items | |
| T4.7 | Navigate to Connection Map view | Lineage styling applies to connection map edges as well. EFS node has convergence styling | |
| T4.8 | Navigate to All Ontologies view | Lineage styling applies. EFS convergence point visible | |
| T4.9 | Click **Both** again | Toggle off — all returns to default | |

---

### T5: Cross-Refs Only Filter (X.3.5)

**Pre-condition:** Registry loaded, "Ontologies (23)" view or merged multi-graph.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T5.1 | Note the current graph (all edges visible) | Both intra-ontology edges and cross-ontology edges visible | |
| T5.2 | Click **Cross-refs Only** button | Button activates (blue). All intra-ontology edges disappear. Only cross-ontology edges (gold dashed) remain visible | |
| T5.3 | Verify node count unchanged | All nodes still present, only edges are filtered | |
| T5.4 | Stats bar | Should show "[cross-refs only]" suffix | |
| T5.5 | Combine with VE Chain toggle | Click VE Chain while cross-refs-only is active. VE lineage edges appear gold solid, other cross-edges dimmed, no intra-ontology edges | |
| T5.6 | Click **Cross-refs Only** again | Toggle off — intra-ontology edges reappear | |

---

### T6: Cross-Ontology Edge Click Navigation (X.3.7)

**Pre-condition:** Registry loaded, any multi-ontology view with cross-ontology edges visible.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T6.1 | Click a cross-ontology edge (gold dashed line) pointing to a loaded ontology | Visualiser navigates to the target ontology's entity graph (Tier 2). Breadcrumb updates | |
| T6.2 | Verify the correct ontology loaded | The entity graph matches the target end of the clicked edge | |
| T6.3 | Use breadcrumb to navigate back | Returns to previous tier/view | |
| T6.4 | Click a cross-ontology edge pointing to a placeholder ontology | **No navigation occurs** — placeholders cannot be drilled into | |
| T6.5 | Click an intra-ontology edge | **No navigation occurs** — only cross-ontology edges are navigable | |
| T6.6 | Click a node (not an edge) | Normal node selection behaviour — sidebar opens, no navigation | |
| T6.7 | Test in Connection Map view | Click a connection map edge — navigates to target ontology | |
| T6.8 | Test in Tier 1 (series drill-down) | Click a cross-ontology edge at Tier 1 — navigates to target ontology | |

---

### T7: Audit Panel Cross-Dependency Counts (X.3.6)

**Pre-condition:** Registry loaded.

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T7.1 | Load a single ontology (drag-drop) | Audit panel does NOT show cross-dependency section (single mode) | |
| T7.2 | Click **Load Registry** | Wait for all ontologies to load | |
| T7.3 | Click any ontology node to trigger audit panel | Audit panel populates. After standard audit sections, a **"Cross-Ontology Dependencies"** section appears | |
| T7.4 | Verify per-ontology counts | Each ontology with outbound cross-refs is listed with its count, sorted by count descending | |
| T7.5 | Verify total count | Gold-coloured "Total: N cross-ontology edges" line appears | |
| T7.6 | Verify bridge node count | If bridge nodes exist, "Bridge nodes: N (3+ ontology refs)" line appears | |
| T7.7 | Cross-check counts | Total should equal the sum of all per-ontology outbound counts (or close, as some edges may be bidirectional) | |

---

### T8: State Persistence Across Views

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T8.1 | Activate VE Chain at Tier 0 series view | Gold lineage active | |
| T8.2 | Toggle to Ontologies (23) view | VE lineage styling persists — gold edges still highlighted | |
| T8.3 | Toggle to Connections view | VE lineage styling persists on connection map | |
| T8.4 | Toggle back to Series (6) view | VE lineage still active, button still highlighted | |
| T8.5 | Drill into a series (Tier 1) | VE lineage persists at Tier 1 | |
| T8.6 | Navigate back to Tier 0 | VE lineage still active | |
| T8.7 | Drag-drop a single ontology file | Mode switches to single-ontology. Lineage state resets. Lineage buttons hidden | |
| T8.8 | Click Load Registry again | Lineage state is off (fresh start). Buttons visible but inactive | |

---

### T9: Console Error Check

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T9.1 | Perform all T1-T8 steps with browser console open | **No JavaScript errors** in console at any point | |
| T9.2 | Rapidly toggle VE/PE/Both on and off | No errors, no visual glitches | |
| T9.3 | Rapidly switch between Tier 0 views while lineage is active | No errors | |
| T9.4 | Click edges in empty areas (no edge selected) | No errors | |

---

### T10: Regression — Existing Features

| # | Step | Expected Result | Pass |
|---|------|-----------------|------|
| T10.1 | Single ontology drag-drop | Graph renders, audit runs, compliance badge shows | |
| T10.2 | Load from GitHub (PAT) | Ontology loads correctly | |
| T10.3 | Load Registry → Tier 0 → Tier 1 → Tier 2 navigation | All tiers navigate correctly | |
| T10.4 | Bridge filter at "Ontologies (23)" view | Bridge nodes filter works independently of lineage | |
| T10.5 | Sidebar Details/Connections/Schema/Data tabs | All tabs function correctly | |
| T10.6 | Export PNG | Image exports correctly | |
| T10.7 | Library save/load | IndexedDB operations work | |
| T10.8 | Physics toggle, Layout switch, Fit View | All layout controls work | |
| T10.9 | Connection Map (no lineage active) | Renders correctly with default gold dashed edges | |
| T10.10 | Placeholder ontology details modal | Clicking placeholder shows details, not entity graph | |

---

## Part 2: Demo Script

**Audience:** Stakeholders, team members
**Duration:** ~8 minutes
**Setup:** Hosted version open in browser, registry not yet loaded

---

### Scene 1: Introduction (30 sec)

> "Today I'll walk you through the new lineage chain visualisation features in the Ontology Visualiser v3.2.0. These features let us trace the Value Engineering and Process Engineering lineage chains through our ontology library, understand where they converge, and navigate cross-ontology dependencies."

---

### Scene 2: Load the Registry (1 min)

1. Click **Load Registry**
2. Wait for the 23 ontologies to load
3. Point out the 6 series super-nodes and the gold dashed cross-series edges

> "Here's our familiar series rollup view — 6 series representing the full ontology library. Notice the three new buttons in the breadcrumb bar: VE Chain, PE Chain, and Both. There's also a Cross-refs Only filter."

---

### Scene 3: VE Lineage Chain (2 min)

1. Click **VE Chain** button
2. Observe the gold highlighting on series nodes and edges

> "The VE Chain — Value Engineering — traces from VSOM through OKR, VP, PMF, and into EFS. When I activate it, you can see the gold highlighting on the VE-Series and PE-Series nodes, since the chain spans both series via EFS."

3. Drill into VE-Series (double-click)
4. Point out gold solid edges between VSOM→OKR→VP→PMF

> "Drilling into VE-Series, the lineage edges are now solid gold thick lines connecting each step in the chain. Non-lineage edges are dimmed so the chain stands out clearly. This is the strategic value flow — from Vision-Strategy down through OKRs, Value Proposition, and into Product-Market Fit."

5. Point out EFS node with convergence styling

> "EFS — Enterprise Framework Services — is visible as a context node from PE-Series. Notice it has special convergence styling because it's where VE and PE chains meet."

---

### Scene 4: PE Lineage Chain (1 min)

1. Click **VE Chain** to deactivate
2. Navigate back to Tier 0
3. Click **PE Chain** button
4. Drill into PE-Series

> "Switching to the PE Chain — Process Engineering — we see the copper-coloured lineage from PPM through Process Engineering, into EFS, and on to EA. This is the execution pathway."

---

### Scene 5: Both Chains + Convergence (1.5 min)

1. Navigate back to Tier 0
2. Click **Both** button
3. Point out both gold and copper edges
4. Switch to "Connections" view

> "With Both active, we see the complete picture. The Connection Map is particularly useful here — gold lines trace VE flow, copper lines trace PE flow, and where they meet at EFS, you see the convergence point in orange-red with a glow effect."

5. Hover over EFS node to show tooltip

> "The EFS convergence point is clearly marked — this is the critical junction where strategic value meets operational execution."

---

### Scene 6: Cross-Refs Only Filter (1 min)

1. Switch to "Ontologies (23)" view
2. Click **Cross-refs Only**

> "The Cross-refs Only filter strips away all the internal edges within each ontology and shows just the cross-ontology connections. Combined with the lineage highlighting, this gives you a clean map of how ontologies depend on each other."

3. Turn off Cross-refs Only

---

### Scene 7: Edge Click Navigation (1 min)

1. In any multi-ontology view, click a cross-ontology edge

> "New in v3.2.0 — clicking any cross-ontology edge navigates directly to the target ontology. Watch..."

2. Click a gold dashed edge
3. Show the entity graph loads for the target ontology
4. Use breadcrumb to navigate back

> "One click on an edge and we're looking at the full entity graph of the target ontology. The breadcrumb lets us navigate back to wherever we came from."

---

### Scene 8: Audit Panel Dependencies (1 min)

1. Click any ontology node to open sidebar
2. Open the audit panel

> "The audit panel now includes a Cross-Ontology Dependencies section. It shows how many outbound cross-references each ontology has, the total cross-edge count, and how many bridge nodes exist — entities referenced by three or more ontologies."

3. Point out the sorted list and totals

> "This gives us a quantitative view of how tightly coupled our ontologies are and which ones are the most interconnected."

---

### Scene 9: Wrap-up (30 sec)

> "To summarise: v3.2.0 adds VE and PE lineage chain highlighting with gold and copper styling, EFS convergence point visualisation, a cross-refs-only filter, clickable edge navigation, and cross-dependency counts in the audit panel. These features make it much easier to understand the architectural flow through our ontology library."

---

## Part 3: Known Limitations

| Limitation | Notes |
|------------|-------|
| Lineage at Tier 2 | Entity-level graphs don't show lineage highlighting (by design — lineage is an ontology-level concept) |
| Placeholder ontologies | Cannot be navigated to via edge click (no entity data available) |
| Tier 0 lineage | At series level, lineage appears as border highlights on series nodes rather than individual chain edges (series aggregate multiple ontologies) |
| Edge click precision | Clicking thin edges requires precise mouse positioning — zooming in helps |
| Cross-edge filter + bridge filter | These are independent filters; combining them is possible but may produce sparse graphs |

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Developer | | | |
| Tester | | | |
| Stakeholder | | | |

---

*OAA Ontology Visualiser v3.2.0 — Test & Demo Plan*
