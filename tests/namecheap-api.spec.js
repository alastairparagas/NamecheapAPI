describe("Front Interface", function () {

    var expect,

        apiCall,
        config,

        namecheapApi;

    before(function () {
        expect = require('chai').expect;
        var requireUncached = require('require-uncached');

        apiCall = require('../namecheap/apiCall');
        config = require('../namecheap/config');

        namecheapApi = require('../namecheap-api');
    });

    it("gives access to apiCall module", function () {
        expect(namecheapApi.apiCall).to.equal(apiCall);
    });

    it("gives access to config module", function () {
        expect(namecheapApi.config).to.equal(config);
    });

});