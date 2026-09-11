import { parseRelGeo, Validator, resolveGeometry } from 'relgeo-core';
import { Diagnostic, DiagnosticSeverity, CompletionItemKind, Hover } from 'vscode-languageserver-types';
import { KEYWORDS, OBJECT_TYPES, OBJECT_ANCHORS, PLACE_FIELDS, GEOMETRY_FUNCTIONS, MATH_FUNCTIONS, COLLECTION_FUNCTIONS, INTERSECTION_SELECTORS, getCompletionsForType, VIEW_FIELDS, SHEET_FIELDS, SHEET_VIEW_PLACEMENT_FIELDS, ON_NAMESPACES, ON_POINT_FIELDS, ON_PATH_FIELDS, META_FIELDS, REPEAT_ALONG_FIELDS } from './completions';
import { type RelGeoSemanticLine, tokenizeRelGeoDocument } from './tokens';

export class RelGeoLanguageService {
  private parseYamlLineKey(trimmed: string): string | undefined {
    const match = trimmed.match(/^("(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|[^:#][^:]*?)\s*:(?:\s*.*)?$/);
    if (!match) return undefined;
    const rawKey = match[1].trim();
    if (
      (rawKey.startsWith('"') && rawKey.endsWith('"')) ||
      (rawKey.startsWith("'") && rawKey.endsWith("'"))
    ) {
      return rawKey.slice(1, -1);
    }
    return rawKey;
  }

  private parseYamlKey(trimmed: string): string | undefined {
    const key = this.parseYamlLineKey(trimmed);
    if (!key || !/:\s*$/.test(trimmed)) return undefined;
    return key;
  }

  private getObjectTypeById(code: string, id: string): string | undefined {
    // Simple heuristic: look for "id:" followed by "type: typeName"
    const lines = code.split('\n');
    let inObjects = false;
    let objectsIndent = 0;
    let currentId = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      
      if (trimmed === 'objects:') {
        inObjects = true;
        objectsIndent = indent;
        continue;
      }
      if (inObjects && indent <= objectsIndent && trimmed !== '') {
        inObjects = false;
        continue;
      }
      
      if (inObjects) {
        const key = this.parseYamlKey(trimmed);
        if (indent === objectsIndent + 2 && key) {
          currentId = key;
        } else if (indent === objectsIndent + 4 && trimmed.startsWith('type:') && currentId === id) {
          return trimmed.split(':')[1].trim();
        }
      }
    }
    return undefined;
  }

  private tryParseDoc(code: string, lineIndex: number): any {
    try {
      return parseRelGeo(code, { mode: 'editor' });
    } catch (e) {
      try {
        const lines = code.split('\n');
        lines[lineIndex] = '';
        return parseRelGeo(lines.join('\n'), { mode: 'editor' });
      } catch (e2) {
        return undefined;
      }
    }
  }

  private getAllObjects(code: string): { id: string, type: string }[] {
    const lines = code.split('\n');
    let inObjects = false;
    let objectsIndent = 0;
    let currentId = '';
    const result: { id: string, type: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.search(/\S/);
      const trimmed = line.trim();
      
      if (trimmed === 'objects:') {
        inObjects = true;
        objectsIndent = indent;
        continue;
      }
      if (inObjects && indent <= objectsIndent && trimmed !== '') {
        inObjects = false;
        continue;
      }
      
      if (inObjects) {
        const key = this.parseYamlKey(trimmed);
        if (indent === objectsIndent + 2 && key) {
          currentId = key;
        } else if (indent === objectsIndent + 4 && trimmed.startsWith('type:')) {
          const type = trimmed.split(':')[1].trim();
          result.push({ id: currentId, type });
        }
      }
    }
    return result;
  }

  private isIntersectionSelectorContext(line: string): boolean {
    return /intersection\(\s*[^,]+,\s*[^,()]+,\s*[^)]*$/.test(line);
  }

  private parseDotNotationObjectId(beforeCursor: string): { objectId: string; isIndexed: boolean } | null {
    const match = beforeCursor.match(/(?:"((?:[^"\\]|\\.)+)"|'((?:[^'\\]|\\.)+)'|([\w\d_&-]+))(?:\[\d+\])?\.[\w\d_&-]*$/);
    if (!match) return null;
    const objectId = match[1] ?? match[2] ?? match[3];
    return {
      objectId,
      isIndexed: /\[\d+\]\.[\w\d_&-]*$/.test(beforeCursor),
    };
  }

