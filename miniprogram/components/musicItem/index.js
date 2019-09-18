Component({
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
        // ['music.']
    }
})
