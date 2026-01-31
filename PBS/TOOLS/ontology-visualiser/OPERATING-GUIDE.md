# OAA Ontology Visualiser — Operating Guide

**Version:** 2.0.0
**Date:** 2026-01-28
**Audience:** Team members, stakeholders, and contributors

---

## Quick Start

### Option 1: Use Hosted Version (Recommended)
Open directly in browser:
```
https://ajrmooreuk.github.io/Azlan-EA-AAA/tools/ontology-visualiser/browser-viewer.html
```

### Option 2: Run Locally
1. Clone the Azlan-EA-AAA repository
2. Open `tools/ontology-visualiser/browser-viewer.html` in any modern browser
3. No server or build step required

---

## Core Workflows

### Workflow 1: Load and Visualise an Ontology

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Drop JSON   │ ──► │   Parsing    │ ──► │  Graph View  │
│    File      │     │  & Auditing  │     │ (Stabilized) │
└──────────────┘     └──────────────┘     └──────────────┘
```

**Steps:**
1. Open the visualiser in your browser
2. Drag and drop a `.json` ontology file onto the drop zone
3. Wait for stabilization (physics simulation settles the layout)
4. The graph is now interactive

**Supported Formats:**
| Format | Detection Key | Example |
|--------|--------------|---------|
| PF Ontology | `entities[]` | `{ "entities": [...] }` |
| JSON-LD | `@graph` | `{ "@graph": [...] }` |
| UniRegistry | `ontologyDefinition` | `{ "ontologyDefinition": {...} }` |
| Agent Registry | `agents[]` | `{ "agents": [...] }` |
| Generic | (fallback) | Any JSON object |

---

### Workflow 2: Inspect Entity Details

```
Click Node ──► Sidebar Opens ──► 4 Tabs Available
                                  ├── Details (ID, Type, Description)
                                  ├── Connections (Incoming/Outgoing)
                                  ├── Schema (Properties, Types)
                                  └── Data (Test instances)
```

**Steps:**
1. Single-click any node to open the sidebar
2. Use tabs to explore different aspects:
   - **Details**: Core metadata
   - **Connections**: Navigate to related entities
   - **Schema**: Property definitions and types
   - **Data**: Sample test data instances

---

### Workflow 3: Drill-Down Navigation

```
Double-Click ──► Focus + Zoom ──► Connections Tab ──► Click Related Node
     │                                                       │
     └───────────────────────────────────────────────────────┘
                         (repeat)
```

**Steps:**
1. Double-click any node
2. Graph focuses and zooms to that node
3. Connections tab opens automatically
4. Click any connection to navigate to that entity
5. Continue drilling down through the graph

---

### Workflow 4: Audit Graph Quality

```
Load Ontology ──► Audit Panel Auto-Populates
                        │
                        ├── Total Nodes/Edges
                        ├── Isolated Nodes (zero edges)
                        ├── Connected Components
                        └── Silo Warnings
```

**Steps:**
1. Load any ontology
2. Click "Audit" button in toolbar (or it opens automatically)
3. Review:
   - **Isolated Nodes**: Entities with no relationships (OAA 5.0.0 GATE 2B violation)
   - **Components**: Disconnected clusters (OAA 5.0.0 GATE 2C concern)
   - **Edge-to-Node Ratio**: Should be ≥ 0.8 for production

---

### Workflow 5: Load Test Data

```
Ontology Loaded ──► Click "+ Test Data" ──► Select JSON ──► Data Tab Populated
```

**Steps:**
1. Load an ontology first
2. Click "+ Test Data" in toolbar
3. Select a test data JSON file
4. Click on entities to see their test instances in the Data tab

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

### Workflow 6: Load from GitHub (Private Repos)

```
Click "Load from GitHub" ──► Enter PAT ──► Enter repo/path ──► Ontology Loads
```

**Steps:**
1. Click "Load from GitHub"
2. Enter your GitHub Personal Access Token (stored in session only)
3. Enter path: `owner/repo/path/to/ontology.json`
4. Ontology loads directly from GitHub

---

## Toolbar Reference

| Button | Function |
|--------|----------|
| **Open JSON File** | File picker for local ontology |
| **Physics** | Toggle force-directed physics on/off |
| **Layout** | Switch between Force, Hierarchical, Circular |
| **Fit View** | Zoom to show all nodes |
| **Export PNG** | Download graph as image |
| **Details** | Toggle sidebar panel |
| **Audit** | Toggle audit panel |
| **Load from GitHub** | Fetch from private repo |
| **+ Test Data** | Overlay test instances |

---

## Keyboard & Mouse Controls

| Action | Effect |
|--------|--------|
| **Scroll** | Zoom in/out |
| **Drag canvas** | Pan view |
| **Drag node** | Move node (physics adjusts) |
| **Click node** | Select + show details |
| **Double-click node** | Focus + drill into connections |
| **Click away** | Deselect |

---

## Visual Indicators

### Node Colors
| Color | Entity Type |
|-------|-------------|
| Green | Core / Class |
| Blue | Framework |
| Orange | Supporting |
| Pink | Agent |
| Cyan | Layer |
| Purple | Concept |
| Grey | External |
| Teal | Default |

### Edge Styles
| Style | Meaning |
|-------|---------|
| Solid | Standard relationship |
| Dashed | External/optional |

### Silo Indicators
| Visual | Meaning |
|--------|---------|
| Orange dashed border | Isolated node (zero edges) |
| Separate cluster | Disconnected component |

---

## OAA 5.0.0 Verification Workflow

Use this visualiser to verify ontologies pass the new connectivity gates:

### GATE 2B: Entity Connectivity
**Requirement:** Every entity must participate in at least one relationship.

**Verification Steps:**
1. Load the ontology
2. Open Audit panel
3. Check "Isolated Nodes" section
4. **PASS**: Zero isolated nodes listed
5. **FAIL**: Any entity with "0 edges" appears

### GATE 2C: Graph Connectivity
**Requirement:** All entities should form a single connected component.

**Verification Steps:**
1. Load the ontology
2. Open Audit panel
3. Check "Connected Components" count
4. **PASS**: 1 component
5. **WARNING**: Multiple components (may need justification)

### Relationship Density
**Requirement:** Edge-to-node ratio ≥ 0.8 for production.

**Verification Steps:**
1. Load the ontology
2. Check stats bar: `X nodes | Y edges`
3. Calculate: Y / X
4. **PASS**: Ratio ≥ 0.8
5. **WARNING**: Ratio < 0.8 (sparse connections)
6. **FAIL**: Ratio < 0.5 (blocker)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Graph doesn't appear | Check browser console for JSON parse errors |
| Nodes overlap badly | Toggle Physics ON, wait for stabilization |
| Can't see all nodes | Click "Fit View" |
| GitHub load fails | Check PAT permissions (needs `repo` scope) |
| No test data showing | Ensure testData keys match entity @id/name |
| Layout too spread | Try Hierarchical or Circular layout |

---

## Sample Files

Located in `tools/ontology-visualiser/`:

| File | Purpose |
|------|---------|
| `sample-ontology-with-data.json` | Demo ontology with embedded test data |
| `sample-test-data.json` | Standalone test data for overlay |

---

## Related Documentation

- [VISUALISER-DOCS.md](./VISUALISER-DOCS.md) — Technical architecture and API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) — Deployment options and CDN setup
- [BACKLOG.md](./BACKLOG.md) — Epics, Features, and Stories for development

---

*OAA Ontology Visualiser v2.0.0 — Operating Guide*
