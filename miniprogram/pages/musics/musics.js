Page({
    data: {
        musics: [],
        listInfo: {},
        creator: {},
    },
    async onLoad (options) {
        const { playlistId } = options
        wx.showLoading()
        const {
            result: {
                playlist: {
                    tracks,
                    coverImgUrl,
                    name,
                    creator,
                    description
                }
            }
        } = await wx.cloud.callFunction({
            name: 'music',
            data: {
                $url: 'musics',
                playlistId
            }
        })
        this.setData({
            musics: tracks,
            listInfo: {
                coverImgUrl,
                name,
                description
            },
            creator
        })
        wx.hideLoading()
    },
})
