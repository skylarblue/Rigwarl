export const cloudRequest = async (options) => {
    wx.showLoading()
    const res = await wx.cloud.callFunction(options)
    wx.hideLoading()
    return res
}
export const cloudRequestWithoutLoading = async (options) => await wx.cloud.callFunction(options)
export const setStorageSync = (key, value) => wx.setStorageSync(key, value)
export const getStorageSync = (key) => wx.getStorageSync(key)
export const showLoading = (options) => wx.showLoading(options)
export const hideLoading = () => wx.hideLoading()
export const showToast = (options) => wx.showToast(options)
export const showModal = (options) => wx.showModal(options)
export const navigateTo = (options) => wx.navigateTo(options)
export const navigateBack = () => wx.navigateBack()
export const chooseImage = (options) => new Promise(resolve => {
    options.success = (res) => resolve(res)
    wx.chooseImage(options)
})
export const getSetting = (options = {}) => new Promise(resolve => {
    options.success = (res) => resolve(res)
    wx.getSetting(options)
})
export const getUserInfo = (options = {}) => new Promise(resolve => {
    options.success = (res) => resolve(res)
    wx.getUserInfo(options)
})
export const previewImage = (options) => wx.previewImage(options)
export const cloudUploadFile = async (options) => await wx.cloud.uploadFile(options)
