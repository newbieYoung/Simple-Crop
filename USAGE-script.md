# script 标签用法

[示例一](examples/test-1.html)
[示例二](examples/test-2.html)

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

### 3、初始化

- 移动端初始化参数示例：

```javascript
new SimpleCrop({
  src: "./img/test2.jpg",
  size: {
    width: 1000,
    height: 600
  },
  cropSizePercent: 0.9,
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  }
});
```

- PC 初始化参数示例：

```javascript
new SimpleCrop({
  title: "上传图片过大，请裁剪",
  src: "./img/test1.jpg",
  size: {
    width: 800,
    height: 900
  },
  positionOffset: {
    left: 0,
    top: 50
  },
  maxScale: 2,
  borderWidth: 2,
  funcBtns: ["close", "crop", "upload"],
  borderColor: "#0BFF00",
  coverColor: "rgba(0,0,0,.5)",
  startAngle: -180,
  endAngle: 180,
  gapAngle: 10,
  cropCallback: function() {
    this.$resultCanvas.style.marginRight = "10px";
    this.$resultCanvas.style.width = "50%";
    document.body.appendChild(this.$resultCanvas);
  },
  coverDraw: function() {
    //...
  }
});
```