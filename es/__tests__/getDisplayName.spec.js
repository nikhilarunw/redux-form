import expect from 'expect';
import getDisplayName from '../getDisplayName';

describe('getDisplayName', function () {
  it('should return the displayName if set', function () {
    expect(getDisplayName({ displayName: 'Foo' })).toBe('Foo');
    expect(getDisplayName({ displayName: 'Bar' })).toBe('Bar');
  });

  it('should return the name if set', function () {
    expect(getDisplayName({ name: 'Foo' })).toBe('Foo');
    expect(getDisplayName({ name: 'Bar' })).toBe('Bar');
  });

  it('should return "Component" if neither displayName nor name is set', function () {
    expect(getDisplayName({})).toBe('Component');
  });
});