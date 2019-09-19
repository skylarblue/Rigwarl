// components/loginModal/index.js
Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    properties: {
        modalShow: Boolean
    },
    data: {

    },
    methods: {
        onGotUserInfo(event) {
            console.log(event)
            const userInfo = event.detail.userInfo
            // 允许授权
            if (userInfo) {
                this.setData({
                    modalShow: false
                })
                this.triggerEvent('loginsuccess', userInfo)
            } else {
                this.triggerEvent('loginfail')
            }
        },
        hideModal() {
            this.setData({
                modalShow: false
            })
        }
    }
})
