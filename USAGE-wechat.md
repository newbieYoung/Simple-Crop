# 微信小程序用法

![小程序码](https://newbieyoung.github.io/images/simple-crop-16.jpg)

[示例代码](examples/wechat)

## 1、复制组件代码至项目目录

```
├── simple-crop
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   ├── index.wxss
│   └── transformmation-matrix.js 
```

## 2、以自定义组件的形式声明

```json
{
  "usingComponents": {
    "simple-crop": "../simple-crop/index"
  }
}
```

## 3、初始化

```javascript
Page({
  data: {
    src: null, // 裁剪图片地址
    visible: false, // 是否显示
    size: { //裁剪尺寸
      width: 400,
      height: 300
    },
    cropSizePercent: 0.9, //裁剪框显示比例
    borderColor: '#fff', //裁剪框边框颜色
    result: '', //裁剪结果地址
  },
})
```

```wxml
<view class="test2">
  <simple-crop wx:if="{{visible}}" size="{{size}}" src="{{src}}" cropSizePercent="{{cropSizePercent}}" borderColor="{{borderColor}}" bindcropUpload="uploadCallback" bindcropClose="closeCallback" bindcropCrop="cropCallback"></simple-crop>
  <image mode="widthFix" src="{{result}}"></image>
</view>
```

- bindcropUpload 选取裁剪图片自定义事件；
- bindcropClose 裁剪组件关闭自定义事件；
- bindcropCrop 图片裁剪完成自定义事件。

## 4、选取裁剪图片

```wxml
<button bindtap="chooseCropImage">选取裁剪图片</button>
```

```javascript
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
```

## 5、更新组件参数

```wxml
<button bindtap="updateComponnet">组件更新</button>
```

```javascript
updateComponnet: function () {
  this.setData({
    visible: true,
    borderColor: "#0BFF00",
    cropSizePercent: 0.7,
    size: {
      width: 300,
      height: 300
    }
  })
},
```
