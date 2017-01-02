var expect = require('chai').expect;

var Router = require('../');

describe("router", function(){

  it("should route", function(done){
    var succeeded = false;

    var router = new Router({
      "foo/:baz/bum": function(topic, params, payload) {
        expect(params).to.have.property("baz");
        expect(params.baz).to.equal("bar");
        succeeded = payload.success;
      },
      "foo/thing/attribute": function() {},
      "foo/:baz/attribute": function() {},
    });

    router.execute("foo/bar/bum", { success:true });
    router.execute("foo/bar/attribute", {  });

    expect(succeeded).to.be.true;

    done();
  });

  it("should add route", function(done){
    var succeeded = false;

    var router = new Router();

    router.add("foo/thing/attribute", function() { succeeded = true; });

    router.execute("foo/thing/attribute", {  });

    expect(succeeded).to.be.true;

    done();
  });

  it("should remove route", function(done){
    var succeeded = true;

    var router = new Router();

    router.add("foo/thing/attribute", function() { succeeded = false; });

    router.remove("foo/thing/attribute");

    expect(() => {
      router.execute("foo/thing/attribute", {  });
    }).to.throw(Error);

    expect(succeeded).to.be.true;

    done();
  });

  it("should return value", function(done){
    var succeeded = false;

    var router = new Router();

    router.add("foo/thing/attribute", function() { return true; });

    succeeded = router.execute("foo/thing/attribute");
    
    expect(succeeded).to.be.true;

    done();
  });
});