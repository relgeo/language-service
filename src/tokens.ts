import {
  ANCHORS,
  COLLECTION_FUNCTIONS,
  GEOMETRY_FUNCTIONS,
  KEYWORDS,
  MATH_FUNCTIONS,
  OBJECT_TYPES,
} from './completions';

export type RelGeoSemanticTokenKind =
  | 'keyword'
  | 'container-keyword'
  | 'key'
  | 'geometry-key'
  | 'presentation-key'
  | 'layout-key'
  | 'parameter-key'
  | 'meta-key'
  | 'meta-preset-key'
  | 'component-param-key'
  | 'object-id'
  | 'object-type'
  | 'enum-value'
  | 'selector'
  | 'compat-alias'
  | 'string'
  | 'number'
  | 'unit'
  | 'angle'
  | 'boolean'
  | 'function'
  | 'query-function'
  | 'math-function'
  | 'collection-function'
  | 'anchor'
  | 'reference'
  | 'identifier'
  | 'operator'
  | 'punctuation'
  | 'comment';

export interface RelGeoSemanticToken {
  start: number;
  end: number;
  kind: RelGeoSemanticTokenKind;
}

export interface RelGeoSemanticLine {
  line: number;
  tokens: RelGeoSemanticToken[];
}

type StackItem = {
  indent: number;
  key: string;
};

type YamlKeySegment = {
  key: string;
  keyStart: number;
  keyEnd: number;
  colonIndex: number;
  valueStart: number;
};

type ValueContext = {
  key?: string;
  parentPath: string[];
};

const ROOT_KEYWORDS = new Set(KEYWORDS.map((item) => item.label));
const CONTAINER_KEYWORDS = new Set([
  'objects',
  'components',
  'views',
  'sheets',
  'parameters',
  'constants',
  'derived',
  'profiles',
  'metaPresets',
  'styles',
  'constraints',
]);
const OBJECT_TYPE_KEYWORDS = new Set(OBJECT_TYPES.map((item) => item.label));
const ANCHOR_KEYWORDS = new Set(ANCHORS.map((item) => item.label));
const QUERY_FUNCTION_KEYWORDS = new Set(GEOMETRY_FUNCTIONS.map((item) => item.label));
const MATH_FUNCTION_KEYWORDS = new Set(MATH_FUNCTIONS.map((item) => item.label));
const COLLECTION_FUNCTION_KEYWORDS = new Set(COLLECTION_FUNCTIONS.map((item) => item.label));
const BOOLEAN_KEYWORDS = new Set(['true', 'false']);
const ENTITY_ID_CONTAINERS = new Set(['objects', 'components', 'views', 'sheets']);
const PARAMETER_CONTAINERS = new Set(['parameters']);
const META_PRESET_CONTAINERS = new Set(['metaPresets', 'styles']);
const META_BLOCK_KEYS = new Set(['meta']);
const GEOMETRY_KEYS = new Set([
  'type',
  'at',
  'from',
  'to',
  'move',
  'on',
  'direction',
  'length',
  'tangent',
  'size',
  'holes',
  'center',
  'radius',
  'through',
  'rx',
  'ry',
  'rotation',
  'content',
  'points',
  'segments',
  'join',
  'closed',
  'closeWith',
  'offset',
  'corners',
  'corner',
  'cp',
  'cp1',
  'cp2',
  'startAngle',
  'endAngle',
  'item',
  'grid',
  'polar',
  'along',
  'each',
  'target',
  'distance',
  'count',
  'children',
  'pick',
  'use',
  'params',
  'kind',
  'between',
  'text',
  'leader',
  'operation',
  'shapes',
  'base',
  'tools',
  'result',
]);
const PRESENTATION_KEYS = new Set([
  'meta',
  'metaPreset',
  'style',
  'anchors',
  'filter',
]);
const LAYOUT_KEYS = new Set([
  'place',
  'transform',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'topCenter',
  'bottomCenter',
  'centerLeft',
  'centerRight',
  'centerX',
  'centerY',
  'left',
  'right',
  'top',
  'bottom',
  'inside',
  'margin',
  'align',
  'path',
  'point',
  'frame',
  'spacing',
  'startOffset',
  'endOffset',
  't',
  'scale',
  'orientation',
  'views',
]);
const REFERENCE_VALUE_KEYS = new Set([
  'at',
  'from',
  'to',
  'center',
  'through',
  'target',
  'path',
  'use',
  'anchor',
  'point',
  'frame',
  'source',
]);
const SELECTOR_VALUES = new Set(['first', 'last']);
const SPACING_MODE_VALUES = new Set(['uniform-length', 'uniform-t', 'fixed-distance']);
const ORIENTATION_VALUES = new Set(['portrait', 'landscape']);
const ROLE_VALUES = new Set(['final', 'construction', 'guide', 'centerline', 'hidden']);
const INTENT_VALUES = new Set([
  'datum',
  'centerline',
  'baseline',
  'clearance-hole',
  'cut-boundary',
]);
const META_LITERAL_VALUES = new Set(['none', 'hairline', 'non-scaling-stroke']);
const COMPAT_ALIAS_KEYS = new Set(['style', 'styles', 'width']);

