function Router(input){

  var messageHandlers;

  function toParts(topic) {
    return topic.split(/\//g);
  }

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

  function handlers(spec) {
    var root = {};

    Object.keys(spec).forEach(function(topic){
      var parent = root;
      var topicHandler = spec[topic];
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

    return root;
  }

  messageHandlers = handlers(input);

  this.execute = routeMessage;

}

if (typeof module !== "undefined") {
  module.exports = Router;
} else if (typeof window !== "undefined") {
  window.Router = Router;
}