# Ontology Architecture Overview

**Version:** 4.0.0
**Date:** 2026-02-06
**Status:** Production

## Directory Structure

```
PBS/ONTOLOGIES/
├── ONTOLOGY-ARCHITECTURE.md
├── MIGRATION-PLAN-OAA-v6.1.md
├── readme.md
│
├── pfc-ontologies/                    # PF-Core Ontologies (Reusable)
│   ├── README.md
│   │
│   ├── EMC-ONT/                       # Enterprise Model Composition
│   │   └── pf-EMC-ONT-v1.0.0.jsonld
│   │
│   ├── ORG-ONT/                       # Organization Foundation
│   │   ├── org-ontology-v2.1.0-oaa-v5.json
│   │   ├── glossary-v1.0.0.json
│   │   ├── registry-entry-v3.0.0.json
│   │   ├── test-data-v1.0.0.json
│   │   ├── archive/
│   │   └── ont-org-ref-files/
│   │
│   ├── ORG-CONTEXT/                   # Organization Context Hub
│   │   ├── org-context-ontology-v1.0.1.json
│   │   ├── glossary-v1.0.0.json
│   │   ├── ORG-MAT-ONT/               # Maturity (nested)
│   │   │   └── org-maturity-v1.0.0-oaa-v5.json
│   │   └── ont-competitor-ref-files/
│   │
│   ├── CA-ONT/                        # Competitive Analysis
│   │   ├── competitive-analysis-v2.1.0-oaa-v5.json
│   │   └── archive/
│   │
│   ├── CL-ONT/                        # Competitive Landscape
│   │   ├── competitive-landscape-v1.0.0-oaa-v5.json
│   │   └── archive/
│   │
│   ├── GA-ONT/                        # Gap Analysis
│   │   └── gap-analysis-v1.0.0-oaa-v5.json
│   │
│   ├── CE-ONT/                        # Customer Experience (placeholder)
│   │
│   ├── ALZ-ONT/                       # Alzheimer's/MCSB Domain
│   │   └── MCSB-Ontology-v1.0.0.jsonld
│   │
│   ├── RCSG-ONT/                      # Risk, Compliance, Security & Governance
│   │   └── GDPR-ONT/                  # GDPR Regulatory Framework
│   │       └── gdpr-regulatory-framework-v1.0.0.json
│   │
│   ├── EA-ONT/                        # Enterprise Architecture (instance data)
│   │   ├── ea-portfolio-roadmaps-*.jsonld
│   │   └── EA-RCSG-Gov-PII/           # PII Governance (Microsoft Native)
│   │       └── pii-governance-microsoft-native-v3.3.0.json
│   │
│   ├── PE-Series-ONT/                 # Process Engineering Series
│   │   ├── README.md
│   │   ├── PE-PPM-ONT/                # Portfolio/Programme/Project
│   │   │   ├── ppm-module-v3.0.0-oaa-v5.json
│   │   │   └── archive/
│   │   ├── PE-Process-Engr-ONT/       # Process Engineering
│   │   │   ├── process-engineering-v2.0.0-oaa-v5.json
│   │   │   ├── ref-ont-pe-files/
│   │   │   └── archive/
│   │   ├── PE-EFS-ONT/                # Enterprise Framework Services
│   │   │   └── efs-ontology-v1.0.0.jsonld
│   │   └── PE-Campaign-Mgr-ONT/       # Campaign Manager (placeholder)
│   │
│   └── VE-Series-ONT/                 # Value Engineering Series
│       ├── README.md
│       ├── VE-VSOM-ONT/               # Vision-Strategy-Objectives-Metrics
│       │   ├── vsom-ontology-v2.1.0-oaa-v5.json
│       │   └── archive/
│       ├── VE-OKR-ONT/                # Objectives & Key Results
│       │   ├── PFC-ONT-OKR-v1_0_0.jsonld        (legacy v1.0.0)
│       │   └── okr-ontology-v2.0.0-oaa-v6.json  (current)
│       ├── VE-RRR-ONT/                # Roles/RACI/RBAC
│       │   ├── pf-roles-raci-rbac-ontology-v3.1.0.jsonld
│       │   └── RRR-DATA-csuite-roles-v2.0.0.jsonld
│       ├── VE-VP-ONT/                 # Value Proposition
│       │   └── vp-ontology-v1.2.0.jsonld
│       ├── VE-PMF-ONT/                # Product-Market Fit
│       │   └── pmf-ontology-v1.0.0.jsonld
│       ├── VE-KPI-ONT/                # KPIs (placeholder)
│       └── archive/
│
├── pfi-ontologies/                    # PF-Instance Ontologies (placeholder)
│   └── readme.md
│
├── pfi-BAIV-AIV-ONT/                  # BAIV Instance Ontologies
│   ├── RRR-DATA-BAIV-AIV-roles-v1.0.0.jsonld
│   └── AIV-Competitive-ONT/           # AI Visibility Competitive
│
└── unified-registry/                  # Ontology Registry
    ├── ont-registry-index.json
    ├── entries/
    └── validation-reports/
```

---

## EMC-ONT: Enterprise Model Composition

EMC-ONT is the orchestration layer that maps requirement scopes to ontology compositions, enabling filtered enterprise model assembly based on context.

### EMC Composition Architecture

