/**
 * OAA v6.1.0 Validation Gates (G1-G6) and graph audit.
 */

export function auditGraph(parsed) {
  const nodeIds = new Set(parsed.nodes.map(n => n.id));
  const edgeSet = new Map();
  nodeIds.forEach(id => edgeSet.set(id, { in: 0, out: 0 }));
  parsed.edges.forEach(e => {
    if (edgeSet.has(e.from)) edgeSet.get(e.from).out++;
    if (edgeSet.has(e.to)) edgeSet.get(e.to).in++;
  });

  const isolated = parsed.nodes.filter(n => {
    const counts = edgeSet.get(n.id);
    return counts && counts.in === 0 && counts.out === 0;
  });

  const adj = new Map();
  nodeIds.forEach(id => adj.set(id, []));
  parsed.edges.forEach(e => {
    if (adj.has(e.from)) adj.get(e.from).push(e.to);
    if (adj.has(e.to)) adj.get(e.to).push(e.from);
  });
  const visited = new Set();
  const components = [];
  nodeIds.forEach(id => {
    if (visited.has(id)) return;
    const component = [];
    const queue = [id];
    while (queue.length > 0) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      component.push(cur);
      (adj.get(cur) || []).forEach(nb => { if (!visited.has(nb)) queue.push(nb); });
    }
    components.push(component);
  });
  components.sort((a, b) => b.length - a.length);

  return {
    format: parsed.diagnostics.format,
    totalNodes: parsed.nodes.length,
    totalEdges: parsed.edges.length,
    isolated,
    components,
    stubNodes: parsed.diagnostics.stubNodes,
    mainComponentSize: components.length > 0 ? components[0].length : 0,
    disconnectedCount: components.length - 1
  };
}

export function validateOAAv5(data, parsed) {
  const gates = [];

  gates.push(validateG1SchemaStructure(data));
  gates.push(validateG2RelationshipCardinality(data));
  gates.push(validateG2BEntityConnectivity(parsed));
  gates.push(validateG2CGraphConnectivity(parsed));
  gates.push(validateG3BusinessRules(data));
  gates.push(validateG4SemanticConsistency(data, parsed));

  const g5 = validateG5Completeness(data, parsed);
  g5.advisory = true;
  gates.push(g5);

  const g6 = validateG6UniRegistry(data);
  g6.advisory = true;
  gates.push(g6);

  const coreGates = gates.filter(g => !g.advisory && !g.skipped);
  const failCount = coreGates.filter(g => g.status === 'fail').length;
  const warnCount = coreGates.filter(g => g.status === 'warn').length;
  const passCount = coreGates.filter(g => g.status === 'pass').length;

  let overall = 'pass';
  if (failCount > 0) overall = 'fail';
  else if (warnCount > 0) overall = 'warn';

  return {
    gates,
    overall,
    summary: { pass: passCount, warn: warnCount, fail: failCount, advisory: gates.filter(g => g.advisory).length }
  };
}

function validateG1SchemaStructure(data) {
  const issues = [];
  const warnings = [];

  if (!data['@context']) {
    warnings.push('Missing @context (not strict JSON-LD)');
  }

  if (!data['@id'] && !data.id && !data.name) {
    issues.push('Missing ontology identifier (@id, id, or name)');
  }

  const hasEntities = data.entities || data.hasDefinedTerm || data['@graph'] ||
                      (data.ontologyDefinition && (data.ontologyDefinition.entities || data.ontologyDefinition['@graph']));
  if (!hasEntities) {
    issues.push('No entities found (entities, hasDefinedTerm, or @graph)');
  }

  const entities = data.entities || data.hasDefinedTerm || data['@graph'] ||
                   (data.ontologyDefinition && (data.ontologyDefinition.entities || data.ontologyDefinition['@graph'])) || [];
  if (Array.isArray(entities)) {
    entities.forEach((e, i) => {
      if (!e['@id'] && !e.id && !e.name) {
        issues.push(`Entity ${i}: missing identifier`);
      }
    });
  }

  return {
    gate: 'G1: Schema Structure',
    status: issues.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass'),
    issues,
    warnings,
    detail: issues.length === 0 ? 'Valid JSON structure' : `${issues.length} issue(s) found`
  };
}

