// pages/profile/profile.js
import {
    chooseImage, previewImage,
    cloudUploadFile, showLoading, hideLoading, showToast,
    navigateBack
} from '../../utils/wxMethod'

let content  = ''
let userInfo = {}
const db = wx.cloud.database()
Page({
    data: {
        imgList: [],
        footerBottom: 0,
        max: 9,
        showModal: false
    },
    onLoad(options) {
        userInfo =options
    },
    onInput(event) {
        content = event.detail.value
    },
    onFocus(event) {
        this.setData({
            footerBottom: event.detail.height,
        })
    },
    onBlur() {
        this.setData({
            footerBottom: 0,
        })
    },
    async ChooseImage() {
        // 还能再选几张图片
        let count = this.data.max - this.data.imgList.length
        const res = await chooseImage({
            count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
        })
        this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
        })
    },
    DelImg(event) {
        const { currentTarget } = event
        const { dataset: { index } } = currentTarget
        console.log(this.data.imgList.splice(index, 1))
        this.setData({
            imgList: this.data.imgList
        })
    },
    onPreviewImage(event) {
        // 6/9
        previewImage({
            urls: this.data.imgList,
            current: event.target.dataset.url,
        })
    },
    hideModal() {
        this.setData({ showModal: false })
    },
    async send() {
        if (content.trim() === '') {
            this.setData({ showModal: true })
            return
        }
        showLoading({
            title: '发布中',
            mask: true,
        })
        let promiseArr = []
        // 图片上传
        for (let i = 0, len = this.data.imgList.length; i < len; i++) {
            let item = this.data.imgList[i]
            // 文件扩展名
            let suffix = /\.\w+$/.exec(item)[0]
            const p = cloudUploadFile({
                cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
                filePath: item,
            })
            promiseArr.push(p)
        }
        try {
            const res = await Promise.all(promiseArr)
            const images = res.map(({fileID}) => fileID)
            await db.collection('blog').add({
                data: {
                    userInfo,
                    content,
                    images,
                    createTime: db.serverDate()
                }
            })
            hideLoading()
            showToast({ title: '发布成功'})
            setTimeout(() => {
                navigateBack()
                const pages = getCurrentPages()
                const prevPage = pages[pages.length - 2]
                prevPage.onPullDownRefresh()
            }, 1500)
        } catch (e) {
            console.log(e)
            hideLoading()
            showToast({ title: '发布失败'})
        }
    }
})
