import { CompletionItem, CompletionItemKind } from 'vscode-languageserver-types';

export const KEYWORDS: CompletionItem[] = [
  { label: 'version', kind: CompletionItemKind.Property, documentation: 'The RelGeo specification version' },
  { label: 'scene', kind: CompletionItemKind.Property, documentation: 'Global scene configuration' },
  { label: 'parameters', kind: CompletionItemKind.Property, documentation: 'Dynamic parameters for the drawing' },
  { label: 'constants', kind: CompletionItemKind.Property, documentation: 'Static constants' },
  { label: 'derived', kind: CompletionItemKind.Property, documentation: 'Computed values' },
  { label: 'profiles', kind: CompletionItemKind.Property, documentation: 'Profiles for parameter overrides' },
  { label: 'metaPresets', kind: CompletionItemKind.Property, documentation: 'Reusable metadata presets for object meta' },
  { label: 'styles', kind: CompletionItemKind.Property, documentation: 'Reusable object metadata presets' },
  { label: 'objects', kind: CompletionItemKind.Property, documentation: 'Geometric objects definition' },
  { label: 'constraints', kind: CompletionItemKind.Property, documentation: 'Global geometric constraints' },
  { label: 'components', kind: CompletionItemKind.Property, documentation: 'Reusable geometric components' },
  { label: 'meta', kind: CompletionItemKind.Property, documentation: 'Document-level metadata' },
  { label: 'sheets', kind: CompletionItemKind.Property, documentation: 'Drawing sheets layout' },
  { label: 'views', kind: CompletionItemKind.Property, documentation: 'Drawing views configurations' },
];

export const OBJECT_TYPES: CompletionItem[] = [
  { label: 'point', kind: CompletionItemKind.Class },
  { label: 'line', kind: CompletionItemKind.Class },
  { label: 'rect', kind: CompletionItemKind.Class },
  { label: 'circle', kind: CompletionItemKind.Class },
  { label: 'ellipse', kind: CompletionItemKind.Class },
  { label: 'group', kind: CompletionItemKind.Class },
  { label: 'text', kind: CompletionItemKind.Class },
  { label: 'path', kind: CompletionItemKind.Class },
  { label: 'polygon', kind: CompletionItemKind.Class },
  { label: 'clone', kind: CompletionItemKind.Class },
  { label: 'arc', kind: CompletionItemKind.Class },
  { label: 'cubic', kind: CompletionItemKind.Class },
  { label: 'quadratic', kind: CompletionItemKind.Class },
  { label: 'repeat', kind: CompletionItemKind.Class },
  { label: 'divide', kind: CompletionItemKind.Class },
  { label: 'collection', kind: CompletionItemKind.Class },
  { label: 'component', kind: CompletionItemKind.Class },
  { label: 'dimension', kind: CompletionItemKind.Class },
  { label: 'annotation', kind: CompletionItemKind.Class },
  { label: 'boolean', kind: CompletionItemKind.Class },
  { label: 'split', kind: CompletionItemKind.Class },
];

export const ANCHORS: CompletionItem[] = [
  { label: 'left', kind: CompletionItemKind.EnumMember },
  { label: 'right', kind: CompletionItemKind.EnumMember },
  { label: 'top', kind: CompletionItemKind.EnumMember },
  { label: 'bottom', kind: CompletionItemKind.EnumMember },
  { label: 'center', kind: CompletionItemKind.EnumMember },
  { label: 'centerX', kind: CompletionItemKind.EnumMember },
  { label: 'centerY', kind: CompletionItemKind.EnumMember },
  { label: 'topLeft', kind: CompletionItemKind.EnumMember },
  { label: 'topRight', kind: CompletionItemKind.EnumMember },
  { label: 'bottomLeft', kind: CompletionItemKind.EnumMember },
  { label: 'bottomRight', kind: CompletionItemKind.EnumMember },
  { label: 'topCenter', kind: CompletionItemKind.EnumMember },
  { label: 'bottomCenter', kind: CompletionItemKind.EnumMember },
  { label: 'centerLeft', kind: CompletionItemKind.EnumMember },
  { label: 'centerRight', kind: CompletionItemKind.EnumMember },
];

