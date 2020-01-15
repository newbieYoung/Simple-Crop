const S_ID = 'simple_crop';
const SystemInfo = wx.getSystemInfoSync(); //  系统信息

Component({
  properties: {
    src: { // 图片地址
      type: String,
      value: ''
    },
    size: { // 裁剪图片目标尺寸
      type: Object,
      value: {
        width: 0,
        height: 0,
      },
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
      value: ["close", "crop", "around", "reset"],
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
    initScale: 0, // 初始缩放倍数
    $resultCanvas: null, // 裁剪结果
  },

  options: {
    query: null,
    $cropMask: null,
    $cropCover: null,
    cropCoverContext: null,
    maskViewSize: { // 容器屏幕尺寸
      width:0,
      height:0
    },
    times: 1, // 实际尺寸/显示尺寸
    cropRect:{
      width:0,
      height:0,
      top:0,
      left:0
    },
  },

  lifetimes: { // 组件生命周期
    created: function () {
      // 在 created 生命周期中查看 this.data 数据时为默认值
    },
    attached: function(){
      let size = this.data.size;
      let cropSizePercent = this.data.cropSizePercent;
      let positionOffset = this.data.positionOffset;

      //相关元素
      let self = this;
      this.$cropMask = this.createSelectorQuery().select('#' + S_ID +' .crop-mask');
      this.$cropMask.boundingClientRect(function (rect) {
        self.maskViewSize = {
          width: rect.width,
          height: rect.height,
        }
        self.times = (size.width / self.maskViewSize.width > size.height / self.maskViewSize.height) ? size.width / self.maskViewSize.width / cropSizePercent : size.height / self.maskViewSize.height / cropSizePercent;
        self.cropRect = {
          width: size.width / self.times,
          height: size.height / self.times
        };
        self.cropRect.left = (self.maskViewSize.width - self.cropRect.width) / 2 - positionOffset.left;
        self.cropRect.top = (self.maskViewSize.height - self.cropRect.height) / 2 - positionOffset.top;
      }).exec()

      this.$cropCover = this.createSelectorQuery().select('#' + S_ID + ' .crop-cover');
      this.$cropCover.node()
      .exec(function (res) {
        self.$cropCover = res[0].node;
        self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
        self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;
        self.cropCoverContext = self.$cropCover.getContext('2d');
      })
    }
  },

  methods: {
  }
})