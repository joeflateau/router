var expect = require('chai').expect;

var Router = require('../');

describe("router", function(){

  it("should route", function(done){
    var succeeded = false;

    var router = new Router({
      "foo/:baz/bum": function(message) {
        expect(message.params).to.have.property("baz");
        expect(message.params.baz).to.equal("bar");
        succeeded = message.payload.success;
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

    router.execute("foo/thing/attribute")
      .then((result) => {
        succeeded = result;
        expect(succeeded).to.be.true;
        done();
      });
  });

  it("should return promise", function(done){
    var succeeded = false;

    var router = new Router();

    router.add("foo/thing/attribute", function() { 
      return Promise.resolve(true);
    });

    router.execute("foo/thing/attribute")
      .then((result) => {
        succeeded = result;
        expect(succeeded).to.be.true;
        done();
      });
  });

  it("should work with middleware", function(done){
    var succeeded = 0;

    var router1 = new Router();
    var router2 = new Router();

    router1.use(function(message){
      message.succeeded = true;
    });

    router1.use(function(message){
      if (message.succeeded) {
        succeeded++;
      }
    });

    router1.add("things/:thing/foo", function(message){
      if (message.succeeded) {
        succeeded++;
      }
    });

    router2.add("things/:thing/foo", function(){
      succeeded++;
    });

    Promise.all([
      router1.execute("things/thing/foo", {}),
      router2.execute("things/thing/foo", {})
    ]).then(() => {
      expect(succeeded).to.equal(3);
      done();
    });
  });
});