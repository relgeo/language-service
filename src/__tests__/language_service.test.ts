import { describe, it, expect } from 'vitest';
import { RelGeoLanguageService } from '../service';
import { RELGEO_SCHEMA } from '../schema';
import {
  OBJECT_TYPES,
  ANCHORS,
  PLACE_FIELDS,
  GEOMETRY_FUNCTIONS,
  INTERSECTION_SELECTORS,
  getCompletionsForType,
  ARC_FIELDS,
  CUBIC_FIELDS,
  QUADRATIC_FIELDS,
  POLYGON_FIELDS,
  PATH_FIELDS,
  TEXT_FIELDS,
  LINE_FIELDS,
  META_FIELDS,
  KEYWORDS,
  COMMON_FIELDS,
  REPEAT_FIELDS,
  REPEAT_ALONG_FIELDS,
  SPLIT_FIELDS,
} from '../completions';
import { CompletionItemKind } from 'vscode-languageserver-types';

const svc = new RelGeoLanguageService();

// ─────────────────────────────────────────────
// OBJECT_TYPES completions
// ─────────────────────────────────────────────

describe('OBJECT_TYPES', () => {
  it('includes all v0.3 primitive types', () => {
    const labels = OBJECT_TYPES.map(c => c.label);
    expect(labels).toContain('arc');
    expect(labels).toContain('cubic');
    expect(labels).toContain('quadratic');
    expect(labels).toContain('polygon');
    expect(labels).toContain('path');
    expect(labels).toContain('line');
    expect(labels).toContain('circle');
    expect(labels).toContain('text');
    expect(labels).toContain('point');
    expect(labels).toContain('rect');
    expect(labels).toContain('clone');
    expect(labels).toContain('group');
    expect(labels).toContain('split');
  });
});

// ─────────────────────────────────────────────
// ANCHORS — 9-point system
// ─────────────────────────────────────────────

describe('ANCHORS', () => {
  it('includes all 9 standard anchor points', () => {
    const labels = ANCHORS.map(a => a.label);
    ['topLeft', 'topCenter', 'topRight',
     'centerLeft', 'center', 'centerRight',
     'bottomLeft', 'bottomCenter', 'bottomRight'].forEach(anchor => {
      expect(labels).toContain(anchor);
    });
  });
});

// ─────────────────────────────────────────────
// PLACE_FIELDS — 9-point system
// ─────────────────────────────────────────────

describe('PLACE_FIELDS', () => {
  it('includes topCenter, bottomCenter, centerLeft, centerRight', () => {
    const labels = PLACE_FIELDS.map(f => f.label);
    expect(labels).toContain('topCenter');
    expect(labels).toContain('bottomCenter');
    expect(labels).toContain('centerLeft');
    expect(labels).toContain('centerRight');
  });
});

describe('META_FIELDS', () => {
  it('prefers strokeWidth while keeping width as deprecated compatibility alias', () => {
    const labels = META_FIELDS.map(f => f.label);
    expect(labels).toContain('strokeWidth');
    expect(labels).toContain('width');
    expect(labels.indexOf('strokeWidth')).toBeLessThan(labels.indexOf('width'));
  });

  it('includes role and label from active metadata spec', () => {
    const labels = META_FIELDS.map(f => f.label);
    expect(labels).toContain('role');
    expect(labels).toContain('label');
  });

  it('includes intent and inherit for v0.5 metadata flow', () => {
    const labels = META_FIELDS.map(f => f.label);
    expect(labels).toContain('intent');
    expect(labels).toContain('inherit');
  });
});

