import expect, { createSpy } from 'expect';
import wrapMapStateToProps from '../wrapMapStateToProps';

describe('wrapMapStateToProps', function () {
  it('should save form if no mapStateToProps given', function () {
    var getForm = createSpy().andReturn('foo');
    var result = wrapMapStateToProps(undefined, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    var mapped = result('bar');
    expect(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    expect(mapped).toEqual({ form: 'foo' });
  });

  it('should throw error when mapStateToProps is not a function', function () {
    var getForm = createSpy();
    expect(function () {
      return wrapMapStateToProps(true, getForm);
    }).toThrow('mapStateToProps must be a function');
    expect(function () {
      return wrapMapStateToProps(42, getForm);
    }).toThrow('mapStateToProps must be a function');
    expect(function () {
      return wrapMapStateToProps({}, getForm);
    }).toThrow('mapStateToProps must be a function');
    expect(function () {
      return wrapMapStateToProps([], getForm);
    }).toThrow('mapStateToProps must be a function');
    expect(getForm).toNotHaveBeenCalled();
  });

  it('should call mapStateToProps when one-param function given', function () {
    var getForm = createSpy().andReturn('foo');
    var mapStateToPropsSpy = createSpy().andReturn({ a: 42, b: true, c: 'baz' });
    var mapStateToProps = function mapStateToProps(state) {
      return mapStateToPropsSpy(state);
    };
    expect(mapStateToProps.length).toBe(1);

    var result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    var mapped = result('bar');
    expect(mapStateToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    expect(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });

  it('should call mapStateToProps when two-param function given', function () {
    var getForm = createSpy().andReturn('foo');
    var mapStateToPropsSpy = createSpy().andReturn({ a: 42, b: true, c: 'baz' });
    var mapStateToProps = function mapStateToProps(state, ownProps) {
      return mapStateToPropsSpy(state, ownProps);
    };
    expect(mapStateToProps.length).toBe(2);

    var result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(result).toBeA('function');
    expect(result.length).toBe(2);
    var mapped = result('bar', 'dog');
    expect(mapStateToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith('bar', 'dog');
    expect(getForm).toHaveBeenCalled().toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });
});