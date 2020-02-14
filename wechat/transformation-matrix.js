(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define([], factory);
  else if (typeof exports === 'object')
    exports["TransformationMatrix"] = factory();
  else
    root["TransformationMatrix"] = factory();
})(window, function () {
  return /******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
        /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
        /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
      /******/
}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /******/
}
      /******/
};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /******/
};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
      /******/
};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
      /******/
};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);

        // CONCATENATED MODULE: ./src/applyToPoint.js
        /**
         * Calculate a point transformed with an affine matrix
         * @param matrix {Matrix} Affine Matrix
         * @param  point {Point} Point
         * @returns {Point} Point
         */
        function applyToPoint(matrix, point) {
          return Array.isArray(point) ? [matrix.a * point[0] + matrix.c * point[1] + matrix.e, matrix.b * point[0] + matrix.d * point[1] + matrix.f] : {
            x: matrix.a * point.x + matrix.c * point.y + matrix.e,
            y: matrix.b * point.x + matrix.d * point.y + matrix.f
          };
        }
        /**
         * Calculate an array of points transformed with an affine matrix
         * @param matrix {Matrix} Affine Matrix
         * @param points {Point[]} Array of point
         * @returns {Point[]} Array of point
         */

        function applyToPoints(matrix, points) {
          return points.map(function (point) {
            return applyToPoint(matrix, point);
          });
        }
        // CONCATENATED MODULE: ./src/fromObject.js
        /**
         * Extract an affine matrix from an object that contains a,b,c,d,e,f keys
         * Any value could be a float or a string that contains a float
         * @param object {Object} Object that contains a,b,c,d,e,f keys
         * @return {Matrix} Affine Matrix
         */
        function fromObject(object) {
          return {
            a: parseFloat(object.a),
            b: parseFloat(object.b),
            c: parseFloat(object.c),
            d: parseFloat(object.d),
            e: parseFloat(object.e),
            f: parseFloat(object.f)
          };
        }
        // CONCATENATED MODULE: ./src/fromString.js
        /**
         * @ignore
         * @type {RegExp}
         */
        var matrixRegex = /^matrix\(\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*,\s*([0-9_+-.e]+)\s*\)$/i;
        /**
         * Parse a string formatted as matrix(a,b,c,d,e,f)
         * @param string {string} String with an affine matrix
         * @returns {Matrix} Affine Matrix
         *
         * @example
         * > fromString('matrix(1,2,3,4,5,6)')
         * {a: 1, b: 2, c: 3, d: 4, c: 5, e: 6}
         */

        function fromString(string) {
          var parsed = string.match(matrixRegex);
          if (parsed === null || parsed.length < 7) throw new Error("'".concat(string, "' is not a matrix"));
          return {
            a: parseFloat(parsed[1]),
            b: parseFloat(parsed[2]),
            c: parseFloat(parsed[3]),
            d: parseFloat(parsed[4]),
            e: parseFloat(parsed[5]),
            f: parseFloat(parsed[6])
          };
        }
        // CONCATENATED MODULE: ./src/identity.js
        /**
         * Identity matrix
         * @returns {Matrix} Affine Matrix
         */
        function identity() {
          return {
            a: 1,
            c: 0,
            e: 0,
            b: 0,
            d: 1,
            f: 0
          };
        }
        // CONCATENATED MODULE: ./src/inverse.js
        /**
         * Calculate a matrix that is the inverse of the provided matrix
         * @param matrix {Matrix} Affine Matrix
         * @returns {Matrix} Inverted Affine Matrix
         */
        function inverse(matrix) {
          // http://www.wolframalpha.com/input/?i=Inverse+%5B%7B%7Ba,c,e%7D,%7Bb,d,f%7D,%7B0,0,1%7D%7D%5D
          var a = matrix.a,
            b = matrix.b,
            c = matrix.c,
            d = matrix.d,
            e = matrix.e,
            f = matrix.f;
          var denom = a * d - b * c;
          return {
            a: d / denom,
            b: b / -denom,
            c: c / -denom,
            d: a / denom,
            e: (d * e - c * f) / -denom,
            f: (b * e - a * f) / denom
          };
        }
        // CONCATENATED MODULE: ./src/utils.js
        function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

        function isUndefined(val) {
          return typeof val === 'undefined';
        }
        function isNumeric(n) {
          return typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n);
        }
        function isObject(obj) {
          return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
        }
        function matchesShape(obj, keys) {
          return keys.every(function (key) {
            return key in obj;
          });
        }
        // CONCATENATED MODULE: ./src/isAffineMatrix.js

        /**
         * Check if the object contain an affine matrix
         * @param object {Object} Generic Plain Object
         * @return {boolean} True if is an object and contains an affine matrix
         */

        function isAffineMatrix(object) {
          return isObject(object) && 'a' in object && isNumeric(object.a) && 'b' in object && isNumeric(object.b) && 'c' in object && isNumeric(object.c) && 'd' in object && isNumeric(object.d) && 'e' in object && isNumeric(object.e) && 'f' in object && isNumeric(object.f);
        }
        // CONCATENATED MODULE: ./src/translate.js
        /**
         * Calculate a translate matrix
         * @param tx {number} Translation on axis x
         * @param [ty = 0] {number} Translation on axis y
         * @returns {Matrix} Affine Matrix
         */
        function translate(tx) {
          var ty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
          return {
            a: 1,
            c: 0,
            e: tx,
            b: 0,
            d: 1,
            f: ty
          };
        }
        // CONCATENATED MODULE: ./src/transform.js
        function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

        function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

        function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

        function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

        function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

        function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

        function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

        /**
         * Merge multiple matrices into one
         * @param matrices {...Matrix | Matrix[]} Matrices listed as separate parameters or in an array
         * @returns {Matrix} Affine Matrix
         */
        function transform() {
          for (var _len = arguments.length, matrices = new Array(_len), _key = 0; _key < _len; _key++) {
            matrices[_key] = arguments[_key];
          }

          matrices = Array.isArray(matrices[0]) ? matrices[0] : matrices;

          var multiply = function multiply(m1, m2) {
            return {
              a: m1.a * m2.a + m1.c * m2.b,
              c: m1.a * m2.c + m1.c * m2.d,
              e: m1.a * m2.e + m1.c * m2.f + m1.e,
              b: m1.b * m2.a + m1.d * m2.b,
              d: m1.b * m2.c + m1.d * m2.d,
              f: m1.b * m2.e + m1.d * m2.f + m1.f
            };
          };

          switch (matrices.length) {
            case 0:
              throw new Error('no matrices provided');

            case 1:
              return matrices[0];

            case 2:
              return multiply(matrices[0], matrices[1]);

            default:
              {
                var _matrices = matrices,
                  _matrices2 = _toArray(_matrices),
                  m1 = _matrices2[0],
                  m2 = _matrices2[1],
                  rest = _matrices2.slice(2);

                var m = multiply(m1, m2);
                return transform.apply(void 0, [m].concat(_toConsumableArray(rest)));
              }
          }
        }
        /**
         * Merge multiple matrices into one
         * @param matrices {...Matrix | Matrix[]} Matrices listed as separate parameters or in an array
         * @returns {Matrix} Affine Matrix
         */

        function compose() {
          return transform.apply(void 0, arguments);
        }
        // CONCATENATED MODULE: ./src/rotate.js



        var cos = Math.cos,
          sin = Math.sin,
          PI = Math.PI;
        /**
         * Calculate a rotation matrix
         * @param angle {number} Angle in radians
         * @param [cx] {number} If (cx,cy) are supplied the rotate is about this point
         * @param [cy] {number} If (cx,cy) are supplied the rotate is about this point
         * @returns {Matrix} Affine Matrix
         */

        function rotate(angle, cx, cy) {
          var cosAngle = cos(angle);
          var sinAngle = sin(angle);
          var rotationMatrix = {
            a: cosAngle,
            c: -sinAngle,
            e: 0,
            b: sinAngle,
            d: cosAngle,
            f: 0
          };

          if (isUndefined(cx) || isUndefined(cy)) {
            return rotationMatrix;
          }

          return transform([translate(cx, cy), rotationMatrix, translate(-cx, -cy)]);
        }
        /**
         * Calculate a rotation matrix with a DEG angle
         * @param angle {number} Angle in degree
         * @param [cx] {number} If (cx,cy) are supplied the rotate is about this point
         * @param [cy] {number} If (cx,cy) are supplied the rotate is about this point
         * @returns {Matrix} Affine Matrix
         */

        function rotateDEG(angle) {
          var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
          var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
          return rotate(angle * PI / 180, cx, cy);
        }
        // CONCATENATED MODULE: ./src/scale.js

        /**
         * Calculate a scaling matrix
         * @param sx {number} Scaling on axis x
         * @param [sy = sx] {number} Scaling on axis y (default sx)
         * @returns {Matrix} Affine Matrix
         */

        function scale(sx) {
          var sy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
          if (isUndefined(sy)) sy = sx;
          return {
            a: sx,
            c: 0,
            e: 0,
            b: 0,
            d: sy,
            f: 0
          };
        }
        // CONCATENATED MODULE: ./src/shear.js
        /**
         * Calculate a shear matrix
         * @param shx {number} Shear on axis x
         * @param shy {number} Shear on axis y
         * @returns {Matrix} Affine Matrix
         */
        function shear(shx, shy) {
          return {
            a: 1,
            c: shx,
            e: 0,
            b: shy,
            d: 1,
            f: 0
          };
        }
        // CONCATENATED MODULE: ./src/skew.js
        // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skew
        var tan = Math.tan;
        /**
         * Calculate a skew matrix
         * @param ax {number} Skew on axis x
         * @param ay {number} Skew on axis y
         * @returns {Matrix} Affine Matrix
         */

        function skew(ax, ay) {
          return {
            a: 1,
            c: tan(ax),
            e: 0,
            b: tan(ay),
            d: 1,
            f: 0
          };
        }
        /**
         * Calculate a skew matrix using DEG angles
         * @param ax {number} Skew on axis x
         * @param ay {number} Skew on axis y
         * @returns {Matrix} Affine Matrix
         */

        function skewDEG(ax, ay) {
          return skew(ax * Math.PI / 180, ay * Math.PI / 180);
        }
        // CONCATENATED MODULE: ./src/toString.js
        /**
         * Serialize an affine matrix to a string that can be used with CSS or SVG
         * @param matrix {Matrix} Affine Matrix
         * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
         */
        function toCSS(matrix) {
          return toString_toString(matrix);
        }
        /**
         * Serialize an affine matrix to a string that can be used with CSS or SVG
         * @param matrix {Matrix} Affine Matrix
         * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
         */

        function toSVG(matrix) {
          return toString_toString(matrix);
        }
        /**
         * Serialize an affine matrix to a string that can be used with CSS or SVG
         * @param matrix {Matrix} Affine Matrix
         * @returns {string} String that contains an affine matrix formatted as matrix(a,b,c,d,e,f)
         */

        function toString_toString(matrix) {
          return "matrix(".concat(matrix.a, ",").concat(matrix.b, ",").concat(matrix.c, ",").concat(matrix.d, ",").concat(matrix.e, ",").concat(matrix.f, ")");
        }
        // CONCATENATED MODULE: ./src/smoothMatrix.js
        /**
         * Rounds all elements of the given matrix using the given precision
         * @param matrix {Matrix} An affine matrix to round
         * @param [precision] {number} A precision to use for Math.round. Defaults to 10000000000 (meaning which rounds to the 10th digit after the comma).
         * @returns {Matrix} The rounded Affine Matrix
         */
        function smoothMatrix(matrix) {
          var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000000000;
          return {
            a: Math.round(matrix.a * precision) / precision,
            b: Math.round(matrix.b * precision) / precision,
            c: Math.round(matrix.c * precision) / precision,
            d: Math.round(matrix.d * precision) / precision,
            e: Math.round(matrix.e * precision) / precision,
            f: Math.round(matrix.f * precision) / precision
          };
        }
        // CONCATENATED MODULE: ./src/fromTriangles.js



        /**
         * Returns a matrix that transforms a triangle t1 into another triangle t2, or throws an exception if it is impossible.
         * @param t1 {Point[]} Array of points containing the three points for the first triangle
         * @param t2 {Point[]} Array of points containing the three points for the second triangle
         * @returns {Matrix} Matrix which transforms t1 to t2
         * @throws Exception if the matrix becomes not invertible
         */

        function fromTriangles(t1, t2) {
          // point p = first point of the triangle
          var px1 = t1[0].x != null ? t1[0].x : t1[0][0];
          var py1 = t1[0].y != null ? t1[0].y : t1[0][1];
          var px2 = t2[0].x != null ? t2[0].x : t2[0][0];
          var py2 = t2[0].y != null ? t2[0].y : t2[0][1]; // point q = second point of the triangle

          var qx1 = t1[1].x != null ? t1[1].x : t1[1][0];
          var qy1 = t1[1].y != null ? t1[1].y : t1[1][1];
          var qx2 = t2[1].x != null ? t2[1].x : t2[1][0];
          var qy2 = t2[1].y != null ? t2[1].y : t2[1][1]; // point r = third point of the triangle

          var rx1 = t1[2].x != null ? t1[2].x : t1[2][0];
          var ry1 = t1[2].y != null ? t1[2].y : t1[2][1];
          var rx2 = t2[2].x != null ? t2[2].x : t2[2][0];
          var ry2 = t2[2].y != null ? t2[2].y : t2[2][1];
          var r1 = {
            a: px1 - rx1,
            b: py1 - ry1,
            c: qx1 - rx1,
            d: qy1 - ry1,
            e: rx1,
            f: ry1
          };
          var r2 = {
            a: px2 - rx2,
            b: py2 - ry2,
            c: qx2 - rx2,
            d: qy2 - ry2,
            e: rx2,
            f: ry2
          };
          var inverseR1 = inverse(r1);
          var affineMatrix = transform([r2, inverseR1]); // round the matrix elements to smooth the finite inversion

          return smoothMatrix(affineMatrix);
        }
        // CONCATENATED MODULE: ./src/fromDefinition.js






        /**
         * Converts array of matrix descriptor to array of matrix
         * @param definitionOrArrayOfDefinition {Object[]} Array of object describing the matrix
         * @returns {Matrix[]} Array of matrix
         *
         * @example
         * > fromDefinition([
         *  { type: 'matrix', a:1, b:2, c:3, d:4, e:5, f:6 },
         *  { type: 'translate', tx: 10, ty: 20 },
         *  { type: 'scale', sx: 2, sy: 4 },
         *  { type: 'rotate', angle: 90, cx: 50, cy: 25 },
         *  { type: 'skewX', angle: 45 },
         *  { type: 'skewY',  angle: 45 },
         *  { type: 'shear', shx: 10, shy: 20}
         * ])
         *
         * [
         *  { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 },
         *  { a: 1, c: 0, e: 10, b: 0, d: 1, f: 20 },
         *  { a: 2, c: 0, e: 0, b: 0, d: 4, f: 0 },
         *  { a: 6.123, c: -1, e: 0, b: 1, d: 6.123, f: 0 },
         *  { a: 1, c: 0.99.., e: 0, b: 0, d: 1, f: 0 },
         *  { a: 1, c: 0, e: 0, b: 0.99, d: 1, f: 0 },
         *  { a: 1, c: 10, e: 0, b: 20, d: 1, f: 0 }
         * ]
         **/

        function fromDefinition(definitionOrArrayOfDefinition) {
          return Array.isArray(definitionOrArrayOfDefinition) ? definitionOrArrayOfDefinition.map(mapper) : mapper(definitionOrArrayOfDefinition);

          function mapper(descriptor) {
            switch (descriptor.type) {
              case 'matrix':
                if ('a' in descriptor && 'b' in descriptor && 'c' in descriptor && 'd' in descriptor && 'e' in descriptor && 'f' in descriptor) {
                  return fromObject(descriptor);
                } else {
                  throw new Error('MISSING_MANDATORY_PARAM');
                }

              case 'translate':
                if (!('tx' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');
                if ('ty' in descriptor) return translate(descriptor.tx, descriptor.ty);
                return translate(descriptor.tx);

              case 'scale':
                if (!('sx' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');
                if ('sy' in descriptor) return scale(descriptor.sx, descriptor.sy);
                return scale(descriptor.sx);

              case 'rotate':
                if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');

                if ('cx' in descriptor && 'cy' in descriptor) {
                  return rotateDEG(descriptor.angle, descriptor.cx, descriptor.cy);
                }

                return rotateDEG(descriptor.angle);

              case 'skewX':
                if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');
                return skewDEG(descriptor.angle, 0);

              case 'skewY':
                if (!('angle' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');
                return skewDEG(0, descriptor.angle);

              case 'shear':
                if (!('shx' in descriptor && 'shy' in descriptor)) throw new Error('MISSING_MANDATORY_PARAM');
                return shear(descriptor.shx, descriptor.shy);

              default:
                throw new Error('UNSUPPORTED_DESCRIPTOR');
            }
          }
        }
        // CONCATENATED MODULE: ./src/fromTransformAttribute.autogenerated.js
        // Generated by PEG.js v0.11.0-master.30f3260, https://pegjs.org/
        function peg$subclass(child, parent) {
          function C() {
            this.constructor = child;
          }

          C.prototype = parent.prototype;
          child.prototype = new C();
        }

        function peg$SyntaxError(message, expected, found, location) {
          this.message = message;
          this.expected = expected;
          this.found = found;
          this.location = location;
          this.name = "SyntaxError"; // istanbul ignore next

          if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, peg$SyntaxError);
          }
        }

        peg$subclass(peg$SyntaxError, Error);

        peg$SyntaxError.buildMessage = function (expected, found) {
          var DESCRIBE_EXPECTATION_FNS = {
            literal: function literal(expectation) {
              return "\"" + literalEscape(expectation.text) + "\"";
            },
            "class": function _class(expectation) {
              var escapedParts = expectation.parts.map(function (part) {
                return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
              });
              return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
            },
            any: function any() {
              return "any character";
            },
            end: function end() {
              return "end of input";
            },
            other: function other(expectation) {
              return expectation.description;
            },
            not: function not(expectation) {
              return "not " + describeExpectation(expectation.expected);
            }
          };

          function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
          }

          function literalEscape(s) {
            return s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
              return "\\x0" + hex(ch);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
              return "\\x" + hex(ch);
            });
          }

          function classEscape(s) {
            return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
              return "\\x0" + hex(ch);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
              return "\\x" + hex(ch);
            });
          }

          function describeExpectation(expectation) {
            return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
          }

          function describeExpected(expected) {
            var descriptions = expected.map(describeExpectation);
            var i, j;
            descriptions.sort();

            if (descriptions.length > 0) {
              for (i = 1, j = 1; i < descriptions.length; i++) {
                if (descriptions[i - 1] !== descriptions[i]) {
                  descriptions[j] = descriptions[i];
                  j++;
                }
              }

              descriptions.length = j;
            }

            switch (descriptions.length) {
              case 1:
                return descriptions[0];

              case 2:
                return descriptions[0] + " or " + descriptions[1];

              default:
                return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
            }
          }

          function describeFound(found) {
            return found ? "\"" + literalEscape(found) + "\"" : "end of input";
          }

          return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
        };

        function peg$parse(input, options) {
          options = options !== undefined ? options : {};
          var peg$FAILED = {};
          var peg$startRuleFunctions = {
            transformList: peg$parsetransformList
          };
          var peg$startRuleFunction = peg$parsetransformList;
          var peg$c0 = "matrix";
          var peg$c1 = "(";
          var peg$c2 = ")";
          var peg$c3 = "translate";
          var peg$c4 = "scale";
          var peg$c5 = "rotate";
          var peg$c6 = "skewX";
          var peg$c7 = "skewY";
          var peg$c8 = ",";
          var peg$c9 = ".";
          var peg$r0 = /^[eE]/;
          var peg$r1 = /^[+\-]/;
          var peg$r2 = /^[0-9]/;
          var peg$r3 = /^[ \t\r\n]/;
          var peg$e0 = peg$literalExpectation("matrix", false);
          var peg$e1 = peg$literalExpectation("(", false);
          var peg$e2 = peg$literalExpectation(")", false);
          var peg$e3 = peg$literalExpectation("translate", false);
          var peg$e4 = peg$literalExpectation("scale", false);
          var peg$e5 = peg$literalExpectation("rotate", false);
          var peg$e6 = peg$literalExpectation("skewX", false);
          var peg$e7 = peg$literalExpectation("skewY", false);
          var peg$e8 = peg$literalExpectation(",", false);
          var peg$e9 = peg$otherExpectation("fractionalConstant");
          var peg$e10 = peg$classExpectation(["e", "E"], false, false);
          var peg$e11 = peg$classExpectation(["+", "-"], false, false);
          var peg$e12 = peg$classExpectation([["0", "9"]], false, false);
          var peg$e13 = peg$classExpectation([" ", "\t", "\r", "\n"], false, false);

          var peg$f0 = function peg$f0(ts) {
            return ts;
          };

          var peg$f1 = function peg$f1(t, ts) {
            return t.concat(ts);
          };

          var peg$f2 = function peg$f2(a, b, c, d, e, f) {
            return [{
              type: 'matrix',
              a: a,
              b: b,
              c: c,
              d: d,
              e: e,
              f: f
            }];
          };

          var peg$f3 = function peg$f3(tx, ty) {
            var t = {
              type: 'translate',
              tx: tx
            };
            if (ty) t.ty = ty;
            return [t];
          };

          var peg$f4 = function peg$f4(sx, sy) {
            var s = {
              type: 'scale',
              sx: sx
            };
            if (sy) s.sy = sy;
            return [s];
          };

          var peg$f5 = function peg$f5(angle, c) {
            var r = {
              type: 'rotate',
              angle: angle
            };

            if (c) {
              r.cx = c[0];
              r.cy = c[1];
            }

            return [r];
          };

          var peg$f6 = function peg$f6(angle) {
            return [{
              type: 'skewX',
              angle: angle
            }];
          };

          var peg$f7 = function peg$f7(angle) {
            return [{
              type: 'skewY',
              angle: angle
            }];
          };

          var peg$f8 = function peg$f8(f) {
            return parseFloat(f.join(""));
          };

          var peg$f9 = function peg$f9(i) {
            return parseInt(i.join(""));
          };

          var peg$f10 = function peg$f10(n) {
            return n;
          };

          var peg$f11 = function peg$f11(n1, n2) {
            return [n1, n2];
          };

          var peg$f12 = function peg$f12(ds) {
            return ds.join("");
          };

          var peg$f13 = function peg$f13(d1, d2) {
            return [d1 ? d1.join("") : null, ".", d2.join("")].join("");
          };

          var peg$f14 = function peg$f14(d) {
            return d.join("");
          };

          var peg$currPos = 0;
          var peg$savedPos = 0;
          var peg$posDetailsCache = [{
            line: 1,
            column: 1
          }];
          var peg$expected = [];
          var peg$silentFails = 0;
          var peg$result;

          if ("startRule" in options) {
            if (!(options.startRule in peg$startRuleFunctions)) {
              throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
            }

            peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
          }

          function text() {
            return input.substring(peg$savedPos, peg$currPos);
          }

          function offset() {
            return peg$savedPos;
          }

          function range() {
            return [peg$savedPos, peg$currPos];
          }

          function location() {
            return peg$computeLocation(peg$savedPos, peg$currPos);
          }

          function expected(description, location) {
            location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
          }

          function error(message, location) {
            location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
            throw peg$buildSimpleError(message, location);
          }

          function peg$literalExpectation(text, ignoreCase) {
            return {
              type: "literal",
              text: text,
              ignoreCase: ignoreCase
            };
          }

          function peg$classExpectation(parts, inverted, ignoreCase) {
            return {
              type: "class",
              parts: parts,
              inverted: inverted,
              ignoreCase: ignoreCase
            };
          }

          function peg$anyExpectation() {
            return {
              type: "any"
            };
          }

          function peg$endExpectation() {
            return {
              type: "end"
            };
          }

          function peg$otherExpectation(description) {
            return {
              type: "other",
              description: description
            };
          }

          function peg$computePosDetails(pos) {
            var details = peg$posDetailsCache[pos];
            var p;

            if (details) {
              return details;
            } else {
              p = pos - 1;

              while (!peg$posDetailsCache[p]) {
                p--;
              }

              details = peg$posDetailsCache[p];
              details = {
                line: details.line,
                column: details.column
              };

              while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                  details.line++;
                  details.column = 1;
                } else {
                  details.column++;
                }

                p++;
              }

              peg$posDetailsCache[pos] = details;
              return details;
            }
          }

          var peg$VALIDFILENAME = typeof options.filename === "string" && options.filename.length > 0;

          function peg$computeLocation(startPos, endPos) {
            var loc = {};
            if (peg$VALIDFILENAME) loc.filename = options.filename;
            var startPosDetails = peg$computePosDetails(startPos);
            loc.start = {
              offset: startPos,
              line: startPosDetails.line,
              column: startPosDetails.column
            };
            var endPosDetails = peg$computePosDetails(endPos);
            loc.end = {
              offset: endPos,
              line: endPosDetails.line,
              column: endPosDetails.column
            };
            return loc;
          }

          function peg$begin() {
            peg$expected.push({
              pos: peg$currPos,
              variants: []
            });
          }

          function peg$expect(expected) {
            var top = peg$expected[peg$expected.length - 1];

            if (peg$currPos < top.pos) {
              return;
            }

            if (peg$currPos > top.pos) {
              top.pos = peg$currPos;
              top.variants = [];
            }

            top.variants.push(expected);
          }

          function peg$end(invert) {
            var expected = peg$expected.pop();
            var top = peg$expected[peg$expected.length - 1];
            var variants = expected.variants;

            if (top.pos !== expected.pos) {
              return;
            }

            if (invert) {
              variants = variants.map(function (e) {
                return e.type === "not" ? e.expected : {
                  type: "not",
                  expected: e
                };
              });
            }

            Array.prototype.push.apply(top.variants, variants);
          }

          function peg$buildSimpleError(message, location) {
            return new peg$SyntaxError(message, null, null, location);
          }

          function peg$buildStructuredError(expected, found, location) {
            return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
          }

          function peg$buildError() {
            var expected = peg$expected[0];
            var failPos = expected.pos;
            return peg$buildStructuredError(expected.variants, failPos < input.length ? input.charAt(failPos) : null, failPos < input.length ? peg$computeLocation(failPos, failPos + 1) : peg$computeLocation(failPos, failPos));
          }

          function peg$parsetransformList() {
            var s0, s1, s2, s3, s4;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsewsp();

            while (s2 !== peg$FAILED) {
              s1.push(s2);
              s2 = peg$parsewsp();
            }

            s2 = peg$parsetransforms();

            if (s2 === peg$FAILED) {
              s2 = null;
            }

            s3 = [];
            s4 = peg$parsewsp();

            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parsewsp();
            }

            peg$savedPos = s0;
            s0 = peg$f0(s2);
            return s0;
          }

          function peg$parsetransforms() {
            var s0, s1, s2, s3;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$parsetransform();

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsecommaWsp();

              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parsecommaWsp();
                }
              } else {
                s2 = peg$FAILED;
              }

              if (s2 !== peg$FAILED) {
                s3 = peg$parsetransforms();

                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f1(s1, s3);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$parsetransform();
            }

            return s0;
          }

          function peg$parsetransform() {
            var s0;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$parsematrix();

            if (s0 === peg$FAILED) {
              s0 = peg$parsetranslate();

              if (s0 === peg$FAILED) {
                s0 = peg$parsescale();

                if (s0 === peg$FAILED) {
                  s0 = peg$parserotate();

                  if (s0 === peg$FAILED) {
                    s0 = peg$parseskewX();

                    if (s0 === peg$FAILED) {
                      s0 = peg$parseskewY();
                    }
                  }
                }
              }
            }

            return s0;
          }

          function peg$parsematrix() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16, s17;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e0);

            if (input.substr(peg$currPos, 6) === peg$c0) {
              s1 = peg$c0;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecommaWsp();

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parsenumber();

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsecommaWsp();

                      if (s8 !== peg$FAILED) {
                        s9 = peg$parsenumber();

                        if (s9 !== peg$FAILED) {
                          s10 = peg$parsecommaWsp();

                          if (s10 !== peg$FAILED) {
                            s11 = peg$parsenumber();

                            if (s11 !== peg$FAILED) {
                              s12 = peg$parsecommaWsp();

                              if (s12 !== peg$FAILED) {
                                s13 = peg$parsenumber();

                                if (s13 !== peg$FAILED) {
                                  s14 = peg$parsecommaWsp();

                                  if (s14 !== peg$FAILED) {
                                    s15 = peg$parsenumber();

                                    if (s15 !== peg$FAILED) {
                                      s16 = [];
                                      s17 = peg$parsewsp();

                                      while (s17 !== peg$FAILED) {
                                        s16.push(s17);
                                        s17 = peg$parsewsp();
                                      }

                                      rule$expects(peg$e2);

                                      if (input.charCodeAt(peg$currPos) === 41) {
                                        s17 = peg$c2;
                                        peg$currPos++;
                                      } else {
                                        s17 = peg$FAILED;
                                      }

                                      if (s17 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s0 = peg$f2(s5, s7, s9, s11, s13, s15);
                                      } else {
                                        peg$currPos = s0;
                                        s0 = peg$FAILED;
                                      }
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsetranslate() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e3);

            if (input.substr(peg$currPos, 9) === peg$c3) {
              s1 = peg$c3;
              peg$currPos += 9;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecommaWspNumber();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  s7 = [];
                  s8 = peg$parsewsp();

                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsewsp();
                  }

                  rule$expects(peg$e2);

                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c2;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                  }

                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f3(s5, s6);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsescale() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e4);

            if (input.substr(peg$currPos, 5) === peg$c4) {
              s1 = peg$c4;
              peg$currPos += 5;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecommaWspNumber();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  s7 = [];
                  s8 = peg$parsewsp();

                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsewsp();
                  }

                  rule$expects(peg$e2);

                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c2;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                  }

                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f4(s5, s6);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parserotate() {
            var s0, s1, s2, s3, s4, s5, s6, s7, s8;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e5);

            if (input.substr(peg$currPos, 6) === peg$c5) {
              s1 = peg$c5;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecommaWspTwoNumbers();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  s7 = [];
                  s8 = peg$parsewsp();

                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parsewsp();
                  }

                  rule$expects(peg$e2);

                  if (input.charCodeAt(peg$currPos) === 41) {
                    s8 = peg$c2;
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                  }

                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f5(s5, s6);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parseskewX() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e6);

            if (input.substr(peg$currPos, 5) === peg$c6) {
              s1 = peg$c6;
              peg$currPos += 5;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parsewsp();

                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parsewsp();
                  }

                  rule$expects(peg$e2);

                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c2;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                  }

                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f6(s5);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parseskewY() {
            var s0, s1, s2, s3, s4, s5, s6, s7;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e7);

            if (input.substr(peg$currPos, 5) === peg$c7) {
              s1 = peg$c7;
              peg$currPos += 5;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsewsp();

              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsewsp();
              }

              rule$expects(peg$e1);

              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c1;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
              }

              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$parsewsp();

                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parsewsp();
                }

                s5 = peg$parsenumber();

                if (s5 !== peg$FAILED) {
                  s6 = [];
                  s7 = peg$parsewsp();

                  while (s7 !== peg$FAILED) {
                    s6.push(s7);
                    s7 = peg$parsewsp();
                  }

                  rule$expects(peg$e2);

                  if (input.charCodeAt(peg$currPos) === 41) {
                    s7 = peg$c2;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                  }

                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f7(s5);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsenumber() {
            var s0, s1, s2, s3;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$currPos;
            s2 = peg$parsesign();

            if (s2 === peg$FAILED) {
              s2 = null;
            }

            s3 = peg$parsefloatingPointConstant();

            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$f8(s1);
            }

            s0 = s1;

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$currPos;
              s2 = peg$parsesign();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              s3 = peg$parseintegerConstant();

              if (s3 !== peg$FAILED) {
                s2 = [s2, s3];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }

              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$f9(s1);
              }

              s0 = s1;
            }

            return s0;
          }

          function peg$parsecommaWspNumber() {
            var s0, s1, s2;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$parsecommaWsp();

            if (s1 !== peg$FAILED) {
              s2 = peg$parsenumber();

              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f10(s2);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsecommaWspTwoNumbers() {
            var s0, s1, s2, s3, s4;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$parsecommaWsp();

            if (s1 !== peg$FAILED) {
              s2 = peg$parsenumber();

              if (s2 !== peg$FAILED) {
                s3 = peg$parsecommaWsp();

                if (s3 !== peg$FAILED) {
                  s4 = peg$parsenumber();

                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f11(s2, s4);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsecommaWsp() {
            var s0, s1, s2, s3, s4;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = [];
            s2 = peg$parsewsp();

            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                s2 = peg$parsewsp();
              }
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = peg$parsecomma();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              s3 = [];
              s4 = peg$parsewsp();

              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$parsewsp();
              }

              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsecomma();

              if (s1 !== peg$FAILED) {
                s2 = [];
                s3 = peg$parsewsp();

                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parsewsp();
                }

                s1 = [s1, s2];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }

            return s0;
          }

          function peg$parsecomma() {
            var s0;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            rule$expects(peg$e8);

            if (input.charCodeAt(peg$currPos) === 44) {
              s0 = peg$c8;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parseintegerConstant() {
            var s0, s1;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$parsedigitSequence();

            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$f12(s1);
            }

            s0 = s1;
            return s0;
          }

          function peg$parsefloatingPointConstant() {
            var s0, s1, s2;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            s1 = peg$parsefractionalConstant();

            if (s1 !== peg$FAILED) {
              s2 = peg$parseexponent();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsedigitSequence();

              if (s1 !== peg$FAILED) {
                s2 = peg$parseexponent();

                if (s2 !== peg$FAILED) {
                  s1 = [s1, s2];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }

            return s0;
          }

          function peg$parsefractionalConstant() {
            var s0, s1, s2, s3;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            rule$expects(peg$e9);
            peg$silentFails++;
            s0 = peg$currPos;
            s1 = peg$parsedigitSequence();

            if (s1 === peg$FAILED) {
              s1 = null;
            }

            if (input.charCodeAt(peg$currPos) === 46) {
              s2 = peg$c9;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
            }

            if (s2 !== peg$FAILED) {
              s3 = peg$parsedigitSequence();

              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f13(s1, s3);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parsedigitSequence();

              if (s1 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                  s2 = peg$c9;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                }

                if (s2 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f14(s1);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }

            peg$silentFails--;
            return s0;
          }

          function peg$parseexponent() {
            var s0, s1, s2, s3;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = peg$currPos;
            rule$expects(peg$e10);

            if (peg$r0.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
            }

            if (s1 !== peg$FAILED) {
              s2 = peg$parsesign();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              s3 = peg$parsedigitSequence();

              if (s3 !== peg$FAILED) {
                s1 = [s1, s2, s3];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsesign() {
            var s0;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            rule$expects(peg$e11);

            if (peg$r1.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsedigitSequence() {
            var s0, s1;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            s0 = [];
            s1 = peg$parsedigit();

            if (s1 !== peg$FAILED) {
              while (s1 !== peg$FAILED) {
                s0.push(s1);
                s1 = peg$parsedigit();
              }
            } else {
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsedigit() {
            var s0;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            rule$expects(peg$e12);

            if (peg$r2.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
            }

            return s0;
          }

          function peg$parsewsp() {
            var s0;

            var rule$expects = function rule$expects(expected) {
              if (peg$silentFails === 0) peg$expect(expected);
            };

            rule$expects(peg$e13);

            if (peg$r3.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
            }

            return s0;
          }

          peg$begin();
          peg$result = peg$startRuleFunction();

          if (peg$result !== peg$FAILED && peg$currPos === input.length) {
            return peg$result;
          } else {
            if (peg$result !== peg$FAILED && peg$currPos < input.length) {
              peg$expect(peg$endExpectation());
            }

            throw peg$buildError();
          }
        }


/* harmony default export */ var fromTransformAttribute_autogenerated = ({
          SyntaxError: peg$SyntaxError,
          parse: peg$parse
        });
        // CONCATENATED MODULE: ./src/fromTransformAttribute.js

        /**
         * Parser for SVG Trasform Attribute http://www.w3.org/TR/SVG/coords.html#TransformAttribute <br/>
         * Warning: This should be considered BETA until it is released a stable version of pegjs.
         * @param transformString {string} Transform string as defined by w3 Consortium
         * @returns {MatrixDescriptor[]} Array of MatrixDescriptor
         *
         * @example
         * > fromTransformAttribute('translate(-10,-10) scale(2,2) translate(10,10)')
         * [
         *  { type: 'translate', tx: -10, ty: -10},
         *  { type: 'scale', sx: 2, sy: 2 },
         *  { type: 'translate', tx: 10, ty: 10}
         * ]
         *
         * > compose(fromDefinition(fromTransformAttribute('translate(-10, -10) scale(10, 10)')))
         * { a: 10, c: 0, e: -10, b: 0, d: 10, f: -10 }
         */

        function fromTransformAttribute(transformString) {
          return peg$parse(transformString);
        }
// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport applyToPoint */__webpack_require__.d(__webpack_exports__, "applyToPoint", function () { return applyToPoint; });
/* concated harmony reexport applyToPoints */__webpack_require__.d(__webpack_exports__, "applyToPoints", function () { return applyToPoints; });
/* concated harmony reexport fromObject */__webpack_require__.d(__webpack_exports__, "fromObject", function () { return fromObject; });
/* concated harmony reexport fromString */__webpack_require__.d(__webpack_exports__, "fromString", function () { return fromString; });
/* concated harmony reexport identity */__webpack_require__.d(__webpack_exports__, "identity", function () { return identity; });
/* concated harmony reexport inverse */__webpack_require__.d(__webpack_exports__, "inverse", function () { return inverse; });
/* concated harmony reexport isAffineMatrix */__webpack_require__.d(__webpack_exports__, "isAffineMatrix", function () { return isAffineMatrix; });
/* concated harmony reexport rotate */__webpack_require__.d(__webpack_exports__, "rotate", function () { return rotate; });
/* concated harmony reexport rotateDEG */__webpack_require__.d(__webpack_exports__, "rotateDEG", function () { return rotateDEG; });
/* concated harmony reexport scale */__webpack_require__.d(__webpack_exports__, "scale", function () { return scale; });
/* concated harmony reexport shear */__webpack_require__.d(__webpack_exports__, "shear", function () { return shear; });
/* concated harmony reexport skew */__webpack_require__.d(__webpack_exports__, "skew", function () { return skew; });
/* concated harmony reexport skewDEG */__webpack_require__.d(__webpack_exports__, "skewDEG", function () { return skewDEG; });
/* concated harmony reexport toCSS */__webpack_require__.d(__webpack_exports__, "toCSS", function () { return toCSS; });
/* concated harmony reexport toSVG */__webpack_require__.d(__webpack_exports__, "toSVG", function () { return toSVG; });
/* concated harmony reexport toString */__webpack_require__.d(__webpack_exports__, "toString", function () { return toString_toString; });
/* concated harmony reexport transform */__webpack_require__.d(__webpack_exports__, "transform", function () { return transform; });
/* concated harmony reexport compose */__webpack_require__.d(__webpack_exports__, "compose", function () { return compose; });
/* concated harmony reexport translate */__webpack_require__.d(__webpack_exports__, "translate", function () { return translate; });
/* concated harmony reexport fromTriangles */__webpack_require__.d(__webpack_exports__, "fromTriangles", function () { return fromTriangles; });
/* concated harmony reexport smoothMatrix */__webpack_require__.d(__webpack_exports__, "smoothMatrix", function () { return smoothMatrix; });
/* concated harmony reexport fromDefinition */__webpack_require__.d(__webpack_exports__, "fromDefinition", function () { return fromDefinition; });
/* concated harmony reexport fromTransformAttribute */__webpack_require__.d(__webpack_exports__, "fromTransformAttribute", function () { return fromTransformAttribute; });


















        /***/
})
/******/]);
});
//# sourceMappingURL=transformation-matrix.js.map