// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init()
const db = cloud.database()
const playListCollection =  db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({ event })
    const { page, limit, userInfo, playlistId } = event
    app.use(async (ctx, next) => {
        ctx.data = {}
        ctx.data.userInfo = userInfo
        await next()
    })
    app.router('playlist', async (ctx) => {
        const result =  await playListCollection
        .skip((page - 1) * limit)
        .limit(limit)
        .orderBy('createTime', 'desc')
        .get()
        result.userInfo = ctx.data.userInfo
        ctx.body = result
    })
    app.router('musics', async(ctx) => {
        ctx.body = await rp(`${BASE_URL}/playlist/detail?id=${parseInt(playlistId)}`).then(res => JSON.parse(res))
    })
    return app.serve()
}
