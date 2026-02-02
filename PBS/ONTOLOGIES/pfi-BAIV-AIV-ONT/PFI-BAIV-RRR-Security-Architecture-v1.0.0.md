# PFC-PFI RRR-RBAC-EFS Security Architecture

**Document Version:** 1.0.0
**Date:** 2026-02-02
**Product:** BAIV AI Visibility Platform
**Schema Conformance:** `pf:RRR-ONT-v3.1.0` | `pf:EFS-ONT-v1.0`

---

## 1. Architecture Overview

### 1.1 Security Layer Stack

```mermaid
flowchart TB
    subgraph "Application Layer"
        UI[React UI Components]
        API[Next.js API Routes]
    end

    subgraph "Security Middleware"
        AUTH[Supabase Auth]
        JWT[JWT Validation]
        CTX[Tenant Context Middleware]
    end

    subgraph "Database Security"
        RLS[Row-Level Security]
        AUDIT[Audit Triggers]
        FUNC[Security Functions]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL)]
    end

    UI --> API
    API --> AUTH
    AUTH --> JWT
    JWT --> CTX
    CTX --> RLS
    RLS --> DB
    API --> AUDIT
    AUDIT --> DB
    CTX --> FUNC
    FUNC --> DB

    style AUTH fill:#e1f5fe
    style RLS fill:#fff3e0
    style AUDIT fill:#fce4ec
```

The BAIV security architecture implements defense-in-depth through three distinct layers. The **Application Layer** handles user interaction and API routing. The **Security Middleware** performs authentication via Supabase Auth, validates JWT tokens, and establishes tenant context for every request. The **Database Security** layer enforces Row-Level Security policies, ensuring tenant isolation cannot be bypassed even if application-level bugs exist.

This layered approach ensures that security is enforced at multiple checkpoints, with the database serving as the final authority on data access. Each layer operates independently, so a failure in one layer cannot compromise the security guarantees of others.

---

### 1.2 Multi-Tenant Architecture

```mermaid
flowchart LR
    subgraph "Platform Tier"
        PFI[PFI Owner]
        ADMIN[Admin]
    end

    subgraph "Agency Tier"
        AA[Agency Admin]
        subgraph "Agency A Clients"
            C1[Client 1]
            C2[Client 2]
        end
    end

    subgraph "Direct Client Tier"
        CA[Client Admin]
        CM[Client Manager]
        CV[Client Analyst]
    end

    subgraph "Tenant Isolation"
        T1[(Tenant A Data)]
        T2[(Tenant B Data)]
        T3[(Tenant C Data)]
    end

    PFI -.->|Cross-Tenant| T1
    PFI -.->|Cross-Tenant| T2
    PFI -.->|Cross-Tenant| T3

    ADMIN -.->|Cross-Tenant| T1
    ADMIN -.->|Cross-Tenant| T2

    AA -->|Agency Scope| C1
    AA -->|Agency Scope| C2
    C1 -->|Own Tenant| T1
    C2 -->|Own Tenant| T2

    CA -->|Own Tenant| T3
    CM -->|Own Tenant| T3
    CV -->|Own Tenant| T3

    style PFI fill:#ffcdd2
    style ADMIN fill:#ffcdd2
    style AA fill:#c8e6c9
    style CA fill:#bbdefb
```

The multi-tenant architecture separates access into three distinct tiers. **Platform Tier** roles (PFI Owner, Admin) have cross-tenant visibility for platform operations. **Agency Tier** roles manage a portfolio of client tenants with scoped access to their assigned clients only. **Direct Client Tier** roles operate within a single tenant boundary.

Tenant isolation is enforced at the database level through RLS policies. Every query automatically filters by `tenant_id = current_setting('app.current_tenant_id')::UUID`, ensuring data cannot leak across tenant boundaries regardless of application logic.

---

## 2. Role Hierarchy & RBAC Model

### 2.1 Role Hierarchy Tree

