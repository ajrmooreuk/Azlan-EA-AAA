# ALZ Environment Audit & MVP Planning Package
## Insurance Advisory Sector

## Overview

This package provides tools and documentation for conducting a comprehensive snapshot audit of an existing Azure environment, followed by Azure Landing Zone (ALZ) MVP planning and implementation.

**Sector:** Insurance Advisory  
**Primary Objective:** Phase 1 Environment Audit  
**Compliance Frameworks:** MCSB v1, MCSB v2, NIST 800-53, UK NCSC 14 Principles, ISO 27001

---

## Package Contents

| File | Purpose | Format |
|------|---------|--------|
| `ALZ-MVP-Vision-Strategy-Plan.md` | Vision, strategy, audit scope, implementation plan | Markdown with Mermaid |
| `Pre-ALZ-Assessment-Workbook.workbook` | Azure Workbook for estate audit | Azure Workbook JSON |
| `kql-queries.json` | Standalone KQL queries for automation | JSON |
| `compliance-mapping.json` | MCSB v1/v2, NIST, NCSC, ISO control mapping | JSON |

---

## Phase 1: Environment Audit

### Quick Start

**Step 1: Import the Azure Workbook**

```bash
# Option A: Azure CLI
az monitor workbook create \
  --resource-group <your-rg> \
  --location <your-location> \
  --display-name "Pre-ALZ Environment Audit" \
  --serialized-data @Pre-ALZ-Assessment-Workbook.workbook \
  --category workbook

# Option B: Azure Portal
# 1. Navigate to Azure Monitor → Workbooks
# 2. Click "+ New"
# 3. Click "</>" (Advanced Editor)
# 4. Paste contents of Pre-ALZ-Assessment-Workbook.workbook
# 5. Click "Apply" then "Save"
```

**Step 2: Run Discovery Queries**

```bash
# Run all inventory queries and export
az graph query -q "resources | summarize count() by type" --output json > inventory-by-type.json

# Full inventory export
az graph query -q "resources | project name, type, location, resourceGroup, subscriptionId, id" \
  --output json > inventory-full.json
```

**Step 3: Export Audit Data**

From the workbook, each grid has an "Export to CSV" option in the ellipsis menu (⋯).

---

## Workbook Tabs

| Tab | Description | Audit Purpose |
|-----|-------------|---------------|
| **Audit Summary** | Executive overview | Quick health check |
| **Resource Inventory** | Complete asset list | Baseline documentation |
| **Subscriptions & Governance** | MGs, subs, policies | Governance maturity |
| **Security Configuration** | Key Vault, NSGs, Storage | Security posture |
| **Network Topology** | VNets, subnets, peerings | Network mapping |
| **Identity & RBAC** | Identities, role assignments | IAM assessment |
| **Data & AI Resources** | Analytics, databases | Data platform inventory |
| **MCSB v1 Assessment** | Legacy benchmark controls | Compliance baseline |
| **MCSB v2 Assessment** | Current benchmark controls | Compliance baseline |
| **NIST/NCSC/ISO Mapping** | Regulatory alignment | Gap analysis |

---

## Audit Output Files

Run the KQL queries to generate these baseline files:

| Output File | Description |
|-------------|-------------|
| `inventory-full.json` | Complete resource inventory |
| `inventory-by-type.csv` | Resource count by type |
| `untagged-resources.csv` | Governance gap - untagged resources |
| `subscriptions.json` | Subscription list |
| `management-groups.json` | MG hierarchy |
| `policy-assignments.json` | Policy assignments |
| `vnets.json` | Virtual network topology |
| `subnets.csv` | Subnet configuration |
| `peerings.json` | VNet peerings |
| `nsgs.json` | Network security groups |
| `storage-security.csv` | Storage account security |
| `keyvaults.csv` | Key Vault configuration |
| `rbac-assignments.json` | RBAC assignments |
| `mcsb-v1-compliance.json` | MCSB v1 control status |
| `mcsb-v2-compliance.json` | MCSB v2 control status |

---

## MCSB v1 vs v2 Coverage

| Domain | v1 Controls | v2 Controls | Key Differences |
|--------|-------------|-------------|-----------------|
| Network Security | NS-1 to NS-7 | NS-1 to NS-10 | v2 adds private DNS, DDoS |
| Identity Management | IM-1 to IM-9 | IM-1 to IM-9 | Similar coverage |
| Data Protection | DP-1 to DP-8 | DP-1 to DP-8 | v2 adds classification |
| Logging | LT-1 to LT-7 | LT-1 to LT-7 | Similar coverage |
| DevOps Security | DS-1 to DS-7 | DS-1 to DS-7 | v2 adds supply chain |

---

## Insurance Sector Considerations

The compliance mapping includes insurance-specific requirements:

- **FCA SYSC** - Operational resilience, data security
- **PRA SS1/21** - Outsourcing and third-party risk
- **Solvency II** - Data quality, model governance
- **Lloyd's Standards** - Minimum security requirements
- **GDPR** - Personal data protection

---

## Viewing Mermaid Diagrams

The `ALZ-MVP-Vision-Strategy-Plan.md` contains Mermaid diagrams that render in:

- GitHub (native support)
- VS Code with Mermaid extension
- Obsidian
- Azure DevOps Wiki
- [mermaid.live](https://mermaid.live) for interactive viewing

---

## Integration Examples

### Azure DevOps Pipeline

```yaml
trigger: none
schedules:
  - cron: "0 6 * * 1"
    branches:
      include: [main]

steps:
  - task: AzureCLI@2
    inputs:
      azureSubscription: 'your-subscription'
      scriptType: 'bash'
      scriptLocation: 'inlineScript'
      inlineScript: |
        az graph query -q "resources" --output json > $(Build.ArtifactStagingDirectory)/inventory.json
  
  - publish: $(Build.ArtifactStagingDirectory)
    artifact: AzureAudit
```

### PowerShell Automation

```powershell
$queries = Get-Content kql-queries.json | ConvertFrom-Json

foreach ($domain in $queries.queries.PSObject.Properties) {
    foreach ($query in $domain.Value.PSObject.Properties) {
        $result = Search-AzGraph -Query $query.Value.query
        $result | ConvertTo-Json -Depth 10 | Out-File "$($query.Value.outputFile)"
    }
}
```

---

## Support

For questions about this audit package, contact the Advisory Team.
