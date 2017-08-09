# node-web

用koa2 vue2 开发的网站内容管理系统[demo](http://47.52.76.201:3006/)    [后台地址](http://47.52.76.201:3006/admin/) admin  admin
 

练手项目，在[https://github.com/wjs/node-blog](https://github.com/wjs/node-blog)基础上改的，
Node.js 网站信息管理系统，后端 Koa2 + mongodb，博客后台管理页 Vue2 + [element](https://github.com/ElemeFE/element)，使用 [wangEditor](http://www.wangeditor.com/) 编辑内容，
使用 [vue-core-image-upload](https://github.com/Vanthink-UED/vue-core-image-upload) 上传。


# 感谢
找了好久的快速入门的例子，结果都感觉设计很复杂，对于新手来说，阅读代码很费时。

然后读了[https://github.com/wjs/node-blog](https://github.com/wjs/node-blog)的博客代码，结构清晰，
代码通俗易懂，很适合初学者，这便开启了我全栈的大门，由衷的感谢！
 


## 部署

如果想在自己的机器上部署，需要安装如下软件

- mongodb
- Node 版本 >= 7.6
- pm2 （可以使用 forever 等代替）

```bash
# 安装 imagemagick，下面是 ubuntu 的安装命令，不通版本的服务器自行查找安装方式
sudp apt-get update && sudo apt-get install imagemagick
git clone https://github.com/wjs/node-blog.git
cd node-blog
npm i --production  # 前端静态已经编译好上传了，这里只需要安装后台相关的包
cp config/sample.js config/index.js
vi config/index.js  # 修改对应配置项
pm2 start app.js -i max
# 推荐用最新版 nginx 代理，开启 http2，再配合 letsencrypt 开启 https
```

首次访问，请先进入后台管理入口进行站点初始化。

- 博客系统前台入口： `/`
- 博客系统后台管理入口： `/admin`

## 使用方法

如果博客功能不足或者主题不适合，欢迎 fork 项目之后自己修改，顺便给个 star

```bash
npm start # 起 server
npm run dev # 编译前端静态
npm run build # 打包前端静态
```

## 功能设计
### 内容管理
- 所有内容都看作为页面，目前首页菜单只展示3级目录
- 如不想在主菜单中看到 指定菜单，点击停用即可（停用只是在主菜单看不到，页面可正常访问）
- 首页管理是管理内容的快速链接
 

## 关键操作说明
目前还在处于讨论需求阶段，后期我会重构一下，优化细节操作等
### 菜单编辑步骤
1. 点击编辑菜单
1. 同步数据
1. 点击要操作的树节点
1. 保存菜单





## Todo

- [ ] 前台基本功能：列表页（分页）
- [ ] SEO信息继承关系处理
- [ ] 富文本编辑器已上传图片管理
- [ ] 内容查找
- [x] 图片上传
- [ ] 兼容手机端
- [ ] 缓存
- [ ] 数据备份还原

## License

MIT