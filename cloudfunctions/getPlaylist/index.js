// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
cloud.init()
const db = cloud.database()
const playListCollection =  db.collection('playlist')
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
    const result = await playListCollection.count()
    const time = Math.ceil(result.total / MAX_LIMIT)
    const tasks = []
    for (let i = 0; i < time; i++) {
        tasks.push(playListCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get())
    }
    let list = {
        data: []
    }
    if (tasks.length > 0) {
        list = (await Promise.all(tasks)).reduce((acc, cur) => ({
            data: acc.data.concat(cur.data)
        }))
    }
    const playlist = await rp(URL).then(res => JSON.parse(res).result)
    const newData = []
    // 去重
    for (let i = 0, len1 = playlist.length; i < len1; i++) {
        let flag = true
        for (let j = 0, len2 = list.data.length; j < len2; j++) {
            if (playlist[i].id === list.data[j].id) {
                flag = false
                break
            }
        }
        if (flag) {
            newData.push(playlist[i])
        }
    }
    for (let i = 0; i < newData.length; i++) {
        await playListCollection.add({
            data: {
                ...newData[i],
                createTime: db.serverDate()
            }
        }).then(res => {
            console.log('插入成功')
        }).catch(err => {
            console.log('插入失败')
        })
    }
    return newData.length
}