```mermaid
flowchart TD
    PFI[("PFI Owner<br/>Level 1")]

    ADMIN[("Admin<br/>Level 2")]

    AA[("Agency Admin<br/>Level 2")]
    CA[("Client Admin<br/>Level 2")]
    AFF[("Affiliate<br/>Level 3")]

    AM[("Agency Manager<br/>Level 3")]
    CM[("Client Manager<br/>Level 3")]

    AN[("Agency Analyst<br/>Level 4")]
    CAN[("Client Analyst<br/>Level 4")]

    CV[("Client Viewer<br/>Level 5")]
    API[("API Only<br/>Level 5")]

    PFI --> ADMIN
    ADMIN --> AA
    ADMIN --> CA
    ADMIN --> AFF
    ADMIN --> API

    AA --> AM
    AM --> AN

    CA --> CM
    CA --> CV
    CM --> CAN

    style PFI fill:#d32f2f,color:#fff
    style ADMIN fill:#f57c00,color:#fff
    style AA fill:#388e3c,color:#fff
    style CA fill:#1976d2,color:#fff
    style AM fill:#66bb6a
    style CM fill:#42a5f5
    style AN fill:#a5d6a7
    style CAN fill:#90caf9
    style CV fill:#e3f2fd
    style AFF fill:#ffe0b2
    style API fill:#f5f5f5
```

The role hierarchy follows a strict seniority model where Level 1 represents maximum authority and Level 5 represents minimum. Each role can only invite users at their level or below, preventing privilege escalation. The hierarchy branches into three tracks: **Agency** (green), **Client** (blue), and **Limited Access** (orange/gray).

This structure maps directly to the RRR-ONT v3.1.0 schema's `seniorityLevel` property, enabling automated permission resolution and RACI matrix generation.

---

### 2.2 Permission Matrix Flow

```mermaid
flowchart LR
    subgraph "Role Definition"
        ROLE[Role Instance]
        RACI[RACI Assignments]
    end

    subgraph "Access Policy"
        POLICY[rbac:AccessPolicy]
        PERMS[Permissions Set]
    end

    subgraph "Permission Resolution"
        ACTION{Action?}
        RESOURCE{Resource?}
        SCOPE{Tenant Scope?}
    end

    subgraph "Decision"
        ALLOW[ALLOW]
        DENY[DENY]
    end

    ROLE --> RACI
    ROLE --> POLICY
    POLICY --> PERMS

    PERMS --> ACTION
    ACTION -->|Valid| RESOURCE
    ACTION -->|Invalid| DENY
    RESOURCE -->|Permitted| SCOPE
    RESOURCE -->|Forbidden| DENY
    SCOPE -->|In Scope| ALLOW
    SCOPE -->|Out of Scope| DENY

    style ALLOW fill:#c8e6c9
    style DENY fill:#ffcdd2
```

Permission resolution follows a three-step evaluation: **Action** (is the operation type allowed?), **Resource** (is this resource type accessible?), and **Scope** (is this specific resource within tenant boundaries?). All three checks must pass for access to be granted.

This model aligns with the `rbac:Permission` entity which defines `action`, `resource`, and `effect` properties, while tenant scope is evaluated dynamically via the security context.

---

## 3. Authentication Flow

### 3.1 Multi-Tenant Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React App
    participant AUTH as Supabase Auth
    participant API as API Routes
    participant CTX as Context Middleware
    participant DB as PostgreSQL

    U->>UI: Login Request
    UI->>AUTH: Authenticate (Email/OAuth/Magic)
    AUTH-->>UI: JWT Token

    UI->>API: API Request + JWT
    API->>AUTH: Validate JWT
    AUTH-->>API: User Claims

    API->>DB: Get User Tenants
    DB-->>API: [Tenant A, Tenant B]

    alt Multiple Tenants
        API-->>UI: Show Tenant Selector
        U->>UI: Select Tenant A
        UI->>API: Set Active Tenant
    else Single Tenant
        API->>API: Auto-select Tenant
    end

    API->>CTX: set_tenant_context(tenant_id, user_id, role)
    CTX->>DB: SET app.current_tenant_id
    CTX->>DB: SET app.current_user_id
    CTX->>DB: SET app.current_role

    API->>DB: Query with RLS
    DB-->>API: Filtered Results
    API-->>UI: Response
