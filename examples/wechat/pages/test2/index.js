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
    cropSizePercent: 0.9,
    borderColor: '#fff',
    result: '',
  },

  onLoad: function () {},

  //选取裁剪图片
  chooseCropImage: function () {
    let self = this;
    wx.chooseImage({
      sizeType: ["compressed"],// ios 选择原图容易 crash
      success(res) {
        self.setData({
          visible: true,
          src: res.tempFilePaths[0],
        })
      }
    });
  },

  //组件更新
  updateComponnet: function () {
    let src = this.data.src ? this.data.src : '../test2/img/test1.jpg';//裁剪图片不存在时，使用默认图片，注意加载时的相对路径
    this.setData({
      visible: true,
      src: src,
      borderColor: "#0BFF00",
      cropSizePercent: 0.7,
      size: {
        width: 300,
        height: 300
      }
    })
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