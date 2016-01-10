# flux-dispatcher

A basic flux dispatcher inspired by Facebook's implementation


## Installation

```shell
$ npm install -flux-dispatcher --save
```

## Usage

First thing to do is require the module.

```javascript
var dispatcher = require('flux-dispatcher');
```


### Register Handlers

Register handlers by calling the `register` method, passing in your handler.
This will return an ID which you can use to `unregister` or `waitFor`

```javascript
  var fooHandler,
    id;

  fooHandler = function() {
     // Foo handler code
  };

  id = dispatcher.register(fooHandler);
```


### Dispatch Handlers

Simply call the `dispatch` method, passing an `action` and optional`payload` and all handlers will be called with those parameters.

In order to keep things "fluxy", the `action` parameter is mandatory.
However, `payload` is not.


```javascript
var payload = {
  hat: 'A',
  bat: 'B'
};

dispatcher.dispatch('somethingHappened', payload);
```

### Unregister an Event Handler

To unregister an event handler, first you need to capture the ID returned by the register method.
Then simply call unregister, passing the ID of the handler you wish to unregister.

```javascript
var fooHandler,
  fooHandlerID;

fooHandler = function() {
  // Foo handler code
};

// Wax on
fooHandlerID = dispatcher.register(fooHandler);
...
// Wax off
dispatcher.unregister(fooHandlerID);

```


### Enforce execute order with waitFor

If you have a handler which is depends on one of more other handlers having finished, you can enforce execute order with waitFor.
To do this, call the `deispatcher.waitFor` method from within the dependant handler, passing the array of IDs for the handlers to wait for.

```javascript
var fooHandler,
    barHandler,
    bazHandler,
    handlerIDs = [];

  fooHandler = function() {
     // Foo handler code
  };

  bazHandler = function() {
     // Baz handler code
  };

  handlerIDs.push(dispatcher.register(fooHandler));
  handlerIDs.push(dispatcher.register(barHandler));

  bazHandler = function() {
    dispatcher.waitFor([handlerIDs])
  }
```

## Tests

```shell
$ npm test
```


## Release History

* 0.1.0 Initial release