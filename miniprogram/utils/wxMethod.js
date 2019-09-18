export const cloudRequest = async (options) => {
    wx.showLoading()
    const res = await wx.cloud.callFunction(options)
    wx.hideLoading()
    return res
}
export const setStorageSync = (key, value) => wx.setStorageSync(key, value)
export const getStorageSync = (key) => wx.getStorageSync(key)
export const showLoading = (options) => wx.showLoading(options)
export const hideLoading = () => wx.hideLoading()
export const showToast = (options) => wx.showToast(options)
