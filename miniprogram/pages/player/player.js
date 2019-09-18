import {
    getStorageSync, showLoading, cloudRequest,
    showToast, hideLoading, cloudRequestWithoutLoading
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
        app.setPlayMusicId(musicId)
        showLoading({ title: '歌曲加载中' })
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
        }
        this.setData({
            isPlaying: true
        })
        hideLoading()
        const {
            result: {
                lrc: {
                    lyric = '暂无歌词'
                }
            }
        } = await cloudRequestWithoutLoading({
            name: 'music',
            data: {
                musicId,
                $url: 'lyric'
            }
        })
        this.setData({ lyric })
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
    onPause() {
        this.setData({
            isPlaying: false
        })
    },
    onPlay() {
        this.setData({
            isPlaying: true
        })
    },
    onChangeLyricShow() {
        const { isLyricShow } = this.data
        this.setData({
            isLyricShow: !isLyricShow
        })
    },

    timeUpdate(event) {
        console.log(11)
        this.selectComponent('.lyric').update(event.detail.currentTime)
    },
})
