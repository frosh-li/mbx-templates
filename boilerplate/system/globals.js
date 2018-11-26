/**
 * 全局对象
 * 为了能够使service controller helper在各个对象中共享使用
 * 
 */
class Service{
	constructor(app) {
		this.ctx = app;
	}
}

class Controller {
	constructor(app) {
		this.ctx = app;
	}
}

class Helper {
	constructor(app) {
		this.ctx = app;
	}
}

global.Service = Service;
global.Controller = Controller;
global.Helper = Helper;