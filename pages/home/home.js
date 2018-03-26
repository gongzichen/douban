import { fetchData, starToArray } from '../../util/util.js';
Page({
  data: {
    inTheaters: {
      movies: [],
      name: '电影'
    },
    comingSoon: {
      movies: [],
      name: '即将上映'
    },
    top250: {
      movies: [],
      name: 'top250'
    }
  },
  onLoad: function (options) {
    // 默认返回20条数据  显示6条
    fetchData('http://t.yushu.im/v2/movie/in_theaters?star=0&count=6').then(res => {
      console.log(res)
      this.processData(res, '电影', 'inTheaters');
    });
    fetchData('http://t.yushu.im/v2/movie/coming_soon?star=0&count=6').then(res => {
      this.processData(res, '即将上映', 'comingSoon');
    });
    fetchData('http://t.yushu.im/v2/movie/top250?star=0&count=6').then(res => {
      this.processData(res, 'top250', 'top250');
    });
  },
  bindToMore(e){
    var val = e.currentTarget.dataset.more;
    wx.navigateTo({
      url: './../more/more?type='+val,
    });
  },
  // 处理数据
  processData(res, name, type) {
    var datas = res.data.subjects;
    var arr = [];
    datas.forEach(item => {
      console.log(item.rating.average + '.0')
      var tmp = {
        id: item.id,
        images: item.images.large,
        title: item.title.length > 6 ? item.title.slice(0, 6) + '...' : item.title,
        rating: {
          stars: starToArray(item.rating.stars),    
          average: parseInt(item.rating.average, 10) === item.rating.average ? item.rating.average + '.0' : item.rating.average
        }
      }
      arr.push(tmp);
    })
    var obj = {};
    obj[type] = {
      movies: arr,
      name
    }
    console.log(obj)
    this.setData(obj);
  },
  toSearch () {
    console.log(123)
    wx.navigateTo({
      url: './../search/search',
    })
  },
  // 跳转详情页
  toDetail (e) {
    console.log('详情')
    var obj = e.currentTarget.id
    // console.log(obj)
    wx.navigateTo({
      url: './../detail/detail?id=' + obj,
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