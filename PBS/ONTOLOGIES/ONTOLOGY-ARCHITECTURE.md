# Ontology Architecture Overview

**Version:** 1.0.0
**Date:** 2026-02-01
**Status:** Production

## Cross-Ontology Architecture Diagram

```mermaid
graph TB
    subgraph "Foundation Layer"
        ORG[("ORG-ONT<br/>Organization")]
        ORG_CTX[("OrganizationContext<br/>(Hub)")]
        ORG -->|hasContext| ORG_CTX
        ORG_CTX -->|contextBelongsTo| ORG
    end

    subgraph "Strategic Context Layer"
        VSOM[("VSOM-ONT<br/>VSOMFramework")]
        VISION["VisionComponent"]
        STRAT["StrategyComponent"]
        OBJ["ObjectivesComponent"]
        METRIC["MetricsComponent"]
        REVIEW["StrategicReviewCycle"]

        VSOM -->|hasVision| VISION
        VSOM -->|hasStrategy| STRAT
        VSOM -->|hasObjective| OBJ
        VSOM -->|hasMetric| METRIC
        VSOM -->|hasReviewCycle| REVIEW

        VISION -->|derivesFromVision| STRAT
        STRAT -->|alignedToStrategy| OBJ
        OBJ -->|trackedByMetric| METRIC
    end

    subgraph "Competitive Context Layer"
        CL[("CL-ONT<br/>CompetitiveLandscape")]
        SEGMENT["MarketSegment"]
        COMPETITOR["CompetitorProfile"]
        DYNAMIC["MarketDynamic"]
        ADVANTAGE["CompetitiveAdvantage"]
        OPPORTUNITY["StrategicOpportunity"]

        CL -->|hasSegment| SEGMENT
        CL -->|hasCompetitorProfile| COMPETITOR
        CL -->|hasMarketDynamic| DYNAMIC
        CL -->|hasAdvantage| ADVANTAGE
        CL -->|hasOpportunity| OPPORTUNITY
    end

    subgraph "Analysis Layer"
        CA[("CA-ONT<br/>CompetitiveAnalysis")]
        CA_TARGET["TargetOrganization"]
        CA_COMP["CompetitorOrganization"]
        CA_REPORT["CompetitiveAnalysis"]

        CA -->|analyzesCompetitor| CA_COMP
        CA -->|analysisFor| CA_TARGET
    end

    subgraph "Execution Layer"
        PPM[("PPM-ONT<br/>Portfolio/Programme/Project")]
        PORTFOLIO["Portfolio"]
        PROGRAMME["Programme"]
        PROJECT["Project"]

        PPM -->|hasPortfolio| PORTFOLIO
        PORTFOLIO -->|hasProgramme| PROGRAMME
        PROGRAMME -->|hasProject| PROJECT
    end

    subgraph "Supporting Ontologies"
        PE[("PE-ONT<br/>ProcessEngineering")]
        OKR[("OKR-ONT<br/>Objectives & Key Results")]
        VE[("VE-ONT<br/>ValueEngineering")]
        PMF[("PMF-ONT<br/>Product-Market Fit")]
        CE[("CE-ONT<br/>CustomerExperience")]
        RRR[("RRR-ONT<br/>Roles/RACI/RBAC")]
    end

    %% Bridge Pattern Connections
    ORG_CTX -->|hasStrategicContext| VSOM
    ORG_CTX -->|hasCompetitiveLandscape| CL
    ORG_CTX -.->|hasMarketContext| PMF
    ORG_CTX -.->|hasCustomerContext| CE
    ORG_CTX -.->|hasProcessContext| PE

    %% Cross-Ontology Iteration
    REVIEW -->|reviewsLandscape| CL
    REVIEW -->|informsStrategy| STRAT
    METRIC -->|triggersReview| REVIEW
    CL -->|informsAnalysis| CA

    %% Strategic Alignment
    STRAT -->|alignsToStrategy| CL
    PROGRAMME -.->|alignsToObjective| OBJ

    %% Future Connections (dashed)
    ORG -.->|isCompetitorOf| ORG
    COMPETITOR -.->|referencesOrg| ORG

    classDef foundation fill:#1a5f7a,stroke:#333,color:#fff
    classDef strategic fill:#57837b,stroke:#333,color:#fff
    classDef competitive fill:#c38154,stroke:#333,color:#fff
    classDef analysis fill:#884a39,stroke:#333,color:#fff
    classDef execution fill:#2c3333,stroke:#333,color:#fff
    classDef supporting fill:#4a4a4a,stroke:#333,color:#fff
    classDef entity fill:#f0f0f0,stroke:#666,color:#333

    class ORG,ORG_CTX foundation
    class VSOM,VISION,STRAT,OBJ,METRIC,REVIEW strategic
    class CL,SEGMENT,COMPETITOR,DYNAMIC,ADVANTAGE,OPPORTUNITY competitive
    class CA,CA_TARGET,CA_COMP,CA_REPORT analysis
    class PPM,PORTFOLIO,PROGRAMME,PROJECT execution
    class PE,OKR,VE,PMF,CE,RRR supporting
```