export const COMMON_FIELDS: CompletionItem[] = [
  { label: 'type', kind: CompletionItemKind.Property, documentation: 'The type of geometric object' },
  { label: 'meta', kind: CompletionItemKind.Property, documentation: 'Styling and metadata' },
  { label: 'metaPreset', kind: CompletionItemKind.Property, documentation: 'Reference to a reusable metadata preset' },
  { label: 'style', kind: CompletionItemKind.Property, documentation: 'Reference to a reusable metadata style preset' },
  { label: 'anchors', kind: CompletionItemKind.Property, documentation: 'Custom anchor definitions' },
];

export const META_FIELDS: CompletionItem[] = [
  { label: 'visible', kind: CompletionItemKind.Property },
  { label: 'role', kind: CompletionItemKind.Property },
  { label: 'intent', kind: CompletionItemKind.Property, documentation: 'Construction/presentation intent metadata' },
  { label: 'inherit', kind: CompletionItemKind.Property, documentation: 'Ordered metadata inherit chain merged before local meta' },
  { label: 'stroke', kind: CompletionItemKind.Property },
  { label: 'fill', kind: CompletionItemKind.Property },
  { label: 'strokeWidth', kind: CompletionItemKind.Property, documentation: 'Preferred stroke width field in the active v0.5 spec' },
  { label: 'width', kind: CompletionItemKind.Property, documentation: 'Deprecated compatibility alias for strokeWidth' },
  { label: 'opacity', kind: CompletionItemKind.Property },
  { label: 'label', kind: CompletionItemKind.Property },
  { label: 'dash', kind: CompletionItemKind.Property },
  { label: 'fontSize', kind: CompletionItemKind.Property },
  { label: 'fontFamily', kind: CompletionItemKind.Property },
  { label: 'fontWeight', kind: CompletionItemKind.Property },
  { label: 'fontStyle', kind: CompletionItemKind.Property },
  { label: 'lineHeight', kind: CompletionItemKind.Property },
  { label: 'hairline', kind: CompletionItemKind.Property, documentation: 'Force non-scaling stroke and thin width' },
  { label: 'non-scaling-stroke', kind: CompletionItemKind.Property, documentation: 'Force non-scaling stroke without changing width' },
];

export const ON_FIELD: CompletionItem = { label: 'on', kind: CompletionItemKind.Property, documentation: 'Constraint to a point, path, or frame' };

export const POINT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'at', kind: CompletionItemKind.Property, documentation: 'Absolute position or object reference' },
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Relative position from another anchor' },
  { label: 'move', kind: CompletionItemKind.Property, documentation: 'Vector movement' },
  ON_FIELD,
];

export const ON_NAMESPACES: CompletionItem[] = [
  { label: 'point', kind: CompletionItemKind.Property, documentation: 'Place on another point' },
  { label: 'path', kind: CompletionItemKind.Property, documentation: 'Place along a path or curve' },
  { label: 'frame', kind: CompletionItemKind.Property, documentation: 'Place and align to a path frame' },
];

export const ON_POINT_FIELDS: CompletionItem[] = [
  { label: 'at', kind: CompletionItemKind.Property, documentation: 'Target point reference' },
  { label: 'anchor', kind: CompletionItemKind.Property, documentation: 'Anchor point on the placed object' },
];

export const ON_PATH_FIELDS: CompletionItem[] = [
  { label: 'path', kind: CompletionItemKind.Property, documentation: 'Target path reference' },
  { label: 't', kind: CompletionItemKind.Property, documentation: 'Parameter t (0.0 to 1.0) along the path' },
  { label: 'anchor', kind: CompletionItemKind.Property, documentation: 'Anchor point on the placed object' },
];

