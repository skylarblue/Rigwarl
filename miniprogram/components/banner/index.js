// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      ImageUrls: [
          "http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg",
          "http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg",
          "http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg"
      ],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 1000
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
