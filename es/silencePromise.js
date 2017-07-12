import isPromise from 'is-promise';

var noop = function noop() {
  return undefined;
};

var silencePromise = function silencePromise(promise) {
  return isPromise(promise) ? promise.then(noop, noop) : promise;
};

export default silencePromise;