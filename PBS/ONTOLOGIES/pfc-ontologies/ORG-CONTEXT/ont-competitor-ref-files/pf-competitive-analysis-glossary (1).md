# PF Competitive Analysis Ontology - Generalized Glossary

**Version**: 1.0.0  
**Date Generated**: 2025-10-08  
**Ontology ID**: pf:ontology:competitive-analysis-v1  
**Framework Type**: Platform Framework (Configurable)

---

## CONFIGURATION GUIDE

This ontology is designed to be **domain-agnostic** and **organization-agnostic**. Before implementation, configure the following variables:

### Required Configuration Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `[TARGET_ORG_ID]` | Unique identifier for your organization | `org:techstart-ai` |
| `[TARGET_ORG_NAME]` | Your organization's display name | `TechStart AI` |
| `[MARKET_DOMAIN]` | Primary market you compete in | `SaaS Integration`, `Fintech`, `HealthTech` |
| `[MARKET_SUBSECTOR]` | Specific subsector focus | `API Management`, `Digital Payments`, `Telemedicine` |
| `[GEOGRAPHICAL_SCOPE]` | Market geography | `North America`, `EMEA`, `Global` |
| `[PRODUCT_CATEGORY]` | Primary product/service type | `Integration Platform`, `Payment Gateway`, `EHR System` |
| `[OKR_FRAMEWORK]` | Reference to your OKR system | `okr:q3-2025-objectives` |
| `[VALUE_PROPOSITION_ONTOLOGY]` | VSOM reference | `vsom:techstart-value-model` |
| `[COMPETITIVE_TIMEFRAME]` | Analysis time horizon | `12 months`, `3 years` |

### Market-Specific Configuration Examples

**For SaaS Integration Startup**:
```json
{
  "TARGET_ORG_ID": "org:integration-innovators",
  "MARKET_DOMAIN": "SaaS Integration & API Management", 
  "MARKET_SUBSECTOR": "Enterprise API Orchestration",
  "PRODUCT_CATEGORY": "Integration Platform",
  "DIRECT_COMPETITORS": ["Zapier", "MuleSoft", "Workato"]
}
```

**For Fintech Payment Solution**:
```json
{
  "TARGET_ORG_ID": "org:paytech-solutions",
  "MARKET_DOMAIN": "Digital Payments & Fintech",
  "MARKET_SUBSECTOR": "B2B Payment Processing", 
  "PRODUCT_CATEGORY": "Payment Gateway",
  "DIRECT_COMPETITORS": ["Stripe", "Square", "Adyen"]
}
```

**For HealthTech Platform**:
```json
{
  "TARGET_ORG_ID": "org:healthtech-platform",
  "MARKET_DOMAIN": "Healthcare Technology",
  "MARKET_SUBSECTOR": "Telemedicine & Remote Care",
  "PRODUCT_CATEGORY": "Telehealth Platform", 
  "DIRECT_COMPETITORS": ["Teladoc", "Amwell", "MDLive"]
}
```

---

## ENTITIES

### TargetOrganization
- **Type**: Entity
- **Schema.org Base**: Organization
- **Definition**: The client organization for whom competitive analysis is being conducted in `[MARKET_DOMAIN]`
- **Business Meaning**: Your organization or client that needs to understand their competitive landscape within `[MARKET_SUBSECTOR]`
- **Technical Meaning**: Primary subject of competitive analysis with extended properties for maturity and readiness assessment in `[MARKET_DOMAIN]`
- **Usage Example**: "`[TARGET_ORG_NAME]` as TargetOrganization analyzing `[MARKET_DOMAIN]` market"
- **Configuration Example**: "TechStart AI as TargetOrganization analyzing SaaS Integration market"
- **Usage Context**: Use when defining the organization that is the subject of competitive analysis
- **Key Properties**: 
  - `organizationMaturity` - Startup/Growth/Enterprise stage
  - `domainReadiness` - Capability level in `[MARKET_DOMAIN]`
  - `okrFramework` - Reference to `[OKR_FRAMEWORK]`
  - `marketingStrategy` - Reference to `[STRATEGIC_CONTEXT]`
  - `valuePropositionProfile` - Reference to `[VALUE_PROPOSITION_ONTOLOGY]`
