// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let duration = 0 // 当前歌曲的总时长，以秒为单位
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题

Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        isSame: Boolean
    },
    data: {
        showTime: {
            currentTime: '00:00',
            totalTime: '00:00',
        },
        movableDis: 0,
        progress: 0,
    },

    lifetimes: {
        ready() {
            this._getMovableDis()
            this._bindBGMEvent()
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event) {
            const { detail } = event
            const { source, x } = detail
            if (source === 'touch') {
                this.data.progress = x / (movableAreaWidth - movableViewWidth)
                this.data.movableDis = x
                isMoving = true
            }
        },
        onTouchEnd() {
            backgroundAudioManager.seek(duration * this.data.progress)
            isMoving = false
        },
        _getMovableDis() {
            const query = this.createSelectorQuery()
            query.select('.movable-area').boundingClientRect()
            query.select('.movable-view').boundingClientRect()
            query.exec((rect) => {
                movableAreaWidth = rect[0].width
                movableViewWidth = rect[1].width
            })
        },

        _bindBGMEvent() {
            backgroundAudioManager.onPlay(() => {
                this.triggerEvent('musicPlay')
            })
            backgroundAudioManager.onPause(() => {
                console.log('adga')
                this.triggerEvent('musicPause')
            })
            backgroundAudioManager.onCanplay(this._setTotalTime.bind(this))
            backgroundAudioManager.onTimeUpdate(this._updateCurrentTime.bind(this))
            backgroundAudioManager.onEnded(() => {
                this.triggerEvent('musicEnd')
            })
            backgroundAudioManager.onError((res) => {
                wx.showToast({
                    title: '错误:' + res.errCode,
                })
            })
        },
        _updateCurrentTime() {
            if (!isMoving) {
                const currentTime = backgroundAudioManager.currentTime
                const duration = backgroundAudioManager.duration
                const currentTimeFmt = this._dateFormat(currentTime)
                this.setData({
                    movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
                    progress: currentTime / duration * 100,
                    ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
                })
                this.triggerEvent('timeUpdate', {
                    currentTime
                })
            }
        },

        _setTotalTime() {
            duration = backgroundAudioManager.duration
            if (duration === undefined) {
                setTimeout(() => {
                    this._setTotalTime()
                }, 100)
            } else {
                const durationFmt = this._dateFormat(duration)
                this.setData({
                    ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
                })
            }
        },
        // 格式化时间
        _dateFormat(sec) {
            // 分钟
            const min = Math.floor(sec / 60)
            sec = Math.floor(sec % 60)
            return {
                'min': this._parse0(min),
                'sec': this._parse0(sec),
            }
        },
        // 补零
        _parse0(sec) {
            return sec < 10 ? '0' + sec : sec
        }
    }
})
