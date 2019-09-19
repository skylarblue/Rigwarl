// pages/profile/profile.js
import {
    chooseImage, previewImage,
    cloudUploadFile
} from '../../utils/wxMethod'

let content  = ''
Page({
    data: {
        imgList: [],
        footerBottom: 0,
        max: 9,
        showModal: false
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
        wx.showLoading({
            title: '发布中',
            mask: true,
        })
        let promiseArr = []
        let fileIds = []
        // 图片上传
        for (let i = 0, len = this.data.imgList.length; i < len; i++) {
            let item = this.data.imgList[i]
            // 文件扩展名
            let suffix = /\.\w+$/.exec(item)[0]
            const p = cloudUploadFile({
                cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
                filePath: item,
                // success: (res) => {
                //     console.log(res.fileID)
                //     fileIds = fileIds.concat(res.fileID)
                //     resolve()
                // },
                // fail: (err) => {
                //     console.error(err)
                //     reject()
                // }
            })
            promiseArr.push(p)
        }
        try {
            const res = await Promise.all(promiseArr)
            console.log(res)
        } catch (e) {
            console.log(e)
        }
        // .then((res) => {
        //     db.collection('blog').add({
        //         data: {
        //             ...userInfo,
        //             content,
        //             img: fileIds,
        //             createTime: db.serverDate(), // 服务端的时间
        //         }
        //     }).then((res) => {
        //         wx.hideLoading()
        //         wx.showToast({
        //             title: '发布成功',
        //         })
        //
        //         // 返回blog页面，并且刷新
        //         wx.navigateBack()
        //         const pages = getCurrentPages()
        //         // console.log(pages)
        //         // 取到上一个页面
        //         const prevPage = pages[pages.length - 2]
        //         prevPage.onPullDownRefresh()
        //     })
        // }).catch((err) => {
        //     wx.hideLoading()
        //     wx.showToast({
        //         title: '发布失败',
        //     })
        // })
    }
})