- **Relationships**: competes_with CompetitorOrganization, direct_competitor (3-5), pursues_objective StrategicObjective
- **AI Agent Usage**: Agents query this to understand client context and competitive positioning needs in `[MARKET_DOMAIN]`
- **Constraints**: Must identify 3-5 direct competitors (BR-001)

### CompetitorOrganization  
- **Type**: Entity
- **Schema.org Base**: Organization
- **Definition**: Organizations that compete in the `[MARKET_DOMAIN]` space within `[MARKET_SUBSECTOR]`
- **Business Meaning**: Companies you compete against for market share, customers, and mindshare in `[MARKET_DOMAIN]`
- **Technical Meaning**: Organization entities with competitive attributes and threat assessment specific to `[MARKET_DOMAIN]`
- **Usage Example**: "`[DIRECT_COMPETITOR_1]` as CompetitorOrganization with threatLevel='High', competitorType='Direct' in `[MARKET_SUBSECTOR]`"
- **Configuration Example**: "Zapier as CompetitorOrganization with threatLevel='High', competitorType='Direct' in SaaS Integration"
- **Usage Context**: Use to model any organization competing in your `[MARKET_DOMAIN]` space
- **Key Properties**: 
  - `competitorType` - Direct/Indirect/Substitute/Emerging relative to `[MARKET_DOMAIN]`
  - `domainCapabilities` - Capabilities specific to `[MARKET_DOMAIN]`
  - `threatLevel` - Competitive threat assessment
  - `geographicalReach` - Coverage within `[GEOGRAPHICAL_SCOPE]`
- **Relationships**: competes_against TargetOrganization, offers_solution MarketOffering
- **AI Agent Usage**: Agents analyze competitive threats and benchmark capabilities in `[MARKET_DOMAIN]`
- **Constraints**: Must operate in at least one MarketSegment (BR-003)

### MarketOffering
- **Type**: Entity  
- **Schema.org Base**: Product
- **Definition**: Products and services offered in the `[MARKET_DOMAIN]` within `[MARKET_SUBSECTOR]`
- **Business Meaning**: Specific solutions that address needs in `[MARKET_DOMAIN]`, categorized as `[PRODUCT_CATEGORY]`
- **Technical Meaning**: Product entities with domain-specific capabilities and market positioning
- **Usage Example**: "`[COMPETITOR_PRODUCT]` with domainFeatures=['`[FEATURE_1]`', '`[FEATURE_2]`'] in `[PRODUCT_CATEGORY]`"
- **Configuration Example**: "Zapier Workflows with domainFeatures=['workflow automation', 'app connectivity'] in Integration Platform"
- **Usage Context**: Use to catalog competitive offerings and feature comparisons within `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `offeringCategory` - Type within `[PRODUCT_CATEGORY]`
  - `domainFeatures` - Features specific to `[MARKET_DOMAIN]`
  - `competitiveDifferentiators` - Unique aspects vs competitors
  - `deliveryModel` - SaaS/On-premise/Hybrid delivery
- **Relationships**: delivers_value ValueProposition, offered_by CompetitorOrganization
- **AI Agent Usage**: Agents perform feature gap analysis and positioning recommendations in `[MARKET_DOMAIN]`
- **Constraints**: Must have at least one domainFeature defined

### MarketSegment
- **Type**: Entity
- **Schema.org Base**: Intangible  
- **Definition**: Distinct segments within the `[MARKET_DOMAIN]` market in `[GEOGRAPHICAL_SCOPE]`
- **Business Meaning**: Specific market areas or customer groups you can target within `[MARKET_DOMAIN]`
- **Technical Meaning**: Abstract market concepts with competitive and opportunity metrics
- **Usage Example**: "`[MARKET_SEGMENT_1]` segment with competitiveIntensity='High', growthRate=15% in `[GEOGRAPHICAL_SCOPE]`"
- **Configuration Example**: "Enterprise API Management segment with competitiveIntensity='High', growthRate=15% in North America"
- **Usage Context**: Use to analyze market opportunities and competitive intensity within `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `segmentName` - Name within `[MARKET_DOMAIN]` context
  - `competitiveIntensity` - Competition level in this segment
  - `regulatoryFactors` - Regulations affecting `[MARKET_DOMAIN]`
  - `technologyTrends` - Tech trends impacting segment