## Simplified Connection View

```mermaid
graph LR
    subgraph "Core"
        ORG[ORG-ONT]
        CTX((Context<br/>Hub))
    end

    subgraph "Strategic"
        VSOM[VSOM-ONT]
        REVIEW((Review<br/>Cycle))
    end

    subgraph "Competitive"
        CL[CL-ONT]
        CA[CA-ONT]
    end

    subgraph "Execution"
        PPM[PPM-ONT]
    end

    subgraph "Supporting"
        PE[PE-ONT]
        VE[VE-ONT]
        OKR[OKR-ONT]
        PMF[PMF-ONT]
        CE[CE-ONT]
    end

    ORG --> CTX
    CTX --> VSOM
    CTX --> CL
    CTX -.-> PE
    CTX -.-> PMF
    CTX -.-> CE

    CL --> CA
    CL <--> REVIEW
    REVIEW --> VSOM
    VSOM --> OKR
    VSOM -.-> PPM
    VSOM -.-> VE

    style ORG fill:#1a5f7a,color:#fff
    style CTX fill:#1a5f7a,color:#fff
    style VSOM fill:#57837b,color:#fff
    style REVIEW fill:#57837b,color:#fff
    style CL fill:#c38154,color:#fff
    style CA fill:#884a39,color:#fff
    style PPM fill:#2c3333,color:#fff
```

## Iteration Flow

```mermaid
sequenceDiagram
    participant M as Metrics
    participant R as StrategicReviewCycle
    participant CL as CompetitiveLandscape
    participant S as Strategy
    participant O as Objectives

    Note over M,O: Normal Cascade Flow
    S->>O: alignedToStrategy
    O->>M: trackedByMetric

    Note over M,O: Iteration Trigger
    M->>R: MetricBreach triggers
    R->>CL: reviewsLandscape
    CL-->>R: Market dynamics, competitor moves
    R->>S: informsStrategy
    R->>S: producesUpdatedStrategy (v2)

    Note over M,O: Updated Cascade
    S->>O: Updated objectives
    O->>M: New metric targets
```

## Bridge Pattern Architecture

```mermaid
graph TB
    subgraph "ORG-ONT (Foundation)"
        O[Organization]
        OC[OrganizationContext]
        O -->|hasContext| OC
    end

    subgraph "Domain Contexts"
        CL_B[hasCompetitiveLandscape]
        VS_B[hasStrategicContext]
        PM_B[hasMarketContext]
        PE_B[hasProcessContext]
        CE_B[hasCustomerContext]
    end

    subgraph "Domain Ontologies"
        CL_O[CL-ONT]
        VS_O[VSOM-ONT]
        PM_O[PMF-ONT]
        PE_O[PE-ONT]
        CE_O[CE-ONT]
    end

    OC --> CL_B --> CL_O
    OC --> VS_B --> VS_O
    OC -.-> PM_B -.-> PM_O
    OC -.-> PE_B -.-> PE_O
    OC -.-> CE_B -.-> CE_O

    style O fill:#1a5f7a,color:#fff
    style OC fill:#1a5f7a,color:#fff
    style CL_O fill:#c38154,color:#fff
    style VS_O fill:#57837b,color:#fff
```

