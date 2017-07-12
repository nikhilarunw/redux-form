import expect, { createSpy } from 'expect';
import wrapMapDispatchToProps from '../wrapMapDispatchToProps';

var createRestorableSpy = function createRestorableSpy() {
  return createSpy(function () {
    return null;
  }, function resetCalls() {
    // i'm not sure why expect doesn't do this by default
    this.calls = [];
  });
};

describe('wrapMapDispatchToProps', function () {
  it('should bind action creators if no mapDispatchToProps given', function () {
    var actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    var result = wrapMapDispatchToProps(undefined, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should bind action creators if object mapDispatchToProps given', function () {
    var actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    var mapDispatchToProps = {
      c: createSpy(),
      d: createSpy()
    };
    var result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBeA('function');
    expect(mapped.d).toBeA('function');

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.c('bar');
    expect(mapDispatchToProps.c).toHaveBeenCalled().toHaveBeenCalledWith('bar');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.d();
    expect(mapDispatchToProps.d).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when one-param function given', function () {
    var actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    var mapDispatchToPropsSpy = createSpy().andReturn({ c: 42, d: true });
    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
      return mapDispatchToPropsSpy(dispatch);
    };
    expect(mapDispatchToProps.length).toBe(1);

    var result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(1);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch);
    expect(mapDispatchToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith(dispatch);

    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when two-param function given', function () {
    var actionCreators = {
      a: createSpy(),
      b: createSpy()
    };
    var mapDispatchToPropsSpy = createSpy().andReturn({ c: 42, d: true });
    var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {
      return mapDispatchToPropsSpy(dispatch, ownProps);
    };
    expect(mapDispatchToProps.length).toBe(2);

    var result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(result).toBeA('function');
    expect(result.length).toBe(2);
    var dispatch = createRestorableSpy();
    var mapped = result(dispatch, 75);
    expect(mapDispatchToPropsSpy).toHaveBeenCalled().toHaveBeenCalledWith(dispatch, 75);

    expect(mapped).toBeA('object');
    expect(mapped.a).toBeA('function');
    expect(mapped.b).toBeA('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled().toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.restore();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});