import expect from 'expect';
import updateField from '../updateField';

describe('updateField', function () {
  it('should return new field object when something changes', function () {
    var field = { value: 'foo' };
    var result = updateField(field, { value: 'bar' }, false, undefined);
    expect(result).toNotBe(field);
  });

  it('should set value', function () {
    expect(updateField({}, { value: 'foo' }, true, undefined).value).toBe('foo');
    expect(updateField({ value: 'foo' }, { value: 'bar' }, true, undefined).value).toBe('bar');
    expect(updateField({}, { value: 42 }, true, undefined).value).toBe(42);
    expect(updateField({ value: 3 }, { value: 42 }, true, undefined).value).toBe(42);
  });

  it('should set pristine and dirty', function () {
    var result1 = updateField({}, { value: 'foo', initial: 'foo' }, false, undefined);
    expect(result1.dirty).toBe(false);
    expect(result1.pristine).toBe(true);
    var result2 = updateField({}, { value: 'foo', initial: 'bar' }, false, undefined);
    expect(result2.dirty).toBe(true);
    expect(result2.pristine).toBe(false);

    // test that it overwrites existing flags
    var result3 = updateField({ dirty: true, pristine: false }, { value: 'foo', initial: 'foo' }, false, undefined);
    expect(result3.dirty).toBe(false);
    expect(result3.pristine).toBe(true);
    var result4 = updateField({ dirty: false, pristine: true }, { value: 'foo', initial: 'bar' }, false, undefined);
    expect(result4.dirty).toBe(true);
    expect(result4.pristine).toBe(false);
  });

  it('should have no error when no errors', function () {
    expect(updateField({}, {}, false, undefined).error).toBe(undefined);
  });

  it('should set error from sync error', function () {
    expect(updateField({}, {}, false, 'foo').error).toBe('foo');
    expect(updateField({}, {}, false, 'bar').error).toBe('bar');
  });

  it('should set error from submit error', function () {
    expect(updateField({}, { submitError: 'foo' }, false, undefined).error).toBe('foo');
    expect(updateField({}, { submitError: 'bar' }, false, undefined).error).toBe('bar');
  });

  it('should set error from async error', function () {
    expect(updateField({}, { asyncError: 'foo' }, false, undefined).error).toBe('foo');
    expect(updateField({}, { asyncError: 'bar' }, false, undefined).error).toBe('bar');
  });

  it('should prioritize submit error over async error', function () {
    expect(updateField({}, { asyncError: 'fooAsync', submitError: 'fooSubmit' }, false, undefined).error).toBe('fooSubmit');
    expect(updateField({}, { asyncError: 'barAsync', submitError: 'barSubmit' }, false, undefined).error).toBe('barSubmit');
  });

  it('should prioritize sync error over async error', function () {
    expect(updateField({}, { asyncError: 'fooAsync' }, false, 'fooSync').error).toBe('fooSync');
    expect(updateField({}, { asyncError: 'barAsync' }, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit error', function () {
    expect(updateField({}, { submitError: 'fooSubmit' }, false, 'fooSync').error).toBe('fooSync');
    expect(updateField({}, { submitError: 'barSubmit' }, false, 'barSync').error).toBe('barSync');
  });

  it('should prioritize sync error over submit and async error', function () {
    expect(updateField({}, { asyncError: 'fooAsync', submitError: 'fooSubmit' }, false, 'fooSync').error).toBe('fooSync');
    expect(updateField({}, { asyncError: 'barAsync', submitError: 'barSubmit' }, false, 'barSync').error).toBe('barSync');
  });

  it('should set valid/invalid', function () {
    var result1 = updateField({}, {}, false, undefined);
    expect(result1.valid).toBe(true);
    expect(result1.invalid).toBe(false);
    var result2 = updateField({}, {}, false, 'sync error');
    expect(result2.valid).toBe(false);
    expect(result2.invalid).toBe(true);

    // test that it overwrites existing flags
    var result3 = updateField({ valid: false, invalid: true }, {}, false, undefined);
    expect(result3.valid).toBe(true);
    expect(result3.invalid).toBe(false);
    var result4 = updateField({ valid: true, invalid: false }, {}, false, 'sync error');
    expect(result4.valid).toBe(false);
    expect(result4.invalid).toBe(true);
  });

  it('should set active', function () {
    expect(updateField({}, {}, true, undefined).active).toBe(true);
    expect(updateField({ active: false }, {}, true, undefined).active).toBe(true);
    expect(updateField({}, {}, false, undefined).active).toBe(false);
    expect(updateField({ active: true }, {}, false, undefined).active).toBe(false);
  });

  it('should set touched', function () {
    // init
    expect(updateField({}, { touched: true }, false, undefined).touched).toBe(true);
    expect(updateField({}, { touched: false }, false, undefined).touched).toBe(false);
    expect(updateField({}, {}, false, undefined).touched).toBe(false);
    // update
    expect(updateField({ touched: false }, { touched: true }, false, undefined).touched).toBe(true);
    expect(updateField({ touched: true }, { touched: false }, false, undefined).touched).toBe(false);
    expect(updateField({ touched: true }, {}, false, undefined).touched).toBe(false);
  });

  it('should set visited', function () {
    // init
    expect(updateField({}, { visited: true }, false, undefined).visited).toBe(true);
    expect(updateField({}, { visited: false }, false, undefined).visited).toBe(false);
    expect(updateField({}, {}, false, undefined).visited).toBe(false);
    // update
    expect(updateField({ visited: false }, { visited: true }, false, undefined).visited).toBe(true);
    expect(updateField({ visited: true }, { visited: false }, false, undefined).visited).toBe(false);
    expect(updateField({ visited: true }, {}, false, undefined).visited).toBe(false);
  });

  it('should change initial and default values when initial changes', function () {
    expect(updateField({ initialValue: 1 }, { initial: 2 }, false, undefined).initialValue).toBe(2);
    expect(updateField({ initialValue: 1 }, { initial: undefined }, false, undefined).initialValue).toBe(undefined);
  });
});