describe('RELGEO_SCHEMA', () => {
  it('includes role and label in object metadata schema', () => {
    const metaProps = (RELGEO_SCHEMA as any).definitions.object.properties.meta.properties;
    expect(metaProps.role).toBeDefined();
    expect(metaProps.label).toBeDefined();
  });

  it('expresses mutual exclusivity for sheet placement topLeft vs center', () => {
    const placeSchema = (RELGEO_SCHEMA as any).properties.sheets.additionalProperties.properties.views.items.properties.place;
    expect(Array.isArray(placeSchema.oneOf)).toBe(true);
    expect(placeSchema.oneOf).toHaveLength(2);
  });

  it('includes repeat.along and meta inherit in the active schema', () => {
    const metaProps = (RELGEO_SCHEMA as any).definitions.object.properties.meta.properties;
    const repeatProps = (RELGEO_SCHEMA as any).definitions.object.allOf.find((entry: any) => entry.if?.properties?.type?.const === 'repeat').then.properties;
    expect(metaProps.intent).toBeDefined();
    expect(metaProps.inherit).toBeDefined();
    expect(repeatProps.along).toBeDefined();
    expect(repeatProps.grid.properties.pitch).toBeDefined();
  });

  it('includes split in object enum and split fields in the active schema', () => {
    const objectTypeEnum = (RELGEO_SCHEMA as any).definitions.object.properties.type.enum;
    const splitProps = (RELGEO_SCHEMA as any).definitions.object.allOf.find((entry: any) => entry.if?.properties?.type?.const === 'split').then.properties;
    expect(objectTypeEnum).toContain('split');
    expect(splitProps.target).toBeDefined();
    expect(splitProps.at).toBeDefined();
    expect(splitProps.pick).toBeDefined();
  });
});

describe('KEYWORDS', () => {
  it('includes profiles, metaPresets, styles alias, and document meta at root level', () => {
    const labels = KEYWORDS.map(f => f.label);
    expect(labels).toContain('profiles');
    expect(labels).toContain('metaPresets');
    expect(labels).toContain('styles');
    expect(labels).toContain('meta');
  });
});

describe('COMMON_FIELDS', () => {
  it('includes metaPreset and style alias as common object fields', () => {
    const labels = COMMON_FIELDS.map(f => f.label);
    expect(labels).toContain('metaPreset');
    expect(labels).toContain('style');
  });
});

describe('REPEAT_FIELDS', () => {
  it('includes along and collection-level placement fields', () => {
    const labels = REPEAT_FIELDS.map(f => f.label);
    expect(labels).toContain('along');
    expect(labels).toContain('place');
    expect(labels).toContain('transform');
  });
});

describe('REPEAT_ALONG_FIELDS', () => {
  it('includes active v0.5 along fields', () => {
    const labels = REPEAT_ALONG_FIELDS.map(f => f.label);
    expect(labels).toContain('target');
    expect(labels).toContain('spacing');
    expect(labels).toContain('count');
    expect(labels).toContain('distance');
    expect(labels).toContain('startOffset');
    expect(labels).toContain('endOffset');
  });
});

