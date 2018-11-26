@Path('/baby','ss')
class Baby extends Controller{
	@GET("/babyIndex/:id",[])
	async index(req, res, next) {
		console.log('id is', req.params.id);
		let name = await this.service.ui.getName();
		let htmls = await this.curl.get('http://www.baidu.com');
		console.log(htmls);
		res.json({
			status: 200,
			msg: 'ok baby',
			name: name,
		});
	}

	@GET('/babyOne')
	detail(req, res, next) {
		res.json({
			status: 200,
			msg: 'detail baby'
		});
	}
}

module.exports = Baby;