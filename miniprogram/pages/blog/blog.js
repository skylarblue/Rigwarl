import { getUserInfo, getSetting, navigateTo } from '../../utils/wxMethod'

const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        modalShow: false
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
})
