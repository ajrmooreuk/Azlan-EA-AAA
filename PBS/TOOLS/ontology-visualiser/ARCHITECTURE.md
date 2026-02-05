# OAA Ontology Visualiser — Architecture & Deployment

**Version:** 3.0.0
**Last Updated:** 2026-02-05

---

## Overview

The OAA Ontology Visualiser is a zero-build-step, client-side browser application for interactive graph visualisation of JSON ontologies produced by OAA (Ontology Architect Agent). It supports single-ontology inspection with OAA v6.1.0 compliance validation, and multi-ontology registry loading with cross-reference detection.

No server-side processing, no Node.js, no bundler. The only external dependency is vis-network v9.1.2, loaded via CDN.

---

## Architecture Diagram

```mermaid
graph LR
    subgraph Source["Source Repository (Azlan-EA-AAA)"]
        A["PBS/TOOLS/ontology-visualiser/"] --> B["GitHub Actions\nWorkflow"]
        R["PBS/ONTOLOGIES/unified-registry/"] --> B
        O["PBS/ONTOLOGIES/pfc-ontologies/"] --> B
    end

    subgraph Deployment["GitHub Pages"]
        B -->|"Deploy"| C["OAA Visualiser\n(Static Files)"]
    end

    subgraph Client["Browser Client"]
        C -->|"Serves"| D["ES Modules\n(11 files)"]
        D --> E["vis.js Runtime"]
        E --> F["Graph Renderer"]
    end

    subgraph Input["Data Sources"]
        G["Local JSON Files\n(Drag & Drop)"] -->|"FileReader API"| D
        H["Private GitHub Repos\n(PAT Auth)"] -->|"GitHub Contents API"| D
        I["Unified Registry\n(23 Ontologies)"] -->|"fetch() from Pages"| D
        J["IndexedDB Library\n(Browser Storage)"] -->|"IDB API"| D
    end

    subgraph Formats["Supported Formats (7)"]
        K["OAA v6.1.0 (hasDefinedTerm)"]
        L["JSON-LD (@graph)"]
        M["PF Ontology (entities)"]
        N["UniRegistry / Registry Entry"]
        P["Agent Registry / Generic"]
    end

    Formats -->|"Auto-detect"| F
```

---

## Module Architecture (ES Modules)

