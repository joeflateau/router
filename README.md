# MQRouter

### Example Usage
```javascript
var router = new Router({
  "things/:thing/online": function(topic, params, payload) {
    var thing = params.thing;
    console.log(`thing ${thing} is ${payload.online ? 'online' : 'offline'}`);
  }
});

router.add("things/:thing/led", function(topic, params, payload){
  var thing = params.thing;
  setRgbPwm(thing, payload.r, payload.g, payload.b);
});

mqtt.on("message", function(topic, payload) {
  var result = router.execute(topic, payload);
  console.log(result);
});

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