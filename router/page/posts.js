const moment = require('moment')
const Router = require('koa-router')
const posts = new Router({
	prefix: '/posts'
})
const config = require('../../config')
const siteService = require('../../service/site')
const postService = require('../../service/posts')

posts
//TODO 未指定分类功能还没做
	.get(['/', '/page/:pageIndex'], async ctx => {
		let site = await siteService.get(ctx.mongo, {
			type: 'site'
		})
		site = site || {}
		let home = await siteService.get(ctx.mongo, {
			type: 'home'
		})
		home = home.data || {}

		let menu = await siteService.get(ctx.mongo, {
			type: 'menu'
		})
		menu = menu.data || []

		let currentPage = ctx.params.pageIndex || 1
		if(currentPage && typeof currentPage === 'string') {
			try {
				currentPage = parseInt(currentPage)
			} catch(e) {
				// not a number
				currentPage = 1
			}
		}
		if(currentPage < 1) {
			return ctx.redirect('/')
		}
		const posts = await postService.getList(ctx.mongo, {
			public: true,
			pageIndex: currentPage,
			pageSize: site.pagesize || 10
		})

		posts.data.forEach(item => {
			item.createtime = moment(item.createtime).format('YYYY-MM-DD')
		})
		await ctx.render('posts', {
			posts: posts.data,
			menu,
			site,
			pageConfig: JSON.stringify({
				pageSize: site.pagesize || 10,
				pageIndex: currentPage
			}),
			pageTitle: site.sitename,
			staticUrl: {
				'app.css': config.staticUrl['app.css'],
				'app.js': config.staticUrl['app.js']
			}
		})
	})
	
	//TODO 强制指定类型渲染数据，可能会出错，现在页面还未涉及到这样的链接

	.get('/:type/:id', async ctx => {
		let type = ctx.params.type
		let id = ctx.params.id

		let typelist = {
			newslist: true,
			textlist: true,
			productlist: true,
			news: true,
			text: true,
			product: true
		}
		if(!typelist[type]) return ctx.redirect('/');

		let site = await siteService.get(ctx.mongo, {
			type: 'site'
		})
		site = site || {}
		let menu = await siteService.get(ctx.mongo, {
			type: 'menu'
		})
		menu = menu.data || []
		let common = await siteService.get(ctx.mongo, {
			type: 'common'
		})
		common = common.data || []

		let post = null
		let isList = type.indexOf('list') > -1
		try {
			if(isList) {
				post = await postService.getList(ctx.mongo, {
					parent: {
						$in: [id]
					}
				})
			} else {
				post = await postService.get(ctx.mongo, ctx.params.id)

			}
		} catch(e) {
			// id is not a mongodb ObjectId
			return ctx.redirect('/')
		}

		if(post) {
			isList && post.data.forEach(item => {
				item.createtime = moment(item.createtime).format('YYYY-MM-DD')

			})
		} else {
			return ctx.redirect('/')
		}


		await ctx.render(type, {
			post,
			menu,
			site,
			pageConfig: JSON.stringify({
				postId: post._id,
			}),
			staticUrl: {
				'app.css': config.staticUrl['app.css'],
				'app.js': config.staticUrl['app.js']
			}
		})

	})

	// 因为路由长得一样，所以得在 /:id 的前面定义
	.get('/pagination', async ctx => {

		ctx.body = {
			total: await postService.getTotalCount(ctx.mongo, {
				public: true
			})
		}
	})
	
	//根据页面ID渲染页面，目前都是这类链接
	.get('/:id', async ctx => {
		let typelist = {
			newslist: true,
			textlist: true,
			productlist: true,
			news: true,
			text: true,
			product: true
		}

		try {
			var page = await postService.get(ctx.mongo, ctx.params.id)
			page = page || {}
			if(!(page.menu&&page.menu.type in typelist))return ctx.redirect('/');
			var site = await siteService.get(ctx.mongo, {
				type: 'site'
			})
			site = site || {}
			var common = await siteService.get(ctx.mongo, {
				type: 'common'
			})
			common = common.data || {}
			var menu = await siteService.get(ctx.mongo, {
				type: 'menu'
			})
			menu = menu.data || []
		} catch(e) {
			// id is not a mongodb ObjectId
			return ctx.redirect('/')
		}

		let post = null

		let isList = page.menu.type.indexOf('list') > -1
		try {
			if(isList) {
				post = await postService.getList(ctx.mongo, {
					parent: {
						$in: [ctx.params.id]
					}
				})
			} else {
				post = page
			}

		} catch(e) {
			// id is not a mongodb ObjectId
			return ctx.redirect('/')

		}

	
		if(post) {
			if(!isList){
				post.menu.type=='product' && post.texts.push(common.aboutToPost)
				post.createtime = moment(post.createtime).format('YYYY-MM-DD')
			}
		} else {
			return ctx.redirect('/')
		}

		

		await ctx.render(page.menu.type || 'product', {
			post,
			menu,
			site,
			pageConfig: JSON.stringify({
				postId: post._id,
			}),
			staticUrl: {
				'app.css': config.staticUrl['app.css'],
				'app.js': config.staticUrl['app.js']
			}
		})
	})

module.exports = posts