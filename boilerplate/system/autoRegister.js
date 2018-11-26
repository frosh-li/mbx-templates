
const express = require("express");
const fs = require('fs');
const path = require('path');
const { GET, Path, getClazz, getMethod, getClassName } = require('./decorator.js');

class autoRegister {

	/**
	 * 注册controller对象到app context上面
	 * @param {app instance} app 
	 */
	async registerController(app) {
		console.log('registerController done');
	}

	/**
	 * 注册路由
	 * 使用装饰器模式来定义路由
	 * @param {app} app 
	 */
	async registerRouter(app) {
		let files = fs.readdirSync(path.resolve(__dirname, "../app/controller"));
		files.forEach(file => {
			if (!file.endsWith(".js")) {
				return;
			}
			let router = express.Router();
			let className = require(path.resolve(__dirname, "../app/controller/", file));
			let service = new className();
			let meta = className.prototype.$meta;
			let routes = meta.routes;
			for (let methodName in routes) {
				let methodMeta = routes[methodName];
				let httpMethod = methodMeta.httpMethod;
				// express router callback
				let fn = (req, res, next) => {
					className.prototype[methodName].apply(app, [req, res, next]);
				};
				// register sub route
				let params = [methodMeta.subUrl];
				params.push(fn);
				router[httpMethod.toLowerCase()].apply(router, params);
			}
			let params = [meta.baseUrl];
			console.log('routers', routes);
			meta.middlewares && (params = params.concat(meta.middlewares));
			params.push(router);
			app.use.apply(app, params);
		});
		console.log('registerRouter done');
	}

	/**
	 * 注册services 到 ctx对象
	 * @param {app} app 
	 */
	async registerService(app) {
		app.service = Object.create(null);
		this.register('service', app);
	}

	async registerHelper(app) {
		app.helper = Object.create(null);

		this.register('helper', app);
	}

	async registerCore(app) {
		await this.loadConfig(app);
		await this.loadPlugin(app);
		['Service', 'Helper', 'Router', 'Controller'].forEach(async item => {
			await this['register' + item].call(this, app);
		});
		await this.registerSchedule(app);
	}

	/**
	 * 注册定时器
	 * @param {Object} app 
	 */
	async registerSchedule(app) {
		let SCHEDULE = 'schedule';
		let files = fs.readdirSync(path.resolve(__dirname, "../app/", SCHEDULE));
		files.forEach(file => {
			if (!file.endsWith(".js")) {
				return;
			}

			let serviceInstance = require(path.resolve(__dirname, "../app/", SCHEDULE, file));
			if (!serviceInstance) {
				throw new Error('no module exports from ', file);
			}
			
			setInterval(() => {
				serviceInstance.task.call(app, app);
			}, serviceInstance.schedule.interval);
		})
		console.log(`register schedule done`);
	}

	/**
	 * 加载配置文件
	 * @param {app} app 
	 */
	loadConfig(app) {
		app.config = Object.create(null);
		this.register('config', app);
	}

	/**
	 * 通用注册模块
	 * 扫描文件并加载到ctx上面
	 * @param {string} ctype 
	 * @param {Object} app 
	 */
	register(ctype, app) {
		let files = fs.readdirSync(path.resolve(__dirname, "../app/", ctype));
		files.forEach(file => {
			if (!file.endsWith(".js")) {
				return;
			}

			let serviceInstance = require(path.resolve(__dirname, "../app/", ctype, file));
			if (!serviceInstance) {
				throw new Error('no module exports from ', file);
			}
			if (ctype === 'config') {
				app[ctype] = serviceInstance;
				return;
			}
			console.log(ctype, file);
			let service = new serviceInstance(app);
			console.log(serviceInstance);
			// serviceInstance.call()
			app[ctype][file.split('.')[0]] = service;
		})
		console.log(`register ${ctype} done`);
	}

	/**
	 * 加载插件
	 * @param {Object} app 
	 */
	async loadPlugin(app) {
		// 加载插件
		let env = process.env.NODE_ENV;
		console.log('node env is', env);
		const config = require(path.resolve(__dirname, "../app/plugin/", `plugin.${env}.js`));
		for (let packageName in config) {
			console.log('packageName', packageName);
			if (config[packageName].enable === true) {
				if (app[packageName]) {
					throw new Error(`已经存在相同的变量名，请修改插件名称${packageName}`);
				}
				let plugin = await require(config[packageName].package)(app);
				app[packageName] = plugin;
			}
		}
	}
}

module.exports = new autoRegister();