```

Authentication supports three methods: email/password, Google OAuth, and magic links. Upon successful authentication, the system checks tenant memberships. Users with multiple tenants see a selector; single-tenant users are auto-directed.

The critical step is `set_tenant_context()` which establishes PostgreSQL session variables. All subsequent queries are automatically filtered by RLS policies using these session values, ensuring complete tenant isolation.

---

## 4. Data Security Model

### 4.1 Row-Level Security Flow

```mermaid
flowchart TD
    subgraph "API Request"
        REQ[Incoming Request]
        MID[Context Middleware]
    end

    subgraph "Session Context"
        SET["SET app.current_tenant_id<br/>SET app.current_user_id<br/>SET app.current_role"]
    end

    subgraph "RLS Policies"
        POL_T["tenant_policy<br/>(tenant_id = current_tenant)"]
        POL_S["service_policy<br/>(service account bypass)"]
    end

    subgraph "Table Access"
        TBL[(Any Table with tenant_id)]
    end

    subgraph "Result"
        FILTERED[Filtered Rows Only]
    end

    REQ --> MID
    MID --> SET
    SET --> POL_T
    SET --> POL_S
    POL_T --> TBL
    POL_S --> TBL
    TBL --> FILTERED

    style SET fill:#fff3e0
    style POL_T fill:#e8f5e9
    style FILTERED fill:#e3f2fd
```

Every table follows the dual-policy pattern: `{table}_tenant` policy for user access and `{table}_service` policy for backend operations. The tenant policy automatically filters using `tenant_id = current_setting('app.current_tenant_id', true)::UUID`.

This architecture ensures that even if application code contains bugs or SQL injection vulnerabilities, the database itself enforces tenant boundaries. No application-layer code can bypass RLS policies.

---

### 4.2 Audit Trail Architecture

```mermaid
flowchart LR
    subgraph "Data Modification"
        INS[INSERT]
        UPD[UPDATE]
        DEL[DELETE]
    end

    subgraph "Trigger Layer"
        TRG[audit_trigger]
    end

    subgraph "Audit Log"
        LOG[(audit_log table)]
        IMMUTABLE["IMMUTABLE<br/>No UPDATE/DELETE allowed"]
    end

    subgraph "Access Control"
        RLS_A["RLS: tenant_id filter"]
    end

    INS --> TRG
    UPD --> TRG
    DEL --> TRG

    TRG -->|Capture| LOG
    LOG --> IMMUTABLE
    LOG --> RLS_A

    style LOG fill:#fce4ec
    style IMMUTABLE fill:#ffcdd2
```

The audit system captures all INSERT, UPDATE, and DELETE operations on core tables via database triggers. The `audit_log` table is append-only—policies explicitly deny UPDATE and DELETE operations, ensuring forensic integrity.

Each audit record includes actor (user/agent/system), action type, target resource, timestamp, and change details. Tenants can only read their own audit records via RLS, maintaining both visibility and isolation.

---

## 5. Collaboration Features

### 5.1 Presence & Locking System

```mermaid
stateDiagram-v2
    [*] --> Offline

    Offline --> Online: Login + Heartbeat
    Online --> Active: View Resource
    Active --> Editing: Acquire Lock
    Editing --> Active: Release Lock
    Active --> Online: Navigate Away
    Online --> Offline: No Heartbeat (2min)
    Editing --> Offline: Session Timeout

    state Editing {
        [*] --> LockHeld
        LockHeld --> LockExpired: 30min timeout
        LockExpired --> [*]
    }

    note right of Online
        Heartbeat every 30 seconds
        Tracks current view/resource
    end note

    note right of Editing
        Lock prevents concurrent edits
        Auto-releases on timeout
    end note
