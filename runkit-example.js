var Router = require("mqrouter")

var router = new Router({
    "things/:thing/online": function(topic, params, online) {
        var thingId = params.thing;
        var onlineString = online ? 'online' : 'offline';
        var thingString = `${params.thing} is ${onlineString}`;
        
        console.log(thingString);
        
        return thingString;
    }
});

var result1 = router.execute("things/my-thing/online", true);
var result2 = router.execute("things/my-other-thing/online", false);

[result1, result2];