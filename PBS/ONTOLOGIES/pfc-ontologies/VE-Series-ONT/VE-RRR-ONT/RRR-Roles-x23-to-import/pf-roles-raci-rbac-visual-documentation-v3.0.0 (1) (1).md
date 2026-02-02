# Platform Foundation ROLES/RACI/RBAC Ontology
## Visual Documentation & Architecture Diagrams v3.0.0

**Version:** 3.0.0  
**Date:** 2025-10-11  
**Purpose:** Comprehensive visual documentation with Mermaid diagrams

---

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Ontology Architecture Overview](#ontology-architecture-overview)
3. [Integration Architecture](#integration-architecture)
4. [Multi-Venture Role Assignment Flow](#multi-venture-role-assignment-flow)
5. [RACI Accountability Chain](#raci-accountability-chain)
6. [RBAC Permission Resolution Flow](#rbac-permission-resolution-flow)
7. [Cross-Ontology Dependencies](#cross-ontology-dependencies)
8. [Authorization Decision Flow](#authorization-decision-flow)
9. [Organizational Hierarchy Visualization](#organizational-hierarchy-visualization)
10. [Data Flow Diagrams](#data-flow-diagrams)

---

## Entity Relationship Diagram

### Complete ERD with All Entities and Relationships

```mermaid
erDiagram
    INDIVIDUAL ||--o{ ROLE-ASSIGNMENT : "has (0..*)"
    ROLE-ASSIGNMENT }o--|| ORGANIZATION : "in (1..1)"
    ROLE-ASSIGNMENT }o--|| ROLE : "assigned (1..1)"
    
    ROLE ||--o{ ROLE : "reportsTo (0..1)"
    ROLE ||--o{ ROLE : "collaboratesWith (0..*)"
    ROLE ||--o{ CAPABILITY : "has (0..*)"
    ROLE ||--o{ ACCESS-POLICY : "governedBy (0..*)"
    ROLE ||--o{ RACI-ASSIGNMENT : "assigned (0..*)"
    
    ACTIVITY ||--o{ RACI-ASSIGNMENT : "has (1..*)"
    
    ACCESS-POLICY ||--o{ PERMISSION : "grants (1..*)"
    ACCESS-POLICY }o--|| ORGANIZATION : "scopedTo (0..1)"
    
    PERMISSION ||--o{ ACCESS-CONDITION : "has (0..*)"
    
    USER }o--|| INDIVIDUAL : "linkedTo (1..1)"
    USER }o--|| ORGANIZATION : "memberOf (1..*)"
    
    INDIVIDUAL {
        string id PK
        string givenName
        string familyName
        string email
    }
    
    ROLE-ASSIGNMENT {
        string id PK
        string individualId FK
        string roleId FK
        string organizationId FK
        enum assignmentType
        float timeCommitment
        boolean isActive
        date startDate
        date endDate
    }
    
    ROLE {
        string id PK
        string roleCode
        string roleTitle
        string roleCategory
        string strategicFocus
        int seniorityLevel
    }
    
    ORGANIZATION {
        string id PK
        string name
        string type
    }
    
    RACI-ASSIGNMENT {
        string id PK
        string activityId FK
        string roleId FK
        enum raciType
        string context
    }
    
    ACTIVITY {
        string id PK
        string name
        string description
    }
    
    CAPABILITY {
        string id PK
        string capabilityName
        enum capabilityType
        enum proficiencyRequired
    }
    
    ACCESS-POLICY {
        string id PK
        string roleId FK
        string organizationId FK
        int priority
        boolean isActive
    }
    
    PERMISSION {
        string id PK
        enum action
        string resource
        enum effect
    }
    
    ACCESS-CONDITION {
        string id PK
        string attribute
        enum operator
        string value
    }
    
    USER {
        string id PK
        string username
        string individualId FK
        string primaryOrganizationId FK
    }
```

---

## Ontology Architecture Overview

### High-Level Component Architecture

```mermaid
graph TB
    subgraph "Platform Foundation Ontology Ecosystem"
        ROLES[ROLES/RACI/RBAC<br/>Ontology v3.0.0]
        
        IND[Individual<br/>Ontology]
        USER[User<br/>Ontology]
        ORG[Organization<br/>Ontology]
        VSOM[VSOM Strategy<br/>Ontology]
        SESSION[Session<br/>Ontology]
        
        ROLES -->|requires| IND
        ROLES -->|requires| USER
        ROLES -->|requires| ORG
        ROLES -->|supports| VSOM
        USER -->|requires| IND
        USER -->|tracks| SESSION
        SESSION -->|references| USER
    end
    
    subgraph "Core Concepts in ROLES/RACI/RBAC"
        R1[Executive Roles<br/>21 C-Suite Positions]
        R2[Functional Roles<br/>Operational Positions]
        R3[Role Assignments<br/>Multi-Venture Support]
        R4[RACI Framework<br/>Accountability]
        R5[RBAC System<br/>Permissions]
        R6[Capabilities<br/>Skills & Competencies]
    end
    
    ROLES --> R1
    ROLES --> R2
    ROLES --> R3
    ROLES --> R4
    ROLES --> R5
    ROLES --> R6
    
    subgraph "Business Value"
        BV1[Clear Accountability]
        BV2[Secure Access Control]
        BV3[Multi-Venture Flexibility]
        BV4[AI-Ready Authorization]
        BV5[Capability Gap Analysis]
    end
    
    R3 --> BV3
    R4 --> BV1
    R5 --> BV2
    R5 --> BV4
    R6 --> BV5
    
    style ROLES fill:#2196F3,stroke:#1976D2,stroke-width:3px,color:#fff
    style IND fill:#4CAF50,stroke:#388E3C,stroke-width:2px
    style USER fill:#4CAF50,stroke:#388E3C,stroke-width:2px
    style ORG fill:#4CAF50,stroke:#388E3C,stroke-width:2px
    style VSOM fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style SESSION fill:#FF9800,stroke:#F57C00,stroke-width:2px
```

---

## Integration Architecture

### How ROLES/RACI/RBAC Connects to Other Ontologies

```mermaid
graph LR
    subgraph "Individual Ontology"
        IND[schema:Person]
        IND_PROPS[Properties:<br/>givenName<br/>familyName<br/>email<br/>jobTitle]
    end
    
    subgraph "ROLES/RACI/RBAC Ontology"
        RA[RoleAssignment]
        ROLE[Role]
        RACI[RACIAssignment]
        POLICY[AccessPolicy]
        PERM[Permission]
    end
    
    subgraph "User Ontology"
        USER[User]
        USER_PROPS[Properties:<br/>username<br/>email<br/>accountStatus]
    end
    
    subgraph "Organization Ontology"
        ORG[Organization]
        ORG_PROPS[Properties:<br/>name<br/>type<br/>industry<br/>size]
    end
    
    subgraph "VSOM Strategy Ontology"
        STRAT[Strategy]
        VISION[Vision]
        METRICS[Metrics]
        ACTIVITY[StrategyActivity]
    end
    
    subgraph "Session Ontology"
        SESSION[UserSession]
        SESSION_PROPS[Properties:<br/>sessionId<br/>startTime<br/>context]
    end
    
    IND -->|individual| RA
    RA -->|assignedRole| ROLE
    RA -->|inOrganization| ORG
    ROLE -->|governedBy| POLICY
    POLICY -->|grantsPermission| PERM
    ROLE -->|hasRACIAssignment| RACI
    ACTIVITY -->|hasRACIAssignment| RACI
    
    USER -->|linkedTo| IND
    USER -->|memberOf| ORG
    USER -.->|inherits permissions via| RA
    
    SESSION -->|authenticatedUser| USER
    SESSION -.->|context for| PERM
    
    STRAT -->|ownedBy| ORG
    ACTIVITY -->|partOf| STRAT
    
    style RA fill:#2196F3,stroke:#1976D2,stroke-width:3px,color:#fff
    style ROLE fill:#2196F3,stroke:#1976D2,stroke-width:3px,color:#fff
    style RACI fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style POLICY fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
```

---

## Multi-Venture Role Assignment Flow

### How Individuals Hold Multiple Roles Across Organizations

```mermaid
sequenceDiagram
    participant IND as Individual<br/>(Amanda Moore)
    participant RA1 as RoleAssignment 1<br/>(BAIV)
    participant RA2 as RoleAssignment 2<br/>(W4M)
    participant ROLE_CEO as Role: CEO
    participant ROLE_CMO as Role: CMO
    participant ORG1 as Organization<br/>(BAIV)
    participant ORG2 as Organization<br/>(W4M)
    
    Note over IND: One person,<br/>multiple ventures
    
    IND->>RA1: hasRoleAssignment
    RA1->>ROLE_CEO: assignedRole
    RA1->>ORG1: inOrganization
    RA1->>RA1: assignmentType=Primary<br/>timeCommitment=80%<br/>isActive=true
    
    IND->>RA2: hasRoleAssignment
    RA2->>ROLE_CMO: assignedRole
    RA2->>ORG2: inOrganization
    RA2->>RA2: assignmentType=Advisory<br/>timeCommitment=20%<br/>isActive=true
    
    Note over IND,ORG2: Total commitment: 100%<br/>Validated by BR-005
    
    rect rgb(200, 220, 250)
        Note over RA1,ORG1: Primary Role at BAIV
        ROLE_CEO->>ORG1: Strategic Leadership
    end
    
    rect rgb(255, 220, 200)
        Note over RA2,ORG2: Advisory Role at W4M
        ROLE_CMO->>ORG2: Marketing Guidance
    end
```

---

## RACI Accountability Chain

### From Strategy to Execution via RACI

```mermaid
graph TB
    subgraph "VSOM Strategy Ontology"
        STRAT[AI Transformation<br/>Strategy]
        VISION[Vision:<br/>AI-Driven Leader]
        ACTIVITY[Strategy Activity:<br/>Develop AI Roadmap]
    end
    
    subgraph "RACI Framework"
        RACI_A[RACI Assignment<br/>Type: Accountable]
        RACI_R[RACI Assignment<br/>Type: Responsible]
        RACI_C[RACI Assignment<br/>Type: Consulted]
        RACI_I[RACI Assignment<br/>Type: Informed]
    end
    
    subgraph "ROLES Ontology"
        ROLE_CEO[Executive Role:<br/>CEO]
        ROLE_CAIO[Executive Role:<br/>CAIO]
        ROLE_CMO[Executive Role:<br/>CMO]
        ROLE_CFO[Executive Role:<br/>CFO]
    end
    
    subgraph "Individuals"
        IND_CEO[Amanda Moore<br/>via RoleAssignment]
        IND_CAIO[John Smith<br/>via RoleAssignment]
    end
    
    STRAT -->|contains| ACTIVITY
    VISION -->|guides| STRAT
    
    ACTIVITY -->|hasRACIAssignment| RACI_A
    ACTIVITY -->|hasRACIAssignment| RACI_R
    ACTIVITY -->|hasRACIAssignment| RACI_C
    ACTIVITY -->|hasRACIAssignment| RACI_I
    
    RACI_A -->|role| ROLE_CEO
    RACI_R -->|role| ROLE_CAIO
    RACI_C -->|role| ROLE_CMO
    RACI_I -->|role| ROLE_CFO
    
    ROLE_CEO -.->|filled by| IND_CEO
    ROLE_CAIO -.->|filled by| IND_CAIO
    
    Note1[BR-001: Exactly ONE<br/>Accountable per activity]
    Note2[BR-002: At least ONE<br/>Responsible per activity]
    
    RACI_A -.-> Note1
    RACI_R -.-> Note2
    
    style RACI_A fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style RACI_R fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style RACI_C fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style RACI_I fill:#2196F3,stroke:#1976D2,stroke-width:2px
```

---

## RBAC Permission Resolution Flow

### How Users Get Permissions Through Roles

```mermaid
flowchart TD
    START([User Action Request:<br/>Approve $15K Budget]) --> USER
    
    USER[User:<br/>amanda.moore@baiv.io]
    
    USER --> LINK{Linked to<br/>Individual?}
    LINK -->|Yes| IND[Individual:<br/>Amanda Moore]
    LINK -->|No| DENY1[❌ DENY:<br/>No linked individual]
    
    IND --> RA_CHECK{Active Role<br/>Assignments?}
    RA_CHECK -->|Yes| RA[RoleAssignments in BAIV:<br/>CEO (Primary, Active)]
    RA_CHECK -->|No| DENY2[❌ DENY:<br/>No active roles]
    
    RA --> ROLE[Role: CEO]
    
    ROLE --> POLICY_CHECK{Access<br/>Policies?}
    POLICY_CHECK -->|Yes| POLICIES[AccessPolicies:<br/>CEO-Full-Access<br/>priority=100]
    POLICY_CHECK -->|No| DENY3[❌ DENY:<br/>No policies]
    
    POLICIES --> PERM_CHECK{Matching<br/>Permissions?}
    PERM_CHECK -->|Yes| PERMS[Permission:<br/>action=Approve<br/>resource=Budget<br/>effect=Allow]
    PERM_CHECK -->|No| DENY4[❌ DENY:<br/>No matching permission]
    
    PERMS --> COND_CHECK{Has<br/>Conditions?}
    COND_CHECK -->|Yes| EVAL_COND{Conditions<br/>Met?}
    COND_CHECK -->|No| ALLOW
    
    EVAL_COND -->|Yes| ALLOW[✅ ALLOW]
    EVAL_COND -->|No| DENY5[❌ DENY:<br/>Conditions failed]
    
    ALLOW --> END([Action Permitted])
    
    DENY1 --> END2([Action Denied])
    DENY2 --> END2
    DENY3 --> END2
    DENY4 --> END2
    DENY5 --> END2
    
    style START fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style ALLOW fill:#4CAF50,stroke:#388E3C,stroke-width:3px,color:#fff
    style DENY1 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY2 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY3 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY4 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY5 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style END fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style END2 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
```

---

## Cross-Ontology Dependencies

### Dependency Graph and Integration Points

```mermaid
graph TD
    subgraph "Required Dependencies (MUST EXIST)"
        IND_ONT[Individual Ontology<br/>pf:ontology:individual-v1]
        USER_ONT[User Ontology<br/>pf:ontology:user-v1]
        ORG_ONT[Organization Ontology<br/>pf:ontology:organization-v1]
    end
    
    subgraph "ROLES/RACI/RBAC Ontology v3.0.0"
        ROLES_ONT[Core Ontology]
        
        RA_ENT[RoleAssignment Entity]
        ROLE_ENT[Role Entity]
        RACI_ENT[RACIAssignment Entity]
        POLICY_ENT[AccessPolicy Entity]
        
        ROLES_ONT --> RA_ENT
        ROLES_ONT --> ROLE_ENT
        ROLES_ONT --> RACI_ENT
        ROLES_ONT --> POLICY_ENT
    end
    
    subgraph "Supporting Dependencies (OPTIONAL)"
        VSOM_ONT[VSOM Strategy Ontology<br/>pf:ontology:vsom-strategy-v1]
        SESSION_ONT[Session Ontology<br/>pf:ontology:session-v1]
        PROC_ONT[Business Process Ontology<br/>pf:ontology:process-v1]
    end
    
    IND_ONT -->|schema:Person<br/>fills roles| RA_ENT
    USER_ONT -->|User accounts<br/>linked to Person| RA_ENT
    ORG_ONT -->|Organization<br/>context| RA_ENT
    ORG_ONT -->|Organization<br/>owns roles| ROLE_ENT
    
    VSOM_ONT -.->|Strategy activities<br/>have RACI| RACI_ENT
    SESSION_ONT -.->|Session context<br/>for permissions| POLICY_ENT
    PROC_ONT -.->|Process steps<br/>have RACI| RACI_ENT
    
    IND_ONT -.->|Provides| P1[Properties:<br/>name, email,<br/>jobTitle]
    USER_ONT -.->|Provides| P2[Properties:<br/>username,<br/>accountStatus]
    ORG_ONT -.->|Provides| P3[Properties:<br/>name, type,<br/>industry]
    
    INT1[Integration Point 1:<br/>RoleAssignment.individual<br/>references Person]
    INT2[Integration Point 2:<br/>User inherits permissions<br/>via Person→RoleAssignment]
    INT3[Integration Point 3:<br/>RoleAssignment.organization<br/>references Organization]
    INT4[Integration Point 4:<br/>RACI.activity references<br/>Strategy/Process activities]
    
    RA_ENT -.-> INT1
    RA_ENT -.-> INT2
    RA_ENT -.-> INT3
    RACI_ENT -.-> INT4
    
    style ROLES_ONT fill:#2196F3,stroke:#1976D2,stroke-width:4px,color:#fff
    style IND_ONT fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style USER_ONT fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style ORG_ONT fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style VSOM_ONT fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style SESSION_ONT fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style PROC_ONT fill:#FF9800,stroke:#F57C00,stroke-width:2px
```

---

## Authorization Decision Flow

### Complete Permission Resolution with Conflict Resolution

```mermaid
flowchart TD
    START([Authorization Query]) --> PARSE[Parse Request:<br/>User, Action, Resource,<br/>Organization]
    
    PARSE --> GET_USER[Get User Account]
    GET_USER --> GET_PERSON[Get Linked Person]
    GET_PERSON --> GET_RA[Get Active<br/>RoleAssignments<br/>in Organization]
    
    GET_RA --> HAS_RA{Has Active<br/>Assignments?}
    HAS_RA -->|No| DENY_NO_ROLE[❌ DENY:<br/>No active roles]
    HAS_RA -->|Yes| GET_ROLES[Collect All Roles]
    
    GET_ROLES --> GET_POLICIES[Get AccessPolicies<br/>for Each Role]
    GET_POLICIES --> HAS_POLICIES{Has<br/>Policies?}
    HAS_POLICIES -->|No| DENY_NO_POLICY[❌ DENY:<br/>No policies]
    HAS_POLICIES -->|Yes| FILTER_ORG[Filter by Organization:<br/>Include global + org-specific]
    
    FILTER_ORG --> GET_PERMS[Collect All Permissions<br/>from Policies]
    GET_PERMS --> FILTER_PERMS[Filter Permissions:<br/>Matching action + resource]
    
    FILTER_PERMS --> HAS_PERMS{Has Matching<br/>Permissions?}
    HAS_PERMS -->|No| DENY_NO_PERM[❌ DENY:<br/>No matching permissions]
    HAS_PERMS -->|Yes| EVAL_CONDITIONS[Evaluate Conditions<br/>for Each Permission]
    
    EVAL_CONDITIONS --> GROUP_BY_PRIORITY[Group by Policy Priority]
    GROUP_BY_PRIORITY --> SORT[Sort: Priority DESC,<br/>Deny before Allow]
    
    SORT --> GET_TOP[Get Highest Priority<br/>Permission]
    GET_TOP --> CHECK_EFFECT{Effect?}
    
    CHECK_EFFECT -->|Deny| DENY_EXPLICIT[❌ DENY:<br/>Explicit deny]
    CHECK_EFFECT -->|Allow| CHECK_COND{Conditions<br/>Met?}
    
    CHECK_COND -->|No| DENY_COND[❌ DENY:<br/>Conditions not met]
    CHECK_COND -->|Yes| ALLOW[✅ ALLOW]
    
    ALLOW --> LOG_ALLOW[Log Authorization:<br/>Granted]
    DENY_NO_ROLE --> LOG_DENY[Log Authorization:<br/>Denied]
    DENY_NO_POLICY --> LOG_DENY
    DENY_NO_PERM --> LOG_DENY
    DENY_EXPLICIT --> LOG_DENY
    DENY_COND --> LOG_DENY
    
    LOG_ALLOW --> END_ALLOW([✅ Access Granted])
    LOG_DENY --> END_DENY([❌ Access Denied])
    
    style START fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style ALLOW fill:#4CAF50,stroke:#388E3C,stroke-width:3px,color:#fff
    style DENY_NO_ROLE fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY_NO_POLICY fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY_NO_PERM fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY_EXPLICIT fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style DENY_COND fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
    style END_ALLOW fill:#4CAF50,stroke:#388E3C,stroke-width:3px,color:#fff
    style END_DENY fill:#F44336,stroke:#D32F2F,stroke-width:3px,color:#fff
```

---

## Organizational Hierarchy Visualization

### Example Organization Chart with Matrix Relationships

```mermaid
graph TD
    subgraph "BAIV Organization - Executive Layer"
        CEO[CEO<br/>Amanda Moore<br/>Primary 80%]
        CFO[CFO<br/>John Smith<br/>Primary 100%]
        CMO[CMO Advisory<br/>Position Available]
        CTO[CTO<br/>Sarah Johnson<br/>Fractional 40%]
        CAIO[CAIO<br/>Position Available]
    end
    
    subgraph "Functional Layer"
        MM[Marketing Manager<br/>Level 3]
        DS[Data Scientist<br/>Level 3]
        SR[Sales Rep<br/>Level 5]
    end
    
    subgraph "W4M Organization"
        CEO_W4M[CEO<br/>Different Person]
        CMO_W4M[CMO Advisory<br/>Amanda Moore<br/>Advisory 20%]
    end
    
    CEO -->|reportsTo: None| CEO
    CFO -->|reportsTo| CEO
    CMO -->|reportsTo| CEO
    CTO -->|reportsTo| CEO
    CAIO -->|reportsTo| CEO
    
    MM -->|reportsTo| CMO
    DS -->|reportsTo| CAIO
    SR -->|reportsTo| CMO
    
    CMO <-.->|collaboratesWith| CTO
    CMO <-.->|collaboratesWith| CAIO
    CTO <-.->|collaboratesWith| CAIO
    
    CEO -.->|also holds| CMO_W4M
    
    style CEO fill:#2196F3,stroke:#1976D2,stroke-width:3px,color:#fff
    style CMO_W4M fill:#FF9800,stroke:#F57C00,stroke-width:2px
    style CTO fill:#FFC107,stroke:#FFA000,stroke-width:2px
```

---

## Data Flow Diagrams

### Complete Data Flow from Individual to Permission

```mermaid
flowchart LR
    subgraph "Identity Layer"
        P[Person:<br/>Amanda Moore]
        U[User:<br/>amanda.moore@baiv.io]
    end
    
    subgraph "Assignment Layer"
        RA1[RoleAssignment 1:<br/>CEO at BAIV<br/>Primary, 80%]
        RA2[RoleAssignment 2:<br/>CMO at W4M<br/>Advisory, 20%]
    end
    
    subgraph "Role Layer"
        R1[Role: CEO<br/>seniorityLevel=1]
        R2[Role: CMO<br/>seniorityLevel=1]
    end
    
    subgraph "Context Layer"
        O1[Organization:<br/>BAIV]
        O2[Organization:<br/>W4M]
    end
    
    subgraph "Policy Layer"
        POL1[AccessPolicy:<br/>CEO-Full-Access<br/>priority=100]
        POL2[AccessPolicy:<br/>CMO-Limited-Access<br/>priority=50]
    end
    
    subgraph "Permission Layer"
        PERM1[Permission:<br/>Approve Budget<br/>Unlimited]
        PERM2[Permission:<br/>Read Strategy]
        PERM3[Permission:<br/>Approve Budget<br/>< $10K]
    end
    
    subgraph "RACI Layer"
        RACI1[RACI:<br/>Accountable for<br/>AI Strategy]
        RACI2[RACI:<br/>Consulted for<br/>Marketing Strategy]
    end
    
    P -->|linkedTo| U
    P -->|hasRoleAssignment| RA1
    P -->|hasRoleAssignment| RA2
    
    RA1 -->|assignedRole| R1
    RA1 -->|inOrganization| O1
    RA2 -->|assignedRole| R2
    RA2 -->|inOrganization| O2
    
    R1 -->|governedBy| POL1
    R2 -->|governedBy| POL2
    
    POL1 -->|grantsPermission| PERM1
    POL1 -->|grantsPermission| PERM2
    POL2 -->|grantsPermission| PERM2
    POL2 -->|grantsPermission| PERM3
    
    R1 -->|hasRACIAssignment| RACI1
    R2 -->|hasRACIAssignment| RACI2
    
    style P fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style U fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style RA1 fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style RA2 fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style PERM1 fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:#fff
```

---

## Integration Patterns

### Pattern 1: User Session to Permission Check

```mermaid
sequenceDiagram
    participant Session as User Session
    participant Auth as Auth Service
    participant User as User Ontology
    participant Roles as ROLES/RACI/RBAC<br/>Ontology
    participant Org as Organization<br/>Ontology
    
    Session->>Auth: Request: Can user<br/>perform action?
    Auth->>User: Get User by session
    User->>Roles: Get Person linked to User
    Roles->>Roles: Get RoleAssignments<br/>for Person
    Roles->>Org: Filter by Organization
    Roles->>Roles: Get Roles from<br/>RoleAssignments
    Roles->>Roles: Get AccessPolicies<br/>for Roles
    Roles->>Roles: Get Permissions<br/>from Policies
    Roles->>Roles: Evaluate conditions
    Roles->>Roles: Apply conflict resolution
    Roles-->>Auth: Authorization Decision
    Auth-->>Session: Allow/Deny
```

### Pattern 2: RACI Query to Individual Resolution

```mermaid
sequenceDiagram
    participant Query as AI Agent
    participant RACI as RACI Framework
    participant Roles as Roles Ontology
    participant Assign as RoleAssignment
    participant Person as Individual Ontology
    
    Query->>RACI: Who is Accountable<br/>for Activity X?
    RACI->>RACI: Find RACIAssignments<br/>where activity=X
    RACI->>RACI: Filter raciType=Accountable
    RACI->>Roles: Get Role from<br/>RACI assignment
    Roles-->>RACI: Role: CEO
    
    opt Resolve to Individual
        RACI->>Assign: Find active RoleAssignments<br/>for CEO role
        Assign->>Person: Get Individual
        Person-->>Query: Amanda Moore
    end
    
    RACI-->>Query: CEO (Amanda Moore)<br/>is Accountable
```

---

## Version History & Evolution

### Ontology Versioning from v1.0 to v3.0.0

```mermaid
timeline
    title ROLES/RACI/RBAC Ontology Evolution
    section v1.0 (External)
        Basic Roles : Simple role hierarchy
                    : No RACI
                    : No RBAC
    section v2.0 (External)
        RACI Added : RACI framework
                   : Basic permissions
                   : Single organization
    section v3.0.0 (Current)
        Complete System : Multi-venture support
                        : Full RBAC with conditions
                        : 21 C-Suite roles
                        : Matrix organization
                        : AI agent capabilities
                        : Cross-ontology integration
```

---

## Summary

This visual documentation provides comprehensive diagrams for understanding:

1. **Entity relationships** - Complete ERD
2. **Architecture** - Component and integration views
3. **Multi-venture patterns** - How individuals span organizations
4. **RACI accountability** - From strategy to roles
5. **RBAC authorization** - Permission resolution flow
6. **Dependencies** - Integration with other ontologies
7. **Decision flows** - Authorization logic
8. **Organizational structures** - Hierarchy and matrix
9. **Data flows** - Complete permission inheritance
10. **Integration patterns** - Common usage scenarios

All diagrams use Mermaid syntax and can be:
- Rendered in Markdown viewers
- Embedded in documentation
- Used in presentations
- Updated as the ontology evolves

---

**Version:** 3.0.0  
**Last Updated:** 2025-10-11  
**Maintained By:** Platform Foundation Team
