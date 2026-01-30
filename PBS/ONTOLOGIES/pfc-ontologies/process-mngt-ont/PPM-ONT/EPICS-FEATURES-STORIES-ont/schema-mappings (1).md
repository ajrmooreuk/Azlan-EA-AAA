# EFS Schema Mappings Reference

## Schema.org Foundation Mappings

This document details how EFS classes extend and map to Schema.org types, ensuring semantic interoperability.

---

## Class-to-Schema.org Mappings

| EFS Class | Schema.org Base | Rationale |
|-----------|-----------------|-----------|
| efs:BacklogItem | schema:CreativeWork | Backlog items are authored creative works representing planned functionality |
| efs:Epic | schema:Project | Epics represent bounded initiatives with defined scope |
| efs:Feature | schema:SoftwareApplication | Features are functional units within software products |
| efs:UserStory | schema:HowTo | Stories describe how users accomplish goals |
| efs:Task | schema:Action | Tasks are executable actions with agents |
| efs:Enabler | schema:CreativeWork | Enablers are authored technical specifications |
| efs:AcceptanceCriterion | schema:DefinedTerm | Acceptance criteria are defined testable terms |
| efs:Outcome | schema:Result | Outcomes are results of completed work |
| efs:Benefit | schema:MonetaryAmount | Benefits have quantifiable value |
| efs:Hypothesis | schema:Claim | Hypotheses are testable claims about value |
| efs:Capability | schema:Intangible | Capabilities are intangible organisational assets |
| efs:Theme | schema:DefinedTerm | Themes are defined strategic categories |
| efs:Risk | schema:Thing | Risks are identifiable entities |
| efs:Dependency | schema:PropertyValue | Dependencies express relationships between items |
| efs:Persona | schema:Person | Personas are archetypal user representations |
| efs:Stakeholder | schema:Person | Stakeholders are persons with product interest |
| efs:Team | schema:Organization | Teams are organisational units |
| efs:Sprint | schema:Event | Sprints are time-bound events |
| efs:Release | schema:SoftwareApplication | Releases are versioned software deliveries |

---

## Property Mappings

### Inherited Schema.org Properties

All EFS classes inherit relevant properties from their Schema.org base:

| Base Type | Inherited Properties |
|-----------|---------------------|
| schema:CreativeWork | name, description, dateCreated, dateModified, author, version |
| schema:Project | name, description, startDate, endDate |
| schema:Action | name, agent, object, startTime, endTime, actionStatus |
| schema:Person | name, email, jobTitle |
| schema:Organization | name, member, department |
| schema:Event | name, startDate, endDate, duration |

### EFS-Specific Properties

Properties prefixed with `efs:` extend the Schema.org foundation:

```json
{
  "efs:priority": {
    "rdfs:domain": "efs:BacklogItem",
    "rdfs:range": "efs:PriorityLevel",
    "rdfs:comment": "Relative importance for scheduling",
    "schema:domainIncludes": ["efs:Epic", "efs:Feature", "efs:UserStory"]
  },
  "efs:status": {
    "rdfs:domain": "efs:BacklogItem",
    "rdfs:range": "efs:BacklogItemStatus",
    "rdfs:comment": "Current workflow state",
    "schema:domainIncludes": ["efs:Epic", "efs:Feature", "efs:UserStory", "efs:Task"]
  },
  "efs:estimate": {
    "rdfs:domain": "efs:BacklogItem",
    "rdfs:range": "schema:QuantitativeValue",
    "rdfs:comment": "Effort estimation"
  }
}
```

---

## Cross-Ontology Integration Mappings

### VSOM/VSEM Integration

| EFS Class | VSOM Class | Relationship | Direction |
|-----------|------------|--------------|-----------|
| efs:Epic | vsom:StrategicObjective | achieves | EFS → VSOM |
| efs:Epic | vsom:StrategicInitiative | implements | EFS → VSOM |
| efs:Theme | vsom:StrategicInitiative | aligns | EFS → VSOM |
| efs:Outcome | vsom:StrategicKPI | measures | EFS ↔ VSOM |
| efs:Capability | vsom:OperationalCapability | maps | EFS ↔ VSOM |
| efs:Benefit | vsom:StrategicObjective | supports | EFS → VSOM |

**Semantic Mapping:**
```turtle
efs:Epic rdfs:subClassOf [
  a owl:Restriction ;
  owl:onProperty efs:alignsToObjective ;
  owl:someValuesFrom vsom:StrategicObjective
] .

efs:Outcome owl:equivalentClass [
  a owl:Restriction ;
  owl:onProperty efs:achievesObjective ;
  owl:someValuesFrom vsom:StrategicObjective
] .
```

### PMF (Product-Market Fit) Integration

| EFS Class | PMF Class | Relationship | Direction |
|-----------|-----------|--------------|-----------|
| efs:Feature | pmf:ValueProposition | delivers | EFS → PMF |
| efs:Hypothesis | pmf:FitValidation | validates | EFS → PMF |
| efs:Persona | pmf:CustomerSegment | represents | EFS → PMF |
| efs:UserStory | pmf:CustomerNeed | addresses | EFS → PMF |
| efs:Outcome | pmf:ValueProposition | validates | EFS → PMF |
| efs:Benefit | pmf:ValueElement | contributes | EFS → PMF |

**Use Case Flow:**
```
[efs:Persona] --represents--> [pmf:CustomerSegment]
     |
     v
[efs:UserStory] --addresses--> [pmf:CustomerNeed]
     |
     v
[efs:Feature] --delivers--> [pmf:ValueProposition]
     |
     v
[efs:Hypothesis] --validates--> [pmf:FitValidation]
```

