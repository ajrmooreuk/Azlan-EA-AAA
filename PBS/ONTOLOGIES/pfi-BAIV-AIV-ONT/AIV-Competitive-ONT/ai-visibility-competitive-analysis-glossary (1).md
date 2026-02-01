# AI Visibility Competitive Analysis Ontology - Comprehensive Glossary

**Version**: 1.0.0  
**Date Generated**: 2025-10-08  
**Ontology ID**: baiv:ontology:competitive-analysis-v1

---

## ENTITIES

### TargetOrganization
- **Type**: Entity
- **Schema.org Base**: Organization
- **Definition**: The client organization for whom competitive analysis is being conducted
- **Business Meaning**: Your organization or client that needs to understand their competitive landscape
- **Technical Meaning**: Primary subject of competitive analysis with extended properties for maturity and readiness assessment
- **Usage Example**: "BAIV Corp as TargetOrganization analyzing AI Visibility market"
- **Usage Context**: Use when defining the organization that is the subject of competitive analysis
- **Key Properties**: organizationMaturity, marketPosition, aiVisibilityReadiness, strategicObjectives
- **Relationships**: competes_with CompetitorOrganization, direct_competitor (3-5)
- **AI Agent Usage**: Agents query this to understand client context and competitive positioning needs
- **Constraints**: Must identify 3-5 direct competitors (BR-001)

### CompetitorOrganization  
- **Type**: Entity
- **Schema.org Base**: Organization
- **Definition**: Organizations that compete in the AI Visibility market space
- **Business Meaning**: Companies you compete against for market share, customers, and mindshare
- **Technical Meaning**: Organization entities with competitive attributes and threat assessment
- **Usage Example**: "HubSpot as CompetitorOrganization with threatLevel='High', competitorType='Direct'"
- **Usage Context**: Use to model any organization competing in your market space
- **Key Properties**: competitorType, marketShare, competitiveStrength, threatLevel
- **Relationships**: competes_against TargetOrganization, offers_product AIVisibilityProduct
- **AI Agent Usage**: Agents analyze competitive threats and benchmark capabilities
- **Constraints**: Must operate in at least one MarketSegment (BR-003)

### AIVisibilityProduct
- **Type**: Entity  
- **Schema.org Base**: Product
- **Definition**: Products and services offered in the AI Visibility market
- **Business Meaning**: Specific solutions that provide AI-driven visibility, analytics, or optimization
- **Technical Meaning**: Product entities with AI-specific capabilities and market positioning
- **Usage Example**: "SEMrush AI Content Tools with aiVisibilityFeatures=['content optimization', 'keyword intelligence']"
- **Usage Context**: Use to catalog competitive offerings and feature comparisons
- **Key Properties**: aiVisibilityFeatures, competitiveDifferentiators, pricingModel
- **Relationships**: delivers_value ValueProposition, offered_by CompetitorOrganization
- **AI Agent Usage**: Agents perform feature gap analysis and positioning recommendations
- **Constraints**: Must have at least one aiVisibilityFeature defined

### MarketSegment
- **Type**: Entity
- **Schema.org Base**: Intangible  
- **Definition**: Distinct segments within the AI Visibility market
- **Business Meaning**: Specific market areas or customer groups you can target
- **Technical Meaning**: Abstract market concepts with competitive and opportunity metrics
- **Usage Example**: "Enterprise SEO Tools segment with competitiveIntensity='High', growthRate=15%"
- **Usage Context**: Use to analyze market opportunities and competitive intensity
- **Key Properties**: segmentSize, growthRate, competitiveIntensity, barriers
- **Relationships**: targeted_by ValueProposition, contains CompetitorOrganization
- **AI Agent Usage**: Agents identify market gaps and segment attractiveness
- **Constraints**: growthRate must be numeric, competitiveIntensity must be enum

### CompetitivePosition
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: An organization's position relative to competitors in the market  
- **Business Meaning**: Where you stand compared to competitors in terms of strength and market presence
- **Technical Meaning**: Abstract positioning concept with measurable competitive metrics
- **Usage Example**: "Market Leader position with marketShare=25%, brandStrength='High'"
- **Usage Context**: Use to assess and track competitive standings over time
- **Key Properties**: marketLeadershipStatus, marketShare, brandStrength, innovationCapability
- **Relationships**: held_by CompetitorOrganization (1:1 relationship)
- **AI Agent Usage**: Agents benchmark positioning and recommend strategic moves
- **Constraints**: marketShare must sum to ≤100% across segment

