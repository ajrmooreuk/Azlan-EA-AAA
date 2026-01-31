# TOOLS

Utility tools and scripts for the Azlan-EA-AAA platform.

## Contents

| Directory                                      | Description                                                |
|------------------------------------------------|------------------------------------------------------------|
| [ontology-visualiser/](ontology-visualiser/)   | Interactive ontology graph visualiser (Python + Browser)   |

## Ontology Visualiser

Network graph visualisation for OAA ontologies. Supports multiple formats:

- PF Ontology (`entities[]`)
- JSON-LD with `hasDefinedTerm`
- Agent Registry
- UniRegistry

### Quick Start

```bash
# Browser version (no install required)
open PBS/TOOLS/ontology-visualiser/browser-viewer.html

# Python version
cd PBS/TOOLS/ontology-visualiser
pip install -r requirements.txt
python visualiser.py path/to/ontology.json
```

See [ontology-visualiser/README.md](ontology-visualiser/README.md) for full documentation.
