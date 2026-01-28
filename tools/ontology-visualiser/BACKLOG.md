# OAA Ontology Visualiser — Product Backlog

**Version:** 2.0.0
**Date:** 2026-01-28
**Status:** Active Development

---

## Backlog Overview

```
EPIC 1: OAA 5.0.0 Verification        [PRIORITY: HIGH]
EPIC 2: Sub-Ontology Connections      [PRIORITY: HIGH]
EPIC 3: Enhanced Audit & Validation   [PRIORITY: MEDIUM]
EPIC 4: Export & Reporting            [PRIORITY: MEDIUM]
EPIC 5: Multi-Source Loading          [PRIORITY: LOW]
EPIC 6: Package & Distribution        [PRIORITY: LOW]
```

---

## EPIC 1: OAA 5.0.0 Verification

**Goal:** Enable visual verification that ontologies pass new OAA 5.0.0 connectivity gates

### Feature 1.1: GATE 2B Violation Highlighting

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 1.1.1 | As a user, I want isolated nodes (zero edges) highlighted with orange dashed borders so I can immediately see GATE 2B violations | 3 | ✅ Done |
| 1.1.2 | As a user, I want the Audit panel to list all isolated nodes with their IDs so I can fix them in the source | 2 | ✅ Done |
| 1.1.3 | As a user, I want to click an isolated node in the Audit panel to focus on it in the graph | 2 | Backlog |
| 1.1.4 | As a user, I want a PASS/FAIL badge for GATE 2B in the Audit panel | 1 | Backlog |

### Feature 1.2: GATE 2C Component Analysis

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 1.2.1 | As a user, I want to see the number of connected components so I know if my ontology has disconnected clusters | 2 | ✅ Done |
| 1.2.2 | As a user, I want each component colored differently so I can visually distinguish clusters | 3 | Backlog |
| 1.2.3 | As a user, I want to filter view to show only a specific component | 3 | Backlog |
| 1.2.4 | As a user, I want a PASS/WARNING badge for GATE 2C based on component count | 1 | Backlog |

### Feature 1.3: Relationship Density Metrics

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 1.3.1 | As a user, I want to see edge-to-node ratio in the stats bar | 1 | Backlog |
| 1.3.2 | As a user, I want visual indicator (green/yellow/red) based on density threshold | 2 | Backlog |
| 1.3.3 | As a user, I want to configure the density threshold (default 0.8) | 2 | Backlog |

### Feature 1.4: OAA Gate Summary Report

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 1.4.1 | As a user, I want a consolidated "OAA Gates" section showing all gate statuses | 3 | Backlog |
| 1.4.2 | As a user, I want to export a validation report as Markdown | 3 | Backlog |
| 1.4.3 | As a user, I want to copy gate results to clipboard for pasting into PRs | 2 | Backlog |

---

## EPIC 2: Sub-Ontology Connections

**Goal:** Enable visualization and management of connections between related ontologies through shared nodes and cross-references

### Architecture: Sub-Ontology Connection Model

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           ONTOLOGY LIBRARY                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐│
│   │ Foundation      │         │ Domain A        │         │ Domain B        ││
│   │ Ontology        │         │ Ontology        │         │ Ontology        ││
│   │                 │         │                 │         │                 ││
│   │  ┌───────────┐  │         │  ┌───────────┐  │         │  ┌───────────┐  ││
│   │  │ Entity:   │  │◄────────│  │ extends:  │  │         │  │ extends:  │──┼┼─┐
│   │  │ Person    │  │  refs   │  │ Customer  │  │         │  │ Vendor    │  ││ │
│   │  └───────────┘  │         │  └───────────┘  │         │  └───────────┘  ││ │
│   │                 │         │                 │         │                 ││ │
│   │  ┌───────────┐  │         │  ┌───────────┐  │◄────────│  ┌───────────┐  ││ │
│   │  │ Entity:   │  │◄────────│  │ uses:     │  │  refs   │  │ uses:     │──┼┼─┤
│   │  │ Location  │  │  refs   │  │ Address   │  │         │  │ Warehouse │  ││ │
│   │  └───────────┘  │         │  └───────────┘  │         │  └───────────┘  ││ │
│   │                 │         │                 │         │                 ││ │
│   └────────▲────────┘         └─────────────────┘         └─────────────────┘│ │
│            │                                                                  │ │
│            │                                                                  │ │
│            └──────────────────────────────────────────────────────────────────┼─┘
│                              Cross-Ontology References                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Connection Types

