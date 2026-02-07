# OAA Ontology Visualiser — Operating Guide

**Version:** 4.0.0
**Date:** 2026-02-07
**Audience:** Team members, stakeholders, and contributors

---

## Quick Start

### Option 1: Use Hosted Version (Recommended)
Open directly in browser:
```
https://ajrmooreuk.github.io/Azlan-EA-AAA/PBS/TOOLS/ontology-visualiser/browser-viewer.html
```
Or via the root redirect:
```
https://ajrmooreuk.github.io/Azlan-EA-AAA/
```

### Option 2: Run Locally
1. Clone the Azlan-EA-AAA repository
2. Serve the repo with any local HTTP server (required for ES module imports):
   ```bash
   cd PBS/TOOLS/ontology-visualiser
   python -m http.server 8080
   ```
3. Open `http://localhost:8080/browser-viewer.html` in any modern browser

> **Note:** Opening `browser-viewer.html` directly as a file:// URL will not work — ES modules require an HTTP server. The hosted GitHub Pages version is the easiest option.

---

## Architecture Overview (v4.0.0)

The visualiser is a zero-build-step browser application using native ES modules:

```text
browser-viewer.html          ← HTML shell (140 lines, incl. breadcrumb bar + series selectors)
├── css/viewer.css            ← All styles (incl. breadcrumb, tier toggle, series highlight, cross-edge filter)
└── js/
    ├── app.js                ← Entry point, navigation orchestration, series toggles, window bindings
    ├── state.js              ← Shared state + constants (incl. SERIES_HIGHLIGHT_COLORS) + navigation state
    ├── ontology-parser.js    ← Format detection + parsing (7 formats)
    ├── graph-renderer.js     ← vis.js rendering (single + Tier 0/1 + series highlight styling + edge click handlers)
    ├── multi-loader.js       ← Registry batch loading, series aggregation, lineage classification
    ├── audit-engine.js       ← OAA v6.1.0 validation gates (G1-G6)
    ├── compliance-reporter.js ← Compliance panel rendering
    ├── ui-panels.js          ← Sidebar, audit (incl. cross-dependency counts), modals, tabs, tier-aware drill buttons
    ├── library-manager.js    ← IndexedDB ontology library
    ├── github-loader.js      ← Registry integration
    └── export.js             ← PNG, audit JSON, ontology download
```

---

## Core Workflows

### Workflow 1: Load and Visualise a Single Ontology

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Drop JSON   │ ──► │   Parsing    │ ──► │ OAA v6.1.0   │ ──► │  Graph View  │
│    File      │     │  (7 formats) │     │  Validation   │     │ (Stabilized) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Steps:**
1. Open the visualiser in your browser
2. Drag and drop a `.json` or `.jsonld` ontology file onto the drop zone
3. The graph renders with physics simulation, audit panel auto-populates
4. The OAA v6.1.0 compliance badge appears in the header

**Alternative loading methods:**
- Click **Open JSON File** in the toolbar to use a file picker
- Click **Load from GitHub** to fetch from a private repo (requires PAT)
- Click **Load Registry** to load all 23 ontologies (see Workflow 7)

**Supported Formats:**
| Format | Detection Key | Example |
|--------|--------------|---------|
| OAA v6.1.0 (hasDefinedTerm) | `hasDefinedTerm[]` | `{ "hasDefinedTerm": [...] }` |
| PF Ontology | `entities[]` | `{ "entities": [...] }` |
| JSON-LD | `@graph` | `{ "@graph": [...] }` |
| UniRegistry | `ontologyDefinition` | `{ "ontologyDefinition": {...} }` |
| Registry Entry | `@type: OntologyRegistryEntry` | Entry from unified registry |
| Agent Registry | `agents[]` | `{ "agents": [...] }` |
| Generic | (fallback) | Any JSON object |

---

### Workflow 2: Inspect Entity Details

```
Click Node ──► Sidebar Opens ──► 4 Tabs Available
                                  ├── Details (ID, Type, Description, Provenance)
                                  ├── Connections (Incoming/Outgoing)
                                  ├── Schema (Properties, Types, Cardinality)
                                  └── Data (Test instances)
```

**Steps:**
1. Single-click any node to open the sidebar
2. Use tabs to explore different aspects:
   - **Details**: Core metadata (ID, type, description). In multi-ontology mode, also shows source ontology, series badge, and placeholder status
   - **Connections**: Navigate to related entities (click to jump)
   - **Schema**: Property definitions with types and cardinality
   - **Data**: Sample test data instances (when test data is loaded)

---

