/**
 * Unit tests for multi-loader.js — Phase 2 functions + cross-ref bug fix.
 *
 * These tests mock browser-dependent imports (state.js, ontology-parser.js,
 * github-loader.js) and test the pure logic functions in isolation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock browser-dependent modules before importing the module under test
vi.mock('../js/state.js', () => ({
  state: {
    viewMode: 'multi',
    loadedOntologies: new Map(),
    mergedGraph: null,
    seriesData: null,
  },
  REGISTRY_BASE_PATH: '../../ONTOLOGIES/unified-registry/',
  SERIES_COLORS: {
    'VE-Series': '#2196F3',
    'PE-Series': '#4CAF50',
    'Foundation': '#FF9800',
    'Competitive': '#E91E63',
    'RCSG-Series': '#9C27B0',
    'Orchestration': '#00BCD4',
    'placeholder': '#616161',
  },
}));

vi.mock('../js/ontology-parser.js', () => ({
  parseOntology: vi.fn(() => ({ nodes: [], edges: [], name: 'mock' })),
}));

vi.mock('../js/github-loader.js', () => ({
  loadRegistryIndex: vi.fn(),
}));

// Now import the functions under test
const { buildCrossSeriesEdges, getOntologiesForSeries, detectCrossReferences } = await import('../js/multi-loader.js');


// ========================================
// TEST DATA FACTORIES
// ========================================

function createLoadedOntologies(entries) {
  const map = new Map();
  for (const entry of entries) {
    map.set(entry.namespace, {
      name: entry.name,
      series: entry.series,
      isPlaceholder: entry.isPlaceholder || false,
      registryEntry: entry.registryEntry || null,
      parsed: entry.parsed || { nodes: [], edges: [] },
      rawData: entry.rawData || {},
      status: entry.status || 'active',
    });
  }
  return map;
}

function createCrossEdge(from, to, label, sourceNamespace) {
  return {
    from,
    to,
    label: label || 'cross-ref',
    edgeType: 'crossOntology',
    purpose: '',
    sourceNamespace,
    isCrossOntology: true,
  };
}


// ========================================
// buildCrossSeriesEdges
// ========================================

describe('buildCrossSeriesEdges', () => {
  let loadedOntologies;

  beforeEach(() => {
    loadedOntologies = createLoadedOntologies([
      { namespace: 'vsom:', name: 'VSOM', series: 'VE-Series' },
      { namespace: 'okr:', name: 'OKR', series: 'VE-Series' },
      { namespace: 'vp:', name: 'VP', series: 'VE-Series' },
      { namespace: 'ppm:', name: 'PPM', series: 'PE-Series' },
      { namespace: 'pe:', name: 'PE', series: 'PE-Series' },
      { namespace: 'org:', name: 'ORG', series: 'Foundation' },
    ]);
  });

  it('returns empty array when no cross-series edges exist', () => {
    const crossEdges = [
      createCrossEdge('vsom::Entity1', 'okr::Entity2', 'intra-ref', 'vsom:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toEqual([]);
  });

  it('aggregates cross-series edges between VE and PE', () => {
    const crossEdges = [
      createCrossEdge('vsom::Objective', 'ppm::Portfolio', 'aligns', 'vsom:'),
      createCrossEdge('vp::ValueProp', 'pe::Process', 'enables', 'vp:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toHaveLength(1);
    expect(result[0].from).toBe('PE-Series');
    expect(result[0].to).toBe('VE-Series');
    expect(result[0].count).toBe(2);
    expect(result[0].bridges).toEqual(['aligns', 'enables']);
  });

  it('normalises direction alphabetically to avoid duplicates', () => {
    const crossEdges = [
      createCrossEdge('vsom::A', 'ppm::B', 'forward', 'vsom:'),
      createCrossEdge('ppm::C', 'vsom::D', 'reverse', 'ppm:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toHaveLength(1);
    // PE-Series < VE-Series alphabetically
    expect(result[0].from).toBe('PE-Series');
    expect(result[0].to).toBe('VE-Series');
    expect(result[0].count).toBe(2);
  });

  it('creates separate edges for different series pairs', () => {
    const crossEdges = [
      createCrossEdge('vsom::A', 'ppm::B', 'VE-PE', 'vsom:'),
      createCrossEdge('vsom::C', 'org::D', 'VE-Foundation', 'vsom:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toHaveLength(2);

    const pairs = result.map(r => `${r.from}->${r.to}`).sort();
    expect(pairs).toContain('Foundation->VE-Series');
    expect(pairs).toContain('PE-Series->VE-Series');
  });

  it('skips edges with unknown namespaces', () => {
    const crossEdges = [
      createCrossEdge('vsom::A', 'unknown::B', 'bad-ref', 'vsom:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toEqual([]);
  });

  it('skips edges with unknown source namespace', () => {
    const crossEdges = [
      createCrossEdge('unknown::A', 'ppm::B', 'bad-ref', 'unknown:'),
    ];
    const result = buildCrossSeriesEdges(crossEdges, loadedOntologies);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    const result = buildCrossSeriesEdges([], loadedOntologies);
    expect(result).toEqual([]);
  });
});


// ========================================
// getOntologiesForSeries
// ========================================

describe('getOntologiesForSeries', () => {
  let loadedOntologies;

  beforeEach(() => {
    loadedOntologies = createLoadedOntologies([
      { namespace: 'vsom:', name: 'VSOM', series: 'VE-Series' },
      { namespace: 'okr:', name: 'OKR', series: 'VE-Series' },
      { namespace: 'vp:', name: 'VP', series: 'VE-Series' },
      { namespace: 'ppm:', name: 'PPM', series: 'PE-Series' },
      { namespace: 'pe:', name: 'PE', series: 'PE-Series' },
      { namespace: 'org:', name: 'ORG', series: 'Foundation' },
    ]);
  });

  it('returns VE-Series ontologies', () => {
    const result = getOntologiesForSeries('VE-Series', loadedOntologies);
    expect(result.size).toBe(3);
    expect(result.has('vsom:')).toBe(true);
    expect(result.has('okr:')).toBe(true);
    expect(result.has('vp:')).toBe(true);
  });

  it('returns PE-Series ontologies', () => {
    const result = getOntologiesForSeries('PE-Series', loadedOntologies);
    expect(result.size).toBe(2);
    expect(result.has('ppm:')).toBe(true);
    expect(result.has('pe:')).toBe(true);
  });

  it('returns Foundation ontologies', () => {
    const result = getOntologiesForSeries('Foundation', loadedOntologies);
    expect(result.size).toBe(1);
    expect(result.has('org:')).toBe(true);
  });

  it('returns empty Map for unknown series', () => {
    const result = getOntologiesForSeries('Nonexistent', loadedOntologies);
    expect(result.size).toBe(0);
  });

  it('returns empty Map for empty ontologies', () => {
    const result = getOntologiesForSeries('VE-Series', new Map());
    expect(result.size).toBe(0);
  });

  it('preserves record data in filtered results', () => {
    const result = getOntologiesForSeries('VE-Series', loadedOntologies);
    const vsomRecord = result.get('vsom:');
    expect(vsomRecord.name).toBe('VSOM');
    expect(vsomRecord.series).toBe('VE-Series');
  });
});


// ========================================
// detectCrossReferences — Bug Fix Verification
// TC-5: Both keyBridges and crossOntology properties read
// ========================================

describe('detectCrossReferences — cross-ref property bug fix', () => {
  it('reads bridges from keyBridges property (VP pattern)', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'vp:',
        name: 'VP',
        series: 'VE-Series',
        registryEntry: {
          relationships: {
            keyBridges: [
              { from: 'vp:ValueProposition', to: 'vsom:ObjectivesComponent', name: 'aligns-to' },
            ],
            crossOntology: 8, // count, not array — should be ignored
          },
        },
        rawData: {},
      },
      {
        namespace: 'vsom:',
        name: 'VSOM',
        series: 'VE-Series',
        registryEntry: { relationships: {} },
        rawData: {},
      },
    ]);

    const mergedGraph = {
      nodes: [],
      edges: [],
      nodeIndex: new Map([
        ['vp::ValueProposition', true],
        ['vsom::ObjectivesComponent', true],
      ]),
    };

    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    expect(result.length).toBeGreaterThanOrEqual(1);

    const alignsEdge = result.find(e => e.label === 'aligns-to');
    expect(alignsEdge).toBeDefined();
    expect(alignsEdge.from).toBe('vp::ValueProposition');
    expect(alignsEdge.to).toBe('vsom::ObjectivesComponent');
    expect(alignsEdge.sourceNamespace).toBe('vp:');
  });

  it('reads bridges from crossOntology property (VSOM pattern)', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'vsom:',
        name: 'VSOM',
        series: 'VE-Series',
        registryEntry: {
          relationships: {
            crossOntology: [
              { from: 'vsom:Objective', to: 'okr:KeyResult', name: 'drives' },
            ],
            // no keyBridges property at all
          },
        },
        rawData: {},
      },
      {
        namespace: 'okr:',
        name: 'OKR',
        series: 'VE-Series',
        registryEntry: { relationships: {} },
        rawData: {},
      },
    ]);

    const mergedGraph = {
      nodes: [],
      edges: [],
      nodeIndex: new Map([
        ['vsom::Objective', true],
        ['okr::KeyResult', true],
      ]),
    };

    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    expect(result.length).toBeGreaterThanOrEqual(1);

    const drivesEdge = result.find(e => e.label === 'drives');
    expect(drivesEdge).toBeDefined();
    expect(drivesEdge.from).toBe('vsom::Objective');
    expect(drivesEdge.to).toBe('okr::KeyResult');
    expect(drivesEdge.sourceNamespace).toBe('vsom:');
  });

  it('reads from both keyBridges and crossOntology when both are arrays', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'dual:',
        name: 'Dual',
        series: 'VE-Series',
        registryEntry: {
          relationships: {
            keyBridges: [
              { from: 'dual:A', to: 'other:B', name: 'bridge-link' },
            ],
            crossOntology: [
              { from: 'dual:C', to: 'other:D', name: 'cross-link' },
            ],
          },
        },
        rawData: {},
      },
      {
        namespace: 'other:',
        name: 'Other',
        series: 'PE-Series',
        registryEntry: { relationships: {} },
        rawData: {},
      },
    ]);

    const mergedGraph = {
      nodes: [],
      edges: [],
      nodeIndex: new Map([
        ['dual::A', true],
        ['other::B', true],
        ['dual::C', true],
        ['other::D', true],
      ]),
    };

    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    const labels = result.map(e => e.label);
    expect(labels).toContain('bridge-link');
    expect(labels).toContain('cross-link');
  });

  it('ignores non-array crossOntology (count value like VP)', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'count:',
        name: 'Count',
        series: 'VE-Series',
        registryEntry: {
          relationships: {
            crossOntology: 8, // numeric count, not an array
            // no keyBridges
          },
        },
        rawData: {},
      },
    ]);

    const mergedGraph = { nodes: [], edges: [], nodeIndex: new Map() };
    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    // Should not crash, should return empty (no valid bridges)
    expect(result).toEqual([]);
  });

  it('skips placeholder ontologies', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'placeholder:',
        name: 'Placeholder',
        series: 'VE-Series',
        isPlaceholder: true,
        registryEntry: {
          relationships: {
            crossOntology: [
              { from: 'placeholder:A', to: 'other:B', name: 'should-skip' },
            ],
          },
        },
        rawData: {},
      },
      {
        namespace: 'other:',
        name: 'Other',
        series: 'PE-Series',
        registryEntry: { relationships: {} },
        rawData: {},
      },
    ]);

    const mergedGraph = {
      nodes: [],
      edges: [],
      nodeIndex: new Map([
        ['placeholder::A', true],
        ['other::B', true],
      ]),
    };

    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    expect(result).toEqual([]);
  });

  it('deduplicates edges with the same key', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'src:',
        name: 'Source',
        series: 'VE-Series',
        registryEntry: {
          relationships: {
            keyBridges: [
              { from: 'src:A', to: 'tgt:B', name: 'dup-link' },
            ],
            crossOntology: [
              { from: 'src:A', to: 'tgt:B', name: 'dup-link' },
            ],
          },
        },
        rawData: {},
      },
      {
        namespace: 'tgt:',
        name: 'Target',
        series: 'PE-Series',
        registryEntry: { relationships: {} },
        rawData: {},
      },
    ]);

    const mergedGraph = {
      nodes: [],
      edges: [],
      nodeIndex: new Map([
        ['src::A', true],
        ['tgt::B', true],
      ]),
    };

    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    const dupLinks = result.filter(e => e.label === 'dup-link');
    expect(dupLinks).toHaveLength(1);
  });

  it('handles missing relationships object gracefully', () => {
    const loadedOntologies = createLoadedOntologies([
      {
        namespace: 'norefs:',
        name: 'NoRefs',
        series: 'VE-Series',
        registryEntry: {
          // no relationships property
        },
        rawData: {},
      },
    ]);

    const mergedGraph = { nodes: [], edges: [], nodeIndex: new Map() };
    const result = detectCrossReferences(loadedOntologies, mergedGraph);
    expect(result).toEqual([]);
  });
});
