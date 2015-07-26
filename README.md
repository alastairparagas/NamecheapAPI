# namecheap-api ![](https://travis-ci.org/alastairparagas/NamecheapAPI.svg)

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

To set the Namecheap global parameters, do this:

```javascript
var namecheapApi = require('namecheap-api');

namecheapApi.config.set("ApiUser", "YourUsernameHere");
```