function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import isPromise from 'is-promise';
import isValid from './isValid';

var handleSubmit = function handleSubmit(submit, values, props, asyncValidate) {
  var dispatch = props.dispatch,
      fields = props.fields,
      onSubmitSuccess = props.onSubmitSuccess,
      onSubmitFail = props.onSubmitFail,
      startSubmit = props.startSubmit,
      stopSubmit = props.stopSubmit,
      submitFailed = props.submitFailed,
      returnRejectedSubmitPromise = props.returnRejectedSubmitPromise,
      touch = props.touch,
      validate = props.validate;

  var syncErrors = validate(values, props);
  touch.apply(undefined, _toConsumableArray(fields)); // touch all fields
  if (isValid(syncErrors)) {
    var doSubmit = function doSubmit() {
      var result = submit(values, dispatch, props);
      if (isPromise(result)) {
        startSubmit();
        return result.then(function (submitResult) {
          stopSubmit();
          if (onSubmitSuccess) {
            onSubmitSuccess(submitResult);
          }
          return submitResult;
        }, function (submitError) {
          stopSubmit(submitError);
          if (onSubmitFail) {
            onSubmitFail(submitError);
          }
          if (returnRejectedSubmitPromise) {
            return Promise.reject(submitError);
          }
        });
      }
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
      return result;
    };
    var asyncValidateResult = asyncValidate();
    return isPromise(asyncValidateResult) ?
    // asyncValidateResult will be rejected if async validation failed
    asyncValidateResult.then(doSubmit, function () {
      submitFailed();
      if (onSubmitFail) {
        onSubmitFail();
      }
      return returnRejectedSubmitPromise ? Promise.reject() : Promise.resolve();
    }) : doSubmit(); // no async validation, so submit
  }
  submitFailed();

  if (onSubmitFail) {
    onSubmitFail(syncErrors);
  }

  if (returnRejectedSubmitPromise) {
    return Promise.reject(syncErrors);
  }
};

export default handleSubmit;