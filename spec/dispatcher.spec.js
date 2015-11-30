var dispatcher = require('../flux-dispatcher.js');

describe('Dispatcher', function () {
  it('can register a handlers and return the key for it', function() {
    var fooHandler = function() {
      console.log('Foo!');
    };

    var id = dispatcher.register(fooHandler);

    expect(dispatcher.handlers[id]).toBe(fooHandler);
  });

  it('can dispatch all handler, passing a payload', function() {
    var handlers,
      handlersIds;

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

    dispatcher.dispatch('hat');

    expect(handlers.A).toHaveBeenCalledWith('hat');
    expect(handlers.B).toHaveBeenCalledWith('hat');
    expect(handlers.C).toHaveBeenCalledWith('hat');
  });

  it('can unregister a handler', function() {
    var handlers,
      handlersIds;

    handlers = {
      D: function() { console.log('D!'); },
      E: function() { console.log('E!'); },
      F: function() { console.log('F!'); }
    };

    spyOn(handlers, 'D');
    spyOn(handlers, 'E');
    spyOn(handlers, 'F');

    handlersIds = {
      D: dispatcher.register(handlers.D),
      E: dispatcher.register(handlers.E),
      F: dispatcher.register(handlers.F)
    };

    dispatcher.unregister(handlersIds.D);
    dispatcher.dispatch('hat');

    expect(handlers.D).not.toHaveBeenCalled();
    expect(handlers.E).toHaveBeenCalled();
    expect(handlers.F).toHaveBeenCalled();
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