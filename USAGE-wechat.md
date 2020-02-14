# 微信小程序用法

[示例](examples/wechat)

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

```
{
  "usingComponents": {
    "simple-crop": "../simple-crop/index"
  }
}
```

## 3、传入相关属性和回调函数即可使用

```
<view class="test2">
  <button bindtap="chooseCropImage">选取裁剪图片</button>
  <simple-crop wx:if="{{visible}}" size="{{size}}" src="{{src}}" bindcropUpload="uploadCallback" bindcropClose="closeCallback" bindcropCrop="cropCallback"></simple-crop>
  <image mode="widthFix" src="{{result}}"></image>
</view>
```