```mermaid
graph TB
    subgraph "EMC-ONT: Enterprise Model Composition"
        EMC[("EMC-ONT v1.0.0<br/>Orchestration Layer")]

        subgraph "Scoping Dimensions"
            SD1[contextLevel<br/>PFC / PFI]
            SD2[instanceId<br/>e.g., BAIV]
            SD3[productContext<br/>e.g., AIV]
            SD4[orgContext<br/>Client Org]
            SD5[requirementScope<br/>Category]
        end

        subgraph "Requirement Categories"
            REQ_STR[STRATEGIC]
            REQ_PROD[PRODUCT]
            REQ_PPM[PPM]
            REQ_COMP[COMPETITIVE]
            REQ_ORG[ORG-DESIGN]
            REQ_PROC[PROCESS]
            REQ_ENT[ENTERPRISE]
            REQ_AGT[AGENTIC]
        end

        subgraph "Composition Rules"
            CR1[Hub-Spoke Pattern]
            CR2[Lineage Chain Pattern]
            CR3[Bridge-Join Pattern]
        end
    end

    EMC --> SD1
    EMC --> SD2
    EMC --> SD3
    EMC --> SD4
    EMC --> SD5

    SD5 --> REQ_STR
    SD5 --> REQ_PROD
    SD5 --> REQ_PPM
    SD5 --> REQ_COMP
    SD5 --> REQ_ORG
    SD5 --> REQ_PROC
    SD5 --> REQ_ENT
    SD5 --> REQ_AGT

    EMC --> CR1
    EMC --> CR2
    EMC --> CR3

    classDef orchestration fill:#9c27b0,stroke:#6a1b9a,color:#fff
    classDef dimension fill:#03a9f4,stroke:#0277bd,color:#fff
    classDef requirement fill:#ff9800,stroke:#e65100,color:#fff
    classDef pattern fill:#4caf50,stroke:#2e7d32,color:#fff

    class EMC orchestration
    class SD1,SD2,SD3,SD4,SD5 dimension
    class REQ_STR,REQ_PROD,REQ_PPM,REQ_COMP,REQ_ORG,REQ_PROC,REQ_ENT,REQ_AGT requirement
    class CR1,CR2,CR3 pattern
```

### EMC Requirement-to-Ontology Mapping

```mermaid
flowchart LR
    subgraph "Requirement Scope"
        STRATEGIC[STRATEGIC<br/>Vision & Direction]
        PRODUCT[PRODUCT<br/>Product Development]
        PPM[PPM<br/>Project Management]
        COMPETITIVE[COMPETITIVE<br/>Market Analysis]
        ORG_DESIGN[ORG-DESIGN<br/>Organization Structure]
        PROCESS[PROCESS<br/>Process Engineering]
        ENTERPRISE[ENTERPRISE<br/>Full Model]
        AGENTIC[AGENTIC<br/>AI Build Support]
    end

    subgraph "Required Ontologies"
        VE_CORE["VE-VSOM-ONT<br/>VE-OKR-ONT<br/>VE-VP-ONT"]
        VE_PROD["VE-PMF-ONT<br/>VE-KPI-ONT<br/>CL-ONT"]
        PE_PPM["PE-PPM-ONT<br/>PE-Process-Engr-ONT"]
        COMP_SET["CA-ONT<br/>CL-ONT<br/>GA-ONT"]
        ORG_SET["ORG-ONT<br/>VE-RRR-ONT<br/>ORG-MAT-ONT"]
        PROC_SET["PE-Process-Engr-ONT<br/>PE-EFS-ONT"]
        ALL_ONT["All PFC Ontologies"]
        AGT_SET["EMC-ONT + Selected<br/>Build Orchestration"]
    end

    STRATEGIC --> VE_CORE
    PRODUCT --> VE_PROD
    PPM --> PE_PPM
    COMPETITIVE --> COMP_SET
    ORG_DESIGN --> ORG_SET
    PROCESS --> PROC_SET
    ENTERPRISE --> ALL_ONT
    AGENTIC --> AGT_SET

    style STRATEGIC fill:#1565c0,color:#fff
    style PRODUCT fill:#2e7d32,color:#fff
    style PPM fill:#6a1b9a,color:#fff
    style COMPETITIVE fill:#c62828,color:#fff
    style ORG_DESIGN fill:#ef6c00,color:#fff
    style PROCESS fill:#00838f,color:#fff
    style ENTERPRISE fill:#37474f,color:#fff
    style AGENTIC fill:#ad1457,color:#fff
```

---

## Series Hierarchy Diagram

```mermaid
graph TB
    subgraph "pfc-ontologies"
        subgraph "Orchestration"
            EMC[EMC-ONT v1.0.0]
        end

        subgraph "Foundation"
            ORG[ORG-ONT v2.1.0]
            ORG_CTX[ORG-CONTEXT v1.0.1]
            ORG_MAT[ORG-MAT-ONT v1.0.0]
            ORG --> ORG_CTX
            ORG_CTX --> ORG_MAT
        end

        subgraph "Competitive"
            CA[CA-ONT v2.1.0]
            CL[CL-ONT v1.0.0]
            GA[GA-ONT v1.0.0]
        end

        subgraph "PE-Series-ONT"
            PE_PPM[PE-PPM-ONT v3.0.0]
            PE_PROC[PE-Process-Engr-ONT v2.0.0]
            PE_EFS[PE-EFS-ONT v1.0.0]
            PE_CAMP[PE-Campaign-Mgr-ONT]
        end

        subgraph "VE-Series-ONT"
            VE_VSOM[VE-VSOM-ONT v2.1.0]
            VE_OKR[VE-OKR-ONT v2.0.0]
            VE_VP[VE-VP-ONT v1.2.0]
            VE_RRR[VE-RRR-ONT v3.1.0]
            VE_PMF[VE-PMF-ONT v1.0.0]
            VE_KPI[VE-KPI-ONT]
        end

        subgraph "RCSG-Series (Risk, Compliance, Security & Governance)"
            MCSB[MCSB-ONT v1.0.0]
            MCSB2[MCSB2-ONT]
            GDPR[GDPR-ONT v1.0.0]
            PII[PII-GOV-ONT v3.3.0]
            AZALZ[Az-ALZ-ONT]
            GDPR -->|regulatoryBasis| PII
            MCSB -.-> MCSB2
        end

        subgraph "Instance Data"
            EA[EA-ONT]
            CE[CE-ONT]
        end
    end

    subgraph "pfi-ontologies"
        PFI_BAIV[pfi-BAIV-AIV-ONT]
    end

    EMC -.->|orchestrates| ORG_CTX
    EMC -.->|orchestrates| VE_VSOM
    EMC -.->|orchestrates| PE_PPM

    classDef orchestration fill:#9c27b0,stroke:#6a1b9a,color:#fff
    classDef production fill:#2e7d32,stroke:#1b5e20,color:#fff
    classDef development fill:#1565c0,stroke:#0d47a1,color:#fff
    classDef placeholder fill:#757575,stroke:#424242,color:#fff
    classDef instance fill:#6a1b9a,stroke:#4a148c,color:#fff

    class EMC orchestration
    class ORG,ORG_CTX,ORG_MAT,CA,CL,GA,PE_PPM,PE_PROC,PE_EFS,VE_VSOM,VE_OKR,VE_VP,VE_RRR,VE_PMF,MCSB,GDPR,PII production
    class PE_CAMP,VE_KPI,CE,MCSB2,AZALZ placeholder
    class EA,PFI_BAIV instance
```

