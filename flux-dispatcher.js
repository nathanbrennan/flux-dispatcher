var Dispatcher = {
  idIncrementor: 0,
  _isDispatching: false,
  _startedHandlers: {},
  _finishedHandlers: {},
  _handlers: {},

  register: function(handler) {
    // Create ID for this handler
    var handlerID = 'handlerID_' + this.idIncrementor++;
    // Register the handler against the ID
    this._handlers[handlerID] = handler;
    // return the ID for use with unregister
    return handlerID;
  },

  unregister: function(handlerID) {
    // TODO: Should this error if handlerID is unknown
    delete this._handlers[handlerID];
  },

  waitFor: function(handlerIDs) {
    // Error out if dispatcher is not dispatching
    if (!this._isDispatching) {
      throw new Error('Dispatcher.waitFor: Must only be called while dispatching');
      return;
    }

    // For each nominated handler
    for (var i = 0; i < handlerIDs.length; i++) {
      var id = handlerIDs[i];

      // Check if the handler has started
      if (this._startedHandlers[id]) {
        // If the handler is still running, this indicates a circular dependency
        if (!this._finishedHandlers[id]) {
          throw new Error('Dispatcher.waitFor: Circular dependency found while waiting for' + id);
        }

        // Otherwise, it has already run (So don't run it)
        continue;
      }

      if (!this._handlers[id]) {
        throw new Error('Dispatcher.waitFor: No handler found with id' +  id);
      }

      this._callHandler(id);
    }
  },

  dispatch: function(payload) {
    this._startDistatching(payload);

    for (var id in this._handlers) {
      if (this._startedHandlers[id]) {
        continue;
      }

      this._callHandler(id);
    }

    this._finishDispatching();
  },

  _startDistatching: function(payload) {
    this._currentPayload = payload;
    this._startedHandlers = {};
    this._finishedHandlers = {};
    this._isDispatching = true;
  },

  _finishDispatching:function() {
    delete this._currentPayload;
    this._isDispatching = false;
  },

  _callHandler: function(id) {
    this._startedHandlers[id] = true;
    this._handlers[id](this._currentPayload);
    this._finishedHandlers[id] = true;
  }
};

// Support module export where available: require('dispatcher')
if (typeof module != 'undefined' && module.exports) {
  module.exports = Dispatcher;
}
