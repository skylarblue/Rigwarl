import {
    getStorageSync, showLoading, cloudRequest,
    showToast, hideLoading
} from '../../utils/wxMethod'

let musics = []
let cur = 0
// 获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
    data: {
        musics: {},
        isPlaying: false, // false表示不播放，true表示正在播放
        isLyricShow: false, //表示当前歌词是否显示
        lyric: '',
        isSame: false, // 表示是否为同一首歌
    },
    onLoad (options) {
        let { musicId, index } = options
        musicId = parseInt(musicId)
        musics = getStorageSync('musics')
        cur = parseInt(index)
        this._loadMusicDetail(musicId)
    },

    async _loadMusicDetail(musicId) {
        const isSame = musicId === app.globalData.playingMusicId
        this.setData({ isSame })
        if (!isSame) {
            backgroundAudioManager.stop()
        }
        let music = musics[cur]
        this.setData({ music, isPlaying: false })

        // console.log(musicId, typeof musicId)
        app.setPlayMusicId(musicId)
        //
        showLoading({
            title: '歌曲加载中',
        })
        const {
            result: {
                data
            }
        } = await cloudRequest({
            name: 'music',
            data: {
                musicId,
                $url: 'song'
            }
        })
        const song = data[0]
        if (song.url === null) {
            showToast({ title: '无权限播放' })
            return
        }
        if (!isSame) {
            backgroundAudioManager.src = song.url
            backgroundAudioManager.title = music.name
            backgroundAudioManager.coverImgUrl = music.al.picUrl
            backgroundAudioManager.singer = music.ar[0].name
            backgroundAudioManager.epname = music.al.name
            // 保存播放历史
            //         this.savePlayHistory()
        }
        this.setData({
            isPlaying: true
        })
        hideLoading()
        // wx.cloud.callFunction({
        //     name: 'music',
        //     data: {
        //         musicId,
        //         $url: 'musicUrl',
        //     }
        // }).then((res) => {
        //     console.log(res)
        //     console.log(JSON.parse(res.result))
        //     let result = JSON.parse(res.result)
        //     if (result.data[0].url == null) {
        //         wx.showToast({
        //             title: '无权限播放',
        //         })
        //         return
        //     }
        //     if (!this.data.isSame) {
        //         backgroundAudioManager.src = result.data[0].url
        //         backgroundAudioManager.title = music.name
        //         backgroundAudioManager.coverImgUrl = music.al.picUrl
        //         backgroundAudioManager.singer = music.ar[0].name
        //         backgroundAudioManager.epname = music.al.name
        //
        //         // 保存播放历史
        //         this.savePlayHistory()
        //     }
        //
        //     this.setData({
        //         isPlaying: true
        //     })
        //     wx.hideLoading()
        //
        //     // 加载歌词
        //     wx.cloud.callFunction({
        //         name: 'music',
        //         data: {
        //             musicId,
        //             $url: 'lyric',
        //         }
        //     }).then((res) => {
        //         console.log(res)
        //         let lyric = '暂无歌词'
        //         const lrc = JSON.parse(res.result).lrc
        //         if (lrc) {
        //             lyric = lrc.lyric
        //         }
        //         this.setData({
        //             lyric
        //         })
        //     })
        // })

    },
    togglePlaying() {
        const { isPlaying } = this.data
        if (isPlaying) {
            backgroundAudioManager.pause()
        } else {
            backgroundAudioManager.play()
        }
        this.setData({
            isPlaying: !isPlaying
        })
    },

    onPrev() {
        cur--
        if (cur < 0) {
            cur = musics.length - 1
        }
        this._loadMusicDetail(musics[cur].id)
    },
    onNext() {
        console.log(1)
        cur++
        if (cur === musics.length) {
            cur = 0
        }
        this._loadMusicDetail(musics[cur].id)
    },

    onChangeLyricShow() {
        this.setData({
            isLyricShow: !this.data.isLyricShow
        })
    },

    timeUpdate(event) {
        this.selectComponent('.lyric').update(event.detail.currentTime)
    },

    // 保存播放历史
    savePlayHistory() {
        //  当前正在播放的歌曲
        const music = musiclist[nowPlayingIndex]
        const openid = app.globalData.openid
        const history = wx.getStorageSync(openid)
        let bHave = false
        for (let i = 0, len = history.length; i < len; i++) {
            if (history[i].id == music.id) {
                bHave = true
                break
            }
        }
        if (!bHave) {
            history.unshift(music)
            wx.setStorage({
                key: openid,
                data: history,
            })
        }
    },
})
