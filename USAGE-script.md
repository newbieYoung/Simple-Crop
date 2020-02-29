# Script 用法

- [Mobile 示例](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)
- [PC 示例](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

## 1、引入样式

目前提供了两种默认样式 `./dist/template-2.css` 适用移动设备，`./dist/template-1.css` 适用 PC。

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

## 2、引入相关依赖和组件源代码

```html
<script src="../lib/prefix-umd.js"></script>
<script src="../lib/exif.js"></script>
<script src="../lib/transformation-matrix.js"></script>
<script src="../index.js"></script>
```

## 3、初始化

- 移动端初始化参数示例：

```javascript
var simpleCrop = new SimpleCrop({
  src: '../img/test2.jpg', //裁剪图片地址
  size: { //裁剪尺寸
    width: 800,
    height: 600
  },
  cropSizePercent: 0.9, //裁剪框显示比例
  cropCallback: function ($resultCanvas) { //图片裁剪完成回调函数
    console.log('cropCallback');
    $resultCanvas.style.marginRight = '10px';
    $resultCanvas.style.width = '50%';
    document.body.appendChild($resultCanvas);
  },
  uploadCallback: function (src) { //上传裁剪图片成功回调函数
    console.log('uploadCallback ' + src);
  },
  closeCallback: function () { //关闭组件回调函数
    console.log('closeCallback');
  }
});
```

- PC 初始化参数示例：

```javascript
var simpleCrop = new SimpleCrop({
  title: '上传图片过大，请裁剪', //标题
  src: '../img/test2.jpg', //裁剪图片地址
  size: { //裁剪尺寸
    width: 800,
    height: 600
  },
  cropSizePercent: 0.65, //裁剪框显示比例
  scaleSlider: true, //是否显示滑动控制条
  maxScale: 3, //最大缩放倍数
  borderWidth: 1, //裁剪框边框宽度
  funcBtns: ['close', 'crop', 'upload'], //功能按钮配置
  borderColor: "#fff", //裁剪框边框颜色
  coverColor: 'rgba(0,0,0,.5)', //裁剪框遮罩颜色
  startAngle: -360, //旋转刻度盘开始角度
  endAngle: 360, //旋转刻度盘结束角度
  cropCallback: function ($resultCanvas) { //图片裁剪完成回调函数
    console.log('cropCallback');
    $resultCanvas.style.marginRight = '10px';
    $resultCanvas.style.width = '50%';
    document.body.appendChild($resultCanvas);
  },
  uploadCallback: function (src) { //上传裁剪图片成功回调函数
    console.log('uploadCallback ' + src);
  },
  closeCallback: function () { //关闭组件回调函数
    console.log('closeCallback');
  }
});
```

## 4、选取裁剪图片

```HTML
<input id="upload" type="file" accept="image/png,image/jpeg">
```

```javascript
 var $upload = document.querySelector('#upload');
$upload.addEventListener('change', function (evt) {
  var files = evt.target.files;
  if (files.length > 0) {
    simpleCrop.show(files[0]); //显示
  }
  $upload.value = ''; //清空 input value属性
});
```

## 5、更新组件参数

```html
<button id="update">组件更新</button>
```

```javascript
var $update = document.querySelector('#update');
$update.addEventListener('click', function () {
  simpleCrop.updateBox({ //更新裁剪框尺寸和显示比例
    cropSizePercent: 0.7,
    size: {
      width: 600,
      height: 600,
    }
  });
  simpleCrop.initBoxBorder({ //更新裁剪框边框样式
    borderColor: "#0BFF00",
  });
  simpleCrop.show(); //显示
});
```

