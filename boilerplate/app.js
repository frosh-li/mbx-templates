const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
require('./system/globals');// 加载父的Controller 父的Service 父的Helper
const autoRegister = require('./system/autoRegister');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('response-time')());
app.all('*', function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type,token,x-token, Authorization");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
console.log('start to register');
(async()=>{
	await autoRegister.registerCore(app);

	console.log('end register');

	// 错误处理
	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.json({
			status: err.status || 500,
			message: err.message,
		});
	});


	/**
	 * Get port from environment and store in Express.
	 */
	let port = process.env.PORT || '10100';
	app.set('port', port);


	/**
	 * Create HTTP server.
	 */

	const server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 */

	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	/**
	 * Event listener for HTTP server "error" event.
	 */

	function onError(error) {
		if (error.syscall !== 'listen') {
			throw error;
		}

		var bind = typeof port === 'string'
			? 'Pipe ' + port
			: 'Port ' + port;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	/**
	 * Event listener for HTTP server "listening" event.
	 */

	function onListening() {
		var addr = server.address();
		var bind = typeof addr === 'string'
					? 'pipe ' + addr
					: 'port ' + addr.port;
		console.log('Listening on ' + bind);
	}



	/**
	 * 加载 SSL证书
	 */
	const privateKey = fs.readFileSync('./server.key', 'utf-8');
	const certificate = fs.readFileSync('./server.crt', 'utf-8');
	const sslKey ={key:privateKey, cert:certificate};

	/**
	 * create https server
	 */
	const httpsServer = https.createServer(sslKey, app);
	const httpsPort = process.env.httpsPort || '10110';
	//启动https server
	httpsServer.listen(httpsPort);

})();