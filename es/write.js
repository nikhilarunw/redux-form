var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Writes any potentially deep value from an object using dot and array syntax,
 * and returns a new copy of the object.
 */
var write = function write(path, value, object) {
  var dotIndex = path.indexOf('.');
  if (dotIndex === 0) {
    return write(path.substring(1), value, object);
  }
  var openIndex = path.indexOf('[');
  var closeIndex = path.indexOf(']');
  if (dotIndex >= 0 && (openIndex < 0 || dotIndex < openIndex)) {
    // is dot notation
    var key = path.substring(0, dotIndex);
    return _extends({}, object, _defineProperty({}, key, write(path.substring(dotIndex + 1), value, object[key] || {})));
  }
  if (openIndex >= 0 && (dotIndex < 0 || openIndex < dotIndex)) {
    // is array notation
    if (closeIndex < 0) {
      throw new Error('found [ but no ]');
    }
    var _key = path.substring(0, openIndex);
    var index = path.substring(openIndex + 1, closeIndex);
    var array = object[_key] || [];
    var rest = path.substring(closeIndex + 1);
    if (index) {
      // indexed array
      if (rest.length) {
        // need to keep recursing
        var dest = array[index] || {};
        var arrayCopy = [].concat(_toConsumableArray(array));
        arrayCopy[index] = write(rest, value, dest);
        return _extends({}, object || {}, _defineProperty({}, _key, arrayCopy));
      }
      var copy = [].concat(_toConsumableArray(array));
      copy[index] = typeof value === 'function' ? value(copy[index]) : value;
      return _extends({}, object || {}, _defineProperty({}, _key, copy));
    }
    // indexless array
    if (rest.length) {
      // need to keep recursing
      if ((!array || !array.length) && typeof value === 'function') {
        return object; // don't even set a value under [key]
      }
      var _arrayCopy = array.map(function (dest) {
        return write(rest, value, dest);
      });
      return _extends({}, object || {}, _defineProperty({}, _key, _arrayCopy));
    }
    var result = void 0;
    if (Array.isArray(value)) {
      result = value;
    } else if (object[_key]) {
      result = array.map(function (dest) {
        return typeof value === 'function' ? value(dest) : value;
      });
    } else if (typeof value === 'function') {
      return object; // don't even set a value under [key]
    } else {
      result = value;
    }
    return _extends({}, object || {}, _defineProperty({}, _key, result));
  }
  return _extends({}, object, _defineProperty({}, path, typeof value === 'function' ? value(object[path]) : value));
};

export default write;