## Graph Composition Patterns

### PF-Core Graph (Generic Template)
```mermaid
graph LR
    ORG[ORG-ONT] --> VSOM[VSOM-ONT]
    ORG --> PPM[PPM-ONT]
    VSOM --> OKR[OKR-ONT]

    style ORG fill:#1a5f7a,color:#fff
    style VSOM fill:#57837b,color:#fff
    style PPM fill:#2c3333,color:#fff
```

### PFI Instance Graph (Full Context)
```mermaid
graph LR
    ORG[ORG-ONT] --> CTX((Context))
    CTX --> VSOM[VSOM-ONT]
    CTX --> CL[CL-ONT]
    CTX --> PE[PE-ONT]
    CL --> CA[CA-ONT]
    VSOM <--> CL
    ORG --> PPM[PPM-ONT]

    style ORG fill:#1a5f7a,color:#fff
    style CTX fill:#1a5f7a,color:#fff
    style VSOM fill:#57837b,color:#fff
    style CL fill:#c38154,color:#fff
    style CA fill:#884a39,color:#fff
    style PPM fill:#2c3333,color:#fff
    style PE fill:#4a4a4a,color:#fff
```

## Ontology Status Summary

| Ontology | Version | Status | Bridge Pattern | Cross-Ontology Links |
|----------|---------|--------|----------------|---------------------|
| ORG-ONT | v2.1.0 | ✅ Production | Foundation + Hub | - |
| VSOM-ONT | v2.1.0 | ✅ Production | hasStrategicContext | CL-ONT (reviewsLandscape) |
| CL-ONT | v1.0.0 | ✅ Production | hasCompetitiveLandscape | VSOM-ONT, CA-ONT |
| CA-ONT | v2.0.0 | ✅ Production | Direct | CL-ONT |
| PPM-ONT | v3.0.0 | ✅ Production | Direct | VSOM-ONT (future) |
| PE-ONT | v2.0.0 | ✅ Production | hasProcessContext (future) | - |
| OKR-ONT | - | ⚠️ Glossary only | - | VSOM-ONT |
| VE-ONT | - | ⚠️ Docs only | - | VSOM-ONT |
| PMF-ONT | - | ⚠️ Docs only | hasMarketContext (future) | CL-ONT |
| CE-ONT | - | ⚠️ Empty | hasCustomerContext (future) | - |
| EA-ONT | - | ⏸️ ON HOLD | Instance data for PPM-ONT | - |

## Join Pattern Registry

| Pattern ID | Source | Target | Path | Use Case |
|------------|--------|--------|------|----------|
| JP-CL-001 | ORG-ONT | CL-ONT | Org→Context→Landscape | Full competitive context |
| JP-CL-002 | CL-ONT | CA-ONT | Landscape→Analysis | Analysis grounded in landscape |
| JP-CL-003 | CL-ONT | VSOM-ONT | Landscape→Strategy | Strategy-aligned positioning |
| JP-VSOM-001 | ORG-ONT | VSOM-ONT | Org→Context→VSOM | Full strategic context |
| JP-VSOM-002 | CL-ONT | VSOM-ONT | ReviewCycle→Landscape | Competitive feedback |
| JP-VSOM-003 | VSOM-ONT | VSOM-ONT | Metric→ReviewCycle | Performance-driven iteration |

---

*Part of PFC Ontologies | OAA Ontology Workbench v1.1.0*
