describe('config', function () {

    var expect,
        requireUncached,

        config;

    beforeEach(function () {
        expect = require('chai').expect;
        requireUncached = require('require-uncached');

        config = requireUncached('../../namecheap/config');
    });

    it("sets and gets configurable properties", function () {
        expect(function () {
            config.set("ApiUser", "SomeUser");
            config.set("ApiKey", "Some-key");
            config.set("UserName", "SomeUser");
            config.set("ClientIp", "192.168.1.1");
            config.set("Proxy", 'http://someproxyserver:8080');
        }).not.to.throw();

        expect(config.get("ApiUser")).to.equal("SomeUser");
        expect(config.get("ApiKey")).to.equal("Some-key");
        expect(config.get("UserName")).to.equal("SomeUser");
        expect(config.get("ClientIp")).to.equal("192.168.1.1");
        expect(config.get("Proxy")).to.equal("http://someproxyserver:8080");

        expect(config.getAll()).to.deep.equal({
            ApiUser: "SomeUser",
            ApiKey: "Some-key",
            UserName: "SomeUser",
            ClientIp: "192.168.1.1",
            Proxy: "http://someproxyserver:8080"
        });
    });

    it("throws on setting a non-string value for configuration", function () {
        expect(function () {
            config.set("ApiUser", {
                key: "someValue"
            });
        });
    });

    it("throws on setting non-valid configuration properties", function () {
        expect(function () {
            config.set("InvalidConfigurationName", "SomeValue");
        }).to.throw();
    });

    it("automatically fills ApiUser if ApiUser is not yet set", function () {
        config.set("UserName", "SomeUser");

        expect(config.get("ApiUser")).to.equal("SomeUser");
        expect(config.get("UserName")).to.equal("SomeUser");
    });
    it("doesn't override ApiUser if ApiUser is already set", function () {
        config.set("ApiUser", "SomeUser");
        config.set("UserName", "AnotherUser");

        expect(config.get("ApiUser")).to.equal("SomeUser");
    });

    it("automatically fills UserName if UserName is not yet set", function () {
        config.set("ApiUser", "SomeUser");

        expect(config.get("UserName")).to.equal("SomeUser");
        expect(config.get("ApiUser")).to.equal("SomeUser");
    });
    it("doesn't override UserName if UserName is already set", function () {
        config.set("UserName", "SomeUser");
        config.set("ApiUser", "AnotherUser");

        expect(config.get("UserName")).to.equal("SomeUser");
    });

    it("notifies if required configuration is satisfied", function () {
        expect(config.isSatisfied()).to.be.false;

        config.set("ApiUser", "SomeUser");
        config.set("ApiKey", "SomeKey");
        config.set("ClientIp", "192.168.1.1");
        expect(config.isSatisfied()).to.be.true;
    });

});
