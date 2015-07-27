describe("apiCall", function () {

    var expect,
        sinon,
        mockery,

        Promise,

        requestStub,
        xml2jsMock,
        configMock,

        apiCall;

    before(function (done) {
        expect = require('chai').expect;
        sinon = require('sinon');
        mockery = require('mockery');
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        Promise = require('es6-promise').Promise;

        requestStub = sinon.stub();
        xml2jsMock = {
            parseString: sinon.stub()
        };
        configMock = {
            isSatisfied: sinon.stub().returns(true),
            getAll: sinon.stub().returns({})
        };
        mockery.registerMock('request', requestStub);
        mockery.registerMock('xml2js', xml2jsMock);
        mockery.registerMock('./config', configMock);

        apiCall = require('../../namecheap/apiCall');
        
        done();
    });

    after(function () {
        mockery.disable();
    });

    describe("Succesful apiCall: ", function () {

        var promise;

        before(function () {
            promise = apiCall("SomeCommand", {});
        });

        it("returns a promise provided correct config", function () {
            expect(promise).to.be.instanceof(Promise);
        });

        it("calls Request exactly once", function () {
            expect(requestStub.calledOnce).to.be.true;
        });

        it("calls Xml2js exactly once", function () {
            requestStub.callArg(1);
            expect(xml2jsMock.parseString.calledOnce).to.be.true; 
        });

        it("Returns all 3 success output properties", function () {
            xml2jsMock.parseString.callArgWith(1, undefined, {
                ApiResponse: {
                    $: {
                        Status: "OK"
                    }
                },
                CommandResponse: {

                }
            });

            return promise.then(function (data) {
                expect(data).to.have.property("requestPayload");
                expect(data).to.have.property("requestUrl");
                expect(data).to.have.property("response");  
            });
        });

        after(function () {
            configMock.getAll.reset();
            configMock.isSatisfied.reset();
            requestStub.reset();
            xml2jsMock.parseString.reset();
        });

    });

    describe("Erroneous apiCall at Request dep: ", function () {

        var promise;

        before(function () {
            promise = apiCall("SomeCommand", {});
        });

        it("skips Xml2js dep if erroneous Request", function () {
            requestStub.callArg(1, new Error("Error Request"));
            expect(xml2jsMock.parseString.callCount).to.equal(0); 
        });
        
        it("passes Request Error as Promise reject", function () {
            return promise.catch(function (data) {
                expect(data).to.have.property("requestPayload");
                expect(data).to.have.property("requestUrl");
                expect(data).to.have.property("response");
                expect(data.response).to.be.instanceof(Error);
            });
        });
        
        after(function () {
            configMock.getAll.reset();
            configMock.isSatisfied.reset();
            requestStub.reset();
            xml2jsMock.parseString.reset();
        });

    });
    
    describe("Erroneous apiCall at Xml2js dep: ", function () {
       
        var promise;
        
        before(function () {
           promise = apiCall("SomeCommand", {}); 
        });
        
        it("passes Xml2js Error as Promise reject", function () {
            requestStub.callArg(1);
            expect(xml2jsMock.parseString.calledOnce).to.be.true;
            
            xml2jsMock.parseString.callArg(1, new Error("Error Parse"));
            return promise.catch(function (data) {
                expect(data).to.have.property("requestPayload");
                expect(data).to.have.property("requestUrl");
                expect(data).to.have.property("response");
                expect(data.response).to.be.instanceof(Error);
            });
        });
        
        after(function () {
            configMock.getAll.reset();
            configMock.isSatisfied.reset();
            requestStub.reset();
            xml2jsMock.parseString.reset();
        });
        
    });

});