```

User presence is tracked via a heartbeat mechanism (30-second interval). Users are marked offline after 2 minutes without heartbeat. This enables "who's online" visibility without requiring persistent connections.

Record locking prevents concurrent edit conflicts. Locks are tied to specific resources (e.g., `gap_analysis:123`), expire after 30 minutes, and display the lock holder's name when acquisition fails.

---

### 5.2 AI Visibility Cycle States

```mermaid
stateDiagram-v2
    [*] --> Discovery

    Discovery --> Audit: advance_cycle_stage()
    Audit --> GapAnalysis: advance_cycle_stage()
    GapAnalysis --> Ideation: advance_cycle_stage()
    Ideation --> Planning: advance_cycle_stage()
    Planning --> Execution: advance_cycle_stage()
    Execution --> [*]

    state Discovery {
        not_started --> in_progress
        in_progress --> blocked
        blocked --> in_progress
        in_progress --> completed
    }

    note right of Discovery
        Only owner/admin roles
        can advance stages
    end note

    note left of Execution
        Each stage tracks:
        - status
        - health_indicators
        - completion_date
    end note
```

The AI Visibility journey follows a structured 6-stage cycle. Each tenant has exactly one `organization_cycle_state` record tracking current stage and status. Stage advancement requires owner/admin role permissions and is logged to the activity stream with `is_highlight=true`.

Health indicators (stored as JSONB) provide at-a-glance progress metrics for each stage, enabling teams to identify blockers early.

---

## 6. EFS Structure Overview

### 6.1 Epic-Feature-Story Hierarchy

```mermaid
flowchart TD
    subgraph "PROJECT EPIC"
        PE[PFI-BAIV-RRR-Security]
    end

    subgraph "EPICs"
        E1[EPIC-SEC-AUTH<br/>Authentication]
        E2[EPIC-SEC-RLS<br/>Row-Level Security]
        E3[EPIC-SEC-COLLAB<br/>Collaboration]
        E4[EPIC-SEC-CYCLE<br/>Cycle Management]
    end

    subgraph "Features (14)"
        F1[FEAT-AUTH-01..05]
        F2[FEAT-RLS-01..03]
        F3[FEAT-COLLAB-01..03]
        F4[FEAT-CYCLE-01..03]
    end

    subgraph "Stories (15)"
        S1[US-A01..US-A05]
        S2[US-S01..US-S02]
        S3[US-L01..US-L03]
        S4[US-C01..US-C03]
    end

    subgraph "Requirements (45)"
        R1[FR-AUTH-01..08]
        R2[FR-SEC-01..06]
        R3[FR-PRE/LOCK/ACT]
        R4[FR-CYC-01..06]
    end

    PE --> E1
    PE --> E2
    PE --> E3
    PE --> E4

    E1 --> F1
    E2 --> F2
    E3 --> F3
    E4 --> F4

    F1 --> S1
    F2 --> S2
    F3 --> S3
    F4 --> S4

    S1 --> R1
    S2 --> R2
    S3 --> R3
    S4 --> R4

    style PE fill:#7b1fa2,color:#fff
    style E1 fill:#1976d2,color:#fff
    style E2 fill:#388e3c,color:#fff
    style E3 fill:#f57c00,color:#fff
    style E4 fill:#d32f2f,color:#fff
