function Path(baseUrl) {
	return function(target) {
		let meta = getClazz(target.prototype);
		meta.baseUrl = baseUrl;
	}
}

function getClazz(target){
    return (target.$meta = target.$meta || { baseUrl: '', routes: {} })
}

function getMethod (target, methodName){
    let meta = getClazz(target);

    let methodMeta = meta.routes[methodName] || (meta.routes[methodName] = {
        subUrl: '',
        httpMethod: '',
        midwares: [],
        params: []
    });

    return methodMeta;
}

function GET(url) {
	return (target, methodName, descriptor) => {
		let meta = getMethod(target, methodName);
		meta.subUrl = url;
		meta.httpMethod = "GET";
	}
}

function POST(url) {
	return (target, methodName, descriptor) => {
		let meta = getMethod(target, methodName);
		meta.subUrl = url;
		meta.httpMethod = "POST";
	}
}

function getClassName(file) {
	let cName = file.split(".")[0];
	return cName.charAt(0).toUpperCase() + cName.substring(1);
}

global.GET = GET;
global.Path = Path;
global.POST = POST;

module.exports = {
	GET: GET,
	POST: POST,
	getMethod: getMethod,
	getClazz: getClazz,
	Path: Path,
	getClassName: getClassName,
}