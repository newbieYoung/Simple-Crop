//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src: null,
    visible: false,
    size: {
      width: 400,
      height: 300
    },
    result: '',
  },

  onLoad: function () {},

  //选取裁剪图片
  chooseCropImage: function () {
    let self = this;
    wx.chooseImage({
      success(res) {
        self.setData({
          visible: true,
          src: res.tempFilePaths[0],
        })
      }
    });
  },

  //选取裁剪图片成功回调
  uploadCallback: function (event) {
    console.log(event);
  },

  //裁剪图片回调
  cropCallback: function (event) {
    console.log(event);
    this.setData({
      visible: false,
      result: event.detail.resultSrc,
    });
  },

  //关闭回调
  closeCallback: function (event) {
    console.log(event);
    this.setData({
      visible: false,
    });
  }
})