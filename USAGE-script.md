# script 标签用法

- [PC 示例](examples/test-1.html)
- [Mobile 示例](examples/test-2.html)

## 1、引入样式

目前提供了两种默认样式 `./dist/template-2.css` 适用移动设备，`./dist/template-1.css` 适用 PC。

```html
<link rel="stylesheet" href="./dist/template-2.css" />
```

## 2、引入组件代码以及相关依赖

```html
<script src="../lib/prefix-umd.js"></script>
<script src="../lib/exif.js"></script>
<script src="../lib/transformation-matrix.js"></script>
<script src="./index.js"></script>
```

## 3、初始化

- 移动端初始化参数示例：

```javascript
var simpleCrop = new SimpleCrop({
  src: '../img/test2.jpg', //裁剪图片地址
  size: { //裁剪尺寸
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.9, //裁剪框显示比例
  cropCallback: function () { //图片裁剪完成回调函数
    this.$resultCanvas.style.marginRight = '10px';
    this.$resultCanvas.style.width = '50%';
    document.body.appendChild(this.$resultCanvas);
  }
});
```

- PC 初始化参数示例：

```javascript
var simpleCrop = new SimpleCrop({
  title: '上传图片过大，请裁剪', //标题
  src: '../img/test2.jpg', //裁剪图片地址
  size: { //裁剪尺寸
    width: 1000,
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
  cropCallback: function () { //图片裁剪完成回调函数
    this.$resultCanvas.style.marginRight = '10px';
    this.$resultCanvas.style.width = '50%';
    document.body.appendChild(this.$resultCanvas);
  },
});
```

## 4、设置裁剪图片

```javascript
var $upload = document.querySelector('#upload');
$upload.addEventListener('change', function (evt) {
  var files = evt.target.files;
  if (files.length > 0) {
    simpleCrop.show(files[0]);
  }
  $upload.value = ''; //清空value属性，从而保证用户修改文件内容但是没有修改文件名时依然能上传成功
});
```

