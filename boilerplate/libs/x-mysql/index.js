const mysql = require('promise-mysql');

module.exports = app => {
    return createMysql(app);
}

function createMysql(app) {
    console.log('mysql config is', app.config.mysql);
    return new Promise((resolve, reject) => {
        mysql
        .createConnection(app.config.mysql)
        .then(conn => {
            return resolve(conn);
        }).catch(e => {
            return reject(e);
        });
    })
    
    // console.log('connnected to mysql success');
    // return conn;
}