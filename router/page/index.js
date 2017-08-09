const Router = require('koa-router')
const posts = new Router({
  prefix: '/'
})
const config = require('../../config')
const siteService = require('../../service/site')

posts
.get('/', async ctx => {
  let site = await siteService.get(ctx.mongo,{type:'site'})
  site = site || {}
  let home = await siteService.get(ctx.mongo,{type:'home'})
  home = home.data || {}
  
    let menu = await siteService.get(ctx.mongo,{type:'menu'})
  menu = menu.data || []


  await ctx.render('index', {
    site: site,
    menu:menu,
    home:home,
    staticUrl: {
      'app.css': config.staticUrl['app.css'],
      'app.js': config.staticUrl['app.js']
    }
  })
})



module.exports = posts