  /**
   * Provides diagnostics for a RelGeo document
   */
  getDiagnostics(code: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    const lines = code.split('\n');

    // Helper to find line number by following a path (e.g. "objects.box.place")
    const findLineForPath = (pathStr: string): number => {
      const parts = pathStr
        .split('.')
        .map((part) => part.replace(/\[\d+\]/g, ''))
        .filter(Boolean);
      let currentLine = 0;
      let targetIndent = 0;

      for (const part of parts) {
        // Find the line that matches `${part}:` with appropriate indentation
        let found = false;
        for (let i = currentLine; i < lines.length; i++) {
          const line = lines[i];
          const indent = line.search(/\S/);
          const key = this.parseYamlLineKey(line.trim());
          if (key === part && indent >= targetIndent) {
            currentLine = i;
            targetIndent = indent + 1; // next part must be deeper
            found = true;
            break;
          }
        }
        if (!found) return currentLine; // Fallback to last known good line
      }
      return currentLine;
    };

    try {
      // Run in validate mode to actually catch missing fields, invalid expressions, etc.
      // Editor mode suppresses these to allow incomplete typing, but diagnostics needs to show them.
      const doc = parseRelGeo(code, { mode: 'validate' });
      const validator = new Validator(doc, 'validate');
      
      try {
        validator.validate();
      } catch (err: any) {
        let line = 0;
        if (err.path) {
          line = findLineForPath(err.path);
        } else if (err.objectId) {
          line = findLineForPath(`objects.${err.objectId}`);
        }

        diagnostics.push({
          range: {
            start: { line, character: 0 },
            end: { line, character: lines[line]?.length || 100 }
          },
          message: err.message,
          severity: DiagnosticSeverity.Error,
          code: err.code,
          source: 'relgeo'
        });
      }
    } catch (err: any) {
      let line = 0;
      if (err.path) {
        line = findLineForPath(err.path);
      } else if (err.objectId) {
        line = findLineForPath(`objects.${err.objectId}`);
      } else if (err.mark && typeof err.mark.line === 'number') {
        // If parser error has mark (YAML parser), try to use it
        line = err.mark.line;
      }

      diagnostics.push({
        range: {
          start: { line, character: 0 },
          end: { line, character: lines[line]?.length || 100 }
        },
        message: err.message,
        severity: DiagnosticSeverity.Error,
        code: err.code,
        source: 'relgeo-parser'
      });
    }
    return diagnostics;
  }

  /**
   * Provides semantic-ish token spans for RelGeo source consumers.
   */
  getSemanticTokens(code: string): RelGeoSemanticLine[] {
    return tokenizeRelGeoDocument(code);
  }

