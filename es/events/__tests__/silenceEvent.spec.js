import expect, { createSpy } from 'expect';
import silenceEvent from '../silenceEvent';

describe('silenceEvent', function () {
  it('should return false if not an event', function () {
    expect(silenceEvent(undefined)).toBe(false);
    expect(silenceEvent(null)).toBe(false);
    expect(silenceEvent(true)).toBe(false);
    expect(silenceEvent(42)).toBe(false);
    expect(silenceEvent({})).toBe(false);
    expect(silenceEvent([])).toBe(false);
    expect(silenceEvent(function () {
      return null;
    })).toBe(false);
  });

  it('should return true if an event', function () {
    expect(silenceEvent({
      preventDefault: function preventDefault() {
        return null;
      },
      stopPropagation: function stopPropagation() {
        return null;
      }
    })).toBe(true);
  });

  it('should call preventDefault and stopPropagation', function () {
    var preventDefault = createSpy();
    var stopPropagation = createSpy();

    silenceEvent({
      preventDefault: preventDefault,
      stopPropagation: stopPropagation
    });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toNotHaveBeenCalled();
  });
});