### Workflow 3: Drill-Down Navigation

#### Single-Ontology Mode

```text
Double-Click ──► Focus + Zoom ──► Connections Tab ──► Click Related Node
     │                                                       │
     └───────────────────────────────────────────────────────┘
                         (repeat)
```

**Steps:**
1. Double-click any node
2. Graph focuses and zooms to that node
3. Connections tab opens automatically showing incoming/outgoing edges
4. Click any connection to navigate to that entity
5. Continue drilling down through the graph

#### Multi-Ontology Mode (Tiered Navigation)

```text
Tier 0 (6 Series)  ──►  Tier 1 (Ontologies)  ──►  Tier 2 (Entities)
  double-click             double-click              double-click
  series node              ontology node              focus+zoom
       ▲                        ▲                         │
       └── breadcrumb ──────────┘── breadcrumb ───────────┘
```

**Steps:**
1. Click **Load Registry** to enter Tier 0 (6 series super-nodes)
2. Double-click a series node to drill into its ontologies (Tier 1)
3. Double-click an ontology node to view its entity graph (Tier 2)
4. Use the breadcrumb bar to navigate back to any previous tier
5. Click the **Home** button to return to Tier 0 at any time
6. At Tier 1, double-click a faded context series node to switch to that series

---

### Workflow 4: OAA v6.1.0 Compliance Audit

```
Load Ontology ──► Compliance Badge Appears ──► Click Badge or "OAA Audit"
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │  Gate Report  │
                                                  │  G1: Schema   │
                                                  │  G2: Relations │
                                                  │  G2B: Nodes   │
                                                  │  G2C: Graph   │
                                                  │  G3: Rules    │
                                                  │  G4: Semantic  │
                                                  │  G5: Complete  │
                                                  │  G6: Registry  │
                                                  └──────────────┘
```

**Steps:**
1. Load any ontology
2. The compliance badge in the header shows pass/warn/fail status
3. Click the badge or the **OAA Audit** button to open the full report
4. Review each gate:
   - **G1 (Schema Structure)**: Valid `@context`, `@type`, required fields
   - **G2 (Relationship Cardinality)**: All relationships properly defined
   - **G2B (Entity Connectivity)**: Every entity in at least one relationship
   - **G2C (Graph Connectivity)**: Single connected component
   - **G3 (Business Rules)**: IF-THEN rules with correct format
   - **G4 (Semantic Consistency)**: Naming conventions, description quality
   - **G5 (Completeness)**: Test data with required distribution
   - **G6 (UniRegistry)**: Registry entry with required metadata

**Additional Actions (when audit completes):**
- **Upgrade with OAA v6**: Generates a Claude Code command to upgrade non-compliant ontologies
- **Save to Library**: Save compliant ontologies to the browser's IndexedDB library
- **Export Audit**: Download the full audit report as JSON

---

### Workflow 5: OAA Upgrade (Non-Compliant Ontologies)

```
Audit Shows Failures ──► Click "Upgrade with OAA v6" ──► Copy Command ──► Run in Claude Code
```

**Steps:**
1. Load an ontology that fails one or more gates
2. The **Upgrade with OAA v6** button appears
3. Click it to generate a Claude Code command
4. Copy the command and paste into Claude Code terminal
5. The agent will fix the ontology to pass all gates

---

### Workflow 6: Ontology Library

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Save to     │ ──► │   IndexedDB  │ ──► │  Load from   │
│   Library    │     │   Storage    │     │   Library    │
└──────────────┘     └──────────────┘     └──────────────┘
         │                                        │
         ▼                                        ▼
  Version History                          Quick Reload
  Export / Import                          Compare Versions
```

**Steps:**
1. Click the **Library** button (book icon) to open the library panel
2. Browse saved ontologies by category
3. Click any entry to load it into the graph
4. Use **History** to view and restore previous versions
5. **Export** / **Import** to transfer your library between browsers

**Saving an Ontology:**
1. Load an ontology that passes compliance
2. Click **Save to Library**
3. Enter name, category, version, and notes
4. The ontology is stored locally in IndexedDB with full version history

---

### Workflow 7: Load Full Registry (Multi-Ontology Mode)

```text
Click "Load Registry" ──► Batch Load (23 ontologies) ──► Tier 0: Series Rollup (6 nodes)
                                                                │
                                                       ┌────────┴────────┐
                                                       │ 6 Series Nodes  │
                                                       │ Cross-Series    │
                                                       │ Edges (gold)    │
                                                       └────────┬────────┘
                                                                │
                                              Double-click ─────┴───── Toggle to
                                              series node              "Ontologies (23)"
                                                    │                       │
                                                    ▼                       ▼
                                           Tier 1: Series         Flat 23-node view
                                           Drill-Down             (legacy merged graph)
                                                    │
                                              Double-click
                                              ontology node
                                                    │
                                                    ▼
                                           Tier 2: Entity Graph
                                           (single-ontology renderer)