All JavaScript is split into native ES modules loaded via `<script type="module">`. No build step, no bundler (see [ADR-009](./ADR-LOG.md#adr-009)).

```
browser-viewer.html           <- HTML shell (110 lines)
├── css/viewer.css             <- All styles
└── js/
    ├── app.js                 <- Entry point, event wiring, window bindings
    ├── state.js               <- Shared state, constants (TYPE_COLORS, SERIES_COLORS, REGISTRY_BASE_PATH)
    ├── ontology-parser.js     <- Format detection + parsing (7 formats)
    ├── graph-renderer.js      <- vis.js rendering (single + multi mode)
    ├── multi-loader.js        <- Registry batch loading, merged graph, cross-ref detection
    ├── audit-engine.js        <- OAA v6.1.0 validation gates (G1-G6, 8 gates)
    ├── compliance-reporter.js <- Compliance panel rendering
    ├── ui-panels.js           <- Sidebar, audit, modals, tabs, provenance display
    ├── library-manager.js     <- IndexedDB ontology library (CRUD, versioning, export/import)
    ├── github-loader.js       <- Registry index loading, entry lookup
    └── export.js              <- PNG, audit JSON, ontology download
```

### Module Dependency Graph

```
state.js              <- (all modules import shared state + constants)
github-loader.js      <- multi-loader.js, app.js
ontology-parser.js    <- multi-loader.js, app.js
multi-loader.js       <- app.js
audit-engine.js       <- graph-renderer.js
compliance-reporter.js <- graph-renderer.js
ui-panels.js          <- graph-renderer.js, app.js
graph-renderer.js     <- app.js
library-manager.js    <- app.js
export.js             <- app.js
```

No circular dependencies. `state.js` is the single shared state module imported by all others.

---

## View Modes

### Single-Ontology Mode (`state.viewMode = 'single'`)

Standard mode for inspecting one ontology at a time. Triggered by:

- Drag-and-drop file
- File picker
- Load from GitHub (PAT)
- Load from Library (IndexedDB)

Features: OAA v6.1.0 compliance validation (8 gates), entity type colouring, sidebar inspection (Details, Connections, Schema, Data tabs), OAA upgrade command generation.

### Multi-Ontology Mode (`state.viewMode = 'multi'`)

Registry mode showing all 23 ontologies as a merged graph. Triggered by "Load Registry" button.

Features: series-based node colouring (6 series), placeholder diamonds (5 undeveloped ontologies), cross-ontology edges (gold dashed), provenance display in sidebar.

Key data structures in multi-mode:

- `state.loadedOntologies: Map<namespace, OntologyRecord>` — all loaded ontologies
- `state.mergedGraph` — combined parsed graph with namespace-prefixed node IDs
- `state.seriesData` — series metadata with counts and colours

Node IDs are prefixed with namespace (`prefix::nodeId`) to avoid collisions across ontologies.

---

## Cross-Ontology Edge Detection

Two-pass algorithm implemented in `multi-loader.js` `detectCrossReferences()` (see [ADR-011](./ADR-LOG.md#adr-011)):

1. **Pass 1 — Registry bridges:** Reads `entry.relationships.keyBridges[]` from each registry entry
2. **Pass 2 — Namespace-prefix scan:** Scans `rangeIncludes`/`domainIncludes` for prefixed references to other ontologies

Edges are deduplicated via `Set<edgeKey>`. Rendered as gold dashed lines (width 2.5).

---

## Data Sources

### Unified Registry

The unified registry at `PBS/ONTOLOGIES/unified-registry/` contains:

- `ont-registry-index.json` — index of 23 entries with `seriesRegistry`, `namespaceRegistry`
- `entries/` — individual registry entry JSON files
- Artifact paths in entries are relative to the `entries/` directory (e.g., `../pfc-ontologies/EMC-ONT/...`)

Path resolution: `REGISTRY_BASE_PATH` (`../../ONTOLOGIES/unified-registry/`) is relative to the visualiser's location at `PBS/TOOLS/ontology-visualiser/`.

### IndexedDB Library

Client-side storage via `library-manager.js`:

- Database: `OntologyLibrary` (IDB v1)
- Stores: ontologies with version history
- Operations: save, load, delete, export, import
- Categories: `pfc-ontologies`, `pfi-ontologies`, `domain-ontologies`, `custom`

### GitHub API

Direct fetch from private repos via PAT (stored in `sessionStorage` only, cleared on tab close).

---

## OAA v6.1.0 Compliance

8 validation gates implemented in `audit-engine.js`:

| Gate | Name | Checks |
| ---- | ---- | ------ |
| G1 | Schema Structure | Valid `@context`, `@type`, required fields |
| G2 | Relationship Cardinality | All relationships properly defined |
| G2B | Entity Connectivity | Every entity in at least one relationship |
| G2C | Graph Connectivity | Single connected component |
| G3 | Business Rules | IF-THEN rules with correct format |
| G4 | Semantic Consistency | Naming conventions, description quality |
| G5 | Completeness | Test data with required distribution |
| G6 | UniRegistry | Registry entry with required metadata |

Results: pass / warn / fail per gate. Overall compliance badge in header (green/orange/red).

---

## Deployment

### GitHub Pages (Current)

Deployed automatically via GitHub Actions on push to `main`.

| Component | Detail |
| --------- | ------ |
| Workflow | `.github/workflows/pages.yml` |
| Trigger paths | `PBS/TOOLS/ontology-visualiser/**`, `PBS/ONTOLOGIES/unified-registry/**`, `PBS/ONTOLOGIES/pfc-ontologies/**`, `PBS/AGENTS/oaa-v6/**` |
| Primary URL | `https://ajrmooreuk.github.io/Azlan-EA-AAA/PBS/TOOLS/ontology-visualiser/browser-viewer.html` |
| Root redirect | `https://ajrmooreuk.github.io/Azlan-EA-AAA/` |
| Legacy URL | `https://ajrmooreuk.github.io/Azlan-EA-AAA/tools/ontology-visualiser/browser-viewer.html` |

The workflow deploys:

- Visualiser files (HTML, CSS, JS modules)
- Unified registry (index + entries)
- Ontology artifact files (from `pfc-ontologies/`)
- OAA system prompts
- Root `index.html` redirect

**Setup requirement:** Repo Settings > Pages > Source must be set to **GitHub Actions**.

### Future: Supabase

Planned migration to Supabase for persistent ontology storage, replacing file-based loading as the primary data source (see [ADR-001](./ADR-LOG.md#adr-001), [ADR-012](./ADR-LOG.md#adr-012)).

---

## Security

- **No backend** — all processing is client-side
- **PAT handling** — GitHub Personal Access Token stored in `sessionStorage` only (cleared on tab close, never persisted)
- **Auto-clear on 401** — invalid tokens removed from session immediately
- **No telemetry** — no analytics, tracking, or external calls beyond vis.js CDN and GitHub API
- **IndexedDB** — local-only storage, no sync to external services

---

## Dependencies

| Dependency | Version | Source |
| ---------- | ------- | ------ |
| vis-network | 9.1.2 | CDN (`unpkg.com`) |

No npm, no Node.js, no build step, no other external dependencies.

---

## File Structure

```
PBS/TOOLS/ontology-visualiser/
├── browser-viewer.html              <- HTML shell
├── css/
│   └── viewer.css                   <- All styles
├── js/
│   ├── app.js                       <- Entry point
│   ├── state.js                     <- Shared state + constants
│   ├── ontology-parser.js           <- Format detection + parsing
│   ├── graph-renderer.js            <- vis.js rendering
│   ├── multi-loader.js              <- Registry batch loading
│   ├── audit-engine.js              <- OAA v6.1.0 validation
│   ├── compliance-reporter.js       <- Compliance panel
│   ├── ui-panels.js                 <- Sidebar, modals, tabs
│   ├── library-manager.js           <- IndexedDB library
│   ├── github-loader.js             <- Registry integration
│   └── export.js                    <- PNG, JSON export
├── ARCHITECTURE.md                  <- This file
├── ADR-LOG.md                       <- Architecture Decision Records
├── OPERATING-GUIDE.md               <- Full operating guide
├── QUICK-START.md                   <- 2-minute getting started
├── README.md                        <- Project overview
├── sample-ontology-with-data.json   <- Demo ontology
└── sample-test-data.json            <- Demo test data
```

### Legacy Python Tools

The original Python tools (`demo.py`, `graph_builder.py`, `visualiser.py`, etc.) remain in this directory for reference but are superseded by the browser-based viewer.

---

## Related Documentation

| Document | Description |
| -------- | ----------- |
| [README.md](./README.md) | Project overview and quick start |
| [QUICK-START.md](./QUICK-START.md) | 2-minute getting started guide |
| [OPERATING-GUIDE.md](./OPERATING-GUIDE.md) | Full operating guide with all workflows |
| [ADR-LOG.md](./ADR-LOG.md) | Architecture Decision Records (13 ADRs) |

---

*OAA Ontology Visualiser v3.0.0 — Architecture & Deployment*