- **Relationships**: targeted_by ValueProposition, contains CompetitorOrganization
- **AI Agent Usage**: Agents identify market gaps and segment attractiveness in `[MARKET_DOMAIN]`
- **Constraints**: growthRate must be numeric, competitiveIntensity must be enum

### CompetitivePosition
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: An organization's position relative to competitors in `[MARKET_DOMAIN]`
- **Business Meaning**: Where you stand compared to competitors in terms of strength and market presence in `[MARKET_DOMAIN]`
- **Technical Meaning**: Abstract positioning concept with measurable competitive metrics
- **Usage Example**: "Market Leader position with marketShare=25%, brandStrength='High' in `[MARKET_SUBSECTOR]`"
- **Configuration Example**: "Market Leader position with marketShare=25%, brandStrength='High' in API Management"
- **Usage Context**: Use to assess and track competitive standings over time in `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `marketLeadershipStatus` - Position in `[MARKET_DOMAIN]` hierarchy
  - `marketMomentum` - Competitive momentum direction
  - `thoughtLeadership` - Industry influence in `[MARKET_DOMAIN]`
- **Relationships**: held_by CompetitorOrganization (1:1 relationship)
- **AI Agent Usage**: Agents benchmark positioning and recommend strategic moves in `[MARKET_DOMAIN]`
- **Constraints**: marketShare must sum to ≤100% across segment

### ValueProposition
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: The unique value offered by an organization or offering in `[MARKET_DOMAIN]`
- **Business Meaning**: What makes your offering compelling and different from competitors in `[MARKET_DOMAIN]`
- **Technical Meaning**: Abstract value concept linking problems, solutions, and benefits with VSOM integration
- **Usage Example**: "`[VALUE_PROPOSITION]` with coreValue='`[CORE_VALUE]`', vsomReference='`[VALUE_PROPOSITION_ONTOLOGY]`'"
- **Configuration Example**: "API-First Integration with coreValue='Seamless connectivity', vsomReference='vsom:techstart-value-model'"
- **Usage Context**: Use to articulate and compare value delivery across competitors in `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `coreValue` - Primary value delivered in `[MARKET_DOMAIN]`
  - `vsomReference` - Reference to `[VALUE_PROPOSITION_ONTOLOGY]`
  - `differentiators` - Unique aspects vs `[MARKET_DOMAIN]` competitors
  - `outcomePromises` - Expected customer outcomes
- **Relationships**: delivered_by MarketOffering, targets_segment MarketSegment, references_vsom VSOM
- **AI Agent Usage**: Agents identify value gaps and positioning opportunities in `[MARKET_DOMAIN]`
- **Constraints**: Must target at least one MarketSegment

### CompetitiveAnalysis
- **Type**: Entity
- **Schema.org Base**: CreativeWork
- **Definition**: Analytical report or assessment of competitive landscape in `[MARKET_DOMAIN]`
- **Business Meaning**: Strategic analysis that informs competitive decisions and positioning in `[MARKET_DOMAIN]`
- **Technical Meaning**: Structured analytical document with findings and recommendations for `[MARKET_DOMAIN]`
- **Usage Example**: "`[ANALYSIS_PERIOD]` `[MARKET_DOMAIN]` Competitive Assessment analyzing top competitors in `[MARKET_SUBSECTOR]`"
- **Configuration Example**: "Q3 2025 SaaS Integration Competitive Assessment analyzing top competitors in API Management"
- **Usage Context**: Use to capture formal competitive analysis outputs and insights for `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `analysisType` - SWOT/Porter5Forces/Benchmarking/GapAnalysis
  - `timeHorizon` - Analysis timeframe matching `[COMPETITIVE_TIMEFRAME]`
  - `strategicImplications` - Impact on `[OKR_FRAMEWORK]` objectives
  - `methodologyUsed` - Analysis framework applied
- **Relationships**: analyzes_competitor CompetitorOrganization, identifies_opportunity BlueOceanOpportunity, informs_objective StrategicObjective
- **AI Agent Usage**: Agents extract insights and generate strategic recommendations for `[MARKET_DOMAIN]`
- **Constraints**: Must analyze at least one competitor

### BlueOceanOpportunity
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: Market opportunities with minimal direct competition in `[MARKET_DOMAIN]`
- **Business Meaning**: Untapped market spaces within `[MARKET_DOMAIN]` where you can create new demand
- **Technical Meaning**: Strategic opportunity concept with accessibility and risk metrics specific to `[MARKET_DOMAIN]`
- **Usage Example**: "`[OPPORTUNITY_NAME]` in `[MARKET_SUBSECTOR]` with competitiveBarriers='Low', marketSize='`[MARKET_SIZE]`'"
- **Configuration Example**: "No-Code API Integration in SMB Market with competitiveBarriers='Low', marketSize='$50M'"
- **Usage Context**: Use to identify and evaluate uncontested market opportunities within `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `marketSize` - Opportunity size within `[GEOGRAPHICAL_SCOPE]`
  - `marketEducationNeeded` - Education required for `[MARKET_DOMAIN]` adoption
  - `regulatoryConsiderations` - Regulatory factors in `[MARKET_DOMAIN]`