function validateG2RelationshipCardinality(data) {
  const issues = [];
  const warnings = [];

  const relationships = data.relationships ||
                        (data.ontologyDefinition && data.ontologyDefinition.relationships) || [];

  if (relationships.length === 0) {
    warnings.push('No explicit relationships defined');
    return {
      gate: 'G2: Relationship Cardinality',
      status: 'warn',
      issues,
      warnings,
      detail: 'No relationships to validate'
    };
  }

  relationships.forEach((rel, i) => {
    const name = rel.name || rel['@id'] || rel['rdfs:label'] || `Relationship ${i}`;

    const hasDomain = rel.domainIncludes || rel.domain || rel.source || rel['rdfs:domain'] || rel['schema:domainIncludes'] || rel['oaa:domainIncludes'];
    if (!hasDomain) {
      issues.push(`${name}: missing domain`);
    }

    const hasRange = rel.rangeIncludes || rel.range || rel.target || rel['rdfs:range'] || rel['schema:rangeIncludes'] || rel['oaa:rangeIncludes'];
    if (!hasRange) {
      issues.push(`${name}: missing range`);
    }

    const cardinality = rel.cardinality || rel['oaa:cardinality'];
    if (cardinality) {
      // Accept both dot notation (n..1) and colon notation (n:1, n:m, 1:n)
      const cardPattern = /^(0|1|\*|n|m)((\.\.)|([:]))?(0|1|\*|n|m)?$/i;
      if (!cardPattern.test(cardinality)) {
        warnings.push(`${name}: non-standard cardinality notation "${cardinality}"`);
      }
    }
  });

  return {
    gate: 'G2: Relationship Cardinality',
    status: issues.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass'),
    issues,
    warnings,
    detail: `${relationships.length} relationship(s) checked`
  };
}

function validateG2BEntityConnectivity(parsed) {
  if (!parsed || !parsed.nodes) {
    return { gate: 'G2B: Entity Connectivity', status: 'warn', issues: [], warnings: ['No parsed data'], detail: 'Cannot validate' };
  }

  // Meta-node types that are not domain entities (excluded from connectivity checks)
  const metaTypes = new Set(['external', 'core', 'layer']);

  const entityIds = new Set(parsed.nodes.map(n => n.id));
  const connected = new Set();

  parsed.edges.forEach(e => {
    connected.add(e.from);
    connected.add(e.to);
  });

  const orphaned = parsed.nodes.filter(n =>
    !connected.has(n.id) && !metaTypes.has(n.entityType)
  );

  const domainNodeCount = parsed.nodes.filter(n => !metaTypes.has(n.entityType)).length;
  const connectedDomainNodes = parsed.nodes.filter(n =>
    connected.has(n.id) && !metaTypes.has(n.entityType)
  ).length;

  const pct = domainNodeCount > 0 ? Math.round((connectedDomainNodes / domainNodeCount) * 100) : 100;

  return {
    gate: 'G2B: Entity Connectivity',
    status: orphaned.length > 0 ? 'fail' : 'pass',
    issues: orphaned.map(n => `${n.label || n.id} (${n.entityType})`),
    warnings: [],
    detail: `${pct}% entities connected (${connectedDomainNodes}/${domainNodeCount})`,
    orphaned: orphaned.map(n => n.id)
  };
}

