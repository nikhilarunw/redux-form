import expect from 'expect';
import removeField from '../removeField';

describe('removeField', function () {
  it('should have no effect if simple field does not exist', function () {
    expect(removeField({ foo: 'bar' }, 'baz')).toEqual({ foo: 'bar' });
  });

  it('should not return same instance', function () {
    var fields = { foo: 'bar' };
    expect(removeField(fields, 'foo')).toNotBe(fields);
  });

  it('should remove a simple field', function () {
    expect(removeField({ foo: 'bar', dog: 42 }, 'dog')).toEqual({ foo: 'bar' });
  });

  it('should remove a nested field', function () {
    expect(removeField({ foo: { rat: 'bar' }, dog: 42 }, 'foo.rat')).toEqual({ dog: 42 });
  });

  it('should remove a nested field from root', function () {
    expect(removeField({ foo: { rat: 'bar' }, dog: 42 }, 'foo')).toEqual({ dog: 42 });
  });

  it('should remove an array field', function () {
    expect(removeField({ foo: [{ rat: 'bar' }], dog: 42 }, 'foo[].rat')).toEqual({ dog: 42 });
  });

  it('should remove a deep field', function () {
    expect(removeField({ foo: [{ rat: { pig: 'bar' } }], dog: 42 }, 'foo[].rat.pig')).toEqual({ dog: 42 });
  });

  it('should remove an array field from root', function () {
    expect(removeField({ foo: [{ rat: 'bar' }], dog: 42 }, 'foo')).toEqual({ dog: 42 });
  });
});