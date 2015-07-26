describe("apiCall (integrated)", function () {
    
    var expect,
        requireUncached,
        Promise,
        
        apiCall,
        config;
    
    before(function () {
        expect = require('chai').expect;
        
        Promise = require('es6-promise').Promise;
        
        apiCall = require('../../namecheap/apiCall');
        config = require('../../namecheap/config');
        
        config.set("ApiUser", "SomeUser");
        config.set("ApiKey", "SomeKey");
        config.set("ClientIp", "192.168.1.1");
    });
    
    after(function () {
        // Prevent from messing up unit tests - remove them from cache
        delete require.cache[require.resolve('../../namecheap/config')];
        delete require.cache[require.resolve('../../namecheap/apiCall')];
    });
    
    it("returns a Q promise provided correct config", function () {
        expect(apiCall("SomeCommand", {})).to.be.instanceof(Promise);
    });
    
});