function validateG2CGraphConnectivity(parsed) {
  if (!parsed || !parsed.nodes) {
    return { gate: 'G2C: Graph Connectivity', status: 'warn', issues: [], warnings: ['No parsed data'], detail: 'Cannot validate' };
  }

  // Meta-node types that are not domain entities (excluded from connectivity checks)
  const metaTypes = new Set(['external', 'core', 'layer']);

  const domainNodes = parsed.nodes.filter(n => !metaTypes.has(n.entityType));
  const nodeIds = new Set(domainNodes.map(n => n.id));

  if (nodeIds.size === 0) {
    return { gate: 'G2C: Graph Connectivity', status: 'pass', issues: [], warnings: [], detail: 'No domain entities' };
  }

  const adj = new Map();
  nodeIds.forEach(id => adj.set(id, []));

  parsed.edges.forEach(e => {
    if (nodeIds.has(e.from) && nodeIds.has(e.to)) {
      adj.get(e.from).push(e.to);
      adj.get(e.to).push(e.from);
    }
  });

  const visited = new Set();
  const components = [];

  nodeIds.forEach(id => {
    if (visited.has(id)) return;
    const component = [];
    const queue = [id];
    while (queue.length > 0) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      component.push(cur);
      (adj.get(cur) || []).forEach(nb => { if (!visited.has(nb)) queue.push(nb); });
    }
    components.push(component);
  });

  const isConnected = components.length <= 1;

  return {
    gate: 'G2C: Graph Connectivity',
    status: isConnected ? 'pass' : 'warn',
    issues: [],
    warnings: isConnected ? [] : [`${components.length} disconnected clusters`],
    detail: isConnected ? 'Single connected component' : `${components.length} components`,
    components: components.length
  };
}

function validateG3BusinessRules(data) {
  const issues = [];
  const warnings = [];

  const businessRules = data.businessRules || data.rules ||
                        (data.ontologyDefinition && data.ontologyDefinition.businessRules) || [];

  if (businessRules.length === 0) {
    return {
      gate: 'G3: Business Rules',
      status: 'warn',
      issues: [],
      warnings: ['No business rules defined'],
      detail: 'Consider adding IF-THEN business rules'
    };
  }

  const ifThenPattern = /^IF\s+.+\s+THEN\s+.+$/i;
  const expressionPattern = /^[A-Za-z_][A-Za-z0-9_.]*\s*(==|!=|>|<|>=|<=|&&|\|\||\s+AND\s+|\s+OR\s+)/i;

  let compliantCount = 0;
  businessRules.forEach((rule, i) => {
    const ruleName = rule.name || rule['@id'] || rule.id || `Rule ${i + 1}`;

    let ruleText = '';
    if (rule.condition && rule.action) {
      ruleText = `${rule.condition} ${rule.action}`;
    } else {
      ruleText = rule.expression || rule.rule || rule.description || '';
    }

    if (ifThenPattern.test(ruleText)) {
      compliantCount++;
    } else if (rule.condition && rule.action) {
      if (rule.condition.toUpperCase().startsWith('IF') && rule.action.toUpperCase().includes('MUST')) {
        compliantCount++;
      } else {
        warnings.push(`${ruleName}: condition/action should use IF...THEN format`);
      }
    } else if (expressionPattern.test(ruleText)) {
      warnings.push(`${ruleName}: has expression but not IF-THEN format`);
    } else if (ruleText.trim() === '') {
      issues.push(`${ruleName}: empty rule expression`);
    } else {
      warnings.push(`${ruleName}: convert to IF-THEN format`);
    }

    if (!rule.severity) {
      warnings.push(`${ruleName}: missing severity (error/warning/info)`);
    }
  });

  const pct = businessRules.length > 0 ? Math.round((compliantCount / businessRules.length) * 100) : 0;

  return {
    gate: 'G3: Business Rules',
    status: issues.length > 0 ? 'fail' : (pct < 80 ? 'warn' : 'pass'),
    issues,
    warnings: warnings.slice(0, 5),
    detail: `${pct}% rules in IF-THEN format (${compliantCount}/${businessRules.length})`
  };
}