export const LINE_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Start point reference' },
  { label: 'to', kind: CompletionItemKind.Property, documentation: 'End point reference' },
  { label: 'direction', kind: CompletionItemKind.Property, documentation: 'Relative direction' },
  { label: 'length', kind: CompletionItemKind.Property, documentation: 'Length of the line' },
  { label: 'tangent', kind: CompletionItemKind.Property, documentation: 'Construct line as tangent to another object' },
];

export const RECT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'size', kind: CompletionItemKind.Property, documentation: '[width, height] array' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'holes', kind: CompletionItemKind.Property, documentation: 'Subtracted nested closed shapes' },
];

export const CIRCLE_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'center', kind: CompletionItemKind.Property, documentation: 'Center point reference' },
  { label: 'radius', kind: CompletionItemKind.Property, documentation: 'Radius value or expression' },
  { label: 'through', kind: CompletionItemKind.Property, documentation: 'Pass through point reference' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'holes', kind: CompletionItemKind.Property, documentation: 'Subtracted nested closed shapes' },
];

export const ELLIPSE_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'center', kind: CompletionItemKind.Property, documentation: 'Center point reference' },
  { label: 'rx', kind: CompletionItemKind.Property, documentation: 'Horizontal radius value or expression' },
  { label: 'ry', kind: CompletionItemKind.Property, documentation: 'Vertical radius value or expression' },
  { label: 'size', kind: CompletionItemKind.Property, documentation: '[width, height] array alias for rx/ry * 2' },
  { label: 'rotation', kind: CompletionItemKind.Property, documentation: 'Rotation angle in radians' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'holes', kind: CompletionItemKind.Property, documentation: 'Subtracted nested closed shapes' },
];

export const TEXT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'at', kind: CompletionItemKind.Property, documentation: 'Absolute anchor reference for the text' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'content', kind: CompletionItemKind.Property, documentation: 'Text content' },
  { label: 'anchor', kind: CompletionItemKind.Property, documentation: 'Text alignment anchor' },
];

export const PATH_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'points', kind: CompletionItemKind.Property, documentation: 'Polyline points shorthand' },
  { label: 'segments', kind: CompletionItemKind.Property, documentation: 'Segmented path definition' },
  { label: 'join', kind: CompletionItemKind.Property, documentation: 'Compose a path by joining existing path-like objects' },
  { label: 'closed', kind: CompletionItemKind.Property, documentation: 'Whether the path is closed' },
  { label: 'closeWith', kind: CompletionItemKind.Property, documentation: 'Closure helper for closed join paths ("none" or "line")' },
  { label: 'offset', kind: CompletionItemKind.Property, documentation: 'Offset path construction' },
  { label: 'corners', kind: CompletionItemKind.Property, documentation: 'Per-corner fillet/chamfer settings' },
  { label: 'corner', kind: CompletionItemKind.Property, documentation: 'Global fillet/chamfer setting' },
  { label: 'holes', kind: CompletionItemKind.Property, documentation: 'Subtracted nested paths (loops) for closed paths' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
];

export const POLYGON_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'points', kind: CompletionItemKind.Property, documentation: 'Closed polygon vertices' },
  { label: 'corners', kind: CompletionItemKind.Property, documentation: 'Per-corner fillet/chamfer settings' },
  { label: 'corner', kind: CompletionItemKind.Property, documentation: 'Global fillet/chamfer setting' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'holes', kind: CompletionItemKind.Property, documentation: 'Subtracted nested closed shapes' },
];

export const ARC_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Arc start point for 3-point mode' },
  { label: 'through', kind: CompletionItemKind.Property, documentation: 'Arc through point for 3-point mode' },
  { label: 'to', kind: CompletionItemKind.Property, documentation: 'Arc end point for 3-point mode' },
  { label: 'center', kind: CompletionItemKind.Property, documentation: 'Arc center for center-radius mode' },
  { label: 'radius', kind: CompletionItemKind.Property, documentation: 'Arc radius for center-radius mode' },
  { label: 'startAngle', kind: CompletionItemKind.Property, documentation: 'Arc start angle for center-radius mode' },
  { label: 'endAngle', kind: CompletionItemKind.Property, documentation: 'Arc end angle for center-radius mode' },
];

