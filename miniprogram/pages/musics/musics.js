import { cloudRequest, setStorageSync } from '../../utils/wxMethod'

Page({
    data: {
        musics: [],
        listInfo: {},
        creator: {},
    },
    async onLoad (options) {
        const { playlistId } = options
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
        } = await cloudRequest({
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
        setStorageSync('musics', tracks)
    },
})