function validateG4SemanticConsistency(data, parsed) {
  const issues = [];
  const warnings = [];

  if (!parsed || !parsed.nodes) {
    return { gate: 'G4: Semantic Consistency', status: 'warn', issues: [], warnings: ['No parsed data'], detail: 'Cannot validate' };
  }

  parsed.nodes.forEach(n => {
    if (n.entityType === 'external') return;

    if (!n.description || n.description.trim() === '') {
      warnings.push(`${n.label}: missing description`);
    }

    if (n.label && n.entityType !== 'layer') {
      const pascalPattern = /^[A-Z][a-zA-Z0-9]*$/;
      const hasSpaces = /\s/.test(n.label);
      if (!pascalPattern.test(n.label) && !hasSpaces) {
        if (!/^[a-z]/.test(n.label) === false && n.label.includes('_')) {
          warnings.push(`${n.label}: consider PascalCase naming`);
        }
      }
    }
  });

  const shownWarnings = warnings.slice(0, 5);
  if (warnings.length > 5) {
    shownWarnings.push(`... and ${warnings.length - 5} more`);
  }

  return {
    gate: 'G4: Semantic Consistency',
    status: issues.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass'),
    issues,
    warnings: shownWarnings,
    detail: warnings.length === 0 ? 'All entities have descriptions' : `${warnings.length} entities missing descriptions`
  };
}

function validateG5Completeness(data, parsed) {
  const issues = [];
  const warnings = [];

  const hasMetadata = data.metadata || data.registryMetadata || data['@context'];
  if (!hasMetadata) {
    warnings.push('No metadata block found');
  } else {
    const meta = data.metadata || data.registryMetadata || {};
    if (!meta.version && !data.version && !data['oaa:moduleVersion'] && !data['owl:versionInfo']) warnings.push('Missing version');
    if (!meta.author && !meta.creator && !data.author && !data.creator) warnings.push('Missing author/creator');
  }

  const entities = data.entities || data.hasDefinedTerm ||
                   (data.ontologyDefinition && (data.ontologyDefinition.entities || data.ontologyDefinition['@graph'])) || [];

  let missingType = 0;
  if (Array.isArray(entities)) {
    entities.forEach(e => {
      if (!e['@type'] && !e.type && !e.entityType) missingType++;
    });
  }

  if (missingType > 0) {
    warnings.push(`${missingType} entities missing @type`);
  }

  if (parsed && parsed.nodes.length > 0) {
    const nonExternal = parsed.nodes.filter(n => n.entityType !== 'external').length;
    const ratio = nonExternal > 0 ? (parsed.edges.length / nonExternal).toFixed(2) : 0;
    if (ratio < 0.5 && nonExternal > 3) {
      warnings.push(`Low edge-to-node ratio: ${ratio} (recommend ≥0.8)`);
    }
  }

  return {
    gate: 'G5: Completeness',
    status: issues.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass'),
    issues,
    warnings,
    detail: issues.length + warnings.length === 0 ? 'All required fields present' : `${warnings.length} recommendation(s)`
  };
}

function validateG6UniRegistry(data) {
  const issues = [];
  const warnings = [];

  const isUniRegistry = data.ontologyDefinition || data.registryEntry || data.registryMetadata;

  if (!isUniRegistry) {
    return {
      gate: 'G6: UniRegistry Format',
      status: 'pass',
      issues: [],
      warnings: [],
      detail: 'Not UniRegistry format (OK)',
      skipped: true
    };
  }

  if (data.ontologyDefinition) {
    const od = data.ontologyDefinition;
    if (!od.name && !od['rdfs:label']) warnings.push('ontologyDefinition missing name');
    if (!od['@graph'] && !od.entities) warnings.push('ontologyDefinition missing @graph or entities');
  }

  if (data.registryMetadata) {
    const rm = data.registryMetadata;
    if (!rm.registryId) warnings.push('registryMetadata missing registryId');
    if (!rm.registeredAt && !rm.createdAt) warnings.push('registryMetadata missing timestamp');
  }

  return {
    gate: 'G6: UniRegistry Format',
    status: issues.length > 0 ? 'fail' : (warnings.length > 0 ? 'warn' : 'pass'),
    issues,
    warnings,
    detail: 'UniRegistry format validated'
  };
}
