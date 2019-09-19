import {
    getUserInfo, getSetting, navigateTo,
    cloudRequest, stopPullDownRefresh
} from '../../utils/wxMethod'

const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        modalShow: false,
        page: 1,
        blogList: [],
        keyword: ''
    },
    onLoad() {
        this._loadBlogList()
    },
    async _loadBlogList() {
        const { page } = this.data
        const { result: { data: blogList } } = await cloudRequest({
            name: 'blog',
            data: {
                $url: 'list',
                page,
                keyword: this.data.keyword
            }
        })
        this.setData({ blogList })
    },
    async onPublish() {
        const { authSetting } = await getSetting()
        const { ['scope.userInfo']: auth } = authSetting
        if (auth) {
            const { userInfo } = await getUserInfo()
            this.onLoginSuccess({ detail: userInfo })
        } else {
            console.log('未登录')
            this.setData({ modalShow: true })
        }

    },
    onLoginSuccess(event) {
        const detail = event.detail
        navigateTo({
            url: `/pages/edit/edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
        })
    },
    onLoginFail() {
        wx.showModal({
            title: '授权用户才能发布',
            content: '',
        })
    },
    onPullDownRefresh() {
        this.data.keyword = ''
        this.setData({
            blogList: []
        })
        this._loadBlogList()
        stopPullDownRefresh()
    },
    onSearch(event) {
        this.setData({
            blogList: [],
            keyword: event.detail
        })
        this._loadBlogList()
    },
    onShareAppMessage(event) {
        console.log(event)
        // let blogObj = event.target.dataset.blog
        // return {
        //     title: blogObj.content,
        //     path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
        //     // imageUrl: ''
        // }
    }
})
