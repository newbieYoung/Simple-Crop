# 微信小程序用法

- [示例](examples/wechat)

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

```js
Page({
  data: {
    src: null, // 裁剪图片地址
    visible: false, // 是否显示
    size:{ //裁剪尺寸
      width:400,
      height:400
    },
    result:'', //裁剪结果地址
  }
})
```

```wxml
<view class="test2">
  <simple-crop wx:if="{{visible}}" size="{{size}}" src="{{src}}" bindcropUpload="uploadCallback" bindcropClose="closeCallback" bindcropCrop="cropCallback"></simple-crop>
  <image mode="widthFix" src="{{result}}"></image>
</view>
```

- bindcropUpload 选取裁剪图片自定义事件；
- bindcropClose 裁剪组件关闭自定义事件；
- bindcropCrop 图片裁剪完成自定义事件。
