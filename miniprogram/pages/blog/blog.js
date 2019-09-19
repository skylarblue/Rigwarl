import {
    getUserInfo, getSetting, navigateTo,
    cloudRequestWithoutLoading, stopPullDownRefresh
} from '../../utils/wxMethod'

const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        modalShow: false,
        page: 1,
        blogList: [],
        keyword: '',
        finish: false
    },
    onLoad() {
        this._loadBlogList()
    },
    async _loadBlogList() {
        const { finish, page, blogList } = this.data
        if (finish) return
        const { result } = await cloudRequestWithoutLoading({
            name: 'blog',
            data: {
                $url: 'list',
                page,
                limit: 5,
                keyword: this.data.keyword,
            }
        })
        this.setData({ blogList:  blogList.concat(result.data)})
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
            blogList: [],
            finish: false,
            page: 1
        })
        this._loadBlogList()
        stopPullDownRefresh()
    },
    onSearch(event) {
        this.setData({
            blogList: [],
            keyword: event.detail,
            finish: false,
            page: 1
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
    },
    async onReachBottom () {
        this.setData({
            page: this.data.page + 1,
        })
        this._loadBlogList()
    },
})
