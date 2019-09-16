// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      playlist: [],
      page: 1,
      finish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
      this._getPlayList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.setData({
          page: 1,
          playlist: [],
          finish: false
      })
      this._getPlayList()
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom () {
      this.setData({
          page: this.data.page + 1,
      })
      this._getPlayList()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  async _getPlayList() {
      const { finish, page, playlist } = this.data
      if (finish) return
      wx.showLoading()
      const { result } = await wx.cloud.callFunction({
          name: 'music',
          data: {
              $url: 'playlist',
              page,
              limit: 15
          }
      })
      this.setData({
          playlist: playlist.concat(result.data),
          finish: result.data.length === 0
      })
      wx.hideLoading()
  }
})
