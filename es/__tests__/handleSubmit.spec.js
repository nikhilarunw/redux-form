import expect, { createSpy } from 'expect';
import isPromise from 'is-promise';
import handleSubmit from '../handleSubmit';

describe('handleSubmit', function () {

  it('should stop if sync validation fails', function () {
    var _expect$toHaveBeenCal;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(69);
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy();
    var validate = createSpy().andReturn({ foo: 'error' });
    var props = {
      fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    expect(handleSubmit(submit, values, props, asyncValidate)).toBe(undefined);

    (_expect$toHaveBeenCal = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal, fields);
    expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toNotHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
    expect(onSubmitSuccess).toNotHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
  });

  it('should stop and return rejected promise if sync validation fails and returnRejectedSubmitPromise', function (done) {
    var _expect$toHaveBeenCal2;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var errorValue = { foo: 'error' };
    var submit = createSpy().andReturn(69);
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy();
    var validate = createSpy().andReturn(errorValue);
    var props = {
      fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    var result = handleSubmit(submit, values, props, asyncValidate);
    expect(isPromise(result)).toBe(true);

    (_expect$toHaveBeenCal2 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal2, fields);
    expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toNotHaveBeenCalled();
    expect(submit).toNotHaveBeenCalled();
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
    expect(onSubmitSuccess).toNotHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
    result.then(function () {
      expect(false).toBe(true); // should not be in resolve branch
    }, function (error) {
      expect(error).toBe(errorValue);
      done();
    });
  });

  it('should return result of sync submit', function () {
    var _expect$toHaveBeenCal3;

    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy();
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    expect(handleSubmit(submit, values, props, asyncValidate)).toBe(69);

    (_expect$toHaveBeenCal3 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal3, fields);
    expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
    expect(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch, props);
    expect(startSubmit).toNotHaveBeenCalled();
    expect(stopSubmit).toNotHaveBeenCalled();
    expect(submitFailed).toNotHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalled();
    expect(onSubmitFail).toNotHaveBeenCalled();
  });

  it('should not submit if async validation fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.reject());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal4;

      expect(result).toBe(undefined);
      (_expect$toHaveBeenCal4 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal4, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toNotHaveBeenCalled();
      expect(startSubmit).toNotHaveBeenCalled();
      expect(stopSubmit).toNotHaveBeenCalled();
      expect(submitFailed).toHaveBeenCalled();
      expect(onSubmitSuccess).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled();
    }, function () {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should not submit if async validation fails and return rejected promise', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.reject());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function () {
      expect(false).toBe(true); // should not get into resolve branch
    }, function (result) {
      var _expect$toHaveBeenCal5;

      expect(result).toBe(undefined);
      (_expect$toHaveBeenCal5 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal5, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toNotHaveBeenCalled();
      expect(startSubmit).toNotHaveBeenCalled();
      expect(stopSubmit).toNotHaveBeenCalled();
      expect(submitFailed).toHaveBeenCalled();
      expect(onSubmitSuccess).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled();
    });
  });

  it('should sync submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(69);
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.resolve());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal6;

      expect(result).toBe(69);
      (_expect$toHaveBeenCal6 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal6, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch, props);
      expect(startSubmit).toNotHaveBeenCalled();
      expect(stopSubmit).toNotHaveBeenCalled();
      expect(submitFailed).toNotHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalled();
      expect(onSubmitFail).toNotHaveBeenCalled();
    }, function () {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should async submit if async validation passes', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submit = createSpy().andReturn(Promise.resolve(69));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.resolve());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal7;

      expect(result).toBe(69);
      (_expect$toHaveBeenCal7 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal7, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch, props);
      expect(startSubmit).toHaveBeenCalled();
      expect(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submitFailed).toNotHaveBeenCalled();
      expect(onSubmitSuccess).toHaveBeenCalled();
      expect(onSubmitFail).toNotHaveBeenCalled();
    }, function () {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should set submit errors if async submit fails', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submitErrors = { foo: 'error' };
    var submit = createSpy().andReturn(Promise.reject(submitErrors));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.resolve());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function (result) {
      var _expect$toHaveBeenCal8;

      expect(result).toBe(undefined);
      (_expect$toHaveBeenCal8 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal8, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch, props);
      expect(startSubmit).toHaveBeenCalled();
      expect(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      expect(submitFailed).toNotHaveBeenCalled();
      expect(onSubmitSuccess).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
    }, function () {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should set submit errors if async submit fails and return rejected promise', function () {
    var values = { foo: 'bar', baz: 42 };
    var fields = ['foo', 'baz'];
    var submitErrors = { foo: 'error' };
    var submit = createSpy().andReturn(Promise.reject(submitErrors));
    var dispatch = function dispatch() {
      return null;
    };
    var touch = createSpy();
    var startSubmit = createSpy();
    var stopSubmit = createSpy();
    var submitFailed = createSpy();
    var onSubmitSuccess = createSpy();
    var onSubmitFail = createSpy();
    var asyncValidate = createSpy().andReturn(Promise.resolve());
    var validate = createSpy().andReturn({});
    var props = {
      dispatch: dispatch, fields: fields, onSubmitSuccess: onSubmitSuccess, onSubmitFail: onSubmitFail, startSubmit: startSubmit, stopSubmit: stopSubmit,
      submitFailed: submitFailed, touch: touch, validate: validate, returnRejectedSubmitPromise: true
    };

    return handleSubmit(submit, values, props, asyncValidate).then(function () {
      expect(false).toBe(true); // should not get into resolve branch
    }, function (result) {
      var _expect$toHaveBeenCal9;

      expect(result).toBe(submitErrors);
      (_expect$toHaveBeenCal9 = expect(touch).toHaveBeenCalled()).toHaveBeenCalledWith.apply(_expect$toHaveBeenCal9, fields);
      expect(validate).toHaveBeenCalled().toHaveBeenCalledWith(values, props);
      expect(asyncValidate).toHaveBeenCalled().toHaveBeenCalledWith();
      expect(submit).toHaveBeenCalled().toHaveBeenCalledWith(values, dispatch, props);
      expect(startSubmit).toHaveBeenCalled();
      expect(stopSubmit).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
      expect(submitFailed).toNotHaveBeenCalled();
      expect(onSubmitSuccess).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled().toHaveBeenCalledWith(submitErrors);
    });
  });
});