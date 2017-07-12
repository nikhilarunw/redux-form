var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import isEvent from './isEvent';

var getSelectedValues = function getSelectedValues(options) {
  var result = [];
  if (options) {
    for (var index = 0; index < options.length; index++) {
      var option = options[index];
      if (option.selected) {
        result.push(option.value);
      }
    }
  }
  return result;
};

var getValue = function getValue(event, isReactNative) {
  if (isEvent(event)) {
    if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
      return event.nativeEvent.text;
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text;
    }
    var _event$target = event.target,
        type = _event$target.type,
        value = _event$target.value,
        checked = _event$target.checked,
        files = _event$target.files,
        dataTransfer = event.dataTransfer;

    if (type === 'checkbox') {
      return checked;
    }
    if (type === 'radio') {
      return checked ? value : '';
    }
    if (type === 'file') {
      return files || dataTransfer && dataTransfer.files;
    }
    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options);
    }
    if (value !== '' && (type === 'number' || type === 'range')) {
      return parseFloat(value);
    }
    return value;
  }
  // not an event, so must be either our value or an object containing our value in the 'value' key
  return event && (typeof event === 'undefined' ? 'undefined' : _typeof(event)) === 'object' && event.value !== undefined ? event.value : // extract value from { value: value } structure. https://github.com/nikgraf/belle/issues/58
  event;
};

export default getValue;