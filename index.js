'use strict';

// HTTP/HTTPS request library with promise support. See https://www.npmjs.com/package/axios
const axios = require("axios");
const _ = require("underscore");

exports.handler = (country, context, callback) => {
    // JSON containing country to code list
    let countryCodesUrl = "https://datahub.io/core/country-list/r/data.json";

    if (_.isObject(country) && _.has(country, "name")) {
        axios.get(countryCodesUrl)
            .then(response => {
                let countryCodes = response.data;
                if (_.isArray(countryCodes)) {
                    let countryCode = countryCodes.find(function(currentCountryCode) {
                        return currentCountryCode.Name.toUpperCase() === country.name.toUpperCase();
                    }).Code;
                    callback(null, {
                        "name": country.name,
                        "code": countryCode
                    });
                } else {
                    callback("ERROR: Country code response does not contain an array");
                }
            })
            .catch(error => {
                callback("ERROR: Request to get country codes failed. Details: " + error);
            });
    } else {
        callback("ERROR: country request parameter is empty, missing or invalid");
    }

}

function localCallback(error, success) {
    if (!_.isEmpty(error)) {
        console.log(error);
    } else {
        console.log(success);
    }
}

// Uncomment this to run/debug this function locally
// exports.handler({"name": "Germany"}, null, localCallback);