  /**
   * Provides hover information (types and current resolved values)
   */
  getHover(code: string, position: { line: number; character: number }): Hover | null {
    const lines = code.split('\n');
    const currentLine = lines[position.line] || '';
    
    // Find the word under cursor
    const beforeCursor = currentLine.slice(0, position.character);
    const afterCursor = currentLine.slice(position.character);
    
    const wordBefore = beforeCursor.match(/[\w\d_&-]+\.?[\w\d_&-]*$/);
    const wordAfter = afterCursor.match(/^[\w\d_&-]*/);
    
    if (!wordBefore) return null;
    
    const fullWord = wordBefore[0] + (wordAfter ? wordAfter[0] : '');
    
    // Try to resolve the whole document to get values
    let resolved: any;
    try {
      const doc = parseRelGeo(code, { mode: 'editor' });
      resolved = resolveGeometry(doc);
    } catch (e) {
      // If resolution fails, we can still show basic type info from the word itself
    }

    // 1. Check if it's a direct object ID
    if (resolved && resolved.objects[fullWord]) {
      const obj = resolved.objects[fullWord];
      let content = `**Object: ${fullWord}** (${obj.type})\n\n`;
      if (obj.type === 'point') {
        content += `x: ${obj.x.toFixed(2)}, y: ${obj.y.toFixed(2)}`;
      } else if (obj.type === 'line') {
        content += `length: ${obj.length.toFixed(2)}`;
      }
      return { contents: { kind: 'markdown', value: content } };
    }

    // 2. Check for dot notation (e.g. "Panel.center.x")
    if (fullWord.includes('.')) {
      const parts = fullWord.split('.');
      const objectId = parts[0];
      const property = parts[1];
      
      if (resolved && resolved.objects[objectId]) {
        const obj = resolved.objects[objectId];
        // Handle coordinates/anchors
        if (property === 'x' || property === 'y') {
            const val = obj[property];
            return { contents: { kind: 'markdown', value: `**${fullWord}**\n\nValue: ${val.toFixed(2)}` } };
        }
        // Handle common anchors
        if (obj[property] && typeof obj[property] === 'object' && 'x' in obj[property]) {
            const pt = obj[property];
            return { contents: { kind: 'markdown', value: `**${fullWord}**\n\nLocation: (${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})` } };
        }
        // Handle scalar properties (length, width, etc.)
        if (typeof obj[property] === 'number') {
            return { contents: { kind: 'markdown', value: `**${fullWord}**\n\nValue: ${obj[property].toFixed(2)}` } };
        }
      }
    }

    return null;
  }

