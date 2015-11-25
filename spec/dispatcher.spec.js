var dispatcher = require('../../dispatcher');

describe('Dispatcher', function () {
  it('can register one or more handlers', function() {
    //...
  });

  describe('with handlers registered', function() {
    var handlers,
      handlersIds;

    beforeEach(function() {
      handlers = {
        A: function() {},
        B: function() {},
        C: function() {}
      };

      spyOn(handlers, 'A');
      spyOn(handlers, 'B');
      spyOn(handlers, 'C');

      handlersIds = {
        A: dispatcher.register(handlers.A),
        B: dispatcher.register(handlers.B),
        C: dispatcher.register(handlers.C)
      };
    });

    it('can dispatch all handlers, passing a payload', function() {
      console.log(dispatcher);
      dispatcher.dispatch();

      expect(handlers.A).toHaveBeenCalled();
      expect(handlers.B).toHaveBeenCalled();
      expect(handlers.C).toHaveBeenCalled();
    });

    it('can unregister a handler', function() {
      dispatcher.unregister(handlersIds.A);

      expect(handlers.A).not.toHaveBeenCalled();
      expect(handlers.B).toHaveBeenCalled();
      expect(handlers.C).toHaveBeenCalled();
    });
  });

  it('can hold off dispatching one handler until one or more other handlers have run', function() {
    var handlers = {},
      handlerIds = {},
      sleep,
      calledOrder = '';

    sleep = function(wait) {
      var startTime = new Date().getTime();
      for (var i = 1e7; i >= 0; i--) {
        var now = new Date().getTime();
        if ((startTime + wait) > now) {
          break;
        }
      }
    }

    handlers['One'] = function() {
      sleep(2000);
      calledOrder += 'One';
    };

    handlers['Two'] = function() {
      sleep(3000);
      calledOrder += 'Two';
    };

    spyOn(handlers, 'One');
    spyOn(handlers, 'Two');
    handlerIds['One'] = dispatcher.register(handlers['One']);
    handlerIds['Two'] = dispatcher.register(handlers['Two']);

    handlers['Three'] = function() {
      dispatcher.waitFor(handlerIds);
      calledOrder += 'Three';
    }

    spyOn(handlers, 'Three');
    dispatcher.register(handlers['Three']);

    dispatcher.dispatch();

    expect(calledOrder).toBe('OneTwoThree');
  });
});