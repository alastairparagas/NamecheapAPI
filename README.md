# namecheap-api ![Build Status](https://travis-ci.org/alastairparagas/NamecheapAPI.svg) [![npm](https://img.shields.io/npm/dt/namecheap-api.svg)](https://www.npmjs.com/package/namecheap-api)

> NodeJS library to make Namecheap API requests

## Getting Started

Namecheap has an unfriendly and unsightly XML API. This library makes it easier for you to call on Namecheap's API without the hassle!

To start, set your Namecheap [global parameters](https://www.namecheap.com/support/api/global-parameters.aspx). These parameters are required for every API call you make to Namecheap. These parameters are:

* `ApiUser` - Username required of the account accessing the API.
* `ApiKey` - Password required of the account accessing the API.
* `ClientIp` - IP address of the client accessing your API that uses this Namecheap API library

Since the `ApiUser` and `UserName` parameters tend to be the same, if you fill in either property, the other will automatically be filled in as well. However, should you want to fill in such parameters with different values, you can do that as well by manually setting them.

The `CommandName` global parameter will be automatically filled in as you use this library, so don't worry about it and do not try setting it!

After filling the global parameters in, you can now make API calls to Namecheap!

## Setting Global Parameters

To set the Namecheap global parameters, do the following. Remember to set all your Namecheap global parameters!

```javascript
var namecheapApi = require('namecheap-api');

namecheapApi.config.set("ApiUser", "YourUsernameHere");
```

## Response and the Response Structure

namecheap-api's apiCall functionality always returns a promise response with 3 properties: `requestUrl`, `requestPayload` and `response`.

`response` holds an Error object if there are XML parsing/network errors or if Namecheap returns an ERROR (with the promise, rejected). `response` holds the parsed XML (turned into an object) if there are no XML parsing/network errors AND Namecheap returns an OK (with the promise, resolved). The parsed XML object is obtained using [xml2js](https://www.npmjs.com/package/xml2js). A StackOverflow article of how the output is like [can be viewed here](http://stackoverflow.com/questions/20238493/xml2js-how-is-the-output).

```javascript
var namecheapApi = require('namecheap-api');

// If there are no XML parsing/network errors and Namecheap returns an OK
namecheapApi.apiCall("SomeCommand", {}).then(function (data) {
    console.log(data.requestUrl);
    console.log(data.requestPayload);
    console.log(data.response); // data.response is the parsed response
});

// If there are XML parsing/network errors OR Namecheap returns an ERROR
namecheapApi.apiCall("SomeCommand", {}).catch(function (data) {
    console.log(data.requestUrl);
    console.log(data.requestPayload);
    console.log(data.response); // data.response is an Error object
});
```

## Sandbox mode

You can now use Namecheap API's sandbox mode within `namecheap-api`! Whenever using the `apiCall` function, if you want to use Namecheap's sandbox server, just make sure to pass in `true` as third parameter.

```javascript
namecheapApi.apiCall("SomeCommand", {}, true);
```

## Web proxy

`namecheap-api` uses the `request` module to make api calls which will obey the HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables.  To specify a specific proxy for Namecheap API calls only you can set the "Proxy" config variable.

```javascript
namecheapApi.config.set("Proxy", "http://user:pass@someproxy.com:80");
```
