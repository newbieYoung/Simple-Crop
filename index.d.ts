export interface ICropConfig {
  title?: string; //标题
  visible?: boolean; // 可见
  debug?: boolean; //调试模式
  $container?: HTMLElement; // 容器
  src: string | File; // 图片文件或者地址
  size: { width: number; height: number }; // 裁剪图片目标尺寸
  positionOffset?: { top: number; left: number }; // 裁剪框屏幕偏移
  boldCornerLen?: number; // 裁剪框边角加粗长度
  coverColor?: string; // 遮罩背景颜色
  cropSizePercent?: number; // 裁剪框占裁剪显示区域的比例
  borderWidth?: number; // 裁剪框边框宽度
  borderColor?: string; // 裁剪框边框颜色
  coverDraw?($coverCanvas: HTMLCanvasElement): void; // 裁剪框辅助线绘制函数
  borderDraw?($coverCanvas: HTMLCanvasElement): void; // 裁剪框边框绘制函数
  funcBtns?: string[]; // 功能按钮配置数组
  cropCallback?($resultCanvas: HTMLCanvasElement): void; // 图片裁剪完成回调函数
  closeCallback?(): void; // 关闭裁剪组件回调函数
  uploadCallback?(src: string): void; // 重新上传裁剪图片回调函数

  rotateSlider?: boolean; // 是否开启旋转刻度盘
  startAngle?: number; // 旋转刻度盘开始角度
  endAngle?: number; // 旋转刻度盘结束角度
  gapAngle?: number; // 旋转刻度盘间隔角度
  lineationItemWidth?: number; // 旋转刻度盘间隔宽度
}

declare class SimpleCrop {
  constructor(params: ICropConfig);
  show(image?: File); // 显示
  hide(); // 隐藏
  initFuncBtns(params: ICropConfig);
  initTitle(params: ICropConfig);
  initBoxBorder(params: ICropConfig);
  initRotateSlider(params: ICropConfig);
  updateBox(params: ICropConfig);
  setImage(image: File);
}

export default SimpleCrop;
