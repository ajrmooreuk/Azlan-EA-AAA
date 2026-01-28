# EFS (Epic-Features-Stories) Ontology

## Modular Specification Ontology for Idea-to-Execution

The EFS Ontology provides a semantic framework for managing product development specifications from strategic alignment through market release. It is designed as a **pluggable module** within a broader ontology ecosystem:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ONTOLOGY ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐ │
│  │  VSOM    │────▶│   EFS    │────▶│   PMF    │────▶│  GTM   │ │
│  │ Strategy │     │   Spec   │     │ Validate │     │ Market │ │
│  └──────────┘     └──────────┘     └──────────┘     └────────┘ │
│                                                                 │
│  Vision ─────▶ Epic ──────▶ Hypothesis ────▶ Launch            │
│  Objective ──▶ Feature ───▶ Fit Score ─────▶ Message           │
│  KPI ────────▶ Outcome ───▶ Validation ────▶ Readiness         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
efs-ontology/
├── efs-ontology.jsonld          # Core ontology specification (JSON-LD)
├── EFS-ONTOLOGY-SPEC.md         # Human-readable specification document
├── README.md                    # This file
│
├── references/
│   └── schema-mappings.md       # Schema.org mappings & cross-ontology integration
│
├── diagrams/
│   └── efs-architecture.mermaid # Mermaid diagrams for visualization
│
└── interfaces/
    ├── pmf-interface.jsonld     # PMF ontology connection interface (stub)
    └── gtm-interface.jsonld     # GTM ontology connection interface (stub)
```

---

## Quick Start

### 1. Core Ontology Import

```javascript
// Load the EFS ontology
const efsOntology = await fetch('./efs-ontology.jsonld').then(r => r.json());

// Access class definitions
const epicClass = efsOntology.hasDefinedTerm.find(c => c['@id'] === 'efs:Epic');
```

### 2. Module Selection

Select modules based on your organisation's maturity:

| Stage | Recommended Modules |
|-------|---------------------|
| **Startup** | BacklogManagement, ValueValidation, UserExperience |
| **Growth** | + ValueDelivery, ExecutionManagement, ReleaseManagement |
| **Scale** | + StrategicAlignment, QualityAssurance, TeamManagement |
| **Enterprise** | All modules |

### 3. Integration with Value Proposition

```json
{
  "@type": "efs:Feature",
  "@id": "feature:payment-integration",
  "name": "Payment Gateway Integration",
  "efs:deliversValue": {
    "@type": "pmf:ValueProposition",
    "@id": "vp:seamless-checkout"
  },
  "efs:enablesCapability": {
    "@type": "efs:Capability",
    "@id": "cap:digital-payments"
  }
}
```

---

## Integration Points

### Upstream: VSOM/VSEM (Strategy)

EFS connects to strategic planning via:

| EFS Class | VSOM Class | Relationship |
|-----------|------------|--------------|
| Epic | StrategicObjective | achieves |
| Theme | StrategicInitiative | aligns |
| Outcome | StrategicKPI | measures |

### Parallel: PMF (Validation)

EFS supports product-market fit validation via:

| EFS Class | PMF Class | Relationship |
|-----------|-----------|--------------|
| Feature | ValueProposition | delivers |
| Hypothesis | FitValidation | validates |
| Persona | CustomerSegment | represents |

### Downstream: GTM (Market)

EFS triggers go-to-market activities via:

| EFS Class | GTM Class | Relationship |
|-----------|-----------|--------------|
| Release | LaunchPlan | triggers |
| Feature | ProductMessage | supports |
| Capability | DifferentiationPoint | enables |

---

## Key Design Decisions

### 1. Schema.org Foundation
All classes extend Schema.org types for semantic interoperability and knowledge graph compatibility.

### 2. Modular Architecture
Modules can be deployed independently. Core modules (BacklogManagement, ValueDelivery) provide essential functionality; extension modules add capabilities progressively.

### 3. Lean/Agile Native
Hypothesis validation, MVP scoping, and iterative delivery are first-class concepts, not afterthoughts.

### 4. Interface-First Integration
External ontology connections are defined through explicit interfaces with clear cardinality and relationship semantics.

---

## Usage Scenarios

### Scenario 1: Startup MVP Planning

```
1. Load: BacklogManagement + ValueValidation
2. Create: Epic with mvpScope features
3. Define: Hypotheses for each core feature
4. Connect: Hypotheses → pmf:FitValidation
5. Track: ValidationStatus progression
```

### Scenario 2: Enterprise Strategic Alignment

```
1. Load: All modules including StrategicAlignment
2. Map: Themes → vsom:StrategicInitiative
3. Trace: Epics → vsom:StrategicObjective
4. Measure: Outcomes → vsom:StrategicKPI
5. Report: Strategic delivery dashboards
```

### Scenario 3: Product Launch Coordination

```
1. Load: ReleaseManagement + GTM interface
2. Define: Release with includedFeatures
3. Set: marketReadiness criteria
4. Trigger: gtm:LaunchPlan on release approval
5. Track: Launch readiness checkpoints
```

---

## Extending the Ontology

### Adding Custom Properties

```json
{
  "@context": {
    "efs": "https://platformcore.io/ontology/efs/",
    "myorg": "https://myorg.com/ontology/"
  },
  "@type": "efs:Feature",
  "myorg:complianceCategory": "SOX",
  "myorg:dataClassification": "Confidential"
}
```

### Creating Custom Modules

1. Define classes extending EFS base classes
2. Declare module in `efs:modules`
3. Specify dependencies
4. Document integration points

---

## Roadmap

### v1.1.0 (Planned)
- SHACL validation shapes
- GraphQL schema generation
- Tool integration templates (Jira, Azure DevOps)

### v1.2.0 (Planned)
- Full PMF ontology implementation
- Full GTM ontology implementation
- Cross-ontology SPARQL query library

### v2.0.0 (Future)
- AI/ML model integration for estimation
- Natural language story generation
- Automated hypothesis testing framework

---

## Related Resources

- **VSOM/VSEM Skill**: Strategic planning framework
- **Schema.org**: https://schema.org/
- **JSON-LD**: https://json-ld.org/
- **SAFe Framework**: https://scaledagileframework.com/

---

## License

MIT License - Free for commercial and non-commercial use.

---

## Contributing

Contributions welcome via pull request. Please ensure:
- Schema.org alignment maintained
- Module boundaries respected
- Integration interfaces documented
- Mermaid diagrams updated

---

*Part of the PlatformCore Ontology Ecosystem*