```

The EFS hierarchy provides complete traceability from high-level business objectives down to specific functional requirements. Each User Story links to acceptance criteria and specific FR/TR requirement IDs from the source documentation.

This structure enables both top-down planning (what business value are we delivering?) and bottom-up verification (are all requirements covered?).

---

### 6.2 PBS Package Alignment

```mermaid
flowchart LR
    subgraph "PBS Packages"
        P1[PBS-1.0<br/>Auth Package]
        P2[PBS-2.0<br/>Security Package]
        P3[PBS-3.0<br/>Collaboration Package]
        P4[PBS-4.0<br/>API Package]
        P5[PBS-5.0<br/>UI Package]
        P6[PBS-6.0<br/>Test Package]
    end

    subgraph "Deliverables"
        D1["Supabase Config<br/>OAuth Setup<br/>Auth Middleware<br/>Tenant Assignment"]
        D2["RLS Migration<br/>Context Function<br/>Audit Infrastructure"]
        D3["Cycle State Table<br/>Presence Table<br/>Locks Table<br/>Activity Table"]
        D4["Context Middleware<br/>Presence API<br/>Lock API<br/>Cycle API"]
        D5["Login/Signup Pages<br/>Tenant Selector<br/>Status Card<br/>Activity Feed"]
        D6["Auth Tests<br/>RLS Tests<br/>Integration Tests"]
    end

    P1 --> D1
    P2 --> D2
    P3 --> D3
    P4 --> D4
    P5 --> D5
    P6 --> D6

    style P1 fill:#e1f5fe
    style P2 fill:#fff3e0
    style P3 fill:#e8f5e9
    style P4 fill:#fce4ec
    style P5 fill:#f3e5f5
    style P6 fill:#fff8e1
```

The Product Breakdown Structure (PBS) organizes deliverables into six logical packages. Each package maps to specific EPICs and contains concrete deliverables with defined formats (SQL, TypeScript, React, Config).

This alignment ensures development work can be planned, tracked, and delivered incrementally while maintaining architectural coherence.

---

## 7. PROJECT EPIC: PFI-BAIV-RRR-Security

### Epic Definition

| Attribute | Value |
|-----------|-------|
| **Epic ID** | `PFI-BAIV-SEC-001` |
| **Title** | BAIV AI Visibility Platform Security Implementation |
| **Owner** | Platform Architecture Team |
| **Priority** | P0 - Critical |
| **Status** | Planned |
| **Target Release** | v1.0.0 |

### Business Value Statement

> *"Implement enterprise-grade multi-tenant security for the BAIV AI Visibility platform, enabling secure collaboration across agencies and direct clients while maintaining complete data isolation and audit compliance."*

### Success Criteria

- [ ] Zero cross-tenant data leakage in security testing
- [ ] 100% of tables have RLS policies enabled
- [ ] Authentication supports 3 methods (email, OAuth, magic link)
- [ ] Audit log captures all data modifications
- [ ] Presence and locking prevent edit conflicts
- [ ] All 45 functional requirements implemented

---

## 8. GitHub-Compliant Epic/Feature/Story Breakdown

### 8.1 EPIC-SEC-AUTH: Authentication & Authorization

```yaml
epic:
  id: EPIC-SEC-AUTH
  title: "Authentication & Authorization System"
  labels: [epic, security, p0-critical]
  milestone: "v1.0.0-security"

  description: |
    Implement secure multi-method authentication with multi-tenant
    user support via Supabase Auth. Enable seamless tenant switching
    for users with multiple organization memberships.

  acceptance_criteria:
    - Users can sign up/login via email+password
    - Users can authenticate via Google OAuth
    - Users can use passwordless magic links
    - Multi-tenant users see tenant selector
    - JWT tokens contain user_id and email
    - Architecture supports future SAML SSO

  features:
    - FEAT-AUTH-01
    - FEAT-AUTH-02
    - FEAT-AUTH-03
    - FEAT-AUTH-04
    - FEAT-AUTH-05
```

#### Feature: FEAT-AUTH-01 - Email/Password Authentication

```yaml
feature:
  id: FEAT-AUTH-01
  title: "Email/Password Authentication"
  epic: EPIC-SEC-AUTH
  labels: [feature, auth, p0-critical]

  description: |
    Enable standard email and password authentication via Supabase Auth.

  stories:
    - id: US-A01
      title: "Email/Password Signup"
      type: user-story
      labels: [story, auth]

      body: |
        **As a** new user
        **I want** to sign up with email/password
        **So that** I can access the platform

        ## Acceptance Criteria
        - [ ] Given a new user with valid email
        - [ ] When user submits signup form
        - [ ] Then account is created
        - [ ] And confirmation email is sent

        ## Technical Notes
        - Supabase Auth handles email verification
        - Password requirements: 8+ chars, 1 uppercase, 1 number

        ## Requirements Traced
        - FR-AUTH-01

        ## PBS Deliverables
        - PBS-1.1: Supabase Auth Config
        - PBS-1.3: Auth Middleware
