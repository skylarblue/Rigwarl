// components/blogCard/index.js
import { cloudGetTempFileURL, previewImage } from '../../utils/wxMethod'

Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        data: Object
    },
    data: {
        show: false
    },
    methods: {
        onPreviewImage(event) {
            previewImage({
                urls: this.data.urls,
                current: event.target.dataset.url,
            })
        },
    },
    observers: {
        ['data.createTime'](time) {
            const t = new Date(time)
            this.setData({
                createTime: `${t.getFullYear()}年${t.getMonth()}月${t.getDay()}日`
            })
        },
        async ['data.images'] (images) {
            if (images.length === 0) {
                this.setData({
                    show: true
                })
                return
            }
            const { fileList } = await cloudGetTempFileURL({
                fileList: images.map(i => ({fileID: i}))
            })
            const urls = fileList.map(({ tempFileURL }) => tempFileURL)
            this.setData({ urls, show: true })
        }
    }
})
