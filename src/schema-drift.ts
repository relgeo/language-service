import { COMPLETION_CATALOGS, getCompletionsForType, KEYWORDS, OBJECT_TYPES } from './completions';
import { RELGEO_SCHEMA } from './schema';

export type SchemaDriftCategory =
  | 'root-sections'
  | 'object-types'
  | 'object-fields'
  | 'parameter-fields'
  | 'view-fields'
  | 'sheet-fields'
  | 'presentation-fields';

export interface SchemaDriftDifference {
  category: SchemaDriftCategory;
  context: string;
  missing: string[];
  extra: string[];
}

export interface SchemaDriftReport {
  ok: boolean;
  checked: {
    rootSections: number;
    objectTypes: number;
    objectFields: number;
    parameterFields: number;
    viewFields: number;
    sheetFields: number;
    presentationFields: number;
  };
  differences: SchemaDriftDifference[];
}

/**
 * Active v0.5 vocabulary snapshot. Root sections are defined by
 * spec/id/core/02-document-structure.md, with the documented `styles`
 * compatibility alias retained; the remaining groups are the published
 * editor contract for the same active line.
 */
export const ACTIVE_SCHEMA_VOCABULARY = {
  rootSections: [
    'version', 'scene', 'parameters', 'constants', 'derived', 'profiles',
    'metaPresets', 'styles', 'objects', 'constraints', 'components', 'views',
    'sheets', 'meta',
  ],
  objectTypes: [
    'point', 'line', 'rect', 'circle', 'ellipse', 'group', 'text', 'path',
    'polygon', 'clone', 'arc', 'cubic', 'quadratic', 'repeat', 'divide',
    'collection', 'component', 'dimension', 'annotation', 'boolean', 'split',
  ],
  parameterFields: ['type', 'default', 'min', 'max', 'step', 'label', 'options'],
  viewFields: ['target', 'scale', 'meta', 'filter'],
  sheetFields: ['size', 'orientation', 'meta', 'views'],
  presentationFields: [
    'visible', 'role', 'intent', 'inherit', 'stroke', 'fill', 'strokeWidth',
    'width', 'opacity', 'label', 'dash', 'fontSize', 'fontFamily',
    'fontWeight', 'fontStyle', 'lineHeight', 'hairline', 'non-scaling-stroke',
  ],
} as const;

function sortedUnique(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

function compareSets(
  differences: SchemaDriftDifference[],
  category: SchemaDriftCategory,
  context: string,
  expected: Iterable<string>,
  actual: Iterable<string>,
): void {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = sortedUnique([...expectedSet].filter((value) => !actualSet.has(value)));
  const extra = sortedUnique([...actualSet].filter((value) => !expectedSet.has(value)));
  if (missing.length || extra.length) {
    differences.push({ category, context, missing, extra });
  }
}

function objectFieldsFromSchema(schema: Record<string, any>, type: string): string[] {
  const objectDefinition = schema.definitions?.object;
  const fields = new Set<string>(Object.keys(objectDefinition?.properties ?? {}));
  for (const branch of objectDefinition?.allOf ?? []) {
    if (branch?.if?.properties?.type?.const !== type) continue;
    for (const field of Object.keys(branch.then?.properties ?? {})) fields.add(field);
  }
  return [...fields];
}

function nestedFields(schema: Record<string, any>, path: string[]): string[] {
  let current: any = schema;
  for (const segment of path) current = current?.[segment];
  return Object.keys(current?.properties ?? {});
}

/**
 * Compare the schema and editor catalogs against the bounded active v0.5
 * vocabulary. The report is deterministic and serializable, making it useful
 * both for focused tests and for a future generated spec-vocabulary check.
 */
export function getSchemaDriftReport(schema: Record<string, any> = RELGEO_SCHEMA): SchemaDriftReport {
  const differences: SchemaDriftDifference[] = [];
  const rootSchema = Object.keys(schema.properties ?? {});
  const rootCompletions = KEYWORDS.map((item) => item.label);
  const objectTypesSchema = schema.definitions?.object?.properties?.type?.enum?.filter(
    (value: unknown): value is string => typeof value === 'string',
  ) ?? [];
  const objectTypesCompletions = OBJECT_TYPES.map((item) => item.label);

  compareSets(differences, 'root-sections', 'schema', ACTIVE_SCHEMA_VOCABULARY.rootSections, rootSchema);
  compareSets(differences, 'root-sections', 'completion-catalog', ACTIVE_SCHEMA_VOCABULARY.rootSections, rootCompletions);
  compareSets(differences, 'object-types', 'schema', ACTIVE_SCHEMA_VOCABULARY.objectTypes, objectTypesSchema);
  compareSets(differences, 'object-types', 'completion-catalog', ACTIVE_SCHEMA_VOCABULARY.objectTypes, objectTypesCompletions);

  for (const type of ACTIVE_SCHEMA_VOCABULARY.objectTypes) {
    compareSets(
      differences,
      'object-fields',
      `${type}:schema-to-completion`,
      objectFieldsFromSchema(schema, type),
      getCompletionsForType(type).map((item) => item.label),
    );
  }

  const parameterSchema = nestedFields(schema, ['properties', 'parameters', 'additionalProperties', 'oneOf', '1']);
  const viewSchema = nestedFields(schema, ['properties', 'views', 'additionalProperties']);
  const sheetSchema = nestedFields(schema, ['properties', 'sheets', 'additionalProperties']);
  const presentationSchema = nestedFields(schema, ['definitions', 'object', 'properties', 'meta']);
  compareSets(differences, 'parameter-fields', 'schema', ACTIVE_SCHEMA_VOCABULARY.parameterFields, parameterSchema);
  compareSets(differences, 'view-fields', 'schema', ACTIVE_SCHEMA_VOCABULARY.viewFields, viewSchema);
  compareSets(differences, 'sheet-fields', 'schema', ACTIVE_SCHEMA_VOCABULARY.sheetFields, sheetSchema);
  compareSets(differences, 'presentation-fields', 'schema', ACTIVE_SCHEMA_VOCABULARY.presentationFields, presentationSchema);
  compareSets(
    differences,
    'presentation-fields',
    'completion-catalog',
    ACTIVE_SCHEMA_VOCABULARY.presentationFields,
    COMPLETION_CATALOGS.presentation.map((item) => item.label),
  );

  return {
    ok: differences.length === 0,
    checked: {
      rootSections: ACTIVE_SCHEMA_VOCABULARY.rootSections.length,
      objectTypes: ACTIVE_SCHEMA_VOCABULARY.objectTypes.length,
      objectFields: ACTIVE_SCHEMA_VOCABULARY.objectTypes.length,
      parameterFields: ACTIVE_SCHEMA_VOCABULARY.parameterFields.length,
      viewFields: ACTIVE_SCHEMA_VOCABULARY.viewFields.length,
      sheetFields: ACTIVE_SCHEMA_VOCABULARY.sheetFields.length,
      presentationFields: ACTIVE_SCHEMA_VOCABULARY.presentationFields.length,
    },
    differences,
  };
}
