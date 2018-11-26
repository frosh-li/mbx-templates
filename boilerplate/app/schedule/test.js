module.exports = {
    schedule: {
        interval: '10000', // 时间间隔单位为毫秒
    },
    async task(ctx) {
        console.log(ctx.config.mysql);
        console.log('interval', new Date());
    }
}