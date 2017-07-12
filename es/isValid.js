var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

export default function isValid(error) {
  if (Array.isArray(error)) {
    return error.reduce(function (valid, errorValue) {
      return valid && isValid(errorValue);
    }, true);
  }
  if (error && (typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
    return Object.keys(error).reduce(function (valid, key) {
      return valid && isValid(error[key]);
    }, true);
  }
  return !error;
}