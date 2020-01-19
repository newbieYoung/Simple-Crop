//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    size:{
      width:1000,
      height:600
    },
    src:null,
  },
  onLoad: function () {
    let self = this;
    // wx.chooseImage({
    //   success(res) {
    //     self.setData({
    //       src: res.tempFilePaths[0],
    //     })
    //   }
    // });
  },
})
