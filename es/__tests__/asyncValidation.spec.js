import expect, { createSpy } from 'expect';
import isPromise from 'is-promise';
import asyncValidation from '../asyncValidation';

describe('asyncValidation', function () {
  var field = 'myField';

  it('should throw an error if fn does not return a promise', function () {
    var fn = function fn() {
      return null;
    };
    var start = function start() {
      return null;
    };
    var stop = function stop() {
      return null;
    };
    expect(function () {
      return asyncValidation(fn, start, stop, field);
    }).toThrow(/promise/);
  });

  it('should return a promise', function () {
    var fn = function fn() {
      return Promise.resolve();
    };
    var start = function start() {
      return null;
    };
    var stop = function stop() {
      return null;
    };
    expect(isPromise(asyncValidation(fn, start, stop, field))).toBe(true);
  });

  it('should call start, fn, and stop on promise resolve', function () {
    var fn = createSpy().andReturn(Promise.resolve());
    var start = createSpy();
    var stop = createSpy();
    var promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      expect(stop).toHaveBeenCalled();
    }, function () {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should throw when promise rejected with no errors', function () {
    var fn = createSpy().andReturn(Promise.reject());
    var start = createSpy();
    var stop = createSpy();
    var promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      expect(false).toBe(true); // should not get into resolve branch
    }, function () {
      expect(stop).toHaveBeenCalled();
    });
  });

  it('should call start, fn, and stop on promise reject', function () {
    var errors = { foo: 'error' };
    var fn = createSpy().andReturn(Promise.reject(errors));
    var start = createSpy();
    var stop = createSpy();
    var promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled().toHaveBeenCalledWith(field);
    return promise.then(function () {
      expect(false).toBe(true); // should not get into resolve branch
    }, function () {
      expect(stop).toHaveBeenCalled().toHaveBeenCalledWith(errors);
    });
  });
});