- **Relationships**: identified_by CompetitiveAnalysis
- **AI Agent Usage**: Agents spot market gaps and assess opportunity viability in `[MARKET_DOMAIN]`
- **Constraints**: competitiveBarriers must be 'Low' or 'None' (BR-002)

### CompetitiveIntelligence
- **Type**: Entity
- **Schema.org Base**: CreativeWork
- **Definition**: Structured intelligence about competitors and market dynamics in `[MARKET_DOMAIN]`
- **Business Meaning**: Actionable information about competitor moves, market trends, and opportunities in `[MARKET_DOMAIN]`
- **Technical Meaning**: Information product with reliability and source attribution for `[MARKET_DOMAIN]`
- **Usage Example**: "Competitor Product Launch Intelligence on `[COMPETITOR_NAME]`'s new `[PRODUCT_CATEGORY]` features"
- **Configuration Example**: "Competitor Product Launch Intelligence on Zapier's new enterprise API features"
- **Usage Context**: Use to capture and organize competitive intelligence gathering for `[MARKET_DOMAIN]`
- **Key Properties**: 
  - `intelligenceType` - ProductIntel/PricingIntel/StrategyIntel for `[MARKET_DOMAIN]`
  - `verificationStatus` - Confirmation level of intelligence
  - `impactAssessment` - Potential impact on `[TARGET_ORG_NAME]`
  - `distributionLevel` - Who should receive this intelligence
- **Relationships**: supports_analysis CompetitiveAnalysis
- **AI Agent Usage**: Agents process intel for patterns and strategic implications in `[MARKET_DOMAIN]`
- **Constraints**: reliability must be scored 1-10

### StrategicObjective
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: Organizational objectives and key results (OKRs) driving competitive strategy in `[MARKET_DOMAIN]`
- **Business Meaning**: Your organization's strategic goals that competitive analysis should inform
- **Technical Meaning**: Structured objectives linked to `[OKR_FRAMEWORK]` with competitive relevance
- **Usage Example**: "`[OBJECTIVE_TITLE]` with keyResults=['`[KR_1]`', '`[KR_2]`'] for `[COMPETITIVE_TIMEFRAME]`"
- **Configuration Example**: "Capture 20% API Management Market Share with keyResults=['Sign 50 enterprise clients', 'Launch 3 integration categories'] for 12 months"
- **Usage Context**: Use to connect competitive analysis to organizational strategy and OKRs
- **Key Properties**: 
  - `objectiveTitle` - Strategic goal name
  - `keyResults` - Measurable outcomes aligned with `[OKR_FRAMEWORK]`
  - `competitiveRelevance` - How competitors affect this objective
  - `resourceRequirements` - Resources needed to achieve in `[MARKET_DOMAIN]`
- **Relationships**: pursued_by TargetOrganization, informed_by CompetitiveAnalysis
- **AI Agent Usage**: Agents align competitive insights with strategic objectives
- **Constraints**: Must have at least one measurable keyResult (BR-005)

