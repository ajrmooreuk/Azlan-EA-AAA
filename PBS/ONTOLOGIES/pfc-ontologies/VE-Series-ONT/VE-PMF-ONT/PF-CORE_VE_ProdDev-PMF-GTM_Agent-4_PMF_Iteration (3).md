# Agent 4: Product-Market Fit (PMF) Iteration Agent

## Agent Metadata
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Product-Market Fit Iteration Agent",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "ProductDevelopment",
  "version": "1.0.0"
}
```

## Executive Summary

Orchestrates iterative MVP development, user testing, market validation, and product refinement cycles until demonstrable product-market fit is achieved.

**Primary Objectives:**
1. Execute build-measure-learn cycles
2. Deploy MVPs to test cohorts
3. Conduct structured user testing
4. Validate market demand
5. Synthesize feedback systematically
6. Make data-driven iteration decisions
7. Achieve and validate PMF

**KPIs:**
- Iteration cycle time: <2 weeks
- User test volume: >20 per iteration
- Feedback quality score: >8/10
- PMF achievement: <6 months
- Resource efficiency: Cost per validated learning

---

## Module 1: Iteration Planning & Hypothesis

**Purpose:** Plan each iteration with clear hypotheses and success criteria

**Inputs:**
```json
{
  "@type": "Action",
  "previousIteration": "Results from last cycle (null for first)",
  "mvpSpecification": "From Agent 2",
  "gtmStrategy": "From Agent 3",
  "currentMetrics": "Product analytics"
}
```

**Outputs:**
```json
{
  "@type": "Action",
  "name": "Iteration Plan",
  "actionPlan": {
    "iterationNumber": "integer",
    "hypothesis": "What we believe will improve PMF",
    "successCriteria": [
      {
        "@type": "QuantitativeValue",
        "name": "Metric",
        "targetValue": "number",
        "threshold": "Minimum for success"
      }
    ],
    "featuresToBuild": ["Feature list"],
    "experimentsToRun": ["A/B tests, user tests"],
    "resourcesRequired": "Team and budget",
    "timeline": "2 weeks"
  }
}
```

**Processing Logic:**
- Review previous iteration results
- Identify highest-impact improvements
- Formulate testable hypotheses
- Define success metrics
- Plan build and test activities

---

## Module 2: MVP Development Orchestration

**Purpose:** Coordinate development of iteration features

**Outputs:**
- Sprint plan
- Development tasks
- Quality gates
- Deployment plan

**Key Activities:**
- Translate requirements to specs
- Coordinate engineering work
- Conduct code reviews
- Execute testing
- Deploy to test environment

---

## Module 3: User Testing & Feedback Collection

**Purpose:** Gather qualitative and quantitative user feedback

**Outputs:**
```json
{
  "@type": "Dataset",
  "name": "User Testing Results",
  "about": {
    "testType": "Usability/Interview/Survey/A-B",
    "participants": "number",
    "methodology": "description",
    "findings": {
      "quantitative": [
        {
          "metric": "name",
          "result": "value",
          "benchmark": "comparison"
        }
      ],
      "qualitative": [
        {
          "theme": "Pattern identified",
          "frequency": "How often mentioned",
          "quotes": ["Verbatim feedback"],
          "sentiment": "Positive/Negative/Mixed"
        }
      ]
    },
    "usabilityMetrics": {
      "taskCompletionRate": "percentage",
      "timeOnTask": "seconds",
      "errorRate": "percentage",
      "satisfactionScore": "1-10"
    }
  }
}
```

**Testing Methods:**
- Moderated usability sessions
- User interviews
- Surveys (NPS, CSAT)
- A/B testing
- Session recordings
- Heatmaps

---

## Module 4: Market Validation

**Purpose:** Validate market demand and business viability

**Outputs:**
- Demand signals (signups, trials, conversions)
- Pricing validation
- Channel performance
- Competitive positioning validation

**Key Metrics:**
- Website traffic and conversion
- Trial signups
- Activation rate
- Conversion to paid
- Customer acquisition cost
- Customer feedback

---

## Module 5: Feedback Analysis & Synthesis

**Purpose:** Transform feedback into actionable insights

**Outputs:**
```json
{
  "@type": "AnalysisNewsArticle",
  "name": "Iteration Insights Report",
  "articleBody": {
    "keyFindings": ["Top insights"],
    "patternIdentification": [
      {
        "pattern": "description",
        "evidence": "supporting data",
        "impact": "High/Medium/Low",
        "recommendation": "what to do"
      }
    ],
    "pmfScoring": {
      "currentScore": "0-10",
      "components": {
        "retentionRate": "percentage",
        "nps": "score",
        "growthRate": "percentage",
        "engagementDepth": "score"
      },
      "trend": "Improving/Flat/Declining"
    },
    "prioritizedImprovements": [
      {
        "improvement": "description",
        "expectedImpact": "score",
        "effort": "score",
        "priority": "High/Medium/Low"
      }
    ]
  }
}
```

**Analysis Techniques:**
- Sentiment analysis
- Theme extraction
- Correlation analysis
- Cohort analysis
- Funnel analysis

---

## Module 6: PMF Assessment & Decision

**Purpose:** Determine if PMF achieved or what to iterate

**Outputs:**
```json
{
  "@type": "AssessAction",
  "name": "PMF Assessment & Decision",
  "result": {
    "pmfAchieved": "Boolean",
    "confidence": "percentage",
    "evidence": ["Supporting data points"],
    "decision": "Persevere/Pivot/Scale",
    "rationale": "explanation",
    "nextActions": ["Specific steps"]
  }
}
```

**PMF Indicators:**

**Quantitative:**
- 40%+ retention at 3 months
- NPS > 50
- Organic growth > 10% monthly
- <5% churn rate
- Strong engagement metrics

**Qualitative:**
- Users express disappointment if removed
- Unprompted positive word-of-mouth
- Clear value articulation by users
- Willingness to pay validates pricing
- Reduced support burden

**Decision Framework:**
- PMF Achieved → Transition to Scale
- Progress toward PMF → Persevere and iterate
- Stalled progress → Consider pivot
- Declining metrics → Major pivot or kill

---

## Module 7: Documentation & Learning

**Purpose:** Capture learnings and build knowledge base

**Outputs:**
- Iteration retrospective
- What worked/didn't work
- Updated product hypotheses
- Knowledge base entries

---

## Workflow

```
INITIALIZE with MVP from Agents 1-3
  ↓
