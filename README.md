# SimpleCrop

`全网唯一`支持裁剪图片任意角度旋转、交互体验`媲美原生客户端`的`全平台`图片裁剪组件。

[English](README-en.md)

## 特性及优势

和目前流行的图片裁剪组件相比，其优势在于以下几点：

- 裁剪图片支持任意角度旋转；
- 支持 Script 标签、微信小程序、React、Vue；
- 支持移动和 PC 设备；
- 支持边界判断、当裁剪框里出现空白时，图片自动吸附至完全填满裁剪框；
- 移动端缩放以双指中心为基准点；
- 交互体验媲美原生客户端。

## 安装

```bash
npm install simple-crop
```

## 示例

### 微信小程序示例

![微信小程序示例](https://newbieyoung.github.io/images/simple-crop-16.jpg)

### 移动端示例

![移动端示例](https://newbieyoung.github.io/images/simple-crop-0.jpg)

> 左侧是 IOS 系统相册中原生的图片裁剪功能，右侧为 SimpleCrop 移动端示例。

可以扫描二维码体验：

![移动端示例二维码](https://newbieyoung.github.io/images/simple-crop-1.png)

或者访问以下链接：

[https://newbieyoung.github.io/Simple-Crop/examples/test-2.html](https://newbieyoung.github.io/Simple-Crop/examples/test-2.html)

### PC 示例

![PC 示例](https://newbieyoung.github.io/images/simple-crop-11.jpg)

链接如下：

[https://newbieyoung.github.io/Simple-Crop/examples/test-1.html](https://newbieyoung.github.io/Simple-Crop/examples/test-1.html)

## 用法

- [Script 用法](USAGE-script.md)
- [微信小程序用法](USAGE-wechat.md)
- [React 用法](USAGE-react.md)
- [Vue 用法](USAGE-vue.md)

## [文档](DOCUMENT.md)

## 开源许可协议

[MIT](http://opensource.org/licenses/MIT) License.

## TodoList

<table style="word-break: normal;">
  <tr>
    <td>类型</td>
    <td>描述</td>
    <td>状态</td>
  </tr>
  <tr>
    <td>feature</td>
    <td>支持镜像变换</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>支持常用滤镜</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>旋转时以裁剪框为中心</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>触摸移动时如果没有在图片区域是否应该触发</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>支持 flutter、Angular 等</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>微信小程序交互使用 wxs 优化</td>
    <td></td>
  </tr>
	<tr>
    <td>feature</td>
    <td>裁剪图片类型默认和上传图片类型一致，另外提供图片类型以及图片质量参数</td>
    <td></td>
  </tr>
</table>

## 兼容性自测

<table style="word-break: normal;">
  <tr>
    <td>设备</td>
    <td>浏览器</td>
    <td>版本</td>
    <td>结果</td>
  </tr>
</table>