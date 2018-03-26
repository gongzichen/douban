import { fetchData, starToArray } from '../../util/util.js';
Page({
  data: {
    movies: [],
    count: 0,
    url: ''
  },
  // 跳转详情页
  toDetail(e) {
    console.log('详情')
    console.log(e)
    var id = e.currentTarget.id
    wx.navigateTo({
      url: './../detail/detail?id='+ id,
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var type = options.type
    var url
    switch (type) {
      case '电影':
        url = "http://t.yushu.im/v2/movie/in_theaters"
        break;
      case '即将上映':
        url = 'http://t.yushu.im/v2/movie/coming_soon'
        break;
      case 'top250':
        url = 'http://t.yushu.im/v2/movie/top250'
        break;
    }
    fetchData(url).then(res => {
      this.processData(res);
    })
    this.setData({
      url: url
    })
  },
  // 处理数据
  processData(res, name, kind) {
    const data = res.data.subjects
    let arr = []
    data.forEach(item => {
      const tmp = {
        id: item.id,
        images: item.images.large,
        title: item.title.length > 6 ? item.title.slice(0, 6) + '...' : item.title,
        rating: {
          stars: starToArray(item.rating.stars),
          average: parseInt(item.rating.average, 10) === item.rating.average ? item.rating.average + '.0' : item.rating.average
        }
      }
      arr.push(tmp)
    })
    // 如果以前有电影,表示延迟加载
    if (this.data.movies.length) {
      arr = this.data.movies.concat(arr)
    }
    this.setData({
      movies: arr
    })
    wx.hideNavigationBarLoading()
  },
  lazyLoad(e) {
    console.log('下拉加载更多')
    var count = this.data.count + 20;
    console.log(count)
    this.setData({
      count
    })
    wx.showNavigationBarLoading();
    fetchData(`${this.data.url}?start=${this.data.count}&count=20`).then(res => {
      console.log(res)
      this.processData(res);
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})