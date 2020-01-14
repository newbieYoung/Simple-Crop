let _multiPoint = false;
let _rotateScale = false;


Component({
  properties: {
    //微信小程序仅支持部分属性
    src: { // 图片地址
      type: String,
      value: ''
    },
    size: { // 裁剪图片目标尺寸
      type: Object,
      value: {
        width: 0,
        height: 0
      }
    },
    maxScale: { // 最大缩放倍数
      type: Number,
      value: 1
    },
    debug: { // 是否开启调试模式
      type: Boolean,
      value: false
    },
    positionOffset: { // 裁剪框屏幕偏移
      type: Object,
      value: {
        top: 0,
        left: 0
      }
    },
    borderWidth: { // 裁剪框边框宽度
      type: Number,
      value: 1
    },
    borderColor: { // 裁剪框边框颜色
      type: String,
      value: '#fff'
    },
    zIndex: { // 组件层级
      type: Number,
      value: '9999'
    },
    visible: { // 组件是否可见 
      type: Boolean,
      value: true
    },
    noBoldCorner: { // 裁剪框边角是否不加粗
      type: Boolean,
      value: false,
    },
    coverColor: { // 遮罩背景颜色
      type: String,
      value: 'rgba(0,0,0,.3)'
    },
    cropSizePercent: { // 裁剪框占裁剪显示区域的比例
      type: Number,
      value: '0.9'
    },
    rotateSlider: { // 是否开启旋转刻度盘
      type: Boolean,
      value: true
    },
    startAngle: { // 旋转刻度盘开始角度
      type: Number,
      value: -90
    },
    endAngle: { // 旋转刻度盘结束角度
      type: Number,
      value: 90
    },
    gapAngle: { // 旋转刻度盘间隔角度
      type: Number,
      value: 10
    },
    lineationItemWidth: { // 旋转刻度盘间隔宽度
      type: Number,
      value: 40.5
    },
    
    funcBtns: { // 功能按钮数组
      type: Array,
      value: ['close', 'crop', 'around', 'reset']
    },
  },
  
  data: {
    _multiPoint: false, // 是否开始多点触控
    _rotateScale: 1, // 旋转缩放倍数
    _baseMoveX: 0, // 旋转刻度盘位置初始化偏移量
    _downPoint: [], // 操作点坐标
    _isControl: false, // 是否正在操作
    _baseAngle: 0,
    scaleTimes: 1, // 缩放倍数
    rotateAngle: 0, // 旋转角度
    maskViewSize: {}, // 容器屏幕尺寸
    cropRect: {}, // 截图框屏幕尺寸
    cropPoints: {}, // 裁剪框顶点坐标
    cropCenter: {}, // 裁剪框中心点坐标
    contentPoints: {}, // 图片顶点坐标
    _contentCurMoveX: 0, // 图片 X 轴方向上的总位移
    _contentCurMoveY: 0, // 图片 Y 轴方向上的总位移
    _orientation: null, // 图片元数据方向角
    initContentPoints: {}, // 图片初始顶点坐标
    originImage: null, // 初始图片
    originWidth: 0, // 初始图片宽度（考虑方向角）
    originHeight: 0, // 初始图片高度（考虑方向角）
    times: 0, // 实际尺寸/显示尺寸
    initScale: 0, // 初始缩放倍数
    $resultCanvas: null, // 裁剪结果
  },

  lifetimes: { // 组件生命周期
    created: function () {
      console.log('---');
      console.log(this.data);
      console.log(this.data.lineationItemWidth);
      console.log(_multiPoint);
    },
  },

  methods: {
  }
})