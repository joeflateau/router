# MQRouter

### Example Usage
```javascript
var router = new Router({
  "foo/:baz/bum": function(topic, params, payload) {
    console.log("callback", topic, params, payload);
    expect(params).to.have.property("baz");
    expect(params.baz).to.equal("bar");
    succeeded = payload.success;
  },
  "foo/thing/attribute": function() {},
  "foo/:baz/attribute": function() {},
});

router.execute("foo/bar/bum", { success:true });
router.execute("foo/bar/attribute", {  });
```