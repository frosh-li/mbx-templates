@Path('/show','ss')
class Show extends Controller{
	@GET("/babyIndex",[])
	index(req, res, next) {
		res.json({
			status: 200,
			msg: 'ok'
		})
	}

	@GET('/detail')
	detail(req, res, next) {
		res.json({
			status: 200,
			msg: 'detail'
		})	
	}
}

module.exports = Show;