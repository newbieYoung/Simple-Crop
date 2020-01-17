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
    borderDraw: { // 裁剪框自定义边框绘制函数
      type: Function,
      value: null
    }
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
    borderDraw: null, // 裁剪框自定义边框绘制函数
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
    cropPoints: [], // 裁剪框顶点坐标
    cropCenter: { // 裁剪框中心点坐标
      x:0,
      y:0
    },
  },

  lifetimes: { // 组件生命周期
    created: function () {
      // 在 created 生命周期中查看 this.data 数据时为默认值
    },
    attached: function(){
      this.borderDraw = this.data.borderDraw ? this.data.borderDraw.bind(this) : this.defaultBorderDraw;

      this.initMaskAndCover(this.updateFrame);
    }
  },

  methods: {
    //初始化 mask 和 cover 元素
    initMaskAndCover: function(callback){
      let call_count = 0; // 回调计数器

      let self = this;
      this.$cropMask = this.createSelectorQuery().select('#' + S_ID + ' .crop-mask');
      this.$cropMask.boundingClientRect(function (rect) {
        self.maskViewSize = {
          width: rect.width,
          height: rect.height,
        }
        call_count++;
        if (call_count >= 2) {
          self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
          self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;

          callback.bind(self)();
        }
      }).exec();

      this.$cropCover = this.createSelectorQuery().select('#' + S_ID + ' .crop-cover');
      this.$cropCover.node().exec(function (res) {
        self.$cropCover = res[0].node;
        self.cropCoverContext = self.$cropCover.getContext('2d');
        call_count++;
        if (call_count >= 2) {
          self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
          self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;

          callback.bind(self)();
        }
      });
    },

    //根据裁剪图片目标尺寸、裁剪框显示比例、裁剪框偏移更新等参数更新并重现绘制裁剪框
    updateFrame: function(){
      let size = this.data.size;
      let cropSizePercent = this.data.cropSizePercent;
      let positionOffset = this.data.positionOffset;

      this.times = (size.width / this.maskViewSize.width > size.height / this.maskViewSize.height) ? size.width / this.maskViewSize.width / cropSizePercent : size.height / this.maskViewSize.height / cropSizePercent;
      this.cropRect = {
        width: size.width / this.times,
        height: size.height / this.times
      };
      this.cropRect.left = (this.maskViewSize.width - this.cropRect.width) / 2 - positionOffset.left;
      this.cropRect.top = (this.maskViewSize.height - this.cropRect.height) / 2 - positionOffset.top;
      this.cropPoints = this.rectToPoints(this.cropRect);
      this.cropCenter = this.getPointsCenter(this.cropPoints);
      this.borderDraw();
    },

    //默认绘制裁剪框
    defaultBorderDraw : function () {
      let coverColor = this.data.coverColor;
      let borderColor = this.data.borderColor;
      let noBoldCorner = this.data.noBoldCorner;
      let borderWidth = this.data.borderWidth;

      this.cropCoverContext.clearRect(0, 0, this.$cropCover.width, this.$cropCover.height);
      this.cropCoverContext.fillStyle = coverColor;
      this.cropCoverContext.fillRect(0, 0, this.$cropCover.width, this.$cropCover.height);
      this.cropCoverContext.fillStyle = borderColor;

      //绘制边框（边框内嵌）
      var borderRect = {
        left: this.cropRect.left * SystemInfo.pixelRatio,
        top: this.cropRect.top * SystemInfo.pixelRatio,
        width: this.cropRect.width * SystemInfo.pixelRatio,
        height: this.cropRect.height * SystemInfo.pixelRatio
      }
      this.cropCoverContext.fillRect(borderRect.left, borderRect.top, borderRect.width, borderRect.height);

      if (!noBoldCorner) {
        //边框四个角加粗
        var percent = 0.05;
        var cornerRectWidth = borderRect.width * percent;
        var cornerRectHeight = borderRect.height * percent;
        this.cropCoverContext.fillRect(borderRect.left - borderWidth, borderRect.top - borderWidth, cornerRectWidth, cornerRectHeight); //左上角
        this.cropCoverContext.fillRect(borderRect.left + borderRect.width - cornerRectWidth + borderWidth, borderRect.top - borderWidth, cornerRectWidth, cornerRectHeight); //右上角
        this.cropCoverContext.fillRect(borderRect.left - borderWidth, borderRect.top + borderRect.height - cornerRectHeight + borderWidth, cornerRectWidth, cornerRectHeight); //左下角
        this.cropCoverContext.fillRect(borderRect.left + borderRect.width - cornerRectWidth + borderWidth, borderRect.top + borderRect.height - cornerRectHeight + borderWidth, cornerRectWidth, cornerRectHeight); //右下角
      }

      //清空内容区域
      this.cropCoverContext.clearRect(borderRect.left + borderWidth, borderRect.top + borderWidth, borderRect.width - 2 * borderWidth, borderRect.height - 2 * borderWidth);
    },

    // 矩形位置形式转换为顶点坐标形式
    rectToPoints : function (rect) {
      var points = [];
      points.push({
        x: -(this.maskViewSize.width / 2 - rect.left),
        y: this.maskViewSize.height / 2 - rect.top
      });
      points.push({
        x: points[0].x + rect.width,
        y: points[0].y
      });
      points.push({
        x: points[1].x,
        y: points[1].y - rect.height
      });
      points.push({
        x: points[0].x,
        y: points[2].y
      });

      return points;
    },

    //获得矩形点坐标中心
    getPointsCenter : function (points) {
      var center = {
        x: (points[0].x + points[2].x) / 2,
        y: (points[0].y + points[2].y) / 2,
      }
      return center;
    },
  }
})