### ValueProposition
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: The unique value offered by an organization or product
- **Business Meaning**: What makes your offering compelling and different from competitors
- **Technical Meaning**: Abstract value concept linking problems, solutions, and benefits
- **Usage Example**: "AI-First SEO with coreValue='Predictive optimization', differentiators=['real-time AI', 'voice search ready']"
- **Usage Context**: Use to articulate and compare value delivery across competitors
- **Key Properties**: coreValue, differentiators, targetBenefits, competitiveAdvantage
- **Relationships**: delivered_by AIVisibilityProduct, targets_segment MarketSegment
- **AI Agent Usage**: Agents identify value gaps and positioning opportunities
- **Constraints**: Must target at least one MarketSegment

### CompetitiveAnalysis
- **Type**: Entity
- **Schema.org Base**: CreativeWork
- **Definition**: Analytical report or assessment of competitive landscape
- **Business Meaning**: Strategic analysis that informs competitive decisions and positioning
- **Technical Meaning**: Structured analytical document with findings and recommendations
- **Usage Example**: "Q3 2025 AI Visibility Competitive Assessment analyzing top 10 competitors"
- **Usage Context**: Use to capture formal competitive analysis outputs and insights
- **Key Properties**: analysisType, keyFindings, competitiveGaps, recommendations
- **Relationships**: analyzes_competitor CompetitorOrganization, identifies_opportunity BlueOceanOpportunity
- **AI Agent Usage**: Agents extract insights and generate strategic recommendations
- **Constraints**: Must analyze at least one competitor

### BlueOceanOpportunity
- **Type**: Entity
- **Schema.org Base**: Intangible
- **Definition**: Market opportunities with minimal direct competition
- **Business Meaning**: Untapped market spaces where you can create new demand
- **Technical Meaning**: Strategic opportunity concept with accessibility and risk metrics
- **Usage Example**: "AI-Powered Voice Search Optimization with competitiveBarriers='Low', marketSize='$50M'"
- **Usage Context**: Use to identify and evaluate uncontested market opportunities
- **Key Properties**: marketSize, competitiveBarriers, requiredCapabilities, strategicValue
- **Relationships**: identified_by CompetitiveAnalysis
- **AI Agent Usage**: Agents spot market gaps and assess opportunity viability
- **Constraints**: competitiveBarriers must be 'Low' or 'None' (BR-002)

### CompetitiveIntelligence
- **Type**: Entity
- **Schema.org Base**: CreativeWork
- **Definition**: Structured intelligence about competitors and market dynamics
- **Business Meaning**: Actionable information about competitor moves, market trends, and opportunities
- **Technical Meaning**: Information product with reliability and source attribution
- **Usage Example**: "Competitor Product Launch Intelligence on HubSpot's new AI features"
- **Usage Context**: Use to capture and organize competitive intelligence gathering
- **Key Properties**: intelligenceType, sources, reliability, actionableRecommendations
- **Relationships**: supports_analysis CompetitiveAnalysis
- **AI Agent Usage**: Agents process intel for patterns and strategic implications
- **Constraints**: reliability must be scored 1-10

---

## RELATIONSHIPS

### competes_with
- **Type**: Relationship
- **Domain**: TargetOrganization → CompetitorOrganization
- **Definition**: Indicates direct competitive relationship between organizations
- **Business Meaning**: Identifies which organizations you actively compete against
- **Usage Example**: "BAIV competes_with HubSpot, SEMrush, Ahrefs"
- **Cardinality**: One-to-many (0..*)
- **Inverse**: competes_against

### direct_competitor  
- **Type**: Relationship
- **Domain**: TargetOrganization → CompetitorOrganization
- **Definition**: Identifies the 3-5 most direct competitors requiring strategic focus
- **Business Meaning**: Your primary competitive threats requiring constant monitoring
- **Usage Example**: "BAIV direct_competitor [HubSpot, SEMrush, BrightEdge]"
- **Cardinality**: Must be exactly 3-5 (business rule BR-001)
- **AI Agent Usage**: Agents prioritize these for deep competitive analysis

### offers_product
- **Type**: Relationship  
- **Domain**: CompetitorOrganization → AIVisibilityProduct
- **Definition**: Organization offers specific AI Visibility products/services
- **Business Meaning**: Maps what solutions each competitor brings to market
- **Usage Example**: "HubSpot offers_product [Content Strategy Tool, SEO Recommendations]"
- **Cardinality**: One-to-many (1..*)

### operates_in_segment
- **Type**: Relationship
- **Domain**: CompetitorOrganization → MarketSegment
- **Definition**: Organization operates within specific market segments
- **Business Meaning**: Defines which market areas each competitor plays in
- **Usage Example**: "SEMrush operates_in_segment [Enterprise SEO, SMB Marketing Tools]"
- **Cardinality**: One-to-many (1..*)

### has_position
- **Type**: Relationship
- **Domain**: CompetitorOrganization → CompetitivePosition  
- **Definition**: Organization's current competitive positioning
- **Business Meaning**: Where each competitor stands in the market hierarchy
- **Usage Example**: "Google has_position Market Dominator"
- **Cardinality**: One-to-one (1..1)

