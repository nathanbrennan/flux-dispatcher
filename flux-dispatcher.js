var Dispatcher = {
  idIncrementor: 0,
  isDispatching: false,
  startedHandlers: {},
  finishedHandlers: {},
  handlers: {},

  register: function(handler) {
    // Create ID for this handler
    var handlerID = 'handlerID_' + this.idIncrementor++;
    // Register the handler against the ID
    this.handlers[handlerID] = handler;
    // return the ID for use with unregister
    return handlerID;
  },

  unregister: function(handlerID) {
    // TODO: Should this error if handlerID is unknown
    delete this.handlers[handlerID];
  },

  waitFor: function(handlerIDs) {
    // Error out if dispatcher is not dispatching
    if (!this.isDispatching) {
      throw new Error('Dispatcher.waitFor: Must only be called while dispatching');
      return;
    }

    // For each nominated handler
    for (var i = 0; i < handlerIDs.length; i++) {
      var id = handlerIDs[i];

      // Ensure that it is not currently running

      // Check if the handler has started
      if (this.startedHandlers[id]) {
        // If the handler id still running, that indicates a circular dependency
        if (!this.finishedHandlers[id]) {
          // YOU ARE HERE
          // YOU ARE HERE
          // YOU ARE HERE
          // YOU ARE HERE
          // YOU ARE HERE
          throw new Error('Dispatcher.waitFor: Circular dependency found whiole waiting for')
        }

        // If it has already run, don't run it
      }
      // If it hasn't run yet
        // Ensure it's a thing
        // Run it
    }
  },

  dispatch: function(payload) {
    this.isDispatching = true;
    for (var id in this.handlers) {
      this.handlers[id](payload);
    }
    this.isDispatching = false;
  }
};

// Support module export where available: require('dispatcher')
if (typeof module != 'undefined' && module.exports) {
  module.exports = Dispatcher;
}
