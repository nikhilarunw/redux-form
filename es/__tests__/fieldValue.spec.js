import expect from 'expect';
import { makeFieldValue, isFieldValue } from '../fieldValue';

describe('fieldValue', function () {
  describe('makeFieldValue', function () {
    it('should be okay with non-objects', function () {
      expect(makeFieldValue()).toBe(undefined);
      expect(makeFieldValue(null)).toBe(null);
      expect(makeFieldValue([1, 2])).toEqual([1, 2]);
      expect(makeFieldValue('not an object')).toEqual('not an object');
    });

    it('should return the same object back', function () {
      var someObject = { b: 1 };
      expect(makeFieldValue(someObject)).toBe(someObject);
    });

    it('should not affect deep equal', function () {
      var someObject = { b: 1 };
      expect(someObject).toEqual({ b: 1 });
      makeFieldValue(someObject);
      expect(someObject).toEqual(Object.defineProperties({ b: 1 }, {
        _isFieldValue: { value: true, enumerable: false // hide property
        } }));
    });

    it('should set the field value flag', function () {
      var someObject = { b: 1 };
      expect(isFieldValue(someObject)).toBe(false);
      makeFieldValue(someObject);
      expect(isFieldValue(someObject)).toBe(true);
    });

    it('should be still field value after object recreation', function () {
      var someObject = makeFieldValue({ b: 1 });
      expect(isFieldValue(someObject)).toBe(true);

      var recreatedObject = JSON.parse(JSON.stringify(someObject));
      expect(isFieldValue(recreatedObject)).toBe(true);
    });
  });

  describe('isFieldValue', function () {
    it('should be okay with non-objects', function () {
      expect(isFieldValue()).toBe(false);
      expect(isFieldValue(null)).toBe(false);
      expect(isFieldValue([1, 2])).toBe(false);
      expect(isFieldValue('not an object')).toBe(false);
    });
  });
});