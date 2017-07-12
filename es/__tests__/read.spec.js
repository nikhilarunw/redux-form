import expect from 'expect';
import read from '../read';

describe('read', function () {
  it('should get simple values', function () {
    expect(read('foo', { foo: 'bar' })).toBe('bar');
    expect(read('foo', { foo: 7 })).toBe(7);
    expect(read('bar', { bar: true })).toBe(true);
  });

  it('should get arbitrarily deep dotted values', function () {
    var data = {
      foo: {
        bar: {
          baz: 42
        }
      }
    };
    expect(read('foo', data)).toBe(data.foo);
    expect(read('foo.bar', data)).toBe(data.foo.bar);
    expect(read('foo.bar.baz', data)).toBe(42);
  });

  it('should return undefined if structure is incomplete', function () {
    var data = {
      foo: {}
    };
    expect(read('foo', data)).toBe(data.foo);
    expect(read('foo.bar', data)).toBe(undefined);
    expect(read('foo.bar.baz', data)).toBe(undefined);
  });

  it('should throw an error when array syntax is broken', function () {
    expect(function () {
      read('foo[dog', {});
    }).toThrow(/found/);
  });

  it('should get simple array values', function () {
    var data = {
      cat: ['foo', 'bar', 'baz']
    };
    expect(read('cat[0]', data)).toBe('foo');
    expect(read('cat[1]', data)).toBe('bar');
    expect(read('cat[2]', data)).toBe('baz');
  });

  it('should get return undefined when array is not there', function () {
    var data = {
      cat: undefined
    };
    expect(read('cat[0]', data)).toBe(undefined);
  });

  it('should get complex array values', function () {
    var data = {
      rat: {
        cat: [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }]
      }
    };
    expect(read('rat.cat[0].name', data)).toBe('foo');
    expect(read('rat.cat[0][name]', data)).toBe('foo');
    expect(read('rat.cat[1].name', data)).toBe('bar');
    expect(read('rat.cat[1][name]', data)).toBe('bar');
    expect(read('rat.cat[2].name', data)).toBe('baz');
    expect(read('rat.cat[2][name]', data)).toBe('baz');
  });
});