---

## PFC/PFI/Product/ORG Filtering Model

```mermaid
graph TB
    subgraph "Filter Dimensions"
        direction TB
        F1[contextLevel<br/>PFC / PFI]
        F2[instanceId<br/>null / BAIV / other]
        F3[productContext<br/>null / AIV / other]
        F4[orgRolesGovernance<br/>Client ROG rules]
        F5[orgContext<br/>Client org ID]
    end

    subgraph "Filter Flow"
        ALL[All Ontology Data]
        PFC_FILTER{contextLevel<br/>= PFC?}
        PFI_FILTER{contextLevel<br/>= PFI?}
        INST_FILTER{instanceId<br/>match?}
        PROD_FILTER{productContext<br/>match?}
        ORG_FILTER{orgContext<br/>match?}
    end

    subgraph "Result Sets"
        PFC_DATA[PF-Core Generic Data<br/>Reusable across instances]
        PFI_DATA[PF-Instance Specific<br/>Instance-filtered data]
        PROD_DATA[Product-Specific<br/>Product-filtered data]
        ORG_DATA[Org-Specific<br/>Client-filtered data]
    end

    ALL --> PFC_FILTER
    PFC_FILTER -->|Yes| PFC_DATA
    PFC_FILTER -->|No| PFI_FILTER
    PFI_FILTER -->|Yes| INST_FILTER
    INST_FILTER -->|Match| PROD_FILTER
    PROD_FILTER -->|Match| ORG_FILTER
    ORG_FILTER -->|Match| ORG_DATA
    PROD_FILTER -->|No product filter| PFI_DATA
    ORG_FILTER -->|No org filter| PROD_DATA

    F1 --> PFC_FILTER
    F1 --> PFI_FILTER
    F2 --> INST_FILTER
    F3 --> PROD_FILTER
    F4 --> ORG_FILTER
    F5 --> ORG_FILTER

    classDef filter fill:#03a9f4,stroke:#0277bd,color:#fff
    classDef decision fill:#ff9800,stroke:#e65100,color:#fff
    classDef result fill:#4caf50,stroke:#2e7d32,color:#fff

    class F1,F2,F3,F4,F5 filter
    class PFC_FILTER,PFI_FILTER,INST_FILTER,PROD_FILTER,ORG_FILTER decision
    class PFC_DATA,PFI_DATA,PROD_DATA,ORG_DATA result
```

### Role Applicability Example

```mermaid
graph LR
    subgraph "L1 C-Suite Roles"
        CEO[CEO<br/>contextLevel: PFC]
        CTO[CTO<br/>contextLevel: PFC]
        CFO[CFO<br/>contextLevel: PFC]
    end

    subgraph "L2 Architecture Roles"
        EA_ARCH[Enterprise Architect<br/>contextLevel: PFC]
        SOL_ARCH[Solutions Architect<br/>contextLevel: PFC]
    end

    subgraph "L2-L3 Platform Roles"
        AZURE_SA[Azure Solutions Architect<br/>contextLevel: PFI<br/>instanceId: BAIV]
        PP_ARCH[Power Platform Architect<br/>contextLevel: PFI<br/>instanceId: BAIV]
    end

    subgraph "L4 Application Roles"
        PROD_OWNER[Product Owner<br/>contextLevel: PFI<br/>productContext: AIV]
        AI_DEV[AI Developer<br/>contextLevel: PFI<br/>productContext: AIV]
        DATA_ENG[Data Engineer<br/>contextLevel: PFI<br/>productContext: AIV]
    end

    CEO --> EA_ARCH
    CTO --> EA_ARCH
    CTO --> AZURE_SA
    EA_ARCH --> SOL_ARCH
    SOL_ARCH --> PP_ARCH
    PP_ARCH --> PROD_OWNER
    PROD_OWNER --> AI_DEV
    PROD_OWNER --> DATA_ENG

    classDef pfc fill:#1565c0,color:#fff
    classDef pfi fill:#6a1b9a,color:#fff
    classDef prod fill:#2e7d32,color:#fff

    class CEO,CTO,CFO,EA_ARCH,SOL_ARCH pfc
    class AZURE_SA,PP_ARCH pfi
    class PROD_OWNER,AI_DEV,DATA_ENG prod
```

---

## L0-L4 Role Hierarchy (VE-RRR-ONT v3.1.0)

