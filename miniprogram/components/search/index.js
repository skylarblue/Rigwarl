// components/search/index.js
Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        keyword: String,
    },
    data: {
        text: ''
    },
    methods: {
        onInput(event) {
            this.setData({
                text: event.detail.value
            })
        },
        onTap() {
            this.triggerEvent('search', this.data.text)
        },
        onClear() {
            const { keyword } = this.properties
            if (keyword) {
                this.triggerEvent('search', '')
            }
            this.setData({
                text: ''
            })
        }
    }
})
