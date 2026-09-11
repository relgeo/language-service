export const RELGEO_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RelGeo Document",
  "type": "object",
  "properties": {
    "version": {
      "type": ["string", "number"],
      "default": "0.5"
    },
    "scene": {
      "type": "object",
      "properties": {
        "unit": { "enum": ["px", "mm", "cm", "m", "in"] },
        "orientation": { "enum": ["y-down", "y-up"] },
        "origin": { "enum": ["top-left", "bottom-left", "center"] },
        "padding": { "type": ["string", "number"] },
        "autoSize": { "type": "boolean" }
      }
    },
    "parameters": {
      "type": "object",
      "additionalProperties": {
        "oneOf": [
          { "type": ["string", "number", "boolean"] },
          {
            "type": "object",
            "properties": {
              "type": { "enum": ["length", "number", "angle", "percent", "boolean", "enum", "string", "point", "vector", "array", "object", "frame2d", "bbox2d", "collection", "path-ref"] },
              "default": {},
              "min": {},
              "max": {},
              "step": {},
              "label": { "type": "string" },
              "options": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["type", "default"]
          }
        ]
      }
    },
    "constants": {
      "type": "object",
      "additionalProperties": { "type": ["string", "number", "boolean"] }
    },
    "derived": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "profiles": {
      "type": "object",
      "additionalProperties": {
        "type": "object"
      }
    },
    "metaPresets": {
      "type": "object",
      "additionalProperties": {
        "type": "object"
      }
    },
    "styles": {
      "type": "object",
      "additionalProperties": {
        "type": "object"
      }
    },
    "objects": {
      "type": "object",
      "additionalProperties": { "$ref": "#/definitions/object" }
    },
    "constraints": {
      "type": "array",
      "items": { "$ref": "#/definitions/constraint" }
    },
    "components": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "parameters": { "$ref": "#/properties/parameters" },
          "objects": { "$ref": "#/properties/objects" },
          "exports": {
            "type": "object",
            "additionalProperties": { "type": "string" }
          }
        },
        "required": ["objects"]
      }
    },
    "meta": {
      "type": "object"
    },
    "sheets": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "size": {
            "oneOf": [
              { "type": "string" },
              { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
            ]
          },
          "orientation": { "enum": ["portrait", "landscape"] },
          "meta": { "type": "object" },
          "views": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "use": { "type": "string" },
                "meta": { "type": "object" },
                "place": {
                  "oneOf": [
                    {
                      "type": "object",
                      "properties": {
                        "topLeft": { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
                      },
                      "required": ["topLeft"],
                      "not": { "required": ["center"] }
                    },
                    {
                      "type": "object",
                      "properties": {
                        "center": { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
                      },
                      "required": ["center"],
                      "not": { "required": ["topLeft"] }
                    }
                  ]
                }
              },
              "required": ["use"]
            }
          }
        },
        "required": ["size"]
      }
    },
    "views": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "target": { "type": "string" },
          "scale": { "type": ["string", "number"] },
          "meta": { "type": "object" },
          "filter": {
            "type": "object",
            "properties": {
              "roles": { "type": "array", "items": { "type": "string" } }
            }
          }
        },
        "required": ["target"]
      }
    }
  },
  "definitions": {
    "object": {
      "type": "object",
      "properties": {
        "type": { "enum": ["point", "line", "rect", "circle", "ellipse", "group", "text", "path", "polygon", "clone", "arc", "cubic", "quadratic", "repeat", "divide", "collection", "component", "dimension", "annotation", "boolean", "split"] },
        "meta": { 
          "type": "object",
          "properties": {
            "visible": { "type": "boolean" },
            "role": { "type": "string" },
            "intent": { "type": "string" },
            "inherit": {
              "oneOf": [
                { "type": "string" },
                { "type": "array", "items": { "type": "string" } }
              ]
            },
            "stroke": { "type": "string" },
            "fill": { "type": "string" },
            "strokeWidth": { "type": ["number", "string"] },
            "width": { "type": ["number", "string"] },
            "opacity": { "type": ["number", "string"] },
            "label": { "type": "string" },
            "dash": { "type": "string" },
            "fontSize": { "type": ["number", "string"] },
            "fontFamily": { "type": "string" },
            "fontWeight": { "type": ["number", "string"] },
            "fontStyle": { "enum": ["normal", "italic", "oblique"] },
            "lineHeight": { "type": ["number", "string"] },
            "hairline": { "type": "boolean" },
            "non-scaling-stroke": { "type": "boolean" }
          }
        },
        "metaPreset": { "type": "string" },
        "style": { "type": "string" },
        "anchors": { "type": "object" }
      },
      "required": ["type"],
      "allOf": [
        {
          "if": { "properties": { "type": { "const": "point" } } },
          "then": {
            "properties": {
              "at": { "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": ["string", "number"] } }] },
              "from": { "type": "string" },
              "move": { "type": "object" },
              "on": { "type": "object" }
            }
          }
        },
        {
          "if": { "properties": { "type": { "const": "line" } } },
          "then": {
            "properties": {
              "from": { "type": "string" },
              "to": { "type": "string" },
              "direction": { "enum": ["left", "right", "up", "down"] },
              "length": { "type": ["string", "number"] },
              "tangent": {
                "type": "object",
                "properties": {
                  "from": { "type": "string" },
                  "to": { "type": "string" },
                  "pick": { "type": ["string", "number"] }
                },
                "required": ["from", "to"]
              }
            },
            "required": ["from"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "rect" } } },
          "then": {
            "properties": {
              "size": { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "holes": { "$ref": "#/definitions/holes" }
            },
            "required": ["size"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "circle" } } },
          "then": {
            "properties": {
              "center": { "type": "string" },
              "radius": { "type": ["string", "number"] },
              "through": { "type": "string" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "holes": { "$ref": "#/definitions/holes" }
            }
          }
        },
        {
          "if": { "properties": { "type": { "const": "ellipse" } } },
          "then": {
            "properties": {
              "center": { "type": "string" },
              "rx": { "type": ["string", "number"] },
              "ry": { "type": ["string", "number"] },
              "size": { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 },
              "rotation": { "type": ["string", "number"] },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "holes": { "$ref": "#/definitions/holes" }
            }
          }
        },
        {
          "if": { "properties": { "type": { "const": "text" } } },
          "then": {
            "properties": {
              "at": { "type": "string" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "content": { "type": ["string", "number"] },
              "anchor": {
                "enum": ["topLeft", "topCenter", "topRight", "centerLeft", "center", "centerRight", "bottomLeft", "bottomCenter", "bottomRight"]
              }
            },
            "required": ["content"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "arc" } } },
          "then": {
            "properties": {
              "from": { "type": "string" },
              "through": { "type": "string" },
              "to": { "type": "string" },
              "center": { "type": "string" },
              "radius": { "type": ["string", "number"] },
              "startAngle": { "type": ["string", "number"] },
              "endAngle": { "type": ["string", "number"] }
            }
          }
        },
        {
          "if": { "properties": { "type": { "const": "cubic" } } },
          "then": {
            "properties": {
              "from": { "type": "string" },
              "cp1": { "type": "string" },
              "cp2": { "type": "string" },
              "to": { "type": "string" }
            },
            "required": ["from", "cp1", "cp2", "to"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "quadratic" } } },
          "then": {
            "properties": {
              "from": { "type": "string" },
              "cp": { "type": "string" },
              "to": { "type": "string" }
            },
            "required": ["from", "cp", "to"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "path" } } },
          "then": {
            "properties": {
              "points": { "type": "array", "items": { "type": "string" } },
              "segments": {
                "type": "array",
                "items": {
                  "type": "object",
                  "oneOf": [
                    { "properties": { "line": { "type": "object", "properties": { "from": { "type": "string" }, "to": { "type": "string" } }, "required": ["to"] } }, "required": ["line"] },
                    { "properties": { "arc": { "type": "object", "properties": { "through": { "type": "string" }, "to": { "type": "string" } }, "required": ["through", "to"] } }, "required": ["arc"] },
                    { "properties": { "quadratic": { "type": "object", "properties": { "cp": { "type": "string" }, "to": { "type": "string" } }, "required": ["cp", "to"] } }, "required": ["quadratic"] },
                    { "properties": { "cubic": { "type": "object", "properties": { "cp1": { "type": "string" }, "cp2": { "type": "string" }, "to": { "type": "string" } }, "required": ["cp1", "cp2", "to"] } }, "required": ["cubic"] }
                  ]
                }
              },
              "join": {
                "type": "array",
                "items": { "type": "string" },
                "minItems": 1
              },
              "closed": { "type": "boolean" },
              "closeWith": { "enum": ["none", "line"] },
              "offset": {
                "type": "object",
                "properties": {
                  "from": { "type": "string" },
                  "distance": { "type": ["string", "number"] },
                  "side": { "enum": ["left", "right", "inside", "outside"] }
                },
                "required": ["from", "distance"]
              },
              "corners": { "type": "object" },
              "corner": { "type": "object" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "holes": { "$ref": "#/definitions/holes" }
            }
          }
        },
        {
          "if": { "properties": { "type": { "const": "polygon" } } },
          "then": {
            "properties": {
              "points": { "type": "array", "items": { "type": "string" }, "minItems": 3 },
              "corners": { "type": "object" },
              "corner": { "type": "object" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "holes": { "$ref": "#/definitions/holes" }
            },
            "required": ["points"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "repeat" } } },
          "then": {
            "properties": {
              "item": { "$ref": "#/definitions/object" },
              "count": { "type": ["string", "number"] },
              "grid": {
                "type": "object",
                "properties": {
                  "rows": { "type": ["string", "number"] },
                  "cols": { "type": ["string", "number"] },
                  "pitch": {
                    "oneOf": [
                      { "type": ["string", "number"] },
                      { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
                    ]
                  },
                  "gap": {
                    "oneOf": [
                      { "type": ["string", "number"] },
                      { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
                    ]
                  }
                },
                "required": ["rows", "cols"]
              },
              "polar": {
                "type": "object",
                "properties": {
                  "count": { "type": ["string", "number"] },
                  "radius": { "type": ["string", "number"] },
                  "center": { "oneOf": [{ "type": "string" }, { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }] }
                },
                "required": ["count"]
              },
              "along": {
                "type": "object",
                "properties": {
                  "target": { "type": "string" },
                  "spacing": { "enum": ["uniform-length", "uniform-t", "fixed-distance"] },
                  "count": { "type": ["string", "number"] },
                  "distance": { "type": ["string", "number"] },
                  "startOffset": { "type": ["string", "number"] },
                  "endOffset": { "type": ["string", "number"] }
                },
                "required": ["target", "spacing"]
              },
              "each": {
                "oneOf": [
                  { "type": "string" },
                  { "type": "array" }
                ]
              },
              "place": { "$ref": "#/definitions/place" },
              "transform": { "type": "array" }
            },
            "required": ["item"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "divide" } } },
          "then": {
            "properties": {
              "target": { "type": "string" },
              "count": { "type": ["string", "number"] }
            },
            "required": ["target", "count"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "collection" } } },
          "then": {
            "properties": {
              "children": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["children"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "split" } } },
          "then": {
            "properties": {
              "target": { "type": "string" },
              "at": {
                "oneOf": [
                  { "type": "string" },
                  { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2, "maxItems": 2 }
                ]
              },
              "pick": { "enum": ["first", "last"] }
            },
            "required": ["target", "at"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "component" } } },
          "then": {
            "properties": {
              "use": { "type": "string" },
              "params": { "type": "object" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "transform": { "type": "array" }
            },
            "required": ["use"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "dimension" } } },
          "then": {
            "properties": {
              "kind": { "enum": ["linear", "radius", "diameter", "angle"] },
              "from": { "type": "string" },
              "to": { "type": "string" },
              "offset": { "type": ["string", "number"] },
              "target": { "type": "string" },
              "between": { "type": "array", "items": { "type": "string" } },
              "text": { "type": "string" }
            },
            "required": ["kind"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "annotation" } } },
          "then": {
            "properties": {
              "target": { "type": "string" },
              "text": { "type": "string" },
              "leader": {
                "type": "object",
                "properties": {
                  "from": { "type": "string" },
                  "to": { "type": "string" }
                }
              },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" }
            },
            "required": ["text"]
          }
        },
        {
          "if": { "properties": { "type": { "const": "boolean" } } },
          "then": {
            "properties": {
              "operation": { "enum": ["union", "subtract", "intersect", "xor"] },
              "shapes": { "type": "array", "items": { "type": "string" } },
              "base": { "type": "string" },
              "tools": { "type": "array", "items": { "type": "string" } },
              "result": {
                "type": "object",
                "properties": {
                  "mode": { "enum": ["single", "multi"] }
                }
              },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" }
            },
            "required": ["operation"]
          }
        }
      ]
    },
    "place": {
      "type": "object",
      "properties": {
        "left": { "type": ["string", "number"] },
        "right": { "type": ["string", "number"] },
        "top": { "type": ["string", "number"] },
        "bottom": { "type": ["string", "number"] },
        "centerX": { "type": ["string", "number"] },
        "centerY": { "type": ["string", "number"] },
        "center": { "type": "string" },
        "topLeft": { "type": "string" },
        "topRight": { "type": "string" },
        "bottomLeft": { "type": "string" },
        "bottomRight": { "type": "string" },
        "topCenter": { "type": "string" },
        "bottomCenter": { "type": "string" },
        "centerLeft": { "type": "string" },
        "centerRight": { "type": "string" },
        "inside": { "type": "string" },
        "margin": { "type": ["string", "number"] }
      }
    },
    "holes": {
      "type": "array",
      "items": {
        "oneOf": [
          { "type": "string" },
          {
            "type": "object",
            "properties": {
              "type": { "enum": ["rect", "circle", "polygon", "clone"] },
              "size": { "type": "array", "items": { "type": ["string", "number"] } },
              "radius": { "type": ["string", "number"] },
              "points": { "type": "array", "items": { "type": "string" } },
              "of": { "type": "string" },
              "place": { "$ref": "#/definitions/place" }, "on": { "type": "object" },
              "segments": { "type": "array" }
            }
          }
        ]
      }
    },
    "constraint": {
      "type": "object",
      "oneOf": [
        {
          "properties": {
            "equal": {
              "oneOf": [
                { "type": "array", "items": { "type": ["string", "number"] }, "minItems": 2 },
                {
                  "type": "object",
                  "properties": {
                    "left": { "type": ["string", "number"] },
                    "right": { "type": ["string", "number"] }
                  },
                  "required": ["left", "right"]
                }
              ]
            }
          },
          "required": ["equal"]
        },
        { "properties": { "perpendicular": { "type": "array", "items": { "type": "string" }, "minItems": 2, "maxItems": 2 } }, "required": ["perpendicular"] },
        { "properties": { "parallel": { "type": "array", "items": { "type": "string" }, "minItems": 2, "maxItems": 2 } }, "required": ["parallel"] },
        { "properties": { "tangent": { "type": "array", "items": { "type": "string" }, "minItems": 2, "maxItems": 2 } }, "required": ["tangent"] },
        { "properties": { "align": { "type": "object", "required": ["target", "with"] } }, "required": ["align"] }
      ]
    }
  }
};
