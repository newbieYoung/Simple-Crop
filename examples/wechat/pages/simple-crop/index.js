const S_ID = 'simple_crop';
const SystemInfo = wx.getSystemInfoSync(); //  系统信息

Component({
  properties: {
    src: { // 图片地址
      type: String,
      value: null
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
    boldCornerLen: { // 裁剪框边角加粗长度
      type: Number,
      value: 12,
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
    cropContentStyle: '', // 裁剪图片样式
    lineationArr:[],

    _multiPoint: false, // 是否开始多点触控
    _baseMoveX: 0, // 旋转刻度盘位置初始化偏移量
    scaleTimes: 1, // 缩放倍数
    originImage: null, // 初始图片
    $resultCanvas: null, // 裁剪结果
  },

  options: {
    _contentCurMoveX: 0, // 图片 X 轴方向上的总位移
    _contentCurMoveY: 0, // 图片 Y 轴方向上的总位移
    _baseAngle: 0,
    rotateAngle: 0, // 旋转角度
    _rotateScale: 1, // 旋转缩放倍数
    _downPoint: [], // 操作点坐标
    _isControl: false, // 是否正在操作
    borderDraw: null, // 裁剪框自定义边框绘制函数
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
    _initPosition: '', // 裁剪图片初始定位
    _initTransform: '', // 裁剪图片初始位移
    _orientation: 1, // 默认方向
    originWidth: 0, // 初始图片宽度（考虑图片方向）
    originHeight: 0, // 初始图片高度（考虑图片方向）
    initContentPoints: [], // 图片初始顶点坐标
    contentPoints: [], //图片顶点坐标
    initScale: 1, // 初始缩放倍数
    maxScale: 1, // 最大缩放倍数
  },

  lifetimes: { // 组件生命周期
    created: function () {
      // 在 created 生命周期中查看 this.data 数据时为默认值
    },
    attached: function(){
      console.log('attached');
      this.borderDraw = this.data.borderDraw ? this.data.borderDraw.bind(this) : this.defaultBorderDraw;
      this.maxScale = this.data.maxScale;
      
      this.initRotateSlider(this.data.startAngle, this.data.endAngle, this.data.gapAngle);
      this.initComponent([this.updateFrame, this.setImage]);
    }
  },

  //数据监听器
  observers: {
    'src': function (src) {
      this.setImage(src);
    },
    'startAngle, endAngle, gapAngle': function (startAngle, endAngle, gapAngle){
      this.initRotateSlider(startAngle, endAngle, gapAngle);
    }
  },

  methods: {
    // 初始化旋转刻度盘
    initRotateSlider: function (startAngle, endAngle, gapAngle){
      let lineationArr = [];
      for (let i = startAngle; i <= endAngle; i += gapAngle) {
        lineationArr.push(i)
      }
      this.setData({
        lineationArr: lineationArr,
      });
    },
    // 微信小程序图片方向转换数字表示
    orientationToNumber: function(name){
      let num = 1; //默认方向
      switch(name){
        case 'up-mirrored':
          num = 2;
          break;
        case 'down':
          num = 3;
          break;
        case 'down-mirrored':
          num = 4;
          break;
        case 'left-mirrored':
          num = 5;
          break;
        case 'right':
          num = 6;
          break;
        case 'right-mirrored':
          num = 7;
          break;
        case 'left':
          num = 8;
          break;
        case 'up':
        default:
          num = 1;
          break;
      }
      return num;
    },
    //初始化组件
    initComponent: function(callbacks){
      let call_count = 0; // 回调计数器
      this._initPosition = 'position:absolute; left:50%; top:50%;';
      this._initTransform = 'transform:translate3d(-50%,-50%,0);';

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

          for(let i=0;i<callbacks.length;i++){
            callbacks[i].bind(self)(); 
          }
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

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i].bind(self)();
          }
        }
      });

      this.$cropContent = this.createSelectorQuery().select('#' + S_ID + ' .crop-content');
    },

    //设置裁剪图片
    setImage: function(image){
      if(image != null && image != ''){
        let type = Object.prototype.toString.call(image);
        if (type === '[object String]') { // 字符串
          this.load();
        }
      }
    },

    //加载图片
    load: function(){
      let self = this;
      let src = this.data.src;
      wx.getImageInfo({
        src: src,
        success(res) {
          self._orientation = self.orientationToNumber(res.orientation);
          self.originWidth = res.width;
          self.originHeight = res.height;
          if(self._orientation > 4){
            self.originWidth = self.height;
            self.originHeight = self.width;
          }
          self.init();
        }
      })
    },

    //初始化
    init: function(){
      let style = this._initPosition + this._initTransform;
      this.setData({
        cropContentStyle: style
      });

      let width = this.originWidth/2;
      let height = this.originHeight/2;
      this.initContentPoints = [{
        x: -width,
        y: height
      }, {
        x: width,
        y: height
      }, {
        x: width,
        y: -height
      }, {
        x: -width,
        y: -height
      }];
      this.contentPoints = this.initContentPoints.slice();

      //计算初始缩放倍数
      let size = this.data.size;
      if (size.width / size.height > this.originWidth / this.originHeight) {
        this.initScale = size.width / this.originWidth;
      } else {
        this.initScale = size.height / this.originHeight;
      }
      this.maxScale = this.initScale < this.maxScale ? this.maxScale : Math.ceil(this.initScale);

      //重置动态操作变量
      this.reset();
    },

    //重置
    reset: function(){
      let positionOffset = this.data.positionOffset;
      let rotateSlider = this.data.rotateSlider;

      this.startControl();
      this._rotateScale = 1;
      this._baseAngle = 0;
      this.rotateAngle = 0;
      this._contentCurMoveX = -positionOffset.left;
      this._contentCurMoveY = -positionOffset.top;

      if(rotateSlider){

      }
    },

    //操作开始
    startControl: function(point){
      if(!this._isControl){
        this._isControl = true;
        this._downPoint = point ? point : [];
      }
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
      let boldCornerLen = this.data.boldCornerLen * SystemInfo.pixelRatio;
      let borderWidth = this.data.borderWidth;

      this.cropCoverContext.clearRect(0, 0, this.$cropCover.width, this.$cropCover.height);
      this.cropCoverContext.fillStyle = coverColor;
      this.cropCoverContext.fillRect(0, 0, this.$cropCover.width, this.$cropCover.height);
      this.cropCoverContext.fillStyle = borderColor;

      //绘制边框（边框内嵌）
      let borderRect = {
        left: this.cropRect.left * SystemInfo.pixelRatio,
        top: this.cropRect.top * SystemInfo.pixelRatio,
        width: this.cropRect.width * SystemInfo.pixelRatio,
        height: this.cropRect.height * SystemInfo.pixelRatio
      }
      this.cropCoverContext.fillRect(borderRect.left, borderRect.top, borderRect.width, borderRect.height);

      if (boldCornerLen > 0) {
        //边框四个角加粗
        let cornerRectWidth = boldCornerLen;
        let cornerRectHeight = boldCornerLen;
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