| Type | Description | Edge Style |
|------|-------------|------------|
| `extends` | Entity inherits from foundation entity | Solid, arrow |
| `references` | Entity points to entity in another ontology | Dashed, arrow |
| `sameAs` | Entities are equivalent across ontologies | Dotted, bidirectional |
| `imports` | Entire ontology imported as dependency | Thick, to subgraph |

### Feature 2.1: Multi-Ontology Loading

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 2.1.1 | As a user, I want to load multiple ontology files and see them merged in one graph | 5 | Backlog |
| 2.1.2 | As a user, I want each ontology visually grouped (subgraph) with a label | 3 | Backlog |
| 2.1.3 | As a user, I want to toggle visibility of individual ontologies | 3 | Backlog |
| 2.1.4 | As a user, I want to see a list of loaded ontologies with metadata | 2 | Backlog |

### Feature 2.2: Cross-Ontology Edge Detection

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 2.2.1 | As a user, I want edges that reference external entities (e.g., `foundation:Person`) to render as cross-ontology links | 5 | Backlog |
| 2.2.2 | As a user, I want cross-ontology edges styled differently (dashed, different color) | 2 | Backlog |
| 2.2.3 | As a user, I want the Audit panel to report cross-ontology dependencies | 3 | Backlog |
| 2.2.4 | As a user, I want to see which foundation entities are extended by domain ontologies | 3 | Backlog |

### Feature 2.3: Bridge Node Highlighting

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 2.3.1 | As a user, I want "bridge nodes" (entities connecting multiple ontologies) highlighted with a special indicator | 3 | Backlog |
| 2.3.2 | As a user, I want to filter to show only bridge nodes and their connections | 3 | Backlog |
| 2.3.3 | As a user, I want the Details panel to show which ontologies reference this entity | 2 | Backlog |

### Feature 2.4: Ontology Library View

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 2.4.1 | As a user, I want a "Library" panel showing all available ontologies in my workspace | 5 | Backlog |
| 2.4.2 | As a user, I want to drag ontologies from Library onto the graph to add them | 3 | Backlog |
| 2.4.3 | As a user, I want to see dependency graph of ontologies (which imports which) | 5 | Backlog |

### Sub-Ontology Connection Schema

```json
{
  "@context": {
    "pf": "https://platformfoundation.io/ontology/",
    "extends": "pf:extends",
    "references": "pf:references",
    "imports": "pf:imports"
  },
  "ontologyId": "domain-a-ontology",
  "imports": [
    "pf:foundation-ontology"
  ],
  "entities": [
    {
      "@id": "Customer",
      "extends": "pf:Person",
      "name": "Customer",
      "properties": [...]
    },
    {
      "@id": "Address",
      "references": "pf:Location",
      "name": "Address"
    }
  ],
  "relationships": [
    {
      "name": "livesAt",
      "domainIncludes": ["Customer"],
      "rangeIncludes": ["Address"],
      "crossOntology": false
    },
    {
      "name": "birthPlace",
      "domainIncludes": ["Customer"],
      "rangeIncludes": ["pf:Location"],
      "crossOntology": true
    }
  ]
}
```

---

## EPIC 3: Enhanced Audit & Validation

**Goal:** Comprehensive ontology quality analysis beyond connectivity

### Feature 3.1: Schema Validation

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 3.1.1 | As a user, I want required properties flagged if missing from entity definitions | 3 | Backlog |
| 3.1.2 | As a user, I want property type mismatches highlighted | 3 | Backlog |
| 3.1.3 | As a user, I want cardinality validation (1..*, 0..1, etc.) checked | 3 | Backlog |

### Feature 3.2: Naming Convention Checks

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 3.2.1 | As a user, I want entity names validated against PascalCase convention | 2 | Backlog |
| 3.2.2 | As a user, I want relationship names validated against camelCase convention | 2 | Backlog |
| 3.2.3 | As a user, I want @id values validated for uniqueness | 2 | Backlog |

### Feature 3.3: Completeness Scoring

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 3.3.1 | As a user, I want an overall "Completeness Score" (0-100%) based on all gates | 3 | Backlog |
| 3.3.2 | As a user, I want breakdown of score by category (connectivity, schema, naming) | 3 | Backlog |
| 3.3.3 | As a user, I want to compare scores across multiple ontologies | 5 | Backlog |

---

## EPIC 4: Export & Reporting

**Goal:** Generate artifacts for documentation and CI/CD integration

