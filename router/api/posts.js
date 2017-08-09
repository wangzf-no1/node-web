const _ = require("lodash")
const mongo = require('koa-mongo')
const multer = require('koa-multer')
const gm = require('gm').subClass({
	imageMagick: true
})
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const moment = require('moment')
const Router = require('koa-router')
const posts = new Router({
	prefix: '/posts'
})
const config = require('../../config')
const utils = require('../../common/utils')
const postService = require('../../service/posts')

// 保证上传目录存在
try {
	mkdirp.sync(path.resolve(config.uploadImagePath), function(err) {})
} catch(e) {}
const upload = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, config.uploadImagePath)
		},
		filename: function(req, file, cb) {
			const originalName = file.originalname.split('.')
			cb(null, `${originalName[0]}-${moment().format('YYYYMMDDHHmmssSSS')}.${originalName[1]}`)
		}
	})
})

const walkSync = (dir, fileList = []) => {
	fs.readdirSync(dir).forEach(file => {
		const filePath = path.join(dir, file)

		fileList.push(
			fs.statSync(filePath).isDirectory() ?
			{
				dir: file,
				children: walkSync(filePath)
			} :
			file
		)
	})
	return fileList
}

posts
	.get('/', async(ctx, next) => {
		let pageIndex = 1
		let pageSize = 10
		if(ctx.query.pageIndex) {
			pageIndex = parseInt(ctx.query.pageIndex)
		}
		if(ctx.query.pageSize) {
			pageSize = parseInt(ctx.query.pageSize)
		}
		const result = await postService.getList(ctx.mongo, {
			pageIndex,
			pageSize
		})
		result.data.forEach(item => {
			item.createtime = moment(item.createtime).format('YYYY-MM-DD')
		})
		ctx.body = result
	})
	.post('/', utils.LoginMiddleware, async(ctx, next) => {
		const post = Object.assign({
			title: '',
			about: '',
			img: '',
			visit: false,
			price: [],
			seo: {
				inherit: false,
				description: '',
				keyword: '',
				title: ''
			},
			texts: [],
			createtime: Date.now(),
			updatetime: Date.now()
		}, ctx.request.body)
		const result = await postService.add(ctx.mongo, post)
		ctx.body = result.ops[0]._id.toString()
	})
	.get('/pagination', async ctx => {
		ctx.body = {
			total: await postService.getTotalCount(ctx.mongo)
		}
	})
	.get('/:id', async(ctx, next) => {
		ctx.body = await postService.get(ctx.mongo, ctx.params.id)
	})
	.put('/:id', utils.LoginMiddleware, async(ctx, next) => {
		var basic = {
			title: '',
			about: '',
			img: '',
			visit: false,
			price: [],
			seo: {
				inherit: false,
				description: '',
				keyword: '',
				title: ''
			},
			texts: []
		}
		if(ctx.request.body.only) {
			basic = {}
		}
		const post = Object.assign(basic, {
			updatetime: Date.now()
		}, ctx.request.body)
		delete post._id
		delete post.only

		ctx.body = await postService.update(ctx.mongo, ctx.params.id, post)
	})
	.del('/:id', utils.LoginMiddleware, async(ctx, next) => {
		ctx.body = await postService.del(ctx.mongo, ctx.params.id)
	})
	.post('/upload-img', utils.LoginMiddleware, upload.single('files'), async ctx => {
		// 这里可能会坑，multer 把结果挂到了 req 上，而不是 request
		// issue 见：https://github.com/koa-modules/multer/issues/14
		const now = moment()
		if(ctx.req && 　ctx.req.file) {
			// 将上传的图片重命名，并归类到年月的文件夹下
			// console.log(ctx.req.file)
			const dirPath = `${path.resolve(config.uploadImagePath)}/${now.year()}/${now.month() + 1}`
			try {
				mkdirp.sync(dirPath, function(err) {})
			} catch(e) {}

			const oldFileName = path.resolve(ctx.req.file.path)
			const newFileName = `${dirPath}/${ctx.req.file.filename}`
			await fs.renameSync(oldFileName, newFileName)
			// http://aheckmann.github.io/gm/docs.html#crop
			// gm("img.png").crop(width, height, x, y)
			const gmCropPromise = new Promise(function(resolve, reject) {
				gm(newFileName).crop(ctx.req.body.toCropImgW, ctx.req.body.toCropImgH, ctx.req.body.toCropImgX, ctx.req.body.toCropImgY)
					.write(newFileName, function(err) {
						if(err) {
							console.log(err)
							reject(err)
						}
						resolve()
					})
			})
			// 因为 gm 的 write 方法是异步的，在这里 await 一下，前端得到的才是截取过的图片
			await gmCropPromise.then(res => {}).catch(err => {})
		}
		ctx.body = {
			// errno 即错误代码，0 表示没有错误。
			//       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
			errno: 0,

			// data 是一个数组，返回若干图片的线上地址
			data: [
				`/static/${now.year()}/${now.month() + 1}/${ctx.req.file.filename}`
			]
		}
	})
	.del('/upload-img/*', utils.LoginMiddleware, async ctx => {
		try {
			await fs.unlinkSync(path.resolve(config.uploadImagePath, ctx.params[0]))
			ctx.body = 'ok'
		} catch(e) {
			console.log(e)
			ctx.body = 'failed'
		}
	})
	.get('/upload-img/list', async ctx => {
		ctx.body = await walkSync(path.resolve(config.uploadImagePath))
	})

module.exports = posts