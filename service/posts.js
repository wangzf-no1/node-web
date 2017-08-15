const mongo = require('koa-mongo')
const config = require('../config')
const collectionName = 'posts'

const posts = {
  // get posts list
  //TODO 分页还没做
  async getList (mongoClient, filter) {
    //const pageIndex = filter.pageIndex || 1
    //const pageSize = filter.pageSize || 10
    //delete filter.pageIndex
    //delete filter.pageSize
    console.log(filter)
    const cursor = await mongoClient.db(config.mongodb.db).collection(collectionName)
    .find(filter,{texts:false,seo:false})
    //.sort({ createtime: -1 })
    //.skip((pageIndex - 1) * pageSize)
    //.limit(pageSize)

    return await {
      hasNext: await cursor.hasNext(),
      data: await cursor.toArray()
    }
  },

  async getTotalCount (mongoClient, filter) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .find(filter)
    .count()
  },
  // add a post
  async add (mongoClient, post) {
  	//console.log(post)
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .insert(post)
  },
  // get a post
  async get (mongoClient, id) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .findOne({ _id: mongo.ObjectId(id) })
  },
  // update a post
  async update (mongoClient, id, updator) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: updator })
  },
  // delete a post
  async del (mongoClient, id) {
    return await mongoClient.db(config.mongodb.db).collection(collectionName)
    .remove({ _id: mongo.ObjectId(id) })
  }
}

module.exports = posts