```mermaid
graph TB
    subgraph "L0: Enterprise Governance"
        BOARD[Board of Directors]
        CHAIR[Chairman]
        SHARE[Shareholders]
    end

    subgraph "L1: Core C-Suite"
        CEO[CEO]
        COO[COO]
        CFO[CFO]
        CTO[CTO]
        CMO[CMO]
        CHRO[CHRO]
    end

    subgraph "L1: Extended C-Suite"
        CDO[CDO<br/>Data]
        CAIO[CAIO<br/>AI]
        CPO[CPO<br/>Product]
        CIO[CIO<br/>Information]
        CSO_SEC[CSO-SEC<br/>Security]
        CSO_STR[CSO-STR<br/>Strategy]
        CRO[CRO<br/>Revenue/Risk]
        CCO[CCO<br/>Customer/Commercial]
        CLO[CLO<br/>Legal]
        CISO[CISO<br/>InfoSec]
    end

    subgraph "L2: Architecture Track"
        EA[Enterprise Architect]
        BA[Business Architect]
        DA[Data Architect]
        SA[Security Architect]
        SOL[Solutions Architect]
        TA[Technical Architect]
        IA[Integration Architect]
    end

    subgraph "L2-L3: Azure/Microsoft Platform"
        AZ_SA[Azure Solutions Architect]
        AZ_INF[Azure Infrastructure Architect]
        PP_ARCH[Power Platform Architect]
        M365_ARCH[M365 Architect]
        DYN_ARCH[Dynamics 365 Architect]
        AZ_DATA[Azure Data Architect]
        AZ_SEC[Azure Security Architect]
        AZ_DEVOPS[Azure DevOps Architect]
        FAB_ARCH[Fabric Architect]
    end

    subgraph "L4: Application Roles (Template)"
        PROD_OWN[Product Owner]
        TECH_LEAD[Technical Lead]
        UX_LEAD[UX Lead]
        DATA_ENG[Data Engineer]
        AI_DEV[AI Developer]
        QA_LEAD[QA Lead]
    end

    BOARD --> CEO
    CEO --> COO
    CEO --> CFO
    CEO --> CTO
    CEO --> CMO
    CEO --> CHRO

    CTO --> CDO
    CTO --> CAIO
    CTO --> CIO
    CTO --> CSO_SEC

    CEO --> CPO
    CEO --> CSO_STR
    CEO --> CRO
    CEO --> CCO
    CEO --> CLO

    CTO --> EA
    EA --> BA
    EA --> DA
    EA --> SA
    EA --> SOL
    EA --> TA
    EA --> IA

    CTO --> AZ_SA
    AZ_SA --> AZ_INF
    AZ_SA --> PP_ARCH
    AZ_SA --> M365_ARCH
    AZ_SA --> DYN_ARCH
    AZ_SA --> AZ_DATA
    AZ_SA --> AZ_SEC
    AZ_SA --> AZ_DEVOPS
    AZ_SA --> FAB_ARCH

    SOL --> PROD_OWN
    PROD_OWN --> TECH_LEAD
    PROD_OWN --> UX_LEAD
    TECH_LEAD --> DATA_ENG
    TECH_LEAD --> AI_DEV
    TECH_LEAD --> QA_LEAD

    classDef L0 fill:#263238,stroke:#000,color:#fff
    classDef L1 fill:#1565c0,stroke:#0d47a1,color:#fff
    classDef L1ext fill:#0277bd,stroke:#01579b,color:#fff
    classDef L2 fill:#2e7d32,stroke:#1b5e20,color:#fff
    classDef L2L3 fill:#6a1b9a,stroke:#4a148c,color:#fff
    classDef L4 fill:#ef6c00,stroke:#e65100,color:#fff

    class BOARD,CHAIR,SHARE L0
    class CEO,COO,CFO,CTO,CMO,CHRO L1
    class CDO,CAIO,CPO,CIO,CSO_SEC,CSO_STR,CRO,CCO,CLO,CISO L1ext
    class EA,BA,DA,SA,SOL,TA,IA L2
    class AZ_SA,AZ_INF,PP_ARCH,M365_ARCH,DYN_ARCH,AZ_DATA,AZ_SEC,AZ_DEVOPS,FAB_ARCH L2L3
    class PROD_OWN,TECH_LEAD,UX_LEAD,DATA_ENG,AI_DEV,QA_LEAD L4
```

---

## Value Engineering Lineage Chain

```mermaid
flowchart LR
    subgraph "Strategic Foundation"
        VSOM[VE-VSOM-ONT<br/>Vision Strategy<br/>Objectives Metrics]
    end

    subgraph "Tactical Alignment"
        OKR[VE-OKR-ONT<br/>Objectives &<br/>Key Results]
        VP[VE-VP-ONT<br/>Value<br/>Proposition]
    end

    subgraph "Market Validation"
        PMF[VE-PMF-ONT<br/>Product-Market<br/>Fit]
    end

    subgraph "Execution Framework"
        EFS[PE-EFS-ONT<br/>Enterprise<br/>Framework Services]
    end

    VSOM -->|"derivesOKR"| OKR
    OKR -->|"informsValue"| VP
    VP -->|"validatesMarket"| PMF
    PMF -->|"enablesExecution"| EFS

    style VSOM fill:#1565c0,color:#fff
    style OKR fill:#0277bd,color:#fff
    style VP fill:#00838f,color:#fff
    style PMF fill:#2e7d32,color:#fff
    style EFS fill:#6a1b9a,color:#fff
```

### Full VE-PE Integration