```

**Steps:**

1. Click **Load Registry** in the toolbar
2. Wait for all 23 ontologies to load from the unified registry
3. The **Tier 0 Series Rollup** displays with:
   - **6 series super-nodes** — large nodes representing each ontology series, labelled with ontology count
   - **Cross-series edges** — gold dashed lines showing relationships between series, labelled with reference count
   - **Series/Ontologies toggle** — breadcrumb bar toggle to switch between 6-node and 23-node views
4. **Drill into a series** (Tier 1): Double-click a series node to see its ontologies
   - Ontology nodes for the selected series are shown at full opacity
   - Other series appear as faded context nodes (30% opacity) — click to switch context
   - Placeholder ontologies shown as dashed-border diamonds (not drillable)
5. **Drill into an ontology** (Tier 2): Double-click an ontology node to see its entity graph
   - Full entity-level graph rendered using the single-ontology renderer
   - Breadcrumb shows: Library > Series > Ontology
6. **Navigate back**: Use breadcrumb links or Home button to return to any previous tier

**Series Colour Key:**

| Series | Colour | Ontologies |
|--------|--------|------------|
| VE-Series (Value Engineering) | Blue | VSOM, OKR, VP, RRR, PMF, KPI |
| PE-Series (Process Engineering) | Green | PPM, PE, EFS, EA |
| Foundation | Orange | ORG, ORG-CONTEXT, ORG-MAT, AIR |
| Competitive | Pink | CA, CL, GA |
| RCSG-Series (Risk, Compliance, Security & Governance) | Purple | MCSB, MCSB2, GDPR, AZALZ, PII |
| Orchestration | Cyan | EMC |

**Returning to Single Mode:**

- Drag-drop a single file, use file picker, or load from GitHub/Library to return to single-ontology mode

---

### Workflow 8: Load Test Data

```
Ontology Loaded ──► Click "+ Test Data" ──► Select JSON ──► Data Tab Populated
```

**Steps:**
1. Load an ontology first
2. Click **+ Test Data** in toolbar
3. Select a test data JSON file
4. Click entities to see their test instances in the **Data** tab

**Test Data Format:**
```json
{
  "testData": {
    "EntityName": [
      { "id": "...", "name": "...", "testCategory": "typical" },
      { "id": "...", "name": "...", "testCategory": "edge" }
    ]
  }
}
```

---

### Workflow 9: Load from GitHub (Private Repos)

```
Click "Load from GitHub" ──► Enter PAT ──► Enter repo/path ──► Ontology Loads
```

**Steps:**
1. Click **Load from GitHub**
2. Enter your GitHub Personal Access Token (stored in session only, cleared on tab close)
3. Enter path: `owner/repo/path/to/ontology.json`
4. Ontology loads directly from GitHub API

---

### Workflow 10: Series Highlight Selectors

```text
Load Registry ──► Tier 0/1 View ──► Click series toggles (VE / PE / Foundation / ...)
                                              │
                                     ┌────────┴────────┐
                                     │ Series nodes     │
                                     │ + edges glow     │
                                     │ in series colour │
                                     │                  │
                                     │ VE/PE retain     │
                                     │ chain logic      │
                                     └─────────────────┘