export const CUBIC_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Curve start point' },
  { label: 'cp1', kind: CompletionItemKind.Property, documentation: 'First control point' },
  { label: 'cp2', kind: CompletionItemKind.Property, documentation: 'Second control point' },
  { label: 'to', kind: CompletionItemKind.Property, documentation: 'Curve end point' },
];

export const QUADRATIC_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Curve start point' },
  { label: 'cp', kind: CompletionItemKind.Property, documentation: 'Control point' },
  { label: 'to', kind: CompletionItemKind.Property, documentation: 'Curve end point' },
];

export const REPEAT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'item', kind: CompletionItemKind.Property, documentation: 'Object template reference to repeat' },
  { label: 'count', kind: CompletionItemKind.Property, documentation: 'Number of repetitions (linear count)' },
  { label: 'grid', kind: CompletionItemKind.Property, documentation: 'Grid repeat configuration { rows, cols, gap }' },
  { label: 'polar', kind: CompletionItemKind.Property, documentation: 'Polar repeat configuration { count, radius, center }' },
  { label: 'along', kind: CompletionItemKind.Property, documentation: 'Path-based repeat configuration { target, spacing, count|distance }' },
  { label: 'each', kind: CompletionItemKind.Property, documentation: 'Repeat at each point of a path/collection' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Placement constraints for the resulting collection' },
  { label: 'transform', kind: CompletionItemKind.Property, documentation: 'Transform modifiers for the resulting collection' },
];

export const REPEAT_ALONG_FIELDS: CompletionItem[] = [
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Target path-like geometry' },
  { label: 'spacing', kind: CompletionItemKind.Property, documentation: 'Distribution mode: uniform-length, uniform-t, fixed-distance' },
  { label: 'count', kind: CompletionItemKind.Property, documentation: 'Item count for uniform-length and uniform-t' },
  { label: 'distance', kind: CompletionItemKind.Property, documentation: 'Fixed pitch for fixed-distance mode' },
  { label: 'startOffset', kind: CompletionItemKind.Property, documentation: 'Offset from the start of the path' },
  { label: 'endOffset', kind: CompletionItemKind.Property, documentation: 'Offset from the end of the path' },
];

export const DIVIDE_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Target path or line to divide' },
  { label: 'count', kind: CompletionItemKind.Property, documentation: 'Number of divisions' },
];

export const COLLECTION_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'children', kind: CompletionItemKind.Property, documentation: 'Array of object IDs belonging to the collection' },
];

export const SPLIT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Open path-like target geometry to split' },
  { label: 'at', kind: CompletionItemKind.Property, documentation: 'Explicit split point on the target' },
  { label: 'pick', kind: CompletionItemKind.Property, documentation: 'Optional single-result selector: first or last' },
];

export const COMPONENT_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'use', kind: CompletionItemKind.Property, documentation: 'Name of the component definition to instantiate' },
  { label: 'params', kind: CompletionItemKind.Property, documentation: 'Arguments mapped to component parameters' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
  { label: 'transform', kind: CompletionItemKind.Property, documentation: 'Transform modifiers' },
];

export const DIMENSION_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'kind', kind: CompletionItemKind.Property, documentation: 'Dimension type: linear, radius, diameter, angle' },
  { label: 'from', kind: CompletionItemKind.Property, documentation: 'Start reference point' },
  { label: 'to', kind: CompletionItemKind.Property, documentation: 'End reference point' },
  { label: 'offset', kind: CompletionItemKind.Property, documentation: 'Offset distance from the line' },
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Target shape or circle reference' },
  { label: 'between', kind: CompletionItemKind.Property, documentation: 'Two lines for angle measurement [line1, line2]' },
  { label: 'text', kind: CompletionItemKind.Property, documentation: 'Custom label text, supports {distance}, etc.' },
];