[ITERATION LOOP START]
  ↓
Iteration Planning (Module 1)
  ↓
MVP Development (Module 2)
  ↓
Deploy to Test Cohort
  ↓
[PARALLEL EXECUTION]
├─ User Testing (Module 3)
└─ Market Validation (Module 4)
  ↓
Feedback Analysis (Module 5)
  ↓
PMF Assessment (Module 6)
  ↓
[PMF Achieved?]
├─ NO → Documentation (Module 7) → LOOP BACK
└─ YES → TRANSITION TO SCALE
```

---

## Decision Gates

**Gate 1: Iteration Success**
- Hypothesis validated or invalidated
- Sufficient user feedback collected
- Data quality acceptable

**Gate 2: PMF Achievement**
- All quantitative indicators met
- Qualitative signals strong
- Sustained for 2+ iterations
- Market validation confirmed

---

## Success Criteria

- ✅ PMF achieved within 6 months
- ✅ Clear evidence of product-market fit
- ✅ Repeatable customer acquisition
- ✅ Positive unit economics
- ✅ Strong retention and engagement

---

## Handoff to Scale Phase

**Package:**
1. PMF Evidence Report
2. Final Product Specification
3. User Research Archive
4. Validated GTM Playbook
5. Financial Model
6. Scale Recommendations

---

## Version History

- v1.0.0 (2025-10-18): Initial specification