```

**Steps:**

1. Click **Load Registry** to enter multi-ontology mode
2. In the breadcrumb bar, six series toggle buttons appear — one per series:
   - **VE** — highlights VE-Series ontologies and VE chain edges (VSOM → OKR → VP → PMF → EFS) in gold (#cec528)
   - **PE** — highlights PE-Series ontologies and PE chain edges (PPM → PE → EFS → EA) in copper (#b87333)
   - **Foundation** — highlights Foundation ontologies in orange (#FF9800)
   - **Competitive** — highlights Competitive ontologies in pink (#E91E63)
   - **RCSG** — highlights RCSG-Series ontologies in purple (#9C27B0)
   - **Orchestration** — highlights Orchestration ontologies in cyan (#00BCD4)
3. When a series is highlighted:
   - Series nodes and ontology nodes glow with the series colour border
   - Cross-ontology edges within the highlighted series are emphasised
   - Non-matching cross-ontology edges are dimmed
   - For VE/PE, consecutive chain edges are shown as thick solid lines (gold/copper)
   - When both VE + PE are active, EFS shows convergence styling (#FF6B35)
4. Multiple series can be active simultaneously (independent toggles)
5. Click an active toggle again to deselect it
6. Series highlighting works at Tier 0, Tier 1, all-ontologies view, and connection map view

**Cross-Refs Only Filter:**

- Click **Cross-refs Only** button to hide all intra-ontology edges and show only cross-ontology connections
- Useful for understanding inter-ontology dependencies without visual noise
- Can be combined with series highlighting

---

### Workflow 11: Cross-Ontology Edge Navigation

```text
Click cross-ontology edge ──► Navigates to target ontology (Tier 2)
```

**Steps:**

1. In any multi-ontology view (Tier 0, Tier 1, all-ontologies, or connection map), click a cross-ontology edge (gold dashed line)
2. The visualiser navigates directly to the target ontology's entity graph (Tier 2)
3. Only edges pointing to loaded (non-placeholder) ontologies are navigable
4. Use the breadcrumb to navigate back

---

## Toolbar Reference

| Button | Function |
|--------|----------|
| **Open JSON File** | File picker for local ontology |
| **Physics** | Toggle force-directed physics on/off |
| **Layout** | Switch between Force-directed, Hierarchical, Circular |
| **Fit View** | Zoom to show all nodes |
| **Reset** | Reload current ontology with default settings |
| **Export PNG** | Download graph as image |
| **Details** | Toggle sidebar panel |
| **OAA Audit** | Toggle compliance/audit panel |
| **Upgrade with OAA v6** | Generate upgrade command (appears after audit) |
| **Save to Library** | Save compliant ontology locally (appears after pass) |
| **Export Audit** | Download audit report as JSON (appears after audit) |
| **Library** | Browse/load saved ontologies |
| **Load from GitHub** | Fetch from private GitHub repo |
| **Load Registry** | Load all 23 ontologies with tiered navigation (series rollup → drill-through) |
| **VE** | Highlight VE-Series ontologies + chain edges (gold) |
| **PE** | Highlight PE-Series ontologies + chain edges (copper) |
| **Foundation** | Highlight Foundation ontologies (orange) |
| **Competitive** | Highlight Competitive ontologies (pink) |
| **RCSG** | Highlight RCSG-Series ontologies (purple) |
| **Orchestration** | Highlight Orchestration ontologies (cyan) |
| **Cross-refs Only** | Toggle cross-ontology-edge-only filter (hides intra-ontology edges) |
| **+ Test Data** | Overlay test data instances |

---

## Keyboard & Mouse Controls

| Action | Effect |
|--------|--------|
| **Scroll** | Zoom in/out |
| **Drag canvas** | Pan view |
| **Drag node** | Move node (physics adjusts) |
| **Click node** | Select + show details sidebar |
| **Double-click node (single mode)** | Focus + drill into connections tab |
| **Double-click node (multi mode)** | Tier 0: drill into series; Tier 1: drill into ontology/switch series |
| **Click cross-ontology edge** | Navigate to target ontology (Tier 2) — multi-mode only |
| **Click away** | Deselect |
| **Escape** | Close any open modal |

---

## Visual Indicators

### Single-Ontology Mode — Node Colours
| Colour | Entity Type |
|--------|-------------|
| Green | Core / Class |
| Blue | Framework |
| Orange | Supporting |
| Pink | Agent |
| Cyan | Layer |
| Purple | Concept |
| Grey | External |
| Teal | Default |

### Multi-Ontology Mode — Series Colours
| Colour | Series |
|--------|--------|
| Blue (#2196F3) | VE-Series (Value Engineering) |
| Green (#4CAF50) | PE-Series (Process Engineering) |
| Orange (#FF9800) | Foundation |
| Pink (#E91E63) | Competitive |
| Purple (#9C27B0) | RCSG-Series (Risk, Compliance, Security & Governance) |
| Cyan (#00BCD4) | Orchestration |
| Grey (#616161) | Placeholder (not yet developed) |

### Edge Styles
| Style | Meaning |
|-------|---------|
| Solid green | Standard relationship |
| Dashed grey | Inheritance / subClassOf |
| Solid orange (thick) | Binding |
| **Gold dashed (thick)** | **Cross-ontology reference (multi-mode only)** |
| **Gold solid (thick, #cec528)** | **VE chain edge (when VE highlighted)** |
| **Copper solid (thick, #b87333)** | **PE chain edge (when PE highlighted)** |
| **Series colour solid** | **Edge between ontologies in a highlighted series** |
| **Convergence glow (#FF6B35)** | **VE+PE convergence edge at EFS (when both highlighted)** |
| Dimmed grey dashed | Non-matching edge (when any series highlighting active) |

### Node Shapes
| Shape | Meaning |
|-------|---------|
| Circle (dot) | Standard entity |
| Large circle (size 45) | Series super-node (Tier 0 only) |
| Medium circle (size 30) | Ontology node (Tier 1 only) |
| Star | Agent |
| Square (box) | Layer |
| Diamond | Placeholder (multi-mode only) |
| Faded node (30% opacity) | Context series node (Tier 1 only) |
| Gold border (thick) | Bridge node (referenced by 3+ ontologies) |
| Series colour border + glow | Ontology in a highlighted series |
| Convergence border (#FF6B35) | EFS convergence point (when VE + PE both highlighted) |

### Silo Indicators
| Visual | Meaning |
|--------|---------|
| Orange dashed border | Isolated node (zero edges) |
| Separate cluster | Disconnected component |

---

## Compliance Badge Reference

The compliance badge in the header shows the overall OAA v6.1.0 validation result:

| Badge | Meaning |
|-------|---------|
| Green "OAA v6.1.0 PASS" | All 8 gates passed |
| Orange "OAA v6.1.0 WARN" | Some gates have warnings |
| Red "OAA v6.1.0 FAIL" | One or more gates failed |
| Hidden | Multi-mode or no ontology loaded |

Click the badge to jump directly to the compliance report.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Graph doesn't appear | Check browser console (F12) for errors. Ensure using HTTP server, not file:// |
| Blank page / modules fail | ES modules require an HTTP server. Use the hosted version or `python -m http.server` |
| Nodes overlap badly | Toggle Physics ON, wait for stabilisation, or try Hierarchical layout |
| Can't see all nodes | Click **Fit View** |
| GitHub load fails | Check PAT permissions (needs `repo` scope). Token stored in session only |
| No test data showing | Ensure testData keys match entity `@id` or `name` fields |
| Layout too spread | Try Hierarchical or Circular layout |
| Library not loading | IndexedDB may be blocked in private browsing mode |
| Load Registry shows errors | Some ontology artifact files may not exist yet — placeholders are created for failures |
| Cross-ref edges not showing | Cross-refs are detected from registry `keyBridges` and namespace prefixes. Ontologies without declared bridges won't show cross-refs |
| Series toggles not visible | Series highlight toggles only appear in multi-ontology mode (after Load Registry). They are hidden in single-ontology mode and Tier 2 |
| Edge click doesn't navigate | Only cross-ontology edges pointing to loaded (non-placeholder) ontologies are navigable. Placeholder ontologies cannot be drilled into |
| EFS convergence not showing | EFS convergence styling only appears when both VE and PE series are highlighted simultaneously |

---

## Deployment

The visualiser is deployed automatically via GitHub Pages when changes are pushed to `main`:

- **Trigger paths:** `PBS/TOOLS/ontology-visualiser/**`, `PBS/ONTOLOGIES/ontology-library/**`
- **Primary URL:** `https://ajrmooreuk.github.io/Azlan-EA-AAA/PBS/TOOLS/ontology-visualiser/browser-viewer.html`
- **Root redirect:** `https://ajrmooreuk.github.io/Azlan-EA-AAA/` (redirects to primary)
- **Legacy URL:** `https://ajrmooreuk.github.io/Azlan-EA-AAA/tools/ontology-visualiser/browser-viewer.html` (backwards compatibility)

The workflow also deploys the ontology library (index, co-located entries + artifacts, glossary, validation reports from `PBS/ONTOLOGIES/ontology-library/`) so the **Load Registry** feature works on the hosted version.

---

## Sample Files

Located in `PBS/TOOLS/ontology-visualiser/`:

| File | Purpose |
|------|---------|
| `sample-ontology-with-data.json` | Demo ontology with embedded test data |
| `sample-test-data.json` | Standalone test data for overlay |

Ontology files for the registry are in `PBS/ONTOLOGIES/ontology-library/` (co-located with their registry entries).

---

## Related Documentation

- [QUICK-START.md](./QUICK-START.md) — 2-minute getting started guide
- [FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md](./FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md) — v3 feature specification
- [IMPLEMENTATION-PLAN-v1.0.0.md](./IMPLEMENTATION-PLAN-v1.0.0.md) — Phased implementation plan
- [ADR-LOG.md](./ADR-LOG.md) — Architecture Decision Records
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture reference

---

*OAA Ontology Visualiser v4.0.0 — Operating Guide*