export const ANNOTATION_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Target point/object for annotation' },
  { label: 'text', kind: CompletionItemKind.Property, documentation: 'Annotation text value' },
  { label: 'leader', kind: CompletionItemKind.Property, documentation: 'Leader line options { from, to }' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
];

export const BOOLEAN_FIELDS: CompletionItem[] = [
  ...COMMON_FIELDS,
  ON_FIELD,
  { label: 'operation', kind: CompletionItemKind.Property, documentation: 'Boolean operation: union, subtract, intersect, xor' },
  { label: 'shapes', kind: CompletionItemKind.Property, documentation: 'Array of target shape IDs for multi-op union/intersect/xor' },
  { label: 'base', kind: CompletionItemKind.Property, documentation: 'Base shape ID for subtract operation' },
  { label: 'tools', kind: CompletionItemKind.Property, documentation: 'Array of subtraction cutter shape IDs' },
  { label: 'result', kind: CompletionItemKind.Property, documentation: 'Operation result options { mode }' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Relative placement constraints' },
];

export const PLACE_FIELDS: CompletionItem[] = [
  { label: 'left', kind: CompletionItemKind.Property },
  { label: 'right', kind: CompletionItemKind.Property },
  { label: 'top', kind: CompletionItemKind.Property },
  { label: 'bottom', kind: CompletionItemKind.Property },
  { label: 'centerX', kind: CompletionItemKind.Property },
  { label: 'centerY', kind: CompletionItemKind.Property },
  { label: 'center', kind: CompletionItemKind.Property },
  { label: 'topLeft', kind: CompletionItemKind.Property },
  { label: 'topRight', kind: CompletionItemKind.Property },
  { label: 'bottomLeft', kind: CompletionItemKind.Property },
  { label: 'bottomRight', kind: CompletionItemKind.Property },
  { label: 'topCenter', kind: CompletionItemKind.Property },
  { label: 'bottomCenter', kind: CompletionItemKind.Property },
  { label: 'centerLeft', kind: CompletionItemKind.Property },
  { label: 'centerRight', kind: CompletionItemKind.Property },
  { label: 'inside', kind: CompletionItemKind.Property, documentation: 'Reference object for placement' },
  { label: 'margin', kind: CompletionItemKind.Property, documentation: 'Padding from boundaries' },
  { label: 'align', kind: CompletionItemKind.Property, documentation: 'Alignment with another object' },
];

export function getCompletionsForType(type?: string): CompletionItem[] {
  switch (type) {
    case 'point': return POINT_FIELDS;
    case 'line': return LINE_FIELDS;
    case 'rect': return RECT_FIELDS;
    case 'circle': return CIRCLE_FIELDS;
    case 'ellipse': return ELLIPSE_FIELDS;
    case 'text': return TEXT_FIELDS;
    case 'path': return PATH_FIELDS;
    case 'polygon': return POLYGON_FIELDS;
    case 'arc': return ARC_FIELDS;
    case 'cubic': return CUBIC_FIELDS;
    case 'quadratic': return QUADRATIC_FIELDS;
    case 'repeat': return REPEAT_FIELDS;
    case 'divide': return DIVIDE_FIELDS;
    case 'collection': return COLLECTION_FIELDS;
    case 'split': return SPLIT_FIELDS;
    case 'component': return COMPONENT_FIELDS;
    case 'dimension': return DIMENSION_FIELDS;
    case 'annotation': return ANNOTATION_FIELDS;
    case 'boolean': return BOOLEAN_FIELDS;
    default: return COMMON_FIELDS;
  }
}

/**
 * Geometry query functions available in expression values (at:, from:, derived:, etc.)
 * Covers active geometry/query functions recognized by the language surface in v0.5.
 */
export const GEOMETRY_FUNCTIONS: CompletionItem[] = [
  { label: 'intersection', kind: CompletionItemKind.Function, documentation: 'intersection(obj1, obj2) — geometric intersection point. Add selector as 3rd arg: "first", "last", index, or nearest/farthest.' },
  { label: 'distance', kind: CompletionItemKind.Function, documentation: 'distance(obj1, obj2) — euclidean distance between two points' },
  { label: 'length', kind: CompletionItemKind.Function, documentation: 'length(obj) — total arc length of a line, arc, path, or curve' },
  { label: 'perimeter', kind: CompletionItemKind.Function, documentation: 'perimeter(obj) — perimeter of a closed shape; authoritative closed-shape circumference query' },
  { label: 'area', kind: CompletionItemKind.Function, documentation: 'area(obj) — area of a closed shape (rect, circle, ellipse, polygon, closed path)' },
  { label: 'bbox', kind: CompletionItemKind.Function, documentation: 'bbox(obj) — minimum world-space bounding box record { minX, maxX, minY, maxY, width, height }' },
  { label: 'width', kind: CompletionItemKind.Function, documentation: 'width(obj) — width of the target world-space bounding box' },
  { label: 'height', kind: CompletionItemKind.Function, documentation: 'height(obj) — height of the target world-space bounding box' },
  { label: 'minX', kind: CompletionItemKind.Function, documentation: 'minX(obj) — left edge of the target world-space bounding box' },
  { label: 'maxX', kind: CompletionItemKind.Function, documentation: 'maxX(obj) — right edge of the target world-space bounding box' },
  { label: 'minY', kind: CompletionItemKind.Function, documentation: 'minY(obj) — top edge of the target world-space bounding box' },
  { label: 'maxY', kind: CompletionItemKind.Function, documentation: 'maxY(obj) — bottom edge of the target world-space bounding box' },
  { label: 'midpoint', kind: CompletionItemKind.Function, documentation: 'midpoint(pointA, pointB) — midpoint between two points' },
  { label: 'polar', kind: CompletionItemKind.Function, documentation: 'polar(center, radius, angle) — point at a radius and angle from a center point' },
  { label: 'angleBetween', kind: CompletionItemKind.Function, documentation: 'angleBetween(pointA, pointB) — direction angle from pointA to pointB' },
  { label: 'pointAt', kind: CompletionItemKind.Function, documentation: 'pointAt(obj, t) — point on object at parameter t (0.0–1.0)' },
  { label: 'tangentAt', kind: CompletionItemKind.Function, documentation: 'tangentAt(obj, t) — unit tangent vector at parameter t (0.0–1.0)' },
  { label: 'normalAt', kind: CompletionItemKind.Function, documentation: 'normalAt(obj, t) — unit normal vector (perpendicular to tangent) at parameter t' },
  { label: 'frameAt', kind: CompletionItemKind.Function, documentation: 'frameAt(obj, t) — local frame { point, tangent, normal, angle } at parameter t' },
  { label: 'tAtLength', kind: CompletionItemKind.Function, documentation: 'tAtLength(obj, distance) — parameter t located at a traversal distance along a path-like object' },
  { label: 'closestPoint', kind: CompletionItemKind.Function, documentation: 'closestPoint(refObj, targetObj) — nearest point on targetObj to refObj' },
  { label: 'project', kind: CompletionItemKind.Function, documentation: 'project(point, line) — orthogonal projection of a point onto a line' },
  { label: 'reflect', kind: CompletionItemKind.Function, documentation: 'reflect(point, target) — reflection of a point across a point or a line' },
  { label: 'toWorld', kind: CompletionItemKind.Function, documentation: 'toWorld(point, object) — convert point from local to world coordinates' },
  { label: 'toLocal', kind: CompletionItemKind.Function, documentation: 'toLocal(point, object) — convert point from world to local coordinates' },
];

export const MATH_FUNCTIONS: CompletionItem[] = [
  { label: 'min', kind: CompletionItemKind.Function, documentation: 'min(a, b, ...) — Returns the smallest of zero or more numbers' },
  { label: 'max', kind: CompletionItemKind.Function, documentation: 'max(a, b, ...) — Returns the largest of zero or more numbers' },
  { label: 'abs', kind: CompletionItemKind.Function, documentation: 'abs(x) — Returns the absolute value of a number' },
  { label: 'clamp', kind: CompletionItemKind.Function, documentation: 'clamp(val, min, max) — Clamps a number between a minimum and maximum value' },
  { label: 'sin', kind: CompletionItemKind.Function, documentation: 'sin(x) — Returns the sine of a number (in radians)' },
  { label: 'cos', kind: CompletionItemKind.Function, documentation: 'cos(x) — Returns the cosine of a number (in radians)' },
  { label: 'tan', kind: CompletionItemKind.Function, documentation: 'tan(x) — Returns the tangent of a number (in radians)' },
  { label: 'sqrt', kind: CompletionItemKind.Function, documentation: 'sqrt(x) — Returns the square root of a number' },
  { label: 'pow', kind: CompletionItemKind.Function, documentation: 'pow(base, exp) — Returns the base to the exponent power' },
  { label: 'round', kind: CompletionItemKind.Function, documentation: 'round(x) — Returns the value of a number rounded to the nearest integer' },
  { label: 'floor', kind: CompletionItemKind.Function, documentation: 'floor(x) — Returns the largest integer less than or equal to a number' },
  { label: 'ceil', kind: CompletionItemKind.Function, documentation: 'ceil(x) — Returns the smallest integer greater than or equal to a number' },
];

export const COLLECTION_FUNCTIONS: CompletionItem[] = [
  { label: 'count', kind: CompletionItemKind.Function, documentation: 'count(collection) — Returns the number of items in a collection or array' },
  { label: 'first', kind: CompletionItemKind.Function, documentation: 'first(collection) — Returns the first item in a collection or array' },
  { label: 'last', kind: CompletionItemKind.Function, documentation: 'last(collection) — Returns the last item in a collection or array' },
];

/** Intersection selectors for use as the 3rd argument to intersection() */
export const INTERSECTION_SELECTORS: CompletionItem[] = [
  { label: 'first', kind: CompletionItemKind.EnumMember, documentation: 'Select the first result' },
  { label: 'last', kind: CompletionItemKind.EnumMember, documentation: 'Select the last result' },
  { label: 'nearest()', kind: CompletionItemKind.Function, documentation: 'nearest(point) — select the result closest to a reference point' },
  { label: 'farthest()', kind: CompletionItemKind.Function, documentation: 'farthest(point) — select the result farthest from a reference point' },
  { label: '0', kind: CompletionItemKind.EnumMember, documentation: 'Select by index (0-based)' },
  { label: '1', kind: CompletionItemKind.EnumMember, documentation: 'Select by index (0-based)' },
];

const PLACEABLE_ANCHORS: CompletionItem[] = [
  { label: 'left', kind: CompletionItemKind.Property },
  { label: 'right', kind: CompletionItemKind.Property },
  { label: 'top', kind: CompletionItemKind.Property },
  { label: 'bottom', kind: CompletionItemKind.Property },
  { label: 'centerX', kind: CompletionItemKind.Property },
  { label: 'centerY', kind: CompletionItemKind.Property },
  { label: 'center', kind: CompletionItemKind.Property },
  { label: 'topLeft', kind: CompletionItemKind.Property },
  { label: 'topRight', kind: CompletionItemKind.Property },
  { label: 'bottomLeft', kind: CompletionItemKind.Property },
  { label: 'bottomRight', kind: CompletionItemKind.Property },
  { label: 'topCenter', kind: CompletionItemKind.Property },
  { label: 'bottomCenter', kind: CompletionItemKind.Property },
  { label: 'centerLeft', kind: CompletionItemKind.Property },
  { label: 'centerRight', kind: CompletionItemKind.Property },
  { label: 'width', kind: CompletionItemKind.Property },
  { label: 'height', kind: CompletionItemKind.Property },
];

/**
 * Anchors and computed properties available for each object type when accessed via dot notation (e.g. obj.anchor)
 */
export const OBJECT_ANCHORS: Record<string, CompletionItem[]> = {
  point: [
    { label: 'x', kind: CompletionItemKind.Property },
    { label: 'y', kind: CompletionItemKind.Property },
  ],
  line: [
    { label: 'start', kind: CompletionItemKind.Property },
    { label: 'end', kind: CompletionItemKind.Property },
    { label: 'center', kind: CompletionItemKind.Property },
    { label: 'length', kind: CompletionItemKind.Property },
  ],
  rect: [
    ...PLACEABLE_ANCHORS,
    { label: 'area', kind: CompletionItemKind.Property },
  ],
  circle: [
    ...PLACEABLE_ANCHORS,
    { label: 'radius', kind: CompletionItemKind.Property },
    { label: 'area', kind: CompletionItemKind.Property },
  ],
  ellipse: [
    ...PLACEABLE_ANCHORS,
    { label: 'rx', kind: CompletionItemKind.Property },
    { label: 'ry', kind: CompletionItemKind.Property },
    { label: 'rotation', kind: CompletionItemKind.Property },
    { label: 'area', kind: CompletionItemKind.Property },
    { label: 'perimeter', kind: CompletionItemKind.Property },
  ],
  path: [
    ...PLACEABLE_ANCHORS,
    { label: 'start', kind: CompletionItemKind.Property },
    { label: 'end', kind: CompletionItemKind.Property },
    { label: 'length', kind: CompletionItemKind.Property },
    { label: 'area', kind: CompletionItemKind.Property },
  ],
  polygon: [
    ...PLACEABLE_ANCHORS,
    { label: 'area', kind: CompletionItemKind.Property },
  ],
  arc: [
    { label: 'start', kind: CompletionItemKind.Property },
    { label: 'end', kind: CompletionItemKind.Property },
    { label: 'center', kind: CompletionItemKind.Property },
    { label: 'length', kind: CompletionItemKind.Property },
    { label: 'radius', kind: CompletionItemKind.Property },
  ],
  text: [
    ...PLACEABLE_ANCHORS,
  ],
  group: [
    ...PLACEABLE_ANCHORS,
  ],
  clone: [
    ...PLACEABLE_ANCHORS,
  ],
  repeat: [
    ...PLACEABLE_ANCHORS,
  ],
  divide: [
    ...PLACEABLE_ANCHORS,
  ],
  collection: [
    ...PLACEABLE_ANCHORS,
  ],
  component: [
    ...PLACEABLE_ANCHORS,
  ],
  boolean: [
    ...PLACEABLE_ANCHORS,
    { label: 'area', kind: CompletionItemKind.Property },
  ],
};

export const VIEW_FIELDS: CompletionItem[] = [
  { label: 'target', kind: CompletionItemKind.Property, documentation: 'Target drawing object reference' },
  { label: 'scale', kind: CompletionItemKind.Property, documentation: 'Scale ratio (e.g., 1:1, 1:2, or decimal)' },
  { label: 'filter', kind: CompletionItemKind.Property, documentation: 'Visibility filters { roles }' },
  { label: 'meta', kind: CompletionItemKind.Property, documentation: 'View-level metadata' },
];

export const SHEET_FIELDS: CompletionItem[] = [
  { label: 'size', kind: CompletionItemKind.Property, documentation: 'Sheet size (e.g. "A4" or [width, height])' },
  { label: 'orientation', kind: CompletionItemKind.Property, documentation: 'portrait or landscape' },
  { label: 'views', kind: CompletionItemKind.Property, documentation: 'Array of views placed on the sheet' },
  { label: 'meta', kind: CompletionItemKind.Property, documentation: 'Sheet-level metadata' },
];

export const SHEET_VIEW_PLACEMENT_FIELDS: CompletionItem[] = [
  { label: 'use', kind: CompletionItemKind.Property, documentation: 'Reference name of the view to place' },
  { label: 'place', kind: CompletionItemKind.Property, documentation: 'Placement coordinates { topLeft, center }' },
  { label: 'meta', kind: CompletionItemKind.Property, documentation: 'Placement-level metadata' },
];
