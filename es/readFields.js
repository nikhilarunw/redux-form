var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import readField from './readField';
import write from './write';
import getValues from './getValues';
import removeField from './removeField';

/**
 * Reads props and generates (or updates) field structure
 */
var readFields = function readFields(props, previousProps, myFields, asyncValidate, isReactNative) {
  var fields = props.fields,
      form = props.form,
      validate = props.validate;

  var previousFields = previousProps.fields;
  var values = getValues(fields, form);
  var syncErrors = validate(values, props) || {};
  var errors = {};
  var formError = syncErrors._error || form._error;
  var allValid = !formError;
  var allPristine = true;
  var tally = function tally(field) {
    if (field.error) {
      errors = write(field.name, field.error, errors);
      allValid = false;
    }
    if (field.dirty) {
      allPristine = false;
    }
  };
  var fieldObjects = previousFields ? previousFields.reduce(function (accumulator, previousField) {
    return ~fields.indexOf(previousField) ? accumulator : removeField(accumulator, previousField);
  }, _extends({}, myFields)) : _extends({}, myFields);
  fields.forEach(function (name) {
    readField(form, name, undefined, fieldObjects, syncErrors, asyncValidate, isReactNative, props, tally);
  });
  Object.defineProperty(fieldObjects, '_meta', {
    value: {
      allPristine: allPristine,
      allValid: allValid,
      values: values,
      errors: errors,
      formError: formError
    }
  });
  return fieldObjects;
};
export default readFields;