### delivers_value
- **Type**: Relationship
- **Domain**: AIVisibilityProduct → ValueProposition
- **Definition**: Product delivers specific value proposition to market
- **Business Meaning**: Connects what products do to the value they promise
- **Usage Example**: "BrightEdge Platform delivers_value Real-time SEO Intelligence"
- **Cardinality**: One-to-many (1..*)

### analyzes_competitor
- **Type**: Relationship
- **Domain**: CompetitiveAnalysis → CompetitorOrganization
- **Definition**: Analysis focuses on specific competitors
- **Business Meaning**: Tracks which competitors are covered in each analysis
- **Usage Example**: "Q3 Analysis analyzes_competitor [HubSpot, SEMrush, Moz]"
- **Cardinality**: One-to-many (1..*)

### identifies_opportunity  
- **Type**: Relationship
- **Domain**: CompetitiveAnalysis → BlueOceanOpportunity
- **Definition**: Analysis identifies blue ocean opportunities
- **Business Meaning**: Links strategic analysis to untapped market opportunities
- **Usage Example**: "Market Gap Analysis identifies_opportunity Voice Commerce SEO"
- **Cardinality**: One-to-many (0..*)

### supports_analysis
- **Type**: Relationship
- **Domain**: CompetitiveIntelligence → CompetitiveAnalysis
- **Definition**: Intelligence supports competitive analysis  
- **Business Meaning**: Connects raw intelligence to analytical outputs
- **Usage Example**: "Product Launch Intel supports_analysis Competitive Positioning Study"
- **Cardinality**: One-to-many (0..*)

### targets_segment
- **Type**: Relationship
- **Domain**: ValueProposition → MarketSegment
- **Definition**: Value proposition targets specific market segments
- **Business Meaning**: Maps value delivery to intended market audiences
- **Usage Example**: "AI-First SEO targets_segment [Enterprise, Mid-Market B2B]"
- **Cardinality**: One-to-many (1..*)

---

## ENUMERATIONS

### CompetitorType
- **Values**: ["Direct", "Indirect", "Substitute", "Emerging", "Adjacent"]
- **Usage**: Categorizes competitive relationship intensity and type

### ThreatLevel  
- **Values**: ["Critical", "High", "Medium", "Low", "Minimal"]
- **Usage**: Assesses competitive threat severity for prioritization

### MarketPosition
- **Values**: ["Leader", "Challenger", "Follower", "Niche", "Emerging"]
- **Usage**: Defines market standing and competitive strength

### AnalysisType
- **Values**: ["SWOT", "Porter5Forces", "Benchmarking", "GapAnalysis", "Positioning"]
- **Usage**: Specifies analytical framework used

### IntelligenceType
- **Values**: ["ProductIntel", "PricingIntel", "StrategyIntel", "PartnershipIntel", "FinancialIntel"]
- **Usage**: Categorizes competitive intelligence by focus area

---

## BUSINESS RULES

### BR-001: Direct Competitor Requirement
Every TargetOrganization must identify between 3-5 direct competitors for focused strategic analysis.

### BR-002: Blue Ocean Definition  
Blue Ocean opportunities must have competitive barriers marked as 'Low' or 'None' to qualify as true blue ocean.

### BR-003: Market Presence Requirement
Every CompetitorOrganization must operate in at least one MarketSegment.

### BR-004: Threat Assessment
Organizations marked as direct competitors must have a defined threatLevel for prioritization.

---

## AI AGENT USAGE GUIDELINES

### Query Patterns
- **Competitive Benchmarking**: "Compare [TargetOrg] capabilities vs [Competitor] in [Segment]"
- **Gap Analysis**: "What capabilities does [Competitor] have that [TargetOrg] lacks?"
- **Opportunity Identification**: "Find Blue Ocean opportunities in [MarketSegment]"
- **Threat Assessment**: "Rank competitors by threat level for [TargetOrg]"

### Reasoning Support
Agents can perform multi-hop reasoning across competitive relationships to:
- Identify competitive clusters and ecosystems
- Spot market gaps and positioning opportunities  
- Assess competitive threats and strategic moves
- Generate positioning and differentiation recommendations

### Graph Traversal Examples
```
TargetOrg → direct_competitor → CompetitorOrg → offers_product → AIVisibilityProduct
TargetOrg → operates_in_segment → MarketSegment ← targets_segment ← ValueProposition
CompetitiveAnalysis → identifies_opportunity → BlueOceanOpportunity → requires_capabilities
```

---

**Status**: Active  
**Last Updated**: 2025-10-08  
**Maintained By**: BAIV Enterprise Architecture Team