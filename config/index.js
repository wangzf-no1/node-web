const staticManifest = require('../static/dist/manifest.json')

module.exports = {
  serverPort: 3008,
  passwordKey: 'node_web',  // 加密密码用的，部署时候需要修改
  authKey: 'node_web',  // 生成 token 用的，部署时候需要修改
  cookieAuthKey: 'webauth',  // 存 cookie 的 key
  staticCacheMaxAge: 1000 * 60 * 60 * 24 * 365,
  mongodb: {
    host: 'localhost',
    port: 27017,
    db: 'nodeweb'
  },
  staticUrl: staticManifest,
  uploadImagePath: 'data/upload/images'
}
