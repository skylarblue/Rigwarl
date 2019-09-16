// components/musicCard/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        music: {
            type: Object,
            value: {}
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        formatCountStr: 0
    },
    /**
     * 组件的方法列表
     */
    methods: {
        _transNumber(num, point) {
            if (num.length < 6) return num
            const count = (num / 10000).toFixed(point)
            if (count.split('.')[0].length >= 5) {
                return `${(count / 10000).toFixed(point)}亿`
            } else {
                return `${count}万`
            }
        }
    },
    /**
     * 数据监听器
     */
    observers: {
        ['music.playCount'](count) {
            this.setData({
                formatCountStr: this._transNumber(count, 2)
            })
        }
    }
})
