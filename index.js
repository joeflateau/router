function toParts(topic) {
  return topic.split(/\//g);
}

function Router(input){
  input = input || {};

  var messageHandlers;

  function routeMessage(topic, payload) {
    var parts = toParts(topic);
    var parent = messageHandlers;
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
    
    handler.call(this, topic, params, payload);
  }

  function handlers() {
    var root = {};

    Object.keys(input).forEach(function(topic){
      var parent = root;
      var topicHandler = input[topic];
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

    messageHandlers = root;
  }

  handlers();

  this.add = function(route, callback) {
    input[route] = callback;
    handlers();
  };

  this.remove = function(route) {
    delete input[route];
    handlers();
  };

  this.execute = routeMessage;

}

if (typeof module !== "undefined") {
  module.exports = Router;
} else if (typeof window !== "undefined") {
  window.Router = Router;
}