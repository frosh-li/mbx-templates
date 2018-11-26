const path = require('path');
exports.mysql = {
	enable: true,
	package: path.join(__dirname, '../../libs/x-mysql'),
}

exports.curl = {
	enable: true,
	package: path.join(__dirname, '../../libs/x-curl'),
}