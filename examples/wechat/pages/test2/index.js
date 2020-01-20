//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src: null,
    visible: false,
    size:{
      width:1000,
      height:600
    },
  },
  onLoad: function () {
  },

  //选取裁剪图片
  chooseCropImage: function(){
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
    console.log('uploadCallback');
    console.log(event);
  },

  //关闭回调
  closeCallback: function (event) {
    console.log('closeCallback');
    console.log(event);

    this.setData({
      visible: false,
    });
  }
})
