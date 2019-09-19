// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({ event })
    const { keyword = '', page = 1, limit = 10 } = event
    app.router('list', async (ctx, next) => {
        let w = {}
        if (keyword.trim()) {
            w = {
                content: new db.RegExp({
                    regexp: keyword,
                    options: 'i'
                })
            }
        }
        ctx.body = await blogCollection
        .where(w)
        .skip((page - 1) * limit)
        .limit(limit)
        .orderBy('createTime', 'desc')
        .get()
    })
    return app.serve()
}
