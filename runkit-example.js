var Router = require("mqrouter");

var router = new Router({
    "things/:thing/online": function(message) {
        var thingId = message.params.thing;
        var onlineString = message.payload ? 'online' : 'offline';
        var thingString = `${thingId} is ${onlineString}`;
        
        console.log(thingString);
        
        return thingString;
    }
});

var result1 = router.execute("things/my-thing/online", true);
var result2 = router.execute("things/my-other-thing/online", false);

Promise.all([result1, result2])
  .then(function(results){
    console.log(results);
  });