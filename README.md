# MQRouter

[![NPM](https://nodei.co/npm/mqrouter.png)](https://nodei.co/npm/mqrouter/)
[![Build Status](https://travis-ci.org/joeflateau/router.svg?branch=master)](https://travis-ci.org/joeflateau/router)

A tiny router for routing messages by topic name from message queues.

----

### Download

```
npm install mqrouter
```

----

### API

#### Create Router
```javascript
var router = new Router();
```
###### Optionally pass routes object to constructor

```javascript
var routes = {
  "things/:thing/online": function(message) {
    var topic = message.topic;
    var params = message.params;
    var payload = message.payload;
  }
};
var router = new Router(routes);
```

#### Add Route

```javascript
router.add(topic, payload);
```
#### Remove Route
```javascript
router.remove(topic);
```

#### Execute Route

```javascript
router.execute("things/esp-123/online", true);
```

----

### Example Usage

```javascript
var router = new Router({
  "things/:thing/online": function(message) {
    var thing = message.params.thing;
    console.log(`thing ${thing} is ${message.payload.online ? 'online' : 'offline'}`);
  }
});

router.add("things/:thing/led", function(message){
  var payload = message.payload;
  var thing = message.params.thing;
  setRgbPwm(thing, payload.r, payload.g, payload.b);
});

mqtt.on("message", function(topic, payload) {
  var result = router.execute(topic, payload);
  console.log(result);
});

mqtt.subscribe("thing/+/online");

mqtt.subscribe("thing/+/led");

mqtt.send("thing/esp-123/online", {
  online: true
});

mqtt.send("thing/esp-123/online", {
  online: false
});

mqtt.send("thing/esp-123/led", {
  r: 128,
  g: 128,
  b: 128,
});
```