const mongo = require('koa-mongo')
const Router = require('koa-router')
const site = new Router({
	prefix: '/site'
})
const utils = require('../../common/utils')
const siteService = require('../../service/site')

site
	.get('/', utils.LoginMiddleware, async(ctx, next) => {
		const site = await siteService.get(ctx.mongo, {
			type: 'site'
		})
		delete site.password
		ctx.body = site
	})
	.get('/:type', utils.LoginMiddleware, async(ctx, next) => {
		const data = await siteService.get(ctx.mongo, {
			type: ctx.params.type
		})
		data && 'password' in data && delete data.password
		ctx.body = data
	})
	.post('/:type', utils.LoginMiddleware, async(ctx, next) => {
		const data = Object.assign({
				type: ctx.params.type
			},
			ctx.request.body
		)
		const result = await siteService.add(ctx.mongo, data)
		ctx.body = result.ops[0]._id.toString()
	})

	.put('/:id', utils.LoginMiddleware, async(ctx, next) => {
		// sitename, admin, password, github
		const site = Object.assign({

		}, ctx.request.body)
		// encry password
		if('password' in site) {
			if(typeof site.password == 'string' && site.password.length) {
				site.password = utils.encryPassword(site.password)
			} else {
				delete site.password
			}
		}

		delete site._id

		ctx.body = await siteService.update(ctx.mongo, ctx.params.id, site)
	})

module.exports = site