export const cloudRequest = async (options) => {
    wx.showLoading()
    const res = await wx.cloud.callFunction(options)
    wx.hideLoading()
    return res
}
