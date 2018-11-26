const request = require('request-promise-native');

module.exports = app => {
    return new Promise((resolve, reject) => {
        return resolve(request);
    });
}