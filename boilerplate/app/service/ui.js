class Ui extends Service {
	async getName() {
		let results = await this.ctx.mysql.query('select * from accounts limit 0,1');
		console.log(results);
		return results;
	}
}

module.exports = Ui;