### GTM (Go-To-Market) Integration

| EFS Class | GTM Class | Relationship | Direction |
|-----------|-----------|--------------|-----------|
| efs:Release | gtm:LaunchPlan | triggers | EFS → GTM |
| efs:Feature | gtm:ProductMessage | supports | EFS → GTM |
| efs:Capability | gtm:DifferentiationPoint | enables | EFS → GTM |
| efs:Release | gtm:MarketEntry | supports | EFS → GTM |

**Release-to-Launch Flow:**
```
[efs:Release (MVP)] --triggers--> [gtm:LaunchPlan]
        |
        +-- includedFeatures --> [efs:Feature]
                                      |
                                      v
                           [gtm:ProductMessage]
                                      |
                                      v
                           [gtm:MarketingCampaign]
```

---

## Module Dependency Graph

```
                    ┌──────────────────────┐
                    │  BacklogManagement   │ (CORE)
                    │  Epic, Feature,      │
                    │  UserStory, Task     │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            v                  v                  v
┌───────────────────┐  ┌───────────────┐  ┌──────────────┐
│   ValueDelivery   │  │ QualityAssur. │  │   Risk/Dep   │
│ Outcome, Benefit  │  │ Acceptance    │  │ Management   │
└─────────┬─────────┘  └───────────────┘  └──────────────┘
          │
          ├─────────────────────────────┐
          │                             │
          v                             v
┌──────────────────┐         ┌─────────────────────┐
│ StrategicAlign.  │         │  ValueValidation    │
│ Theme, Capability│←──┬─────│ Hypothesis          │
└────────┬─────────┘   │     └─────────────────────┘
         │             │              │
         │             │              │
         v             │              v
┌──────────────────┐   │     ┌─────────────────────┐
│ CapabilityDeliv. │   │     │ UserExperience      │
│ Maturity         │   │     │ Persona, JTBD       │
└──────────────────┘   │     └─────────────────────┘
                       │
          ┌────────────┘
          │
          v
┌──────────────────┐
│ ExecutionMgmt    │
│ Sprint, Task     │
└────────┬─────────┘
         │
         ├──────────────────┐
         │                  │
         v                  v
┌──────────────────┐  ┌──────────────┐
│ TeamManagement   │  │ ReleaseMgmt  │
│ Team, Velocity   │  │ Release      │
└──────────────────┘  └──────────────┘
```

---

## External Ontology Namespace Declarations

```json
{
  "@context": {
    "efs": "https://platformcore.io/ontology/efs/",
    "vsom": "https://platformcore.io/ontology/vsom/",
    "pmf": "https://platformcore.io/ontology/pmf/",
    "gtm": "https://platformcore.io/ontology/gtm/",
    "schema": "https://schema.org/",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "skos": "http://www.w3.org/2004/02/skos/core#"
  }
}
```

---

## Validation Rules

### Structural Integrity

1. Every `efs:UserStory` MUST belong to exactly one `efs:Feature`
2. Every `efs:Feature` MUST belong to at least one `efs:Epic`
3. Every `efs:Epic` SHOULD have at least one `efs:Hypothesis`
4. Every `efs:UserStory` MUST have at least one `efs:AcceptanceCriterion`

### Strategic Alignment

1. Every `efs:Epic` SHOULD link to at least one `vsom:StrategicObjective`
2. Every `efs:Theme` MUST align to a `vsom:StrategicInitiative`

### Value Validation

1. Every `efs:Release` of type MVP SHOULD trigger a `gtm:LaunchPlan`
2. Every `efs:Hypothesis` MUST have defined `efs:successCriteria`

### SHACL Shape Example

```turtle
efs:UserStoryShape a sh:NodeShape ;
    sh:targetClass efs:UserStory ;
    sh:property [
        sh:path efs:belongsToFeature ;
        sh:minCount 1 ;
        sh:maxCount 1 ;
        sh:class efs:Feature
    ] ;
    sh:property [
        sh:path efs:storyAcceptanceCriteria ;
        sh:minCount 1 ;
        sh:class efs:AcceptanceCriterion
    ] ;
    sh:property [
        sh:path efs:asA ;
        sh:minCount 1 ;
        sh:class efs:Persona
    ] .
```

---

## Query Patterns

### SPARQL: Get all features for a strategic objective

```sparql
PREFIX efs: <https://platformcore.io/ontology/efs/>
PREFIX vsom: <https://platformcore.io/ontology/vsom/>

SELECT ?feature ?featureName
WHERE {
  ?epic efs:alignsToObjective ?objective .
  ?epic efs:hasFeature ?feature .
  ?feature schema:name ?featureName .
  FILTER (?objective = vsom:ObjectiveXYZ)
}
```

### SPARQL: Get validated hypotheses contributing to PMF

```sparql
PREFIX efs: <https://platformcore.io/ontology/efs/>
PREFIX pmf: <https://platformcore.io/ontology/pmf/>

SELECT ?hypothesis ?statement ?validation
WHERE {
  ?hypothesis a efs:Hypothesis .
  ?hypothesis efs:hypothesisStatement ?statement .
  ?hypothesis efs:validationStatus efs:Validated .
  ?hypothesis efs:validatesForPMF ?validation .
}
```

### GraphQL: Get Epic with features and stories

```graphql
query GetEpicHierarchy($epicId: ID!) {
  epic(id: $epicId) {
    name
    businessOutcome {
      name
      targetValue
    }
    features {
      name
      benefitHypothesis
      stories {
        asA { name }
        iWant
        soThat
        storyPoints
      }
    }
  }
}
```
