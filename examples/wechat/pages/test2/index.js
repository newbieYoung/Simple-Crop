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
    

    wx.createSelectorQuery().select('.test1').node().exec(function (res) {
      let node = res[0].node;
      let ctx1 = node.getContext('2d');
      let ctx2 = wx.createCanvasContext('test2')


      wx.chooseImage({
        success(res) {
          let image = res.tempFilePaths[0];
          // self.setData({
          //   src: image
          // })
          //ctx1.drawImage(image, 0, 0, 200, 200);
          ctx2.drawImage(image, 0, 0, 200, 200);
          ctx2.draw()
        }
      });

    });
  },
})