```mermaid
flowchart TB
    subgraph "VE-Series: Value Engineering"
        VSOM[VE-VSOM-ONT<br/>Vision Strategy]
        OKR[VE-OKR-ONT v2.0.0<br/>OKRs]
        VP[VE-VP-ONT<br/>Value Proposition]
        PMF[VE-PMF-ONT<br/>Product-Market Fit]
        RRR[VE-RRR-ONT<br/>Roles RACI RBAC]
        KPI[VE-KPI-ONT<br/>KPIs]
    end

    subgraph "PE-Series: Process Engineering"
        PPM[PE-PPM-ONT<br/>Portfolio Programme Project]
        PROC[PE-Process-Engr-ONT<br/>Process Engineering]
        EFS[PE-EFS-ONT<br/>Enterprise Framework Services]
        CAMP[PE-Campaign-Mgr-ONT<br/>Campaign Management]
    end

    subgraph "RCSG-Series: Risk, Compliance, Security & Governance"
        RCSG_GDPR[GDPR-ONT<br/>Regulatory Framework]
        RCSG_PII[PII-GOV-ONT<br/>PII Governance]
        RCSG_MCSB[MCSB-ONT<br/>Cloud Security Benchmark]
        RCSG_GDPR -->|regulatoryBasis| RCSG_PII
    end

    subgraph "Foundation"
        ORG[ORG-ONT<br/>Organization]
        CTX[ORG-CONTEXT<br/>Context Hub]
    end

    VSOM --> OKR
    OKR --> VP
    VP --> PMF
    PMF --> EFS

    VSOM -.->|"accountableRole"| RRR
    OKR -.->|"measuredBy"| KPI
    PMF -.->|"executedVia"| PPM

    PPM --> PROC
    PROC --> EFS
    EFS -.-> CAMP

    ORG --> CTX
    CTX --> VSOM
    CTX --> PPM
    CTX -.-> RRR

    RCSG_PII -.->|"governs"| ORG
    RCSG_MCSB -.->|"secures"| EFS

    classDef ve fill:#1565c0,color:#fff
    classDef pe fill:#6a1b9a,color:#fff
    classDef foundation fill:#37474f,color:#fff
    classDef rcsg fill:#9c27b0,color:#fff

    class VSOM,OKR,VP,PMF,RRR,KPI ve
    class PPM,PROC,EFS,CAMP pe
    class ORG,CTX foundation
    class RCSG_GDPR,RCSG_PII,RCSG_MCSB rcsg
```

---

## Graph Composition Patterns

### Hub-Spoke Pattern

```mermaid
graph TB
    HUB((ORG-CONTEXT<br/>Hub))

    VSOM[VE-VSOM-ONT]
    CL[CL-ONT]
    MAT[ORG-MAT-ONT]
    GA[GA-ONT]
    RRR[VE-RRR-ONT]
    PE[PE-Process-Engr-ONT]

    HUB -->|hasStrategicContext| VSOM
    HUB -->|hasCompetitiveLandscape| CL
    HUB -->|hasMaturityProfile| MAT
    HUB -->|hasGapAnalysis| GA
    HUB -->|hasRoleContext| RRR
    HUB -->|hasProcessContext| PE

    style HUB fill:#1565c0,color:#fff,stroke-width:3px
    style VSOM fill:#2e7d32,color:#fff
    style CL fill:#c62828,color:#fff
    style MAT fill:#6a1b9a,color:#fff
    style GA fill:#ef6c00,color:#fff
    style RRR fill:#00838f,color:#fff
    style PE fill:#37474f,color:#fff
```

### Lineage Chain Pattern

```mermaid
graph LR
    V[Vision] -->|derives| S[Strategy]
    S -->|aligns| O[Objectives]
    O -->|tracked by| M[Metrics]
    M -->|triggers| R[Review]
    R -->|updates| S

    style V fill:#1565c0,color:#fff
    style S fill:#0277bd,color:#fff
    style O fill:#00838f,color:#fff
    style M fill:#2e7d32,color:#fff
    style R fill:#ef6c00,color:#fff
```

### Bridge-Join Pattern

```mermaid
graph TB
    subgraph "Source Ontology A"
        A1[Entity A]
        A2[Context A]
    end

    subgraph "Bridge Layer"
        BRIDGE((Bridge<br/>Relationship))
    end

    subgraph "Target Ontology B"
        B1[Entity B]
        B2[Context B]
    end

    A1 --> A2
    A2 --> BRIDGE
    BRIDGE --> B1
    B1 --> B2

    style BRIDGE fill:#9c27b0,color:#fff,stroke-width:3px
```

---

## Agentic Build Support

EMC-ONT provides orchestration for AI-augmented solution development using ontologies as a technology-agnostic layer.

```mermaid
flowchart TB
    subgraph "Agentic Build Workflow"
        REQ[Requirements Input]
        SCOPE[Scope Analysis<br/>EMC-ONT]
        COMPOSE[Ontology Composition<br/>Select Required ONTs]
        GRAPH[Graph Assembly<br/>Connect Entities]
        GEN[Code/Schema Generation<br/>Technology Mapping]
        DEPLOY[Deployment<br/>Target Platform]
    end

    subgraph "Supporting Artifacts"
        ONT_REG[Ontology Registry]
        PATTERN_LIB[Pattern Library]
        TECH_MAP[Technology Mappings]
        VALIDATE[Validation Rules]
    end

    REQ --> SCOPE
    SCOPE --> COMPOSE
    COMPOSE --> GRAPH
    GRAPH --> GEN
    GEN --> DEPLOY

    ONT_REG --> COMPOSE
    PATTERN_LIB --> GRAPH
    TECH_MAP --> GEN
    VALIDATE --> GRAPH
    VALIDATE --> GEN

    style REQ fill:#1565c0,color:#fff
    style SCOPE fill:#9c27b0,color:#fff
    style COMPOSE fill:#6a1b9a,color:#fff
    style GRAPH fill:#2e7d32,color:#fff
    style GEN fill:#ef6c00,color:#fff
    style DEPLOY fill:#c62828,color:#fff
```

### Agentic Workflow Stages

