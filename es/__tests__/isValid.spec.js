import expect from 'expect';
import isValid from '../isValid';

describe('isValid', function () {

  it('should return true if the value is falsy', function () {
    expect(isValid(undefined)).toBe(true);
    expect(isValid(null)).toBe(true);
    expect(isValid(false)).toBe(true);
  });

  it('should return false if the value is truthy', function () {
    expect(isValid('error')).toBe(false);
    expect(isValid(true)).toBe(false);
  });

  it('should return true if the value is an array of falsy values', function () {
    expect(isValid([undefined, null, false])).toBe(true);
  });

  it('should return true if the value is an empty array', function () {
    expect(isValid([])).toBe(true);
  });

  it('should return false if the value is an array with one truthy value', function () {
    expect(isValid([undefined, 'error', undefined])).toBe(false);
  });

  it('should return true if the value is an empty object', function () {
    expect(isValid({})).toBe(true);
  });

  it('should return true if the value is an object with a falsy value', function () {
    expect(isValid({ name: undefined })).toBe(true);
    expect(isValid({ name: null })).toBe(true);
    expect(isValid({ name: false })).toBe(true);
    expect(isValid({ name: '' })).toBe(true);
  });

  it('should return false if the value is an object with a value', function () {
    expect(isValid({ name: 'error' })).toBe(false);
  });
});