function getIndent(line: string): number {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

function findCommentStart(line: string): number {
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const previous = i > 0 ? line[i - 1] : '';

    if (quote) {
      if (char === quote && previous !== '\\') {
        quote = null;
      }
      continue;
    }

    if ((char === '"' || char === "'") && previous !== '\\') {
      quote = char;
      continue;
    }

    if (char === '#') {
      return i;
    }
  }

  return -1;
}

function trimQuotedKey(raw: string): string {
  const value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function findYamlKeySegment(line: string): YamlKeySegment | null {
  let index = 0;
  while (index < line.length && /\s/.test(line[index])) index += 1;

  if (line[index] === '-') {
    index += 1;
    while (index < line.length && /\s/.test(line[index])) index += 1;
  }

  if (index >= line.length) return null;

  let quote: '"' | "'" | null = null;
  const keyStart = index;

  for (let i = index; i < line.length; i += 1) {
    const char = line[i];
    const previous = i > keyStart ? line[i - 1] : '';

    if (quote) {
      if (char === quote && previous !== '\\') {
        quote = null;
      }
      continue;
    }

    if ((char === '"' || char === "'") && previous !== '\\') {
      quote = char;
      continue;
    }

    if (char === ':') {
      let keyEnd = i;
      while (keyEnd > keyStart && /\s/.test(line[keyEnd - 1])) keyEnd -= 1;
      const rawKey = line.slice(keyStart, keyEnd);
      if (!rawKey.trim()) return null;
      return {
        key: trimQuotedKey(rawKey),
        keyStart,
        keyEnd,
        colonIndex: i,
        valueStart: i + 1,
      };
    }
  }

  return null;
}

function isNumberStart(char: string): boolean {
  return /\d/.test(char);
}

function classifyKey(key: string, parentPath: string[]): RelGeoSemanticTokenKind {
  if (parentPath.length === 0 && ROOT_KEYWORDS.has(key)) {
    return CONTAINER_KEYWORDS.has(key) ? 'container-keyword' : 'keyword';
  }

  if (key === 'parameters') {
    return 'container-keyword';
  }

  if (parentPath.length === 1 && ENTITY_ID_CONTAINERS.has(parentPath[0])) {
    return 'object-id';
  }

  if (parentPath.length === 1 && PARAMETER_CONTAINERS.has(parentPath[0])) {
    return 'parameter-key';
  }

  if (parentPath[parentPath.length - 1] === 'parameters') {
    return 'parameter-key';
  }

  if (parentPath.length === 1 && META_PRESET_CONTAINERS.has(parentPath[0])) {
    return 'meta-preset-key';
  }

  if (parentPath[parentPath.length - 1] === 'params') {
    return 'component-param-key';
  }

  if (COMPAT_ALIAS_KEYS.has(key)) {
    return 'compat-alias';
  }

  if (parentPath.some((segment) => META_BLOCK_KEYS.has(segment))) {
    return 'meta-key';
  }

  if (PRESENTATION_KEYS.has(key)) {
    return 'presentation-key';
  }

  if (isLayoutKey(key, parentPath)) {
    return 'layout-key';
  }

  if (GEOMETRY_KEYS.has(key)) {
    return 'geometry-key';
  }

  return 'key';
}

function isLayoutKey(key: string, parentPath: string[]): boolean {
  const lastParent = parentPath[parentPath.length - 1];
  const rootParent = parentPath[0];

  if (key === 'place' || key === 'transform') return true;

  if (lastParent === 'place') {
    return (
      key === 'anchor' ||
      key === 'center' ||
      LAYOUT_KEYS.has(key)
    );
  }

  if (lastParent === 'along') {
    return key === 'spacing' || key === 'startOffset' || key === 'endOffset';
  }

  if (rootParent === 'views') {
    return key === 'scale' || key === 'place';
  }

  if (rootParent === 'sheets') {
    return key === 'size' || key === 'orientation' || key === 'views' || key === 'place';
  }

  return LAYOUT_KEYS.has(key);
}

function shouldTreatIdentifierAsReference(
  value: string,
  index: number,
  word: string,
  context: ValueContext
): boolean {
  if (REFERENCE_VALUE_KEYS.has(context.key ?? '')) return true;

  const previous = index > 0 ? value[index - 1] : '';
  const next = index + word.length < value.length ? value[index + word.length] : '';
  return previous === '.' || next === '.';
}

function tokenizeValue(
  value: string,
  startOffset: number,
  context: ValueContext
): RelGeoSemanticToken[] {
  const tokens: RelGeoSemanticToken[] = [];
  let index = 0;

  const push = (start: number, end: number, kind: RelGeoSemanticTokenKind) => {
    tokens.push({ start: startOffset + start, end: startOffset + end, kind });
  };

  while (index < value.length) {
    const char = value[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      let end = index + 1;
      while (end < value.length) {
        if (value[end] === quote && value[end - 1] !== '\\') {
          end += 1;
          break;
        }
        end += 1;
      }
      push(index, end, 'string');
      index = end;
      continue;
    }

    const operatorMatch = value.slice(index).match(/^(==|!=|<=|>=|\|\||&&|->)/);
    if (operatorMatch) {
      push(index, index + operatorMatch[0].length, 'operator');
      index += operatorMatch[0].length;
      continue;
    }

    if ('[]{}(),'.includes(char)) {
      push(index, index + 1, 'punctuation');
      index += 1;
      continue;
    }

    if ('+-*/%<>?=:.'.includes(char)) {
      push(index, index + 1, 'operator');
      index += 1;
      continue;
    }

    const numericMatch = value
      .slice(index)
      .match(/^\d+(?:\.\d+)?(?:deg|rad|mm|cm|m|px|pt|in|ft|yd|km|%)?/);
    if (numericMatch) {
      const token = numericMatch[0];
      let kind: RelGeoSemanticTokenKind = 'number';

      if (/(deg|rad)$/.test(token)) kind = 'angle';
      else if (/[a-zA-Z%]+$/.test(token)) kind = 'unit';

      push(index, index + token.length, kind);
      index += token.length;
      continue;
    }

    const identifierMatch = value.slice(index).match(/^[A-Za-z_][\w&-]*/);
    if (identifierMatch) {
      const word = identifierMatch[0];
      let kind: RelGeoSemanticTokenKind = 'identifier';

      if (BOOLEAN_KEYWORDS.has(word)) {
        kind = 'boolean';
      } else if (SELECTOR_VALUES.has(word) && isSelectorContext(context)) {
        kind = 'selector';
      } else if (SPACING_MODE_VALUES.has(word) && context.key === 'spacing') {
        kind = 'enum-value';
      } else if (ORIENTATION_VALUES.has(word) && context.key === 'orientation') {
        kind = 'enum-value';
      } else if (ROLE_VALUES.has(word) && isRoleContext(context)) {
        kind = 'enum-value';
      } else if (INTENT_VALUES.has(word) && context.key === 'intent') {
        kind = 'enum-value';
      } else if (META_LITERAL_VALUES.has(word) && isMetaLiteralContext(context)) {
        kind = 'enum-value';
      } else if ((context.key ?? '') === 'type' && OBJECT_TYPE_KEYWORDS.has(word)) {
        kind = 'object-type';
      } else if (QUERY_FUNCTION_KEYWORDS.has(word)) {
        const nextNonSpace = value.slice(index + word.length).match(/^\s*(.)/);
        if (nextNonSpace?.[1] === '(') {
          kind = 'query-function';
        }
      } else if (MATH_FUNCTION_KEYWORDS.has(word)) {
        const nextNonSpace = value.slice(index + word.length).match(/^\s*(.)/);
        if (nextNonSpace?.[1] === '(') {
          kind = 'math-function';
        }
      } else if (COLLECTION_FUNCTION_KEYWORDS.has(word)) {
        const nextNonSpace = value.slice(index + word.length).match(/^\s*(.)/);
        if (nextNonSpace?.[1] === '(') {
          kind = 'collection-function';
        }
      } else if (ANCHOR_KEYWORDS.has(word)) {
        kind = 'anchor';
      } else if (shouldTreatIdentifierAsReference(value, index, word, context)) {
        kind = 'reference';
      }

      push(index, index + word.length, kind);
      index += word.length;
      continue;
    }

    push(index, index + 1, 'punctuation');
    index += 1;
  }

  return tokens;
}

function isRoleContext(context: ValueContext): boolean {
  return (
    context.key === 'role' ||
    context.key === 'roles' ||
    context.parentPath[context.parentPath.length - 1] === 'roles'
  );
}

function isSelectorContext(context: ValueContext): boolean {
  return context.key === 'pick' || context.key === 'selector';
}

function isMetaLiteralContext(context: ValueContext): boolean {
  return context.key === 'fill' || context.key === 'stroke' || context.key === 'strokeWidth';
}

export function tokenizeRelGeoDocument(code: string): RelGeoSemanticLine[] {
  const lines = code.split('\n');
  const stack: StackItem[] = [];

  return lines.map((line, lineNumber) => {
    const lineTokens: RelGeoSemanticToken[] = [];
    const commentStart = findCommentStart(line);
    const content = commentStart === -1 ? line : line.slice(0, commentStart);
    const trimmedContent = content.trim();

    if (trimmedContent.length > 0) {
      const indent = getIndent(line);
      while (stack.length > 0 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const parentPath = stack.map((item) => item.key);
      const keySegment = findYamlKeySegment(content);

      if (keySegment) {
        const trimmedPrefix = content.slice(0, keySegment.keyStart).trimEnd();
        if (trimmedPrefix.endsWith('-')) {
          const dashIndex = content.lastIndexOf('-', keySegment.keyStart);
          if (dashIndex !== -1) {
            lineTokens.push({ start: dashIndex, end: dashIndex + 1, kind: 'punctuation' });
          }
        }

        lineTokens.push({
          start: keySegment.keyStart,
          end: keySegment.keyEnd,
          kind: classifyKey(keySegment.key, parentPath),
        });
        lineTokens.push({
          start: keySegment.colonIndex,
          end: keySegment.colonIndex + 1,
          kind: 'punctuation',
        });

        lineTokens.push(
          ...tokenizeValue(content.slice(keySegment.valueStart), keySegment.valueStart, {
            key: keySegment.key,
            parentPath,
          })
        );

        stack.push({ indent, key: keySegment.key });
      } else {
        lineTokens.push(...tokenizeValue(content, 0, { parentPath: stack.map((item) => item.key) }));
      }
    }

    if (commentStart !== -1) {
      lineTokens.push({ start: commentStart, end: line.length, kind: 'comment' });
    }

    return {
      line: lineNumber,
      tokens: lineTokens.sort((a, b) => a.start - b.start),
    };
  });
}