```mermaid
sequenceDiagram
    participant U as User/Agent
    participant EMC as EMC-ONT
    participant REG as Registry
    participant ONT as Ontologies
    participant BUILD as Build System

    U->>EMC: Submit requirements
    EMC->>EMC: Analyze scope dimensions
    EMC->>REG: Query required ontologies
    REG-->>EMC: Return ontology set
    EMC->>ONT: Load & compose graph
    ONT-->>EMC: Assembled model
    EMC->>BUILD: Generate artifacts
    BUILD-->>U: Deployable solution

    Note over EMC,ONT: Tech-agnostic layer
    Note over BUILD: Platform-specific output
```

---

## Cross-Ontology Architecture Diagram

```mermaid
graph TB
    subgraph "Orchestration Layer"
        EMC[("EMC-ONT v1.0.0<br/>Enterprise Model Composition")]
    end

    subgraph "Foundation Layer"
        ORG[("ORG-ONT v2.1.0<br/>Organization")]
        ORG_CTX[("ORG-CONTEXT v1.0.1<br/>(Hub)")]
        ORG -->|hasContext| ORG_CTX
        ORG_CTX -->|contextBelongsTo| ORG
    end

    subgraph "Strategic Context Layer (VE-Series)"
        VSOM[("VE-VSOM-ONT v2.1.0<br/>VSOMFramework")]
        OKR[("VE-OKR-ONT v2.0.0<br/>OKRs")]
        VP[("VE-VP-ONT v1.2.0<br/>Value Proposition")]
        RRR[("VE-RRR-ONT v3.1.0<br/>Roles/RACI/RBAC")]
        PMF[("VE-PMF-ONT v1.0.0<br/>Product-Market Fit")]
        KPI[("VE-KPI-ONT<br/>KPIs")]

        VSOM --> OKR
        OKR --> VP
        VP --> PMF
        VSOM -.-> RRR
        VSOM -.-> KPI
    end

    subgraph "Competitive Context Layer"
        CL[("CL-ONT v1.0.0<br/>CompetitiveLandscape")]
        CA[("CA-ONT v2.1.0<br/>CompetitiveAnalysis")]
        GA[("GA-ONT v1.0.0<br/>GapAnalysis")]

        CL --> CA
        GA --> CL
    end

    subgraph "Execution Layer (PE-Series)"
        PPM[("PE-PPM-ONT v3.0.0<br/>Portfolio/Programme/Project")]
        PE[("PE-Process-Engr-ONT v2.0.0<br/>ProcessEngineering")]
        EFS[("PE-EFS-ONT v1.0.0<br/>Enterprise Framework Services")]

        PPM --> PE
        PE --> EFS
    end

    subgraph "Maturity Assessment Layer"
        MAT[("ORG-MAT-ONT v1.0.0<br/>Organization Maturity")]
    end

    subgraph "RCSG Layer (Risk, Compliance, Security & Governance)"
        GDPR[("GDPR-ONT v1.0.0<br/>Regulatory Framework")]
        PII_GOV[("PII-GOV-ONT v3.3.0<br/>PII Governance")]
        MCSB_V1[("MCSB-ONT v1.0.0<br/>Cloud Security Benchmark")]
        GDPR -->|regulatoryBasis| PII_GOV
    end

    %% EMC Orchestration
    EMC -.->|orchestrates| ORG_CTX
    EMC -.->|orchestrates| VSOM
    EMC -.->|orchestrates| PPM
    EMC -.->|orchestrates| CL

    %% Bridge Pattern Connections
    ORG_CTX -->|hasStrategicContext| VSOM
    ORG_CTX -->|hasCompetitiveLandscape| CL
    ORG_CTX -->|hasMaturityProfile| MAT
    ORG_CTX -->|hasGapAnalysis| GA
    ORG_CTX -.->|hasProcessContext| PE

    %% Cross-Layer Connections
    GA -->|strategicContext| VSOM
    PMF -->|executedVia| PPM
    VSOM -.->|alignsTo| CL

    %% RCSG Cross-Layer Connections
    PII_GOV -.->|governs| ORG
    MCSB_V1 -.->|secures| EFS

    classDef orchestration fill:#9c27b0,stroke:#6a1b9a,color:#fff
    classDef foundation fill:#1a5f7a,stroke:#333,color:#fff
    classDef strategic fill:#57837b,stroke:#333,color:#fff
    classDef competitive fill:#c38154,stroke:#333,color:#fff
    classDef execution fill:#2c3333,stroke:#333,color:#fff
    classDef maturity fill:#6b5b95,stroke:#333,color:#fff
    classDef rcsg fill:#9c27b0,stroke:#4a148c,color:#fff

    class EMC orchestration
    class ORG,ORG_CTX foundation
    class VSOM,OKR,VP,RRR,PMF,KPI strategic
    class CL,CA,GA competitive
    class PPM,PE,EFS execution
    class MAT maturity
    class GDPR,PII_GOV,MCSB_V1 rcsg
```

---

## PFI Instance Configuration: BAIV

```mermaid
graph TB
    subgraph "BAIV Instance (pfi-BAIV-AIV-ONT)"
        BAIV_ROOT[BAIV Instance<br/>instanceId: BAIV]

        subgraph "Products"
            AIV[AIV Product<br/>AI Visibility]
        end

        subgraph "Required Ontologies"
            ORG_I[ORG-ONT]
            VSOM_I[VE-VSOM-ONT]
            VP_I[VE-VP-ONT]
            PMF_I[VE-PMF-ONT]
            RRR_I[VE-RRR-ONT]
            CL_I[CL-ONT]
            CA_I[CA-ONT]
            PPM_I[PE-PPM-ONT]
        end

        subgraph "Instance-Specific Data"
            ROLES[BAIV-AIV Roles<br/>L4 Application Roles]
            COMP[AIV Competitive Data]
        end
    end

    BAIV_ROOT --> AIV
    AIV --> ROLES
    AIV --> COMP

    BAIV_ROOT --> ORG_I
    BAIV_ROOT --> VSOM_I
    BAIV_ROOT --> VP_I
    BAIV_ROOT --> PMF_I
    BAIV_ROOT --> RRR_I
    BAIV_ROOT --> CL_I
    BAIV_ROOT --> CA_I
    BAIV_ROOT --> PPM_I

    ROLES -.->|extends| RRR_I
    COMP -.->|extends| CA_I

    classDef instance fill:#6a1b9a,color:#fff
    classDef product fill:#2e7d32,color:#fff
    classDef ont fill:#1565c0,color:#fff
    classDef data fill:#ef6c00,color:#fff

    class BAIV_ROOT instance
    class AIV product
    class ORG_I,VSOM_I,VP_I,PMF_I,RRR_I,CL_I,CA_I,PPM_I ont
    class ROLES,COMP data
```

