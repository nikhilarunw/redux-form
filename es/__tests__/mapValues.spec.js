import expect from 'expect';
import mapValues from '../mapValues';

describe('mapValues', function () {
  it('should return undefined when given undefined', function () {
    expect(mapValues(undefined, function () {
      return null;
    })).toBe(undefined);
  });

  it('should return null when given null', function () {
    expect(mapValues(null, function () {
      return null;
    })).toBe(null);
  });

  it('should call a function on each value', function () {
    expect(mapValues({
      a: 1,
      b: 2,
      c: 3,
      d: 4
    }, function (value) {
      return value * 2;
    })).toBeA('object').toEqual({
      a: 2,
      b: 4,
      c: 6,
      d: 8
    });
  });
});