---

## RELATIONSHIPS

### competes_with
- **Type**: Relationship
- **Domain**: TargetOrganization → CompetitorOrganization
- **Definition**: Indicates direct competitive relationship between organizations in `[MARKET_DOMAIN]`
- **Business Meaning**: Identifies which organizations you actively compete against in `[MARKET_DOMAIN]`
- **Usage Example**: "`[TARGET_ORG_NAME]` competes_with `[DIRECT_COMPETITOR_1]`, `[DIRECT_COMPETITOR_2]`, `[DIRECT_COMPETITOR_3]`"
- **Configuration Example**: "TechStart AI competes_with Zapier, MuleSoft, Workato"

### direct_competitor  
- **Type**: Relationship
- **Domain**: TargetOrganization → CompetitorOrganization
- **Definition**: Identifies the 3-5 most direct competitors requiring strategic focus in `[MARKET_DOMAIN]`
- **Business Meaning**: Your primary competitive threats in `[MARKET_DOMAIN]` requiring constant monitoring
- **Usage Example**: "`[TARGET_ORG_NAME]` direct_competitor [`[DIRECT_COMPETITOR_1]`, `[DIRECT_COMPETITOR_2]`, `[DIRECT_COMPETITOR_3]`]"
- **Configuration Example**: "TechStart AI direct_competitor [Zapier, MuleSoft, Workato]"

### offers_solution
- **Type**: Relationship  
- **Domain**: CompetitorOrganization → MarketOffering
- **Definition**: Organization offers specific solutions in `[MARKET_DOMAIN]`
- **Business Meaning**: Maps what solutions each competitor brings to `[MARKET_DOMAIN]`
- **Usage Example**: "`[COMPETITOR_NAME]` offers_solution [`[PRODUCT_1]`, `[PRODUCT_2]`] in `[PRODUCT_CATEGORY]`"
- **Configuration Example**: "Zapier offers_solution [Zapier Workflows, Zapier Tables] in Integration Platform"

### operates_in_segment
- **Type**: Relationship
- **Domain**: CompetitorOrganization → MarketSegment
- **Definition**: Organization operates within specific market segments in `[MARKET_DOMAIN]`
- **Business Meaning**: Defines which `[MARKET_DOMAIN]` areas each competitor plays in
- **Usage Example**: "`[COMPETITOR_NAME]` operates_in_segment [`[MARKET_SEGMENT_1]`, `[MARKET_SEGMENT_2]`]"
- **Configuration Example**: "MuleSoft operates_in_segment [Enterprise API Management, B2B Integration]"

### pursues_objective
- **Type**: Relationship
- **Domain**: TargetOrganization → StrategicObjective
- **Definition**: Organization pursues specific strategic objectives aligned with `[OKR_FRAMEWORK]`
- **Business Meaning**: Links your organization to its strategic goals that drive competitive strategy
- **Usage Example**: "`[TARGET_ORG_NAME]` pursues_objective `[OBJECTIVE_1]`, `[OBJECTIVE_2]`, `[OBJECTIVE_3]`"
- **Configuration Example**: "TechStart AI pursues_objective 'Capture 20% market share', 'Launch enterprise tier', 'Build partner ecosystem'"

### references_vsom
- **Type**: Relationship
- **Domain**: ValueProposition → schema:CreativeWork
- **Definition**: Value proposition references Value Proposition Ontology (VSOM) framework
- **Business Meaning**: Connects competitive value propositions to your structured VSOM model
- **Usage Example**: "`[VALUE_PROPOSITION]` references_vsom `[VALUE_PROPOSITION_ONTOLOGY]`"
- **Configuration Example**: "API-First Integration references_vsom vsom:techstart-value-model"

---

## CONFIGURATION TEMPLATES

### Startup SaaS Template
```json
{
  "TARGET_ORG_ID": "org:[your-startup-name]",
  "MARKET_DOMAIN": "[SaaS Category]",
  "MARKET_SUBSECTOR": "[Specific Focus Area]", 
  "GEOGRAPHICAL_SCOPE": "North America",
  "PRODUCT_CATEGORY": "[SaaS Solution Type]",
  "COMPETITIVE_TIMEFRAME": "18 months",
  "DIRECT_COMPETITORS": ["[Leader]", "[Challenger_1]", "[Challenger_2]", "[Emerging]"]
}
```