---

## Simplified Connection View

```mermaid
graph LR
    subgraph "Orchestration"
        EMC[EMC-ONT v1.0.0]
    end

    subgraph "Foundation"
        ORG[ORG-ONT v2.1.0]
        CTX((ORG-CONTEXT<br/>v1.0.1))
    end

    subgraph "VE-Series"
        VSOM[VE-VSOM-ONT v2.1.0]
        OKR[VE-OKR-ONT v2.0.0]
        VP[VE-VP-ONT v1.2.0]
        RRR[VE-RRR-ONT v3.1.0]
        PMF[VE-PMF-ONT v1.0.0]
    end

    subgraph "Competitive"
        CL[CL-ONT v1.0.0]
        CA[CA-ONT v2.1.0]
        GA[GA-ONT v1.0.0]
    end

    subgraph "Maturity"
        MAT[ORG-MAT-ONT v1.0.0]
    end

    subgraph "PE-Series"
        PPM[PE-PPM-ONT v3.0.0]
        PE[PE-Process-Engr-ONT v2.0.0]
        EFS[PE-EFS-ONT v1.0.0]
    end

    subgraph "RCSG-Series"
        GDPR[GDPR-ONT v1.0.0]
        PII_G[PII-GOV-ONT v3.3.0]
        MCSB_S[MCSB-ONT v1.0.0]
    end

    EMC -.-> CTX
    ORG --> CTX
    CTX --> VSOM
    CTX --> CL
    CTX --> MAT
    CTX --> GA

    VSOM --> OKR
    OKR --> VP
    VP --> PMF
    VSOM -.-> RRR

    CL --> CA
    GA --> CL
    GA --> VSOM

    PMF --> PPM
    PPM --> PE
    PE --> EFS

    GDPR --> PII_G
    PII_G -.-> ORG
    MCSB_S -.-> EFS

    style EMC fill:#9c27b0,color:#fff
    style ORG fill:#1a5f7a,color:#fff
    style CTX fill:#1a5f7a,color:#fff
    style VSOM fill:#57837b,color:#fff
    style OKR fill:#57837b,color:#fff
    style VP fill:#57837b,color:#fff
    style RRR fill:#57837b,color:#fff
    style PMF fill:#57837b,color:#fff
    style CL fill:#c38154,color:#fff
    style CA fill:#884a39,color:#fff
    style GA fill:#884a39,color:#fff
    style MAT fill:#6b5b95,color:#fff
    style PPM fill:#2c3333,color:#fff
    style PE fill:#2c3333,color:#fff
    style EFS fill:#2c3333,color:#fff
    style GDPR fill:#9c27b0,color:#fff
    style PII_G fill:#9c27b0,color:#fff
    style MCSB_S fill:#9c27b0,color:#fff
```

---

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

---

## Ontology Status Summary

| Series/Context | Ontology | Version | Status | Bridge Pattern | Cross-Ontology Links |
|----------------|----------|---------|--------|----------------|---------------------|
| **EMC-ONT** | EMC-ONT | v1.0.0 | ✅ Production | Orchestration Layer | All ontologies |
| **ORG-ONT** | ORG-ONT | v2.1.0 | ✅ Production | Foundation + Hub | - |
| **ORG-CONTEXT** | ORG-CONTEXT | v1.0.1 | ✅ Production | Context Hub | All domain ontologies |
| ORG-CONTEXT | ORG-MAT-ONT | v1.0.0 | ✅ Production | hasMaturityProfile | PE-Process-Engr-ONT, CE-ONT |
| ORG-CONTEXT | CL-ONT | v1.0.0 | ✅ Production | hasCompetitiveLandscape | VE-VSOM-ONT, CA-ONT |
| ORG-CONTEXT | CA-ONT | v2.1.0 | ✅ Production | Direct | ORG-ONT, CL-ONT |
| ORG-CONTEXT | GA-ONT | v1.0.0 | ✅ Production | hasGapAnalysis | VE-VSOM-ONT, CL-ONT, PE-PPM-ONT |
| ORG-CONTEXT | CE-ONT | - | ⏸️ Placeholder | hasCustomerContext (future) | ORG-MAT-ONT |
| **VE-Series-ONT** | VE-VSOM-ONT | v2.1.0 | ✅ Production | hasStrategicContext | CL-ONT (reviewsLandscape) |
| VE-Series-ONT | VE-OKR-ONT | v2.0.0 | ✅ Production (OAA v6.1.0) | - | VE-VSOM-ONT |
| VE-Series-ONT | VE-VP-ONT | v1.2.0 | ✅ Production | - | VE-VSOM-ONT, VE-OKR-ONT |
| VE-Series-ONT | VE-RRR-ONT | v3.1.0 | ✅ Production | hasRoleContext | VE-VSOM-ONT (L0-L4 roles) |
| VE-Series-ONT | VE-PMF-ONT | v1.0.0 | ✅ Production | hasMarketContext | CL-ONT, VE-VP-ONT |
| VE-Series-ONT | VE-KPI-ONT | - | ⏸️ Placeholder | - | VE-VSOM-ONT |
| **PE-Series-ONT** | PE-PPM-ONT | v3.0.0 | ✅ Production | Direct | VE-VSOM-ONT |
| PE-Series-ONT | PE-Process-Engr-ONT | v2.0.0 | ✅ Production | hasProcessContext | ORG-MAT-ONT |
| PE-Series-ONT | PE-EFS-ONT | v1.0.0 | ✅ Production | - | VE-PMF-ONT, PE-Process-Engr-ONT |
| PE-Series-ONT | PE-Campaign-Mgr-ONT | - | ⏸️ Placeholder | - | PE-PPM-ONT |
| **RCSG-Series** | GDPR-ONT | v1.0.0 | ✅ Production (OAA v6.1.0) | Regulatory Layer | PII-GOV-ONT |
| RCSG-Series | PII-GOV-ONT | v3.3.0 | ✅ Production (OAA v6.1.0) | implementsFramework | GDPR-ONT, MCSB-ONT, ORG-ONT |
| RCSG-Series | MCSB-ONT (v1) | v1.0.0 | ✅ Production | secures | PE-EFS-ONT |
| RCSG-Series | MCSB2-ONT (v2) | - | ⏸️ Placeholder | - | MCSB-ONT |
| RCSG-Series | Az-ALZ-ONT | - | ⏸️ Placeholder | - | MCSB-ONT |
| **Instance** | EA-ONT | - | ⏸️ ON HOLD | Instance data for PE-PPM-ONT | - |
| **pfi-BAIV-AIV-ONT** | AIV-Competitive-ONT | v1.0.0 | ✅ Production | - | CA-ONT, CL-ONT |
| pfi-BAIV-AIV-ONT | RRR-DATA-BAIV-AIV-roles | v1.0.0 | ✅ Production | - | VE-RRR-ONT |