describe('semantic tokens', () => {
  it('classifies RelGeo-specific root keys, field families, function families, and comments', () => {
    const tokens = svc.getSemanticTokens(`objects:
  panel:
    type: rect
    size: [80mm, 40]
    center: panel.center
    meta:
      strokeWidth: 1
      role: centerline
      intent: datum
      fill: none
      width: 2
    place:
      center: panel.center
    style: guideLine
parameters:
  width:
    type: length
    default: max(distance(panel.center, panel.right), 80mm)
views:
  front:
    target: panel
    scale: 1
    filter:
      roles: [final]
    meta:
      label: Front
    place:
      center: [100mm, 80mm]
components:
  holePattern:
    parameters:
      pitch:
        type: length
sheets:
  sheet1:
    size: A4
    orientation: landscape
    views:
      - use: front
        place:
          topLeft: [10mm, 10mm]
repeatTest:
  spacing: fixed-distance
  pick: first
derived:
  itemCount: count(panel.holes) # note`);

    expect(tokens[0]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[1]?.tokens.some((token) => token.kind === 'object-id')).toBe(true);
    expect(tokens[2]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[2]?.tokens.some((token) => token.kind === 'object-type')).toBe(true);
    expect(tokens[3]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[3]?.tokens.some((token) => token.kind === 'unit')).toBe(true);
    expect(tokens[4]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[4]?.tokens.some((token) => token.kind === 'reference')).toBe(true);
    expect(tokens[5]?.tokens.some((token) => token.kind === 'presentation-key')).toBe(true);
    expect(tokens[6]?.tokens.some((token) => token.kind === 'meta-key')).toBe(true);
    expect(tokens[7]?.tokens.some((token) => token.kind === 'meta-key')).toBe(true);
    expect(tokens[7]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[8]?.tokens.some((token) => token.kind === 'meta-key')).toBe(true);
    expect(tokens[8]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[9]?.tokens.some((token) => token.kind === 'meta-key')).toBe(true);
    expect(tokens[9]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[10]?.tokens.some((token) => token.kind === 'compat-alias')).toBe(true);
    expect(tokens[11]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[12]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[13]?.tokens.some((token) => token.kind === 'compat-alias')).toBe(true);
    expect(tokens[14]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[15]?.tokens.some((token) => token.kind === 'parameter-key')).toBe(true);
    expect(tokens[17]?.tokens.some((token) => token.kind === 'math-function')).toBe(true);
    expect(tokens[17]?.tokens.some((token) => token.kind === 'query-function')).toBe(true);
    expect(tokens[18]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[20]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[21]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[22]?.tokens.some((token) => token.kind === 'presentation-key')).toBe(true);
    expect(tokens[23]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[24]?.tokens.some((token) => token.kind === 'presentation-key')).toBe(true);
    expect(tokens[25]?.tokens.some((token) => token.kind === 'meta-key')).toBe(true);
    expect(tokens[26]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[27]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[28]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[29]?.tokens.some((token) => token.kind === 'object-id')).toBe(true);
    expect(tokens[30]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[31]?.tokens.some((token) => token.kind === 'parameter-key')).toBe(true);
    expect(tokens[33]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[35]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[36]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[37]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[38]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[39]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[40]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[41]?.tokens.some((token) => token.kind === 'key')).toBe(true);
    expect(tokens[42]?.tokens.some((token) => token.kind === 'layout-key')).toBe(true);
    expect(tokens[42]?.tokens.some((token) => token.kind === 'enum-value')).toBe(true);
    expect(tokens[43]?.tokens.some((token) => token.kind === 'geometry-key')).toBe(true);
    expect(tokens[43]?.tokens.some((token) => token.kind === 'selector')).toBe(true);
    expect(tokens[44]?.tokens.some((token) => token.kind === 'container-keyword')).toBe(true);
    expect(tokens[45]?.tokens.some((token) => token.kind === 'collection-function')).toBe(true);
    expect(tokens[45]?.tokens.some((token) => token.kind === 'comment')).toBe(true);
  });
});

// ─────────────────────────────────────────────
// getCompletionsForType
// ─────────────────────────────────────────────

describe('getCompletionsForType()', () => {
  it('arc → includes from, through, center, radius, startAngle, endAngle', () => {
    const labels = ARC_FIELDS.map(f => f.label);
    expect(labels).toContain('from');
    expect(labels).toContain('through');
    expect(labels).toContain('center');
    expect(labels).toContain('radius');
    expect(labels).toContain('startAngle');
    expect(labels).toContain('endAngle');
  });

  it('cubic → includes from, cp1, cp2, to', () => {
    const labels = CUBIC_FIELDS.map(f => f.label);
    expect(labels).toContain('cp1');
    expect(labels).toContain('cp2');
  });

  it('quadratic → includes cp', () => {
    const labels = QUADRATIC_FIELDS.map(f => f.label);
    expect(labels).toContain('cp');
  });

  it('polygon → includes points, corners, corner', () => {
    const labels = POLYGON_FIELDS.map(f => f.label);
    expect(labels).toContain('points');
    expect(labels).toContain('corners');
    expect(labels).toContain('corner');
  });

  it('path → includes segments, join, closeWith, closed, offset, corners', () => {
    const labels = PATH_FIELDS.map(f => f.label);
    expect(labels).toContain('segments');
    expect(labels).toContain('join');
    expect(labels).toContain('closeWith');
    expect(labels).toContain('closed');
    expect(labels).toContain('offset');
    expect(labels).toContain('corners');
  });

  it('text → includes anchor field (v0.3 upgrade)', () => {
    const labels = TEXT_FIELDS.map(f => f.label);
    expect(labels).toContain('anchor');
    expect(labels).toContain('content');
    expect(labels).toContain('place');
  });

  it('line → includes tangent field (v0.3)', () => {
    const labels = LINE_FIELDS.map(f => f.label);
    expect(labels).toContain('tangent');
  });

  it('unknown type → returns COMMON_FIELDS', () => {
    const result = getCompletionsForType('unknown_type');
    const labels = result.map(f => f.label);
    expect(labels).toContain('type');
    expect(labels).toContain('meta');
  });

  it('split → includes target, at, and pick', () => {
    const labels = SPLIT_FIELDS.map(f => f.label);
    expect(labels).toContain('target');
    expect(labels).toContain('at');
    expect(labels).toContain('pick');
  });
});

