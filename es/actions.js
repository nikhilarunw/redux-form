import { ADD_ARRAY_VALUE, AUTOFILL, BLUR, CHANGE, DESTROY, FOCUS, INITIALIZE, REMOVE_ARRAY_VALUE, RESET, START_ASYNC_VALIDATION, START_SUBMIT, STOP_ASYNC_VALIDATION, STOP_SUBMIT, SUBMIT_FAILED, SWAP_ARRAY_VALUES, TOUCH, UNTOUCH } from './actionTypes';

export var addArrayValue = function addArrayValue(path, value, index, fields) {
  return { type: ADD_ARRAY_VALUE, path: path, value: value, index: index, fields: fields };
};

export var autofill = function autofill(field, value) {
  return { type: AUTOFILL, field: field, value: value };
};

export var blur = function blur(field, value) {
  return { type: BLUR, field: field, value: value };
};

export var change = function change(field, value) {
  return { type: CHANGE, field: field, value: value };
};

export var destroy = function destroy() {
  return { type: DESTROY };
};

export var focus = function focus(field) {
  return { type: FOCUS, field: field };
};

export var initialize = function initialize(data, fields) {
  var overwriteValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!Array.isArray(fields)) {
    throw new Error('must provide fields array to initialize() action creator');
  }
  return { type: INITIALIZE, data: data, fields: fields, overwriteValues: overwriteValues };
};

export var removeArrayValue = function removeArrayValue(path, index) {
  return { type: REMOVE_ARRAY_VALUE, path: path, index: index };
};

export var reset = function reset() {
  return { type: RESET };
};

export var startAsyncValidation = function startAsyncValidation(field) {
  return { type: START_ASYNC_VALIDATION, field: field };
};

export var startSubmit = function startSubmit() {
  return { type: START_SUBMIT };
};

export var stopAsyncValidation = function stopAsyncValidation(errors) {
  return { type: STOP_ASYNC_VALIDATION, errors: errors };
};

export var stopSubmit = function stopSubmit(errors) {
  return { type: STOP_SUBMIT, errors: errors };
};

export var submitFailed = function submitFailed() {
  return { type: SUBMIT_FAILED };
};

export var swapArrayValues = function swapArrayValues(path, indexA, indexB) {
  return { type: SWAP_ARRAY_VALUES, path: path, indexA: indexA, indexB: indexB };
};

export var touch = function touch() {
  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
    fields[_key] = arguments[_key];
  }

  return { type: TOUCH, fields: fields };
};

export var untouch = function untouch() {
  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fields[_key2] = arguments[_key2];
  }

  return { type: UNTOUCH, fields: fields };
};