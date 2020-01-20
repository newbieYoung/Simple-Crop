const TransformationMatrix = require('./transformation-matrix.js');
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
    },
    uploadCallback: {
      type: Function,
      value: function(){}
    }
  },
  
  data: {
    cropContentStyle: '', // 裁剪图片样式
    lineationArr:[],
    statusBtns: {
      close: false,
      crop: false,
      around: false,
      reset: false,
    },
    curMoveX: 0,

    _multiPoint: false, // 是否开始多点触控
    originImage: null, // 初始图片
    $resultCanvas: null, // 裁剪结果
  },

  options: {
    scaleTimes: 1, // 缩放倍数
    _curMoveX: 0, // 旋转刻度盘位置当前偏移量
    _baseMoveX: 0, // 旋转刻度盘位置初始化偏移量
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
    $cropRotate: null,
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
    _initSize: '', // 裁剪图片初始尺寸
    _orientation: 1, // 默认方向
    originWidth: 0, // 初始图片宽度（考虑图片方向）
    originHeight: 0, // 初始图片高度（考虑图片方向）
    initContentPoints: [], // 图片初始顶点坐标
    contentPoints: [], //图片顶点坐标
    initScale: 1, // 初始缩放倍数
    maxScale: 1, // 最大缩放倍数
  },

  methods: {
    //整角旋转
    transform : function (rotateCover, scaleKeepCover) {
      var scaleNum = this.scaleTimes / this.times * this._rotateScale;
      var transform = '';
      transform += ' scale(' + scaleNum + ')'; //缩放
      transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
      transform += ' rotate(' + this.rotateAngle + 'deg)';

      if (scaleKeepCover) { //缩放时为了保证裁剪框不出现空白，需要在原有变换的基础上再进行一定的位移变换
        transform = this.getCoverTransform(transform, true);
        var scMat = this.getTransformMatrix(transform);
        this._contentCurMoveX = scMat.e;
        this._contentCurMoveY = scMat.f;
      }

      if (rotateCover) { //旋转时需要保证裁剪框不出现空白，需要在原有变换的基础上再进行一定的适配变换
        var rotatePoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
        var coverScale = this.getCoverRectScale(rotatePoints, this.cropPoints);
        var changedX = self._changedX;
        var curMoveX = self._curMoveX;
        var totalMoveX = curMoveX - changedX - this._baseMoveX;
        var rotateCenter = this.getPointsCenter(rotatePoints);
        var centerVec = {
          x: rotateCenter.x - this.cropCenter.x,
          y: rotateCenter.y - this.cropCenter.y
        }
        var percent = Math.abs(changedX) / Math.abs(totalMoveX);
        if (coverScale > 1) {
          this._rotateScale = this._rotateScale * coverScale;
          scaleNum = scaleNum * coverScale;
        } else if (this.vecLen(centerVec) < 1 && percent > 0) { //中心点接近重合时，旋转支持自适应缩小
          if (coverScale < (1 - percent)) { //不能突变
            coverScale = 1 - percent;
          }
          if (this._rotateScale * coverScale > 1) {
            this._rotateScale = this._rotateScale * coverScale;
          } else { //不能影响 scaleTimes
            this._rotateScale = 1;
            coverScale = 1;
          }
          scaleNum = scaleNum * coverScale;
        }
      }

      //操作变换
      transform = '';
      transform += ' scale(' + scaleNum + ')'; //缩放
      transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
      transform += ' rotate(' + this.rotateAngle + 'deg)';
      var style = this._initSize + this._initPosition + this._initTransform + transform;
      this.setData({
        cropContentStyle: style
      });
      this.contentPoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
    },

    //获得矩形点坐标中心
    getPointsCenter : function (points){
      var center = {
        x: (points[0].x + points[2].x) / 2,
        y: (points[0].y + points[2].y) / 2,
      }
      return center;
    },

    //计算一个矩形刚好包含另一个矩形需要的缩放倍数
    getCoverRectScale : function (outer, inner){
      var scale = 0;
      for (var i = 0; i < inner.length; i++) {
        var num = this.getCoverPointScale(inner[i], outer);
        if (num > scale) {
          scale = num;
        }
      }
      return scale;
    },

    //计算图片内容刚好包含裁剪框的transform变换
    getCoverTransform : function (transform, onlyTranslate){
      var cRect = this.getCoveRect(this.cropPoints, this.rotateAngle);
      onlyTranslate = onlyTranslate ? onlyTranslate : false;

      //计算放大倍数
      var uScale = 1; //水平缩放倍数和垂直缩放倍数
      var rScale = 1;
      var cup = {
        x: this.contentPoints[1].x - this.contentPoints[2].x,
        y: this.contentPoints[1].y - this.contentPoints[2].y
      }
      var cright = {
        x: this.contentPoints[1].x - this.contentPoints[0].x,
        y: this.contentPoints[1].y - this.contentPoints[0].y
      }
      var tup = {
        x: cRect[1].x - cRect[2].x,
        y: cRect[1].y - cRect[2].y
      }
      var tright = {
        x: cRect[1].x - cRect[0].x,
        y: cRect[1].y - cRect[0].y
      }
      var uAng = this.vecAngle(cup, tup);
      if (Math.abs(180 - uAng) < Math.abs(90 - uAng) || Math.abs(0 - uAng) < Math.abs(90 - uAng)) { //更接近180或者0
        uScale = this.vecLen(tup) / this.vecLen(cup);
        rScale = this.vecLen(tright) / this.vecLen(cright);
      } else {
        uScale = this.vecLen(tup) / this.vecLen(cright);
        rScale = this.vecLen(tright) / this.vecLen(cup);
      }
      uScale = uScale < 1 ? 1 : uScale;
      rScale = rScale < 1 ? 1 : rScale;

      var scale = uScale > rScale ? uScale : rScale;

      if (onlyTranslate && scale > 1) {
        return transform;
      }

      //复制坐标
      var scalePoints = [];
      for (var i = 0; i < this.contentPoints.length; i++) {
        scalePoints.push({
          x: this.contentPoints[i].x,
          y: this.contentPoints[i].y
        });
      }

      //计算放大后的新坐标
      if (scale > 1) {
        transform += 'scale(' + scale + ')';
        this._rotateScale = this._rotateScale * scale;
        scalePoints = this.getTransformPoints('scaleY(-1)' + transform, this.initContentPoints);
      }

      //位移变换
      var scaleNum = this.scaleTimes / this.times * this._rotateScale;
      var count = 0;
      var self = this;
      var outDetails = [];
      do {
        //找出裁剪框超出的顶点
        outDetails = this.getOutDetails(this.cropPoints, scalePoints);
        if (outDetails.length > 0) {
          count++;
          outDetails.sort(function (a, b) { //找出距离最远的点
            var aLen = self.vecLen(a.iv);
            var bLen = self.vecLen(b.iv);
            if (aLen < bLen) {
              return 1;
            }
            if (aLen > bLen) {
              return -1;
            }
            return 0;
          });

          //开始移动
          var maxFarOut = outDetails[0];
          var maxFarPcv = maxFarOut.pcv;

          //计算X轴位移
          uAng = this.vecAngle(maxFarPcv.up, maxFarPcv.uproj);
          var uLen = this.vecLen(maxFarPcv.uproj);
          var moveY = 0;

          //if(uAng == 0){ //同方向
          if (Math.abs(uAng) < 90) { //浮点数精度问题，接近0时小于90 ，接近180时大于90
            moveY = -uLen * maxFarOut.uOver;
          } else {
            moveY = uLen * maxFarOut.uOver;
          }
          if (moveY != 0) {
            transform += ' translateY(' + moveY / scaleNum + 'px)';
          }

          //计算Y轴位移
          var rAng = this.vecAngle(maxFarPcv.right, maxFarPcv.rproj);
          var rLen = this.vecLen(maxFarPcv.rproj);
          var moveX = 0;

          if (Math.abs(rAng) < 90) { //同方向
            moveX = rLen * maxFarOut.rOver;
          } else {
            moveX = -rLen * maxFarOut.rOver;
          }
          if (moveX != 0) {
            transform += ' translateX(' + moveX / scaleNum + 'px)';
          }

          //计算位移后的新坐标
          if (moveX != 0 || moveY != 0) {
            for (i = 0; i < scalePoints.length; i++) {
              scalePoints[i].x = scalePoints[i].x + maxFarOut.iv.x,
                scalePoints[i].y = scalePoints[i].y + maxFarOut.iv.y;
            }
          }
        }
      } while (count < 2 && outDetails.length > 0)

      return transform;
    },

    //计算新的变换坐标
    getTransformPoints : function (transform, points){
      var matrix = this.getTransformMatrix(transform);
      var nPoints = [];
      for (var i = 0; i < points.length; i++) {
        var item = {
          x: points[i].x,
          y: points[i].y
        };
        item = TransformationMatrix.applyToPoint(matrix, item);
        nPoints.push(item);
      }
      nPoints.reverse(); //顶点顺序发生了变化，需要颠倒

      return nPoints;
    },

    //获取 css transform 属性对应的矩形形式
    getTransformMatrix : function (transform){
      var transforms = transform.split(' ');
      var params = [];
      for (var i = 0; i < transforms.length; i++) {
        if (transforms[i].trim() != '') { // 不能为空
          var func = this.getTransformFunctionName(transforms[i]);
          var result;
          if (func.name != 'rotate') {
            result = TransformationMatrix[func.name](func.params[0], func.params[1]);
          } else {
            result = TransformationMatrix[func.name](func.params[0]);
          }
          params.push(result);
        }
      }

      return TransformationMatrix.compose(params);
    },

    //根据 css transform 属性获取 transformation-matrix 对应的函数名称以及参数
    getTransformFunctionName : function (transform){
      var start = transform.indexOf('(');
      var end = transform.indexOf(')');
      var func = {};

      //参数
      var params = transform.substring(start + 1, end).split(',');
      var arr = [];
      for (var i = 0; i < params.length; i++) {
        arr.push(parseFloat(params[i]));
      }
      func.params = arr;

      //名称
      var name = transform.substring(0, start).toLowerCase();
      var defParams = 0;//默认参数
      if (name.indexOf('scale') != -1) {
        func.name = 'scale';
        defParams = 1;
      } else if (name.indexOf('translate') != -1) {
        func.name = 'translate';
      } else if (name.indexOf('skew') != -1) {
        func.name = 'skewDEG';
      } else if (name.indexOf('rotate') != -1) {
        func.name = 'rotateDEG'; // 角度
      }

      //加入默认参数
      if (name.indexOf('x') != -1) {
        func.params.push(defParams);
      } else if (name.indexOf('y') != -1) {
        func.params.unshift(defParams);
      } else if (name.indexOf('rotate') == -1 && func.params.length <= 1) { // 除了 rotate 其它函数支持 x、y 两个参数，如果 css transform 属性参数只有一个则另一个参数也是如此。
        func.params.push(func.params[0]);
      }

      return func;
    },

    //计算向量夹角
    vecAngle : function (vec1, vec2){
      var acos = (vec1.x * vec2.x + vec1.y * vec2.y) / (this.vecLen(vec1) * this.vecLen(vec2));
      if (Math.abs(acos) > 1) { //因为浮点数精度结果有可能超过1，Math.acos(1.0000001) = NaN
        acos = acos > 0 ? 1 : -1;
      }
      var rad = Math.acos(acos);
      var angle = rad * 180 / Math.PI;
      return angle;
    },

    //计算向量的模
    vecLen : function(vec){
      return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    },

    //获取刚好包含某个矩形的新矩形
    getCoveRect : function(rect, angle){
      if (angle < 0) {
        angle = 90 + angle % 90;
      } else {
        angle = angle % 90;
      }
      var rad = angle / 180 * Math.PI;

      var up = {
        x: rect[1].x - rect[2].x,
        y: rect[1].y - rect[2].y
      }
      var right = {
        x: rect[1].x - rect[0].x,
        y: rect[1].y - rect[0].y
      }
      var rLen = this.vecLen(right);
      var uLen = this.vecLen(up);

      var nRect = [];
      nRect[0] = {};
      nRect[0].x = rect[0].x + rLen * Math.sin(rad) * Math.sin(rad);
      nRect[0].y = rect[0].y + rLen * Math.sin(rad) * Math.cos(rad);

      nRect[1] = {};
      nRect[1].x = rect[1].x + uLen * Math.sin(rad) * Math.cos(rad);
      nRect[1].y = rect[1].y - uLen * Math.sin(rad) * Math.sin(rad);

      nRect[2] = {};
      nRect[2].x = rect[2].x - rLen * Math.sin(rad) * Math.sin(rad);
      nRect[2].y = rect[2].y - rLen * Math.sin(rad) * Math.cos(rad);

      nRect[3] = {};
      nRect[3].x = rect[3].x - uLen * Math.sin(rad) * Math.cos(rad);
      nRect[3].y = rect[3].y + uLen * Math.sin(rad) * Math.sin(rad);

      return nRect;
    },

    // 初始化旋转刻度盘
    initRotateSlider : function (startAngle, endAngle, gapAngle){
      var lineationArr = [];
      for (var i = startAngle; i <= endAngle; i += gapAngle) {
        lineationArr.push(i)
      }
      this.setData({
        lineationArr: lineationArr,
      });
    },

    // 初始化功能按钮
    initFuncBtns : function (funcBtns){
      var statusBtns = {
        close: false,
        crop: false,
        around: false,
        reset: false,
      };
      for(var i=0;i<funcBtns.length;i++){
        statusBtns[funcBtns[i]] = true;
      }
      this.setData({
        statusBtns: statusBtns
      });
    },

    // 微信小程序图片方向转换数字表示
    orientationToNumber : function(name){
      var num = 1; //默认方向
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

    //初始化相关子元素
    initChilds : function(callbacks){
      var rotateSlider = this.data.rotateSlider;
      var lineationItemWidth = this.data.lineationItemWidth;
      var endAngle = this.data.endAngle;
      var startAngle = this.data.startAngle;
      var gapAngle = this.data.gapAngle;

      var call_count = 0; // 回调计数器
      var total_count = 0;
      this._initPosition = 'position:absolute; left:50%; top:50%;';
      this._initTransform = 'transform:translate3d(-50%,-50%,0)';

      var self = this;
      this.$cropMask = this.createSelectorQuery().select('#' + S_ID + ' .crop-mask');
      total_count++;
      this.$cropMask.boundingClientRect(function (rect) {
        self.maskViewSize = {
          width: rect.width,
          height: rect.height,
        }

        // callback
        call_count++;
        if (call_count >= total_count) {
          self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
          self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;

          for (var i=0;i<callbacks.length;i++){
            callbacks[i].bind(self)(); 
          }
        }
      }).exec();

      this.$cropCover = this.createSelectorQuery().select('#' + S_ID + ' .crop-cover');
      total_count++;
      this.$cropCover.node().exec(function (res) {
        self.$cropCover = res[0].node;
        self.cropCoverContext = self.$cropCover.getContext('2d');

        // callback
        call_count++;
        if (call_count >= total_count) {
          self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
          self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;

          for (var j = 0; j < callbacks.length; j++) {
            callbacks[j].bind(self)();
          }
        }
      });

      if (rotateSlider){
        this.$cropRotate = this.createSelectorQuery().select('#' + S_ID + ' .crop-rotate');
        total_count++;
        this.$cropRotate.boundingClientRect(function (rect) {
          var lineationWidth = lineationItemWidth * ((endAngle - startAngle) / gapAngle + 1);
          var rotateWidth = rect.width;
          self._baseMoveX = -(lineationWidth / 2 - rotateWidth / 2);

          // callback
          call_count++;
          if (call_count >= total_count) {
            self.$cropCover.width = self.maskViewSize.width * SystemInfo.pixelRatio;
            self.$cropCover.height = self.maskViewSize.height * SystemInfo.pixelRatio;

            for (var j = 0; j < callbacks.length; j++) {
              callbacks[j].bind(self)();
            }
          }
        }).exec();
      }
    },

    //设置裁剪图片
    setImage : function(image){
      if(image != null && image != ''){
        var type = Object.prototype.toString.call(image);
        if (type === '[object String]') { // 字符串
          this.load();
          this.data.uploadCallback.bind(this)();
        }
      }
    },

    //加载图片
    load : function(){
      var self = this;
      var src = this.data.src;
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
          self._initSize = 'width:'+self.originWidth+'px;height:'+self.originHeight+'px;';
          self.init();
        }
      })
    },

    //初始化
    init : function(){
      var width = this.originWidth/2;
      var height = this.originHeight/2;
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
      var size = this.data.size;
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
    reset : function(){
      var positionOffset = this.data.positionOffset;
      var rotateSlider = this.data.rotateSlider;

      this.startControl();
      this._rotateScale = 1;
      this._baseAngle = 0;
      this.rotateAngle = 0;
      this._contentCurMoveX = -positionOffset.left;
      this._contentCurMoveY = -positionOffset.top;

      if(rotateSlider){
        this._curMoveX = this._baseMoveX;
        this.setData({
          curMoveX: -this._curMoveX
        });
      }
      this.scaleTimes = this.initScale;
      this.transform();
      this.endControl();
    },

    //操作开始
    startControl : function(point){
      if(!this._isControl){
        this._isControl = true;
        this._downPoint = point ? point : [];
      }
    },

    //操作结束
    endControl : function(){
      if(this._isControl){
        var self = this;
        this._isControl = false;
        this._downPoint = [];
        this.scaleDownX = 0;

        if (!this.isWholeCover(this.contentPoints, this.cropPoints)) { //如果没有完全包含则需要进行适配变换
          var scaleNum = this.scaleTimes / this.times * this._rotateScale;
          var transform = '';
          transform += ' scale(' + scaleNum + ')'; //缩放
          transform += ' translateX(' + this._contentCurMoveX / scaleNum + 'px) translateY(' + this._contentCurMoveY / scaleNum + 'px)'; //移动
          transform += ' rotate(' + this.rotateAngle + 'deg) ';

          //适配变换
          var coverTr = this.getCoverTransform(transform);
          var coverMat = this.getTransformMatrix(coverTr);
          this._contentCurMoveX = coverMat.e;
          this._contentCurMoveY = coverMat.f;
          this.contentPoints = this.getTransformPoints('scaleY(-1)' + coverTr, this.initContentPoints);

          var style = this._initSize + this._initPosition + this._initTransform + coverTr;
          this.setData({
            cropContentStyle: style
          });
        }
      }
    },

    //判断 矩形A 是否完全包含 矩形B
    isWholeCover : function(rectA, rectB){
      for (var i = 0; i < rectB.length; i++) {
        if (!this.isPointInRectCheckByLen(rectB[i], rectA)) {
          return false;
        }
      }
      return true;
    },

    //根据矩形中心到某一点向量在矩形边框向量的投影长度判断该点是否在矩形内
    isPointInRectCheckByLen : function (point, rectPoints){
      var pcv = this.getPCVectorProjOnUpAndRight(point, rectPoints);

      var precision = 100; //保留两位小数

      var uLen = Math.round(this.vecLen(pcv.uproj) * precision);
      var height = Math.round(this.vecLen(pcv.up) / 2 * precision);
      var rLen = Math.round(this.vecLen(pcv.rproj) * precision);
      var width = Math.round(this.vecLen(pcv.right) / 2 * precision);

      if (uLen <= height && rLen <= width) {
        return true;
      } else {
        return false;
      }
    },

    //计算矩形中心到某点的向量在矩形自身坐标系上方向和右方向上的投影向量
    getPCVectorProjOnUpAndRight : function (point, rectPoints){
      //计算矩形自身坐标系的上方向向量和右方向向量
      var up = {
        x: rectPoints[1].x - rectPoints[2].x,
        y: rectPoints[1].y - rectPoints[2].y
      }
      var right = {
        x: rectPoints[1].x - rectPoints[0].x,
        y: rectPoints[1].y - rectPoints[0].y
      }

      //计算矩形中心点
      var center = this.getPointsCenter(rectPoints);
      var line = {
        x: point.x - center.x,
        y: point.y - center.y
      }

      var uproj = this.getProjectionVector(line, up);
      var rproj = this.getProjectionVector(line, right);

      return {
        up: up,
        uproj: uproj,
        right: right,
        rproj: rproj
      };
    },

    //计算向量 a 在向量 b 上的投影向量
    getProjectionVector : function (vecA, vecB){
      var bLen = this.vecLen(vecB);
      var ab = vecA.x * vecB.x + vecA.y * vecB.y;

      var proj = {
        x: ab / Math.pow(bLen, 2) * vecB.x,
        y: ab / Math.pow(bLen, 2) * vecB.y,
      }

      return proj
    },

    //根据裁剪图片目标尺寸、裁剪框显示比例、裁剪框偏移更新等参数更新并重现绘制裁剪框
    updateFrame : function(){
      var size = this.data.size;
      var cropSizePercent = this.data.cropSizePercent;
      var positionOffset = this.data.positionOffset;

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
      var coverColor = this.data.coverColor;
      var borderColor = this.data.borderColor;
      var boldCornerLen = this.data.boldCornerLen * SystemInfo.pixelRatio;
      var borderWidth = this.data.borderWidth;

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

      if (boldCornerLen > 0) {
        //边框四个角加粗
        var cornerRectWidth = boldCornerLen;
        var cornerRectHeight = boldCornerLen;
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

    //滑动旋转刻度盘
    scrollLineation: function(){

    },
  },

  lifetimes: { // 组件生命周期
    created: function () {
      // 在 created 生命周期中查看 this.data 数据时为默认值
    },
    attached: function () {
      console.log('attached');
      this.borderDraw = this.data.borderDraw ? this.data.borderDraw.bind(this) : this.defaultBorderDraw;
      this.maxScale = this.data.maxScale ? this.data.maxScale : 1; //最大缩放倍数，默认为原始尺寸

      this.initRotateSlider(this.data.startAngle, this.data.endAngle, this.data.gapAngle);
      this.initFuncBtns(this.data.funcBtns);
      this.initChilds([this.updateFrame, this.setImage]);
    }
  },

  //数据监听器
  observers: {
    'src': function (src) {
      this.setImage(src);
    },
    'startAngle, endAngle, gapAngle': function (startAngle, endAngle, gapAngle) {
      this.initRotateSlider(startAngle, endAngle, gapAngle);
    },
    'funcBtns': function (funcBtns){
      this.initFuncBtns(funcBtns);
    },
  },
})