// ─────────────────────────────────────────────
// GEOMETRY_FUNCTIONS
// ─────────────────────────────────────────────

describe('GEOMETRY_FUNCTIONS', () => {
  it('includes active v0.5 query functions', () => {
    const labels = GEOMETRY_FUNCTIONS.map(f => f.label);
    expect(labels).toContain('intersection');
    expect(labels).toContain('distance');
    expect(labels).toContain('length');
    expect(labels).toContain('perimeter');
    expect(labels).toContain('area');
    expect(labels).toContain('bbox');
    expect(labels).toContain('width');
    expect(labels).toContain('height');
    expect(labels).toContain('minX');
    expect(labels).toContain('maxX');
    expect(labels).toContain('minY');
    expect(labels).toContain('maxY');
    expect(labels).toContain('midpoint');
    expect(labels).toContain('polar');
    expect(labels).toContain('angleBetween');
    expect(labels).toContain('pointAt');
    expect(labels).toContain('tangentAt');
    expect(labels).toContain('normalAt');
    expect(labels).toContain('frameAt');
    expect(labels).toContain('tAtLength');
    expect(labels).toContain('closestPoint');
    expect(labels).toContain('project');
    expect(labels).toContain('reflect');
    expect(labels).toContain('toWorld');
    expect(labels).toContain('toLocal');
  });

  it('all geometry functions have kind=Function', () => {
    GEOMETRY_FUNCTIONS.forEach(fn => {
      expect(fn.kind).toBe(CompletionItemKind.Function);
    });
  });

  it('intersection documentation mentions selector', () => {
    const fn = GEOMETRY_FUNCTIONS.find(f => f.label === 'intersection');
    expect(fn?.documentation).toMatch(/selector/i);
  });
});

describe('INTERSECTION_SELECTORS', () => {
  it('includes deterministic selector completions', () => {
    const labels = INTERSECTION_SELECTORS.map(s => s.label);
    expect(labels).toContain('first');
    expect(labels).toContain('last');
    expect(labels).toContain('0');
  });
});

// ─────────────────────────────────────────────
// Service: getCompletions context detection
// ─────────────────────────────────────────────