  /**
   * Provides completions based on the current context
   */
  getCompletions(code: string, position: { line: number; character: number }) {
    const lines = code.split('\n');
    const currentLine = lines[position.line] || '';
    const beforeCursor = currentLine.slice(0, position.character);
    const nonWsIndex = beforeCursor.search(/\S/);
    const currentIndent = nonWsIndex === -1 ? beforeCursor.length : nonWsIndex;
    
    // 1. Root level
    if (currentIndent <= 0) {
      return KEYWORDS;
    }

    // 2. Determine Context Chain
    const contextChain: { key: string; indent: number }[] = [];
    let lastIndent = currentIndent;

    for (let i = position.line - 1; i >= 0; i--) {
      const line = lines[i];
      const indent = line.search(/\S/);
      if (indent !== -1 && indent < lastIndent) {
        const trimmed = line.trim();
        const key = this.parseYamlKey(trimmed);
        if (key) {
          contextChain.push({ key, indent });
          lastIndent = indent;
        }
        if (indent === 0) break;
      }
    }

    const path = contextChain.map(c => c.key);
    
    // 3. Specialized Context Logic
    
    // Inside 'place' block
    if (path.includes('place')) {
      return PLACE_FIELDS;
    }

    if (path.includes('along') || currentLine.trim().startsWith('along:')) {
      if (currentLine.trim().startsWith('target:')) {
        const allowedTypes = ['line', 'circle', 'ellipse', 'rect', 'arc', 'quadratic', 'cubic', 'path', 'polygon'];
        const objects = this.getAllObjects(code).filter(o => allowedTypes.includes(o.type));
        return objects.map(o => ({
          label: o.id,
          kind: CompletionItemKind.Variable,
          detail: o.type
        }));
      }
      return REPEAT_ALONG_FIELDS;
    }

    // Inside a component definition (e.g. components -> componentId -> [here])
    if (path.indexOf('components') === 1) {
      return [
        { label: 'parameters', kind: CompletionItemKind.Property, documentation: 'Dynamic parameters for the component' },
        { label: 'objects', kind: CompletionItemKind.Property, documentation: 'Geometric objects inside the component' },
        { label: 'exports', kind: CompletionItemKind.Property, documentation: 'Exported anchors or values' },
      ];
    }

    // Inside a view definition (e.g. views -> viewId -> [here])
    if (path.indexOf('views') === 1 && path.indexOf('sheets') === -1) {
      return VIEW_FIELDS;
    }

    // Inside a sheet definition (e.g. sheets -> sheetId -> [here])
    if (path.indexOf('sheets') === 1) {
      return SHEET_FIELDS;
    }

    // Inside a sheet's view list placement (e.g. sheets -> sheetId -> views -> [item] -> [here])
    if (path.indexOf('views') === 0 && path.indexOf('sheets') === 2) {
      return SHEET_VIEW_PLACEMENT_FIELDS;
    }

    // Inside 'params' block of a component instance
    if (path[0] === 'params' && path[1]) {
      const doc = this.tryParseDoc(code, position.line);

      if (doc && doc.objects?.[path[1]]) {
        const obj = doc.objects[path[1]];
        if (obj.type === 'component') {
          const use = obj.use;
          if (use && doc.components?.[use]) {
            const comp = doc.components[use];
            if (comp.parameters) {
              return Object.keys(comp.parameters).map(paramKey => {
                const param = comp.parameters![paramKey];
                const defVal = typeof param === 'object' && param !== null ? (param.default !== undefined ? String(param.default) : '') : String(param);
                const desc = typeof param === 'object' && param !== null && param.description ? param.description : `Component parameter (default: ${defVal})`;
                return {
                  label: paramKey,
                  kind: CompletionItemKind.Property,
                  documentation: desc,
                  detail: typeof param === 'object' && param !== null && param.type ? param.type : 'number'
                };
              });
            }
          }
        }
      }
    }

    // Inside 'objects' block
    const objectsIdx = path.indexOf('objects');
    // Check for dot notation autocomplete (e.g. "obj." or "obj[0].")
    const dotAccess = this.parseDotNotationObjectId(beforeCursor);
    if (dotAccess) {
      const { objectId, isIndexed } = dotAccess;
      const doc = this.tryParseDoc(code, position.line);

      if (doc && doc.objects?.[objectId]) {
        const obj = doc.objects[objectId];
        if (obj.type === 'component') {
          const use = obj.use;
          if (use && doc.components?.[use]) {
            const comp = doc.components[use];
            if (comp.exports) {
              return Object.keys(comp.exports).map(expKey => ({
                label: expKey,
                kind: CompletionItemKind.EnumMember,
                documentation: `Exported anchor from component "${use}": ${comp.exports![expKey]}`
              }));
            } else {
              // Fallback to internal objects if no exports defined
              if (comp.objects) {
                return Object.keys(comp.objects).map(innerId => ({
                  label: innerId,
                  kind: CompletionItemKind.EnumMember,
                  documentation: `Internal object of component "${use}": ${comp.objects![innerId].type}`
                }));
              }
            }
          }
        } else if ((obj.type === 'repeat' || obj.type === 'collection') && isIndexed) {
          let itemType = 'point';
          if (obj.type === 'repeat' && obj.item?.type) {
            itemType = obj.item.type;
          } else if (obj.type === 'collection') {
            if (obj.children && obj.children.length > 0) {
              const childId = obj.children[0];
              if (doc.objects?.[childId]) {
                itemType = doc.objects[childId].type;
              }
            }
          }
          if (OBJECT_ANCHORS[itemType]) {
            return OBJECT_ANCHORS[itemType];
          }
        }
      }

      const objectType = this.getObjectTypeById(code, objectId);
      if (objectType && OBJECT_ANCHORS[objectType]) {
        return OBJECT_ANCHORS[objectType];
      }
    }

    if (objectsIdx !== -1) {
      if (path.includes('on') || currentLine.trim().startsWith('on:')) {
        if (path.includes('point') || currentLine.trim().startsWith('point:')) {
          if (currentLine.trim().startsWith('at:')) {
            const allowedTypes = ['point'];
            const objects = this.getAllObjects(code).filter(o => allowedTypes.includes(o.type));
            return objects.map(o => ({
              label: o.id,
              kind: CompletionItemKind.Variable,
              detail: o.type
            }));
          }
          return ON_POINT_FIELDS;
        }
        if (path.includes('path') || path.includes('frame') || currentLine.trim().startsWith('path:') || currentLine.trim().startsWith('frame:')) {
          if (currentLine.trim().startsWith('path:')) {
            const allowedTypes = ['line', 'circle', 'ellipse', 'rect', 'arc', 'quadratic', 'cubic', 'path', 'polygon'];
            const objects = this.getAllObjects(code).filter(o => allowedTypes.includes(o.type));
            return objects.map(o => ({
              label: o.id,
              kind: CompletionItemKind.Variable,
              detail: o.type
            }));
          }
          return ON_PATH_FIELDS;
        }
        return ON_NAMESPACES;
      }

      if (path.includes('meta') || currentLine.trim().startsWith('meta:')) {
        return META_FIELDS;
      }

      // If we are directly under an object ID (e.g. objects -> tanah -> [here])
      if (objectsIdx === 1) {
        const objectId = path[0];
        
        // Find the type of this object by scanning the block
        let objectType: string | undefined;
        
        // Find the line index of the object ID
        let idLineIdx = -1;
        for(let i = position.line - 1; i >= 0; i--) {
            if (this.parseYamlKey(lines[i].trim()) === objectId) {
                idLineIdx = i;
                break;
            }
        }

        if (idLineIdx !== -1) {
            for (let j = idLineIdx + 1; j < position.line; j++) {
                const subLine = lines[j].trim();
                if (subLine.startsWith('type:')) {
                    objectType = subLine.split(':')[1].trim();
                    break;
                }
            }
        }

        if (currentLine.trim().startsWith('type:')) {
          return OBJECT_TYPES;
        }

        // Expression value context: fields that accept geometry function expressions
        const EXPRESSION_VALUE_KEYS_NESTED = ['at', 'from', 'to', 'center', 'through', 'value'];
        const onExpressionField = EXPRESSION_VALUE_KEYS_NESTED.some(k => currentLine.trim().startsWith(k + ':'));
        if (onExpressionField) {
          if (this.isIntersectionSelectorContext(currentLine)) {
            return INTERSECTION_SELECTORS;
          }
          return [...GEOMETRY_FUNCTIONS, ...MATH_FUNCTIONS, ...COLLECTION_FUNCTIONS];
        }

        return getCompletionsForType(objectType);
      }
      
      // If we are at the object ID level (objects -> [here])
      if (objectsIdx === 0) {
          return []; // Suggesting IDs is complex, return empty for now
      }
    }

    // Inside 'constraints' block
    if (path.includes('constraints')) {
        return [
          { label: 'equal', kind: CompletionItemKind.Property },
          { label: 'perpendicular', kind: CompletionItemKind.Property },
          { label: 'parallel', kind: CompletionItemKind.Property },
          { label: 'align', kind: CompletionItemKind.Property },
          { label: 'tangent', kind: CompletionItemKind.Property },
        ];
    }

    // Expression value context: fields that accept geometry functions
    const EXPRESSION_VALUE_KEYS = ['at', 'from', 'to', 'center', 'through', 'value', 'left', 'right', 'top', 'bottom', 'centerX', 'centerY'];
    const derivedIdx = path.indexOf('derived');
    const onExpressionField = EXPRESSION_VALUE_KEYS.some(k => currentLine.trim().startsWith(k + ':'));
    if (onExpressionField || derivedIdx !== -1) {
      if (this.isIntersectionSelectorContext(currentLine)) {
        return INTERSECTION_SELECTORS;
      }
      return [...GEOMETRY_FUNCTIONS, ...MATH_FUNCTIONS, ...COLLECTION_FUNCTIONS];
    }

    // Fallback: only keywords at root or unknown context
    return KEYWORDS;
  }
}