### Feature 4.1: Validation Report Export

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 4.1.1 | As a user, I want to export validation results as Markdown for PR reviews | 3 | Backlog |
| 4.1.2 | As a user, I want to export validation results as JSON for CI pipelines | 2 | Backlog |
| 4.1.3 | As a user, I want to generate a PDF report with graph snapshot | 5 | Backlog |

### Feature 4.2: Graph Export Formats

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 4.2.1 | As a user, I want to export graph as PNG with transparent background option | 2 | ✅ Done |
| 4.2.2 | As a user, I want to export graph as SVG for scalable documentation | 3 | Backlog |
| 4.2.3 | As a user, I want to export graph data as Mermaid diagram code | 3 | Backlog |
| 4.2.4 | As a user, I want to export as D3.js-compatible JSON | 2 | Backlog |

### Feature 4.3: Changelog Generation

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 4.3.1 | As a user, I want to compare two versions of an ontology and see differences | 5 | Backlog |
| 4.3.2 | As a user, I want added/removed/modified entities highlighted in diff view | 5 | Backlog |
| 4.3.3 | As a user, I want to generate a changelog Markdown from the diff | 3 | Backlog |

---

## EPIC 5: Multi-Source Loading

**Goal:** Load ontologies from various sources beyond local files

### Feature 5.1: GitHub Integration Enhancements

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 5.1.1 | As a user, I want to browse GitHub repos and select files visually | 5 | Backlog |
| 5.1.2 | As a user, I want to load from specific branches/tags | 2 | Backlog |
| 5.1.3 | As a user, I want to authenticate via GitHub OAuth instead of PAT | 5 | Backlog |

### Feature 5.2: URL Loading

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 5.2.1 | As a user, I want to paste any URL to a JSON file and load it | 3 | Backlog |
| 5.2.2 | As a user, I want to load from CDN-hosted ontology registries | 3 | Backlog |

### Feature 5.3: Local Storage

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 5.3.1 | As a user, I want recently loaded ontologies saved in browser storage | 3 | Backlog |
| 5.3.2 | As a user, I want a "Recent Files" quick-access list | 2 | Backlog |
| 5.3.3 | As a user, I want to bookmark favorite ontologies | 2 | Backlog |

---

## EPIC 6: Package & Distribution

**Goal:** Make visualiser available through standard package managers

### Feature 6.1: npm Package

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 6.1.1 | As a developer, I want to install visualiser via `npm install @baiv/ontology-visualiser` | 5 | Backlog |
| 6.1.2 | As a developer, I want TypeScript type definitions included | 3 | Backlog |
| 6.1.3 | As a developer, I want to embed visualiser as a React/Vue component | 8 | Backlog |

### Feature 6.2: CLI Tool

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 6.2.1 | As a CI pipeline, I want to run `oaa-validate ontology.json` and get exit code | 5 | Backlog |
| 6.2.2 | As a CI pipeline, I want JSON output for parsing in scripts | 2 | Backlog |
| 6.2.3 | As a developer, I want to generate PNG graphs headlessly | 5 | Backlog |

### Feature 6.3: Docker Image

**Stories:**

| ID | Story | Points | Status |
|----|-------|--------|--------|
| 6.3.1 | As a user, I want to run visualiser via `docker run -p 8080:80 baiv/ontology-visualiser` | 3 | Backlog |
| 6.3.2 | As a user, I want to mount local ontology files into container | 2 | Backlog |

---

## Priority Matrix

```
                    IMPACT
              Low    Med    High
         ┌─────────────────────────┐
    High │        │ E3,E4 │ E1,E2  │
         ├─────────────────────────┤
URGENCY Med  │        │       │        │
         ├─────────────────────────┤
    Low  │        │ E5,E6 │        │
         └─────────────────────────┘
```

**Recommended Sprint Order:**
1. EPIC 1 Features 1.3-1.4 (complete OAA 5.0.0 verification)
2. EPIC 2 Features 2.1-2.2 (sub-ontology MVP)
3. EPIC 4 Feature 4.1 (export for CI)
4. EPIC 2 Features 2.3-2.4 (full library support)
5. EPIC 3 (enhanced validation)
6. EPIC 5-6 (nice-to-have)

---

## Definition of Done

- [ ] Feature works in Chrome, Firefox, Safari
- [ ] No console errors
- [ ] OPERATING-GUIDE.md updated if UI changed
- [ ] VISUALISER-DOCS.md updated if architecture changed
- [ ] Sample files demonstrate feature
- [ ] PR reviewed and merged to main
- [ ] GitHub Pages deployment verified

---

*OAA Ontology Visualiser v2.0.0 — Product Backlog*