### Enterprise Solution Template
```json
{
  "TARGET_ORG_ID": "org:[enterprise-solution-name]",
  "MARKET_DOMAIN": "[Enterprise Software Category]",
  "MARKET_SUBSECTOR": "[Department/Function Focus]",
  "GEOGRAPHICAL_SCOPE": "Global", 
  "PRODUCT_CATEGORY": "[Enterprise Platform Type]",
  "COMPETITIVE_TIMEFRAME": "3 years",
  "DIRECT_COMPETITORS": ["[Market_Leader]", "[Traditional_Player]", "[Disruptor_1]", "[Disruptor_2]"]
}
```

### Healthcare Technology Template
```json
{
  "TARGET_ORG_ID": "org:[healthtech-platform]",
  "MARKET_DOMAIN": "Healthcare Technology",
  "MARKET_SUBSECTOR": "[Clinical/Administrative Focus]",
  "GEOGRAPHICAL_SCOPE": "[Regulatory Region]",
  "PRODUCT_CATEGORY": "[HealthTech Solution Type]", 
  "COMPETITIVE_TIMEFRAME": "24 months",
  "DIRECT_COMPETITORS": ["[Incumbent_1]", "[Incumbent_2]", "[Digital_Native_1]", "[Digital_Native_2]"]
}
```

---

## AI AGENT CONFIGURATION

### Query Pattern Templates
Replace variables in square brackets with your specific values:

```sparql
# Find direct competitors in your market domain
SELECT ?competitor ?threatLevel ?marketShare
WHERE {
  [TARGET_ORG_ID] direct_competitor ?competitor .
  ?competitor threatLevel ?threatLevel .
  ?competitor marketShare ?marketShare .
  ?competitor operates_in_segment [MARKET_SEGMENT_ID] .
}

# Identify blue ocean opportunities
SELECT ?opportunity ?marketSize ?barriers
WHERE {
  ?opportunity a BlueOceanOpportunity .
  ?opportunity marketSize ?marketSize .
  ?opportunity competitiveBarriers ?barriers .
  ?opportunity targets_segment [MARKET_SEGMENT_ID] .
  FILTER(?barriers IN ("Low", "None"))
}

# Connect competitive analysis to OKRs
SELECT ?analysis ?objective ?recommendation
WHERE {
  ?analysis informs_objective ?objective .
  ?objective pursued_by [TARGET_ORG_ID] .
  ?analysis recommendations ?recommendation .
}
```

---

## BUSINESS RULES (CONFIGURABLE)

### BR-001: Direct Competitor Requirement
Every TargetOrganization must identify between 3-5 direct competitors in `[MARKET_DOMAIN]` for focused strategic analysis.

### BR-002: Blue Ocean Definition  
BlueOceanOpportunity must have competitive barriers marked as 'Low' or 'None' to qualify as true blue ocean in `[MARKET_DOMAIN]`.

### BR-003: Market Presence Requirement
Every CompetitorOrganization must operate in at least one MarketSegment within `[MARKET_DOMAIN]`.

### BR-004: Threat Assessment
Organizations marked as direct competitors must have a defined threatLevel for prioritization in `[MARKET_DOMAIN]`.

### BR-005: Strategic Objective Measurability
Every StrategicObjective must have at least one measurable keyResult aligned with `[OKR_FRAMEWORK]`.

---

## IMPLEMENTATION CHECKLIST

- [ ] Configure all required variables for your market domain
- [ ] Identify your 3-5 direct competitors
- [ ] Define your market segments within geographical scope
- [ ] Link to your OKR framework reference
- [ ] Connect to your VSOM (Value Proposition Ontology)
- [ ] Set competitive analysis timeframe
- [ ] Validate configuration against business rules
- [ ] Generate test data with your specific values
- [ ] Deploy configured ontology to your systems

---

**Status**: Template Ready for Configuration  
**Last Updated**: 2025-10-08  
**Framework Type**: Platform Framework (Domain-Agnostic)  
**Maintained By**: Platform Framework Architecture Team