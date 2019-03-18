var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

export default function isPristine(initial, data) {
  if (initial === data) {
    return true;
  }
  if (typeof initial === 'boolean' || typeof data === 'boolean') {
    return initial === data;
  } else if (initial instanceof Date && data instanceof Date) {
    return initial.getTime() === data.getTime();
  } else if (initial && (typeof initial === 'undefined' ? 'undefined' : _typeof(initial)) === 'object') {
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
      return false;
    }
    var initialKeys = Object.keys(initial);
    var dataKeys = Object.keys(data);
    if (initialKeys.length !== dataKeys.length) {
      return false;
    }
    for (var index = 0; index < dataKeys.length; index++) {
      var key = dataKeys[index];
      if (!isPristine(initial[key], data[key])) {
        return false;
      }
    }
  } else if (initial || data) {
    // allow '' to equate to undefined or null
    return initial === data;
  } else if (initial === null && data === 0 || initial === 0 && data === null) {
    return false;
  }
  return true;
}