```

#### Feature: FEAT-AUTH-02 - OAuth Integration

```yaml
feature:
  id: FEAT-AUTH-02
  title: "Google OAuth Integration"
  epic: EPIC-SEC-AUTH
  labels: [feature, auth, p1-high]

  stories:
    - id: US-A02
      title: "Google OAuth Login"

      body: |
        **As a** user
        **I want** to sign in with Google
        **So that** I don't need another password

        ## Acceptance Criteria
        - [ ] Given Google OAuth is enabled
        - [ ] When user clicks "Sign in with Google"
        - [ ] Then user is redirected to Google
        - [ ] And upon success, JWT is issued

        ## Requirements Traced
        - FR-AUTH-03

        ## PBS Deliverables
        - PBS-1.2: OAuth Setup
```

#### Feature: FEAT-AUTH-04 - Multi-Tenant Switching

```yaml
feature:
  id: FEAT-AUTH-04
  title: "Multi-Tenant User Switching"
  epic: EPIC-SEC-AUTH
  labels: [feature, auth, multi-tenant, p1-high]

  stories:
    - id: US-A04
      title: "Multi-Organization Switching"

      body: |
        **As a** user with multiple organizations
        **I want** to switch between them easily
        **So that** I can manage multiple tenants

        ## Acceptance Criteria
        - [ ] Given user belongs to Tenant A and Tenant B
        - [ ] When user logs in
        - [ ] Then tenant selector is displayed
        - [ ] And selecting Tenant A sets context to Tenant A

        ## Negative Case
        - [ ] Given user belongs to only Tenant A
        - [ ] When user logs in
        - [ ] Then user is automatically directed to Tenant A dashboard

        ## Requirements Traced
        - FR-AUTH-05, FR-AUTH-06, FR-AUTH-07

        ## PBS Deliverables
        - PBS-1.4: Tenant Assignment
        - PBS-5.2: TenantSelector.tsx
```

---

### 8.2 EPIC-SEC-RLS: Row-Level Security

```yaml
epic:
  id: EPIC-SEC-RLS
  title: "Row-Level Security Implementation"
  labels: [epic, security, database, p0-critical]
  milestone: "v1.0.0-security"

  description: |
    Implement database-level tenant isolation using PostgreSQL
    Row-Level Security. Ensure data cannot leak across tenant
    boundaries even if application bugs exist.

  features:
    - FEAT-RLS-01: Tenant Data Isolation
    - FEAT-RLS-02: Context Propagation
    - FEAT-RLS-03: Audit Log Immutability
```

#### Feature: FEAT-RLS-01 - Tenant Data Isolation

```yaml
feature:
  id: FEAT-RLS-01
  title: "Tenant Data Isolation via RLS"
  epic: EPIC-SEC-RLS
  labels: [feature, security, rls, p0-critical]

  stories:
    - id: US-S01
      title: "Database-Level Tenant Isolation"

      body: |
        **As a** Platform Owner
        **I want** tenant data isolated at DB level
        **So that** app bugs can't leak data

        ## Acceptance Criteria
        - [ ] Given User A is in Tenant A
        - [ ] When User A queries any table with Tenant B's ID
        - [ ] Then zero rows are returned

        ## Technical Implementation
        ```sql
        -- Enable RLS
        ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

        -- Tenant policy
        CREATE POLICY {table}_tenant ON {table}
          USING (tenant_id = current_setting('app.current_tenant_id', true)::UUID);
        ```

        ## Requirements Traced
        - FR-SEC-01, TR-DB-01, TR-DB-02

        ## PBS Deliverables
        - PBS-2.1: RLS Migration