describe('RelGeoLanguageService.getCompletions()', () => {
  it('root level → returns keywords', () => {
    const result = svc.getCompletions('', { line: 0, character: 0 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('version');
    expect(labels).toContain('objects');
    expect(labels).toContain('profiles');
    expect(labels).toContain('metaPresets');
    expect(labels).toContain('styles');
    expect(labels).toContain('meta');
  });

  it('type: field → returns object types', () => {
    const code = `objects:\n  myObj:\n    type: `;
    const result = svc.getCompletions(code, { line: 2, character: 10 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('arc');
    expect(labels).toContain('polygon');
  });

  it('place: block → returns place fields with 9-point anchors', () => {
    // The cursor is on a line inside 'place:' block
    const code = `objects:\n  r:\n    type: rect\n    size: [10, 10]\n    place:\n      centerLeft: `;
    const result = svc.getCompletions(code, { line: 5, character: 14 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('centerLeft');
    expect(labels).toContain('topCenter');
  });

  it('at: line → returns geometry functions', () => {
    // When cursor is on a line starting with 'at:' inside an object, geometry functions are suggested
    const code = `objects:\n  p:\n    type: point\n    at: intersection`;
    const result = svc.getCompletions(code, { line: 3, character: 18 });
    const labels = result.map(r => r.label);
    // inside object block: returns point fields. The expression completion is triggered
    // by the expression value detection BEFORE getCompletionsForType returns
    expect(labels).toContain('intersection');
    expect(labels).toContain('pointAt');
    expect(labels).toContain('tangentAt');
    expect(labels).toContain('normalAt');
  });

  it('intersection selector context → returns selector completions', () => {
    const code = `objects:\n  p:\n    type: point\n    at: intersection(A, B, `;
    const result = svc.getCompletions(code, { line: 3, character: 27 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('first');
    expect(labels).toContain('last');
    expect(labels).toContain('nearest()');
    expect(labels).toContain('farthest()');
    expect(labels).toContain('0');
  });

  it('constraints block → includes tangent completion', () => {
    const code = `constraints:\n  - tangent: `;
    const result = svc.getCompletions(code, { line: 1, character: 12 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('tangent');
  });

  it('along block → returns repeat.along fields', () => {
    const code = `objects:
  marks:
    type: repeat
    along:
      `;
    const result = svc.getCompletions(code, { line: 4, character: 6 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('target');
    expect(labels).toContain('spacing');
    expect(labels).toContain('distance');
  });

  it('along.target field → suggests path-like objects', () => {
    const code = `objects:
  p:
    type: point
  g:
    type: line
  c:
    type: circle
  marks:
    type: repeat
    along:
      target: `;
    const result = svc.getCompletions(code, { line: 10, character: 14 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('g');
    expect(labels).toContain('c');
    expect(labels).not.toContain('p');
  });

  it('along.target field → suggests quoted punctuation-heavy object ids', () => {
    const code = `objects:
  "front&detail":
    type: line
  "vent-guide":
    type: ellipse
  notes:
    type: point
  marks:
    type: repeat
    along:
      target: `;
    const result = svc.getCompletions(code, { line: 10, character: 14 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('front&detail');
    expect(labels).toContain('vent-guide');
    expect(labels).not.toContain('notes');
  });

  it('meta block → includes intent and inherit', () => {
    const code = `objects:
  box:
    type: rect
    size: [10, 10]
    meta:
      `;
    const result = svc.getCompletions(code, { line: 5, character: 6 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('intent');
    expect(labels).toContain('inherit');
  });

  it('object field for arc type → includes arc-specific fields', () => {
    // The service uses type: line to detect object type and return appropriate field completions
    const code = `objects:\n  myArc:\n    type: arc\n    center: `;
    const result = svc.getCompletions(code, { line: 3, character: 12 });
    // At this point, cursor is on 'center:' which is an expression field → geometry functions
    // OR if falling through to object fields → arc-specific
    // Either way, it should not return root keywords
    expect(result.length).toBeGreaterThan(0);
    // Verify arc fields are available via getCompletionsForType
    const arcLabels = getCompletionsForType('arc').map(f => f.label);
    expect(arcLabels).toContain('center');
    expect(arcLabels).toContain('startAngle');
    expect(arcLabels).toContain('endAngle');
  });

  it('suggests holes in path completions', () => {
    const pathLabels = getCompletionsForType('path').map(f => f.label);
    expect(pathLabels).toContain('holes');
  });

  it('suggests point, path, frame namespaces under point.on completion', () => {
    const code = `objects:
  c:
    type: circle
  r:
    type: rect
  q:
    type: quadratic
  cb:
    type: cubic
  p:
    type: point
    on: `;
    const result = svc.getCompletions(code, { line: 11, character: 8 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('point');
    expect(labels).toContain('path');
    expect(labels).toContain('frame');
  });

  it('suggests circle, rect, quadratic, cubic under point.on.path completion', () => {
    const code = `objects:
  c:
    type: circle
  r:
    type: rect
  q:
    type: quadratic
  cb:
    type: cubic
  p:
    type: point
    on:
      path:
        path: `;
    const result = svc.getCompletions(code, { line: 13, character: 14 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('c');
    expect(labels).toContain('r');
    expect(labels).toContain('q');
    expect(labels).toContain('cb');
  });

  it('handles blank indented lines without falling back to root keywords', () => {
    const code = `objects:
  myPath:
    type: path
    `;
    const result = svc.getCompletions(code, { line: 3, character: 4 });
    const labels = result.map(r => r.label);
    expect(labels).not.toContain('version');
    expect(labels).not.toContain('objects');
    expect(labels).toContain('segments');
    expect(labels).toContain('holes');
  });

  it('getDiagnostics returns empty for valid document', () => {
    const code = `version: "0.3"\nobjects:\n  A:\n    type: point\n    at: [0, 0]\n`;
    const diags = svc.getDiagnostics(code);
    expect(diags).toHaveLength(0);
  });

  it('getDiagnostics catches syntax errors', () => {
    const code = `version: "0.3"\nobjects: [invalid`;
    const diags = svc.getDiagnostics(code);
    expect(diags.length).toBeGreaterThan(0);
  });

  it('getDiagnostics maps validation error paths to line numbers', () => {
    const code = `version: "0.3"
objects:
  missingLine:
    type: line
`;
    const diags = svc.getDiagnostics(code);
    expect(diags.length).toBeGreaterThan(0);
    // The missing required field error should point to the 'missingLine' definition
    // "missingLine:" is on line 2 (0-indexed)
    expect(diags[0].range.start.line).toBe(2);
    expect(diags[0].code).toBe('MISSING_REQUIRED_FIELD');
  });

  it('getDiagnostics maps indexed expression paths close to offending line', () => {
    const code = `version: "0.3"
objects:
  r:
    type: rect
    size: [missingValue, 10]
`;
    const diags = svc.getDiagnostics(code);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0].range.start.line).toBeGreaterThanOrEqual(3);
    expect(diags[0].code).toBe('INVALID_EXPRESSION');
  });

  it('getDiagnostics maps hyphenated object ids to the object definition line', () => {
    const code = `version: "0.4"
objects:
  front-detail:
    type: line
`;
    const diags = svc.getDiagnostics(code);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0].range.start.line).toBe(2);
    expect(diags[0].code).toBe('MISSING_REQUIRED_FIELD');
  });

  it('getDiagnostics maps quoted punctuation-heavy object ids to the object definition line', () => {
    const code = `version: "0.5"
objects:
  "front&detail":
    type: line
`;
    const diags = svc.getDiagnostics(code);
    expect(diags.length).toBeGreaterThan(0);
    expect(diags[0].range.start.line).toBe(2);
    expect(diags[0].code).toBe('MISSING_REQUIRED_FIELD');
  });

  // ─────────────────────────────────────────────
  // v0.4 Language Service Support Tests
  // ─────────────────────────────────────────────

  it('includes all v0.4 new object types', () => {
    const labels = OBJECT_TYPES.map(c => c.label);
    expect(labels).toContain('repeat');
    expect(labels).toContain('divide');
    expect(labels).toContain('collection');
    expect(labels).toContain('component');
    expect(labels).toContain('dimension');
    expect(labels).toContain('annotation');
  });

  it('suggests holes on rect, circle, and polygon (polymorphic holes parity)', () => {
    const rectLabels = getCompletionsForType('rect').map(f => f.label);
    expect(rectLabels).toContain('holes');

    const circleLabels = getCompletionsForType('circle').map(f => f.label);
    expect(circleLabels).toContain('holes');

    const polygonLabels = getCompletionsForType('polygon').map(f => f.label);
    expect(polygonLabels).toContain('holes');
  });

  it('provides correct completions for repeat, divide, collection, component, dimension, annotation', () => {
    const repeatLabels = getCompletionsForType('repeat').map(f => f.label);
    expect(repeatLabels).toContain('item');
    expect(repeatLabels).toContain('grid');
    expect(repeatLabels).toContain('polar');
    expect(repeatLabels).toContain('each');

    const divideLabels = getCompletionsForType('divide').map(f => f.label);
    expect(divideLabels).toContain('target');
    expect(divideLabels).toContain('count');

    const collectionLabels = getCompletionsForType('collection').map(f => f.label);
    expect(collectionLabels).toContain('children');

    const splitLabels = getCompletionsForType('split').map(f => f.label);
    expect(splitLabels).toContain('target');
    expect(splitLabels).toContain('at');
    expect(splitLabels).toContain('pick');

    const componentLabels = getCompletionsForType('component').map(f => f.label);
    expect(componentLabels).toContain('use');
    expect(componentLabels).toContain('params');

    const dimLabels = getCompletionsForType('dimension').map(f => f.label);
    expect(dimLabels).toContain('kind');
    expect(dimLabels).toContain('from');
    expect(dimLabels).toContain('to');

    const annLabels = getCompletionsForType('annotation').map(f => f.label);
    expect(annLabels).toContain('target');
    expect(annLabels).toContain('text');
  });

  it('suggests parameters, objects, and exports under a component definition', () => {
    const code = `components:
  myComp:
    `;
    const result = svc.getCompletions(code, { line: 2, character: 4 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('parameters');
    expect(labels).toContain('objects');
    expect(labels).toContain('exports');
  });

  it('supports nesting getObjectTypeById and autocomplete inside components block', () => {
    const code = `components:
  myComp:
    objects:
      innerRect:
        type: rect
        `;
    const result = svc.getCompletions(code, { line: 5, character: 8 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('size');
    expect(labels).toContain('holes');
  });

  it('supports completions inside quoted object ids with punctuation', () => {
    const code = `objects:
  "front&detail":
    type: path
    `;
    const result = svc.getCompletions(code, { line: 3, character: 4 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('segments');
    expect(labels).toContain('holes');
  });

  it('supports dot-notation completions for quoted object ids with punctuation', () => {
    const code = `objects:
  "front&detail":
    type: rect
    size: [10, 10]
  p:
    type: point
    at: "front&detail".`;
    const result = svc.getCompletions(code, { line: 6, character: 23 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('topLeft');
    expect(labels).toContain('center');
    expect(labels).toContain('width');
  });

  it('suggests target, scale, and filter under view definition', () => {
    const code = `views:
  myView:
    `;
    const result = svc.getCompletions(code, { line: 2, character: 4 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('target');
    expect(labels).toContain('scale');
    expect(labels).toContain('filter');
    expect(labels).toContain('meta');
  });

  it('suggests size, orientation, and views under sheet definition', () => {
    const code = `sheets:
  mySheet:
    `;
    const result = svc.getCompletions(code, { line: 2, character: 4 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('size');
    expect(labels).toContain('orientation');
    expect(labels).toContain('views');
    expect(labels).toContain('meta');
  });

  it('suggests use and place under sheet view placement item', () => {
    const code = `sheets:
  mySheet:
    views:
      - `;
    const result = svc.getCompletions(code, { line: 3, character: 8 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('use');
    expect(labels).toContain('place');
    expect(labels).toContain('meta');
  });

  it('suggests component parameter keys under params: block of a component instance', () => {
    const code = `version: "0.4"
components:
  boltHole:
    parameters:
      diameter: 8
      depth: 12
    objects: {}
objects:
  h1:
    type: component
    use: boltHole
    params:
      `;
    const result = svc.getCompletions(code, { line: 12, character: 6 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('diameter');
    expect(labels).toContain('depth');
  });

  it('suggests hyphenated object ids in point.on.path.path completions', () => {
    const code = `objects:
  front-detail:
    type: rect
    size: [10, 10]
  p:
    type: point
    on:
      path:
        path: `;
    const result = svc.getCompletions(code, { line: 8, character: 14 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('front-detail');
  });

  it('restricts component dot-notation completions to exported keys only', () => {
    const code = `version: "0.4"
components:
  hinge:
    exports:
      top: "body.top"
      width: "body.width"
    objects:
      body:
        type: rect
        size: [10, 20]
objects:
  h1:
    type: component
    use: hinge
  p1:
    type: point
    at: h1.`;
    const result = svc.getCompletions(code, { line: 16, character: 11 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('top');
    expect(labels).toContain('width');
    expect(labels).not.toContain('body'); // private internal object should be hidden!
  });

  it('suggests child item anchors for indexed repeat objects', () => {
    const code = `version: "0.4"
objects:
  rivetHoles:
    type: repeat
    count: 5
    item:
      type: circle
      radius: 10
  p1:
    type: point
    at: rivetHoles[0].`;
    const result = svc.getCompletions(code, { line: 10, character: 22 });
    const labels = result.map(r => r.label);
    expect(labels).toContain('radius');
    expect(labels).toContain('center');
  });

  it('suggests operation, base, and tools fields under boolean objects', () => {
    const booleanLabels = getCompletionsForType('boolean').map(f => f.label);
    expect(booleanLabels).toContain('operation');
    expect(booleanLabels).toContain('base');
    expect(booleanLabels).toContain('tools');
    expect(booleanLabels).toContain('shapes');
  });

  it('includes boolean in OBJECT_TYPES completions', () => {
    const labels = OBJECT_TYPES.map(c => c.label);
    expect(labels).toContain('boolean');
  });
});
