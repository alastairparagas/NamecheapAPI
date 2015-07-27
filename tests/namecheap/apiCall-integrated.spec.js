describe('apiCall (integrated)', function () {

    var expect,
        requireUncached,

        apiCall;

    beforeEach(function () {
        expect = require('chai').expect;
        requireUncached = require('require-uncached');

        apiCall = requireUncached('../../namecheap/apiCall');
    });

    it("throws an error if no/invalid CommandName is passed", function () {
        expect(function () {
            apiCall();
        }).to.throw(Error);
    });

    it("throws an error if requestParams are incorrect", function () {
        expect(function () {
            apiCall("someCommand", "someParameter");
        }).to.throw(Error);

        expect(function () {
            apiCall("anotherCommand", true);
        }).to.throw(Error);
    });

    it("throws an error if config/global params are not set", function () {
        expect(function () {
            apiCall("someCommand", {});
        }).to.throw(Error);
    });

});