```

#### Feature: FEAT-RLS-03 - Audit Log Immutability

```yaml
feature:
  id: FEAT-RLS-03
  title: "Immutable Audit Trail"
  epic: EPIC-SEC-RLS
  labels: [feature, security, audit, p0-critical]

  stories:
    - id: US-S02
      title: "Append-Only Audit Logs"

      body: |
        **As a** Tenant Admin
        **I want** audit logs
        **So that** I can track who changed what

        ## Acceptance Criteria
        - [ ] Given an audit_log record exists
        - [ ] When any user attempts UPDATE or DELETE
        - [ ] Then the operation is blocked

        ## Technical Implementation
        ```sql
        -- Deny UPDATE/DELETE on audit_log
        CREATE POLICY audit_log_immutable ON audit_log
          FOR UPDATE USING (false);
        CREATE POLICY audit_log_no_delete ON audit_log
          FOR DELETE USING (false);
        ```

        ## Requirements Traced
        - FR-SEC-04, FR-SEC-05, FR-SEC-06

        ## PBS Deliverables
        - PBS-2.3: Audit Infrastructure
```

---

### 8.3 EPIC-SEC-COLLAB: Collaboration & Presence

```yaml
epic:
  id: EPIC-SEC-COLLAB
  title: "Real-Time Collaboration Features"
  labels: [epic, collaboration, p1-high]
  milestone: "v1.0.0-security"

  features:
    - FEAT-COLLAB-01: User Presence
    - FEAT-COLLAB-02: Record Locking
    - FEAT-COLLAB-03: Activity Stream
```

#### Feature: FEAT-COLLAB-02 - Record Locking

```yaml
feature:
  id: FEAT-COLLAB-02
  title: "Pessimistic Record Locking"
  epic: EPIC-SEC-COLLAB
  labels: [feature, collaboration, locking, p1-high]

  stories:
    - id: US-L02
      title: "Lock Resources During Edit"

      body: |
        **As an** Analyst
        **I want** to lock a gap analysis while editing
        **So that** others don't overwrite my work

        ## Acceptance Criteria

        ### Scenario: Lock Acquisition
        - [ ] Given no lock exists on gap_analysis:123
        - [ ] When User A requests lock
        - [ ] Then lock is granted to User A

        ### Scenario: Lock Conflict
        - [ ] Given User A holds lock on gap_analysis:123
        - [ ] When User B requests same lock
        - [ ] Then User B receives "Locked by User A"

        ### Scenario: Lock Expiry
        - [ ] Given lock held for 30+ minutes
        - [ ] When another user requests lock
        - [ ] Then expired lock is released
        - [ ] And new lock is granted

        ## Requirements Traced
        - FR-LOCK-01 through FR-LOCK-06

        ## PBS Deliverables
        - PBS-3.3: dataset_edit_locks table
        - PBS-4.3: /api/locks/* endpoints
```

---

### 8.4 EPIC-SEC-CYCLE: Cycle State Management

```yaml
epic:
  id: EPIC-SEC-CYCLE
  title: "AI Visibility Cycle State Management"
  labels: [epic, cycle, workflow, p1-high]
  milestone: "v1.0.0-security"

  features:
    - FEAT-CYCLE-01: Stage Tracking
    - FEAT-CYCLE-02: Stage Advancement
    - FEAT-CYCLE-03: Health Indicators
```

#### Feature: FEAT-CYCLE-02 - Stage Advancement

```yaml
feature:
  id: FEAT-CYCLE-02
  title: "Role-Controlled Stage Advancement"
  epic: EPIC-SEC-CYCLE
  labels: [feature, cycle, rbac, p1-high]

  stories:
    - id: US-C02
      title: "Advance Cycle Stages"

      body: |
        **As a** Tenant Admin
        **I want** to advance stages
        **So that** we progress through the AI Visibility journey

        ## Acceptance Criteria

        ### Scenario: Successful Advancement
        - [ ] Given tenant is in "audit" stage
        - [ ] And user has "admin" role
        - [ ] When user calls advance_cycle_stage()
        - [ ] Then stage becomes "gap_analysis"
        - [ ] And activity is logged with is_highlight=true

        ### Scenario: Permission Denied
        - [ ] Given user has "member" role
        - [ ] When user calls advance_cycle_stage()
        - [ ] Then operation fails with "Permission denied"

        ## Technical Implementation
        ```sql
        CREATE FUNCTION advance_cycle_stage()
        RETURNS void AS $$
        BEGIN
          -- Check role
          IF current_setting('app.current_role') NOT IN ('owner', 'admin') THEN
            RAISE EXCEPTION 'Permission denied';
          END IF;
          -- Advance stage...
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        ```

        ## Requirements Traced
        - FR-CYC-04, FR-CYC-05, FR-CYC-06

        ## PBS Deliverables
        - PBS-3.5: advance_cycle_stage() function
        - PBS-4.4: /api/cycle/advance endpoint
```

---

## 9. Implementation Roadmap

### 9.1 Phase Timeline

```mermaid
gantt
    title PFI-BAIV-RRR-Security Implementation
    dateFormat  YYYY-MM-DD

    section Phase 1: Foundation
    PBS-1.0 Auth Package       :p1a, 2026-02-10, 5d
    PBS-2.0 Security Package   :p1b, 2026-02-10, 7d

    section Phase 2: Collaboration
    PBS-3.0 Collaboration      :p2a, after p1b, 5d
    PBS-4.0 API Package        :p2b, after p1a, 7d

    section Phase 3: UI & Testing
    PBS-5.0 UI Package         :p3a, after p2a, 5d
    PBS-6.0 Test Package       :p3b, after p3a, 5d

    section Milestones
    Security MVP               :milestone, m1, 2026-02-17, 0d
    Full Implementation        :milestone, m2, 2026-03-03, 0d
```

---

## 10. Validation Checklist

### Schema Conformance

- [x] All roles conform to `pf:RRR-ONT-v3.1.0` schema
- [x] All EFS entities conform to `pf:EFS-ONT-v1.0` schema
- [x] RACI matrices follow BR-RRR-002 (one Accountable)
- [x] RACI matrices follow BR-RRR-003 (at least one Responsible)
- [x] Role hierarchy has no cycles (BR-RRR-004)

### Requirements Traceability

| Category | Total | Mapped | Coverage |
|----------|-------|--------|----------|
| FR-AUTH | 8 | 8 | 100% |
| FR-SEC | 6 | 6 | 100% |
| FR-CYC | 6 | 6 | 100% |
| FR-PRE | 5 | 5 | 100% |
| FR-LOCK | 6 | 6 | 100% |
| FR-ACT | 5 | 5 | 100% |
| TR-DB | 4 | 4 | 100% |
| TR-API | 5 | 5 | 100% |
| **Total** | **45** | **45** | **100%** |

---

## 11. References

### Source Documents
- `BAIV-Security-REQS.pdf` - Functional Requirements
- `BAIV-PFI-RBAC Roles v2.pdf` - RBAC Permission Matrix
- `BAIV-PFC-PFI Security-PBS.pdf` - Product Breakdown Structure

### Data Files
- `RRR-DATA-BAIV-AIV-roles-v1.0.0.jsonld` - Role Definitions
- `EFS-DATA-BAIV-AIV-security-v1.0.0.jsonld` - EFS Structure

### Schema Conformance
- `pf:RRR-ONT-v3.1.0` - Roles, RACI, RBAC Ontology
- `pf:EFS-ONT-v1.0` - Epics, Features, Stories Ontology

---

*Document Version: 1.0.0*
*Created: 2026-02-02*
*Author: Platform Architecture Team*
*Conformance: OAA v5.0.0 Documentation Standards*
