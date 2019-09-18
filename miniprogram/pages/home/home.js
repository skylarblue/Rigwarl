import { cloudRequest } from '../../utils/cloudRequest'

Page({
    data: {
        playlist: [],
        page: 1,
        finish: false
    },
    async onLoad () {
        this._getPlayList()
    },
    onPullDownRefresh: function () {
        this.setData({
            page: 1,
            playlist: [],
            finish: false
        })
        this._getPlayList()
        wx.stopPullDownRefresh()
    },
    async onReachBottom () {
        this.setData({
            page: this.data.page + 1,
        })
        this._getPlayList()
    },
    async _getPlayList() {
        const { finish, page, playlist } = this.data
        if (finish) return
        const { result } = await cloudRequest({
            name: 'music',
            data: {
                $url: 'playlist',
                page,
                limit: 15
            }
        })
        this.setData({
            playlist: playlist.concat(result.data),
            finish: result.data.length === 0
        })
    }
})
