# OAA Ontology Visualiser

Interactive browser-based graph visualiser for ontologies produced by the OAA (Ontology Architect Agent). Supports single-ontology inspection with OAA v6.1.0 compliance validation, and multi-ontology registry loading with cross-reference detection.

**Live version:** [https://ajrmooreuk.github.io/Azlan-EA-AAA/](https://ajrmooreuk.github.io/Azlan-EA-AAA/)

## Features

- **7 format auto-detection** — OAA v6.1.0 (hasDefinedTerm), JSON-LD, PF Ontology, UniRegistry, Registry Entry, Agent Registry, Generic
- **OAA v6.1.0 compliance validation** — 8 gates (G1-G6) with pass/warn/fail reporting
- **Multi-ontology registry loading** — batch load all 23 ontologies with series-based colouring and cross-ontology edge detection
- **Interactive graph** — vis.js force-directed, hierarchical, or circular layouts with zoom, pan, drag
- **Entity inspection** — sidebar with Details, Connections, Schema, and Data tabs
- **Ontology library** — IndexedDB-backed local storage with version history, export/import
- **OAA upgrade workflow** — generates Claude Code commands to fix non-compliant ontologies
- **GitHub integration** — load ontologies from private repos via PAT
- **Export** — PNG graph images, JSON audit reports

## Quick Start

Open the hosted version — no install required:

```
https://ajrmooreuk.github.io/Azlan-EA-AAA/
```

Drop a `.json` or `.jsonld` file onto the page, or click **Load Registry** to see all 23 ontologies.

For local development, serve with any HTTP server (ES modules require it):

```bash
cd PBS/TOOLS/ontology-visualiser
python -m http.server 8080
# Open http://localhost:8080/browser-viewer.html
```

## Architecture

Zero-build-step browser application using native ES modules (no bundler, no Node.js):

```
browser-viewer.html           ← HTML shell (110 lines)
├── css/viewer.css             ← All styles
└── js/
    ├── app.js                 ← Entry point, event wiring
    ├── state.js               ← Shared state + constants
    ├── ontology-parser.js     ← Format detection + parsing
    ├── graph-renderer.js      ← vis.js rendering (single + multi)
    ├── multi-loader.js        ← Registry batch loading + merged graph
    ├── audit-engine.js        ← OAA v6.1.0 validation gates
    ├── compliance-reporter.js ← Compliance panel rendering
    ├── ui-panels.js           ← Sidebar, audit, modals, tabs
    ├── library-manager.js     ← IndexedDB ontology library
    ├── github-loader.js       ← Registry integration
    └── export.js              ← PNG, audit JSON, ontology download
```

## Dependencies

Single external dependency loaded via CDN:

- **vis-network** v9.1.2 (vis.js) — graph visualisation

No npm, no build step, no bundler.

## Deployment

Deployed automatically via GitHub Pages on push to `main`. The workflow copies the visualiser, unified registry, and OAA system prompts to the Pages site.

- **Primary:** `https://ajrmooreuk.github.io/Azlan-EA-AAA/PBS/TOOLS/ontology-visualiser/browser-viewer.html`
- **Root redirect:** `https://ajrmooreuk.github.io/Azlan-EA-AAA/`

## Documentation

| Document | Description |
|----------|-------------|
| [QUICK-START.md](./QUICK-START.md) | 2-minute getting started guide |
| [OPERATING-GUIDE.md](./OPERATING-GUIDE.md) | Full operating guide with all workflows |
| [FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md](./FEATURE-SPEC-Graph-Rollup-DrillThrough-v1.0.0.md) | v3 feature specification |
| [IMPLEMENTATION-PLAN-v1.0.0.md](./IMPLEMENTATION-PLAN-v1.0.0.md) | Phased implementation plan |
| [ADR-LOG.md](./ADR-LOG.md) | Architecture Decision Records |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture reference |

## Legacy Python Tools

The original Python visualisation tools (`demo.py`, `graph_builder.py`, `visualiser.py`, etc.) remain in this directory for reference but are superseded by the browser-based viewer.

---

**Version:** 3.0.0
**Last Updated:** February 2026
