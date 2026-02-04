/**
 * Export functions — audit reports, PNG export, ontology download.
 */

import { state } from './state.js';
import { validateOAAv5 } from './audit-engine.js';

export function generateAuditReport(ontologyData, parsed, validation, registryInfo = null) {
  const timestamp = new Date().toISOString();
  const fileName = document.getElementById('file-name').textContent || 'unknown';

  const ontologyName = ontologyData.name ||
                       ontologyData['rdfs:label'] ||
                       ontologyData['@id']?.split('/').pop() ||
                       'unnamed';
  const ontologyVersion = ontologyData['oaa:moduleVersion'] ||
                          ontologyData.version ||
                          ontologyData['owl:versionInfo'] ||
                          'unknown';

  return {
    "@context": "https://oaa-ontology.org/audit/v1/",
    "@type": "OAAAuditReport",
    "@id": `audit:${ontologyName.toLowerCase().replace(/\s+/g, '-')}-${timestamp.replace(/[:.]/g, '-')}`,
    "auditMetadata": {
      "generatedAt": timestamp,
      "generatedBy": "OAA Visualiser v6.1.0",
      "oaaVersion": "6.1.0",
      "auditVersion": "1.0.0"
    },
    "ontologyMetadata": {
      "name": ontologyName,
      "version": ontologyVersion,
      "schemaVersion": ontologyData['oaa:schemaVersion'] || null,
      "domain": ontologyData['oaa:domain'] || null,
      "previousVersion": ontologyData['oaa:previousVersion'] || null,
      "sourceFile": fileName
    },
    "complianceResult": {
      "overallStatus": validation.overall,
      "summary": validation.summary
    },
    "gateResults": validation.gates.map(g => ({
      "gateId": g.gate.split(':')[0].trim(),
      "gateName": g.gate.split(':')[1]?.trim() || g.gate,
      "status": g.status,
      "isAdvisory": g.advisory || false,
      "isSkipped": g.skipped || false,
      "detail": g.detail,
      "issues": g.issues || [],
      "warnings": g.warnings || []
    })),
    "graphMetrics": {
      "totalNodes": parsed.nodes.length,
      "totalEdges": parsed.edges.length,
      "entityCount": parsed.nodes.filter(n => n.entityType !== 'external').length,
      "relationshipCount": (ontologyData.relationships ||
                           ontologyData.ontologyDefinition?.relationships || []).length,
      "businessRuleCount": (ontologyData.businessRules ||
                           ontologyData.rules ||
                           ontologyData.ontologyDefinition?.businessRules || []).length,
      "edgeToNodeRatio": parsed.nodes.length > 0 ?
                         (parsed.edges.length / parsed.nodes.filter(n => n.entityType !== 'external').length).toFixed(2) : 0,
      "connectedComponents": state.lastAudit?.components?.length || 1,
      "orphanedEntities": validation.gates.find(g => g.gate.includes('G2B'))?.orphaned || []
    },
    "registryInfo": registryInfo ? {
      "matched": true,
      "entryId": registryInfo.entryId,
      "registryVersion": registryInfo.version,
      "registryStatus": registryInfo.status,
      "validatedDate": registryInfo.validatedDate,
      "dependencies": registryInfo.dependencies || [],
      "dependents": registryInfo.dependents || []
    } : {
      "matched": false
    }
  };
}

export function exportAuditFile() {
  if (!state.currentData || !state.lastParsed) {
    alert('Load an ontology first to generate audit report');
    return;
  }

  const validation = state.lastValidation || validateOAAv5(state.currentData, state.lastParsed);
  const auditReport = generateAuditReport(state.currentData, state.lastParsed, validation, state.currentRegistryEntry);

  const ontName = auditReport.ontologyMetadata.name.toLowerCase().replace(/\s+/g, '-');
  const ontVersion = auditReport.ontologyMetadata.version;
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${ontName}-audit-${ontVersion}-${dateStr}.json`;

  const blob = new Blob([JSON.stringify(auditReport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPNG() {
  if (!state.network) return;
  const canvas = document.querySelector('#network canvas');
  if (canvas) {
    const link = document.createElement('a');
    link.download = 'ontology-graph.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

export function downloadOntologyForOAA() {
  const blob = new Blob([JSON.stringify(state.currentData, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = document.getElementById('file-name').textContent || 'ontology';
  a.download = fileName.replace(/\.json$/i, '') + '-for-oaa.json';
  a.click();
  URL.revokeObjectURL(url);
}