---

## Join Pattern Registry

| Pattern ID | Source | Target | Path | Use Case |
|------------|--------|--------|------|----------|
| JP-EMC-001 | EMC-ONT | ORG-CONTEXT | EMC→Context | Model composition orchestration |
| JP-EMC-002 | EMC-ONT | VE-VSOM-ONT | EMC→Strategy | Strategic model composition |
| JP-EMC-003 | EMC-ONT | PE-PPM-ONT | EMC→Execution | Execution model composition |
| JP-ORG-001 | ORG-ONT | ORG-CONTEXT | Org→Context | Context hub access |
| JP-CL-001 | ORG-CONTEXT | CL-ONT | Context→Landscape | Full competitive context |
| JP-CL-002 | CL-ONT | CA-ONT | Landscape→Analysis | Analysis grounded in landscape |
| JP-CL-003 | CL-ONT | VE-VSOM-ONT | Landscape→Strategy | Strategy-aligned positioning |
| JP-VSOM-001 | ORG-CONTEXT | VE-VSOM-ONT | Context→VSOM | Full strategic context |
| JP-VSOM-002 | CL-ONT | VE-VSOM-ONT | ReviewCycle→Landscape | Competitive feedback |
| JP-VSOM-003 | VE-VSOM-ONT | VE-VSOM-ONT | Metric→ReviewCycle | Performance-driven iteration |
| JP-VE-001 | VE-VSOM-ONT | VE-OKR-ONT | VSOM→OKR | Strategic to tactical |
| JP-VE-002 | VE-OKR-ONT | VE-VP-ONT | OKR→VP | Tactical to value |
| JP-VE-003 | VE-VP-ONT | VE-PMF-ONT | VP→PMF | Value to market fit |
| JP-VE-004 | VE-PMF-ONT | PE-EFS-ONT | PMF→EFS | Market fit to execution |
| JP-MAT-001 | ORG-CONTEXT | ORG-MAT-ONT | Context→MaturityProfile | Organization maturity assessment |
| JP-GA-001 | ORG-CONTEXT | GA-ONT | Context→GapAnalysis | Connect org to gap analysis |
| JP-GA-002 | GA-ONT | VE-VSOM-ONT | Analysis→strategicContext | Strategic alignment |
| JP-GA-003 | GA-ONT | CL-ONT | Analysis→analysesLandscape | Competitive grounding |
| JP-GA-004 | GA-ONT | PE-PPM-ONT | Recommendation→spawnsProject | Execution handoff |
| JP-PE-001 | ORG-CONTEXT | PE-Process-Engr-ONT | Context→ProcessContext | Process engineering link |
| JP-PE-002 | PE-PPM-ONT | PE-Process-Engr-ONT | PPM→Process | Project process definitions |
| JP-PE-003 | PE-Process-Engr-ONT | PE-EFS-ONT | Process→EFS | Process to framework services |
| JP-RRR-001 | ORG-CONTEXT | VE-RRR-ONT | Context→Roles | Role context access |
| JP-RRR-002 | VE-VSOM-ONT | VE-RRR-ONT | VSOM→RRR | Accountability mapping |
| JP-RCSG-001 | GDPR-ONT | PII-GOV-ONT | GDPR→PII | Regulatory basis for PII governance |
| JP-RCSG-002 | PII-GOV-ONT | ORG-ONT | PII→ORG | PII governance of org data |
| JP-RCSG-003 | MCSB-ONT | PE-EFS-ONT | MCSB→EFS | Security controls for framework services |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Production - OAA v5.0.0 or v6.1.0 compliant |
| ⚠️ | Development - Docs/Glossary only |
| ⏸️ | Placeholder - Empty or on hold |
| → | Direct relationship |
| -.-> | Future/planned relationship |
| (( )) | Hub/Orchestration node |

---

*Part of PFC Ontologies | Azlan-EA-AAA Repository*
*OAA Ontology Workbench v1.1.0 | OAA v6.1.0 (8-gate)*
*EMC-ONT Composition Engine v1.0.0*
