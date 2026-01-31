# OAA Ontology Visualiser

Standalone, portable Python tool for visualising ontologies produced by the OAA (Ontology Architect Agent). Generates interactive browser-based graph visualisations from JSON-LD ontology files.

Migrated from VHF-App-Mk3 prototype tools (CC-102 through CC-108).

## Quick Start

```bash
cd tools/ontology-visualiser

# Set up virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run demo with sample data
python demo.py

# Visualise a specific ontology file
python demo.py path/to/ontology.json

# Visualise the Azlan agent registry
python demo.py sample-ontologies/agent-registry.json

# Run tests
python -m pytest test_ontology_tools.py -v
```

## What It Does

Takes any JSON-LD ontology file and produces:
- **Interactive HTML** (PyVis/vis.js) — zoom, pan, click, physics simulation, tooltips
- **Static images** (Matplotlib) — PNG/SVG/PDF export
- **W4M framework graphs** — 8-layer business framework visualisation
- **VSOM hierarchy** — Vision → Strategy → Objectives → Metrics
- **Value flow analysis** — path finding, bottleneck detection

## Supported Input Formats

The loader auto-detects format:
1. Standard JSON-LD (classes with `rdfs:label`, relationships)
2. Registry Entry format (`registryEntry` key)
3. UniRegistry v1.0 (`ontologyDefinition` key)
4. JSON-LD `@graph` array format
5. Inferred format (auto-detection for unknown structures)

## File Structure

```
ontology-visualiser/
├── ontology_loader.py      # JSON-LD parsing, multi-format detection
├── graph_builder.py        # NetworkX graph construction
├── visualiser.py           # PyVis/Matplotlib rendering
├── ve_domain_graphs.py     # W4M framework, VSOM, value chains
├── demo.py                 # Browser demo script
├── test_ontology_tools.py  # Unit/integration test suite
├── requirements.txt        # Python dependencies
├── README.md               # This file
└── sample-ontologies/      # Example input files
    └── agent-registry.json
```

## Usage Examples

### Load and Visualise Any Ontology

```python
from ontology_loader import load_ontology
from graph_builder import build_ontology_graph
from visualiser import render_interactive

ontology = load_ontology('my_ontology.json')
G = build_ontology_graph('my_ontology.json')
render_interactive(G, 'output.html')
```

### W4M Framework Analysis

```python
from ve_domain_graphs import VEDomainGraphBuilder

builder = VEDomainGraphBuilder()
G = builder.build_w4m_framework_graph()
analysis = builder.analyze_value_flow(G, source_layer=0, target_layer=7)
```

### Domain Filtering

```python
from visualiser import OntologyVisualiser

vis = OntologyVisualiser()
ve_graph = vis.filter_by_domain(G, 'VE', include_connected=True)
highlighted = vis.highlight_path(G, 'start_node', 'end_node')
```

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| networkx | >=3.0 | Graph data structures and algorithms |
| pyvis | >=0.3.1 | Interactive HTML visualisation (vis.js) |
| matplotlib | >=3.7 | Static image export |
| rdflib | >=7.0 | JSON-LD parsing (optional) |
| jupyter | >=1.0 | Notebook support (optional) |
| ipywidgets | >=8.0 | Interactive widgets (optional) |
| pandas | >=2.0 | Data handling (optional) |

## Output

Generated files appear in `demo_output/` (gitignored):
- `ontology_demo.html` — Interactive ontology graph
- `w4m_framework.html` — 8-layer business framework

Open any `.html` in a browser for zoom/pan, node selection, physics simulation, and hover tooltips.

## Tests

```bash
python -m pytest test_ontology_tools.py -v
```

| Module | Tests | Coverage |
|--------|-------|----------|
| ontology_loader | 6 | Format parsing, file loading, dataclasses |
| graph_builder | 4 | Graph construction, metadata, stats |
| visualiser | 3 | Domain filtering, path highlighting, HTML |
| ve_domain_graphs | 3 | W4M framework, value flow analysis |
| Integration | 1 | End-to-end pipeline |

---

**Origin:** VHF-App-Mk3 prototype (CC-102–CC-108)
**Version:** 1.0.0
**Last Updated:** January 2026
