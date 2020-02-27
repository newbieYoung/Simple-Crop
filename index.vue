<template></template>

<script>
import Core from "./index.js";

export default {
  _instance: null, //组件实例

  props: ["cropParams"],

  mounted() {
    this.cropParams.cropCallback = this.cropCallback.bind(this);
    this.cropParams.uploadCallback = this.uploadCallback.bind(this);
    this.cropParams.closeCallback = this.closeCallback.bind(this);
    this._instance = new Core(this.cropParams);
  },

  methods: {
    //关闭回调
    closeCallback() {
      this.$emit("close");
    },

    //上传图片回调
    uploadCallback() {
      let src = this._instance ? this._instance.src : this.cropParams.src;
      this.$emit("upload", src);
    },

    //裁剪回调
    cropCallback() {
      let $resultCanvas = this._instance ? this._instance.$resultCanvas : null;
      this.$emit("crop", $resultCanvas);
    },

    //属性是否发生变化
    hasChanged(names, props) {
      let cur = {};
      let prev = {};
      for (let i = 0; i < names.length; i++) {
        let item = names[i];
        cur[item] = this.cropParams[item];
        prev[item] = props[item];
      }
      return !this.isEquivalent(cur, prev, names);
    },

    //根据两个简单对象的值比较它们是否相同
    isEquivalent(a, b, include) {
      if (a != null && b != null) {
        let aProps = [];
        let aTemps = Object.getOwnPropertyNames(a);
        let bProps = [];
        let bTemps = Object.getOwnPropertyNames(b);

        //只考虑 include
        if (include instanceof Array) {
          // 数组
          for (let i = 0; i < include.length; i++) {
            let item = include[i];
            if (aTemps.includes(item)) {
              aProps.push(item);
            }
            if (bTemps.includes(item)) {
              bProps.push(item);
            }
          }
        } else if (include instanceof RegExp) {
          //正则
          for (let i = 0; i < aTemps.length; i++) {
            let item = aTemps[i];
            if (include.test(item)) {
              aProps.push(item);
            }
          }
          for (let i = 0; i < bTemps.length; i++) {
            let item = bTemps[i];
            if (include.test(item)) {
              bProps.push(item);
            }
          }
        } else {
          aProps = aTemps;
          bTemps = bTemps;
        }

        if (aProps.length != bProps.length) {
          return false;
        }

        for (let i = 0; i < aProps.length; i++) {
          let propName = aProps[i];
          if (a[propName] !== b[propName]) {
            return false;
          }
        }

        return true;
      } else if (a === b) {
        return true;
      } else {
        return false;
      }
    }
  },

  //监听参数变化
  watch: {
    cropParams(val, oldVal) {
      if (this._instance) {
        if (this.hasChanged(["src"], oldVal)) {
          this._instance.setImage(this.cropParams.src);
        }

        if (
          this.hasChanged(
            [
              "rotateSlider",
              "startAngle",
              "endAngle",
              "gapAngle",
              "lineationItemWidth"
            ],
            oldVal
          )
        ) {
          this._instance.initRotateSlider(this.cropParams);
        }

        if (
          this.hasChanged(["cropSizePercent"], oldVal) ||
          !this.isEquivalent(
            this.cropParams.positionOffset,
            oldVal.positionOffset,
            ["top", "left"]
          ) ||
          !this.isEquivalent(this.cropParams.size, oldVal.size, [
            "width",
            "height"
          ])
        ) {
          this._instance.updateBox(this.cropParams);
        }

        if (
          this.hasChanged(
            [
              "borderWidth",
              "borderColor",
              "boldCornerLen",
              "coverColor",
              "borderDraw",
              "coverDraw"
            ],
            oldVal
          )
        ) {
          this._instance.initBoxBorder(this.cropParams);
        }

        if (
          !this.isEquivalent(
            this.cropParams.funcBtns,
            oldVal.funcBtns,
            /^[0-9]*$/
          )
        ) {
          this._instance.initFuncBtns(this.cropParams);
        }

        if (this.hasChanged(["scaleSlider", "maxScale"], oldVal)) {
          this._instance.initScaleSlider(this.cropParams);
        }

        if (this.hasChanged(["title"], oldVal)) {
          this._instance.initTitle(this.cropParams);
        }

        if (this.cropParams.visible == false) {
          this._instance.hide();
        } else {
          this._instance.show();
        }
      }
    }
  }
};
</script>

<style scoped>
</style>