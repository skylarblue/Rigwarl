Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        music: {
            type: Object,
            value: {}
        },
        index: {
            type: Number,
            value: 0
        }
    },
    data: {

    },
    methods: {
        onTap() {
            const { music } = this.properties
            const { id } = music
            wx.navigateTo({
                url: `/pages/player/player?musicId=${id}`
            })
        }
    },
    observers: {
        ['music.alia'] (alias = []) {
            const alia = alias.join(',')
            this.setData({ alia })
        },
        ['music.ar'] (singers = []) {
            const singerNames = singers.map(({name}) => name)
            const name = singerNames.join('/')
            this.setData({ name })
        },
    }
})
