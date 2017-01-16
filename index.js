function toParts(topic) {
  return topic.split(/\//g);
}

function Router(routes){
  this._middleware = [];
  this._routes = routes || {};
  this._structure = {};
  this._parseRoutes();
}

Router.prototype = {
  use: function(callback){
    this._middleware.push(callback);
  },
  add: function(route, callback) {
    this._routes[route] = callback;
    this._parseRoutes();
  },
  remove: function(route) {
    delete this._routes[route];
    this._parseRoutes();
  },
  execute: function(topic, payload){ 
    var route = this._routeMessage(topic, payload);
    var handler = route.handler;
    var params = route.params;

    var message = {
      topic: topic,
      params: params,
      payload: payload
    };

    var middlewares = this._middleware.slice();
    function executeNext(){
      if (middlewares.length === 0) {
        return Promise.resolve(handler.call(this, message));
      }
      var middleware = middlewares.shift();
      return Promise.resolve(middleware.call(this, message)).then(executeNext.bind(this));
    }
    return executeNext();
  },
  _parseRoutes: function() {
    var root = {};

    Object.keys(this._routes).forEach((topic) => {
      var parent = root;
      var topicHandler = this._routes[topic];
      var parts = toParts(topic);
      parts.forEach(function(part){
        if (part.substring(0,1) === ":") {
          if (!parent[":"]) {
            parent[":"] = {
              _name: part.substring(1)
            };
          }
          parent = parent[":"];
        } else {
          if (!parent[part]) {
            parent[part] = {};
          }
          parent = parent[part];
        }
      });
      parent._handler = topicHandler;
    });

    this._structure = root;
  },
  _routeMessage: function(topic) {
    var parts = toParts(topic);
    var parent = this._structure;
    var params = {};
    parts.forEach(function(part){
      if (parent.hasOwnProperty(part)) {
        parent = parent[part];
      } else if (parent.hasOwnProperty(":")) {
        parent = parent[":"];
        params[parent._name] = part;
      } else {
        throw new Error("Route not valid: " + topic);
      }
    });
    
    var handler = parent._handler;

    if (!handler) {
      throw new Error("Route not valid: " + topic);
    }
    
    return {
      handler: handler,
      params: params
    };
  }
};

if (typeof module !== "undefined") {
  module.exports = Router;
} else if (typeof window !== "undefined") {
  window.Router = Router;
}