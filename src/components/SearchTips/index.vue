<template>
  <div class="searchTips">
    <div class="tipsCont fl">
      <div class="cont-left fl">
        <span class="textW fl">已选条件：</span>
        <div class="allSpice fl" :style="{width:widthData}">
          <p ref="spiceAll" :style="{width:widthData1}" style="margin:0;transition: margin 0.2s;">
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">121</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
            <span class="spiceTips">羊安水厂</span>
          </p>
        </div>
      </div>
      <div class="cont-right fr">
        <i class="icon iconfont" @click="leftEnter">&#xe678;</i>
        <i class="icon iconfont" @click="rightEnter">&#xe683;</i>
      </div>
    </div>
    <div class="tipsBtn fr">
      <i class="icon iconfont">&#xe678;</i>
      <i class="icon iconfont">&#xe683;</i>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchTips",
  //   props: {
  //     searchName: {
  //       type: Object,
  //       default: function() {
  //         return {};
  //       }
  //     }
  //   }
  data() {
    return {
      widthData: null,
      widthData1: '3000px',
      w: "200px",
      num: 0
    };
  },
  methods: {
    rightEnter() {
      //  var tag= document.getElementsByTagName("allSpice")[0]
      this.$refs.spiceAll.style.position = "relative";
      this.num = this.num + 200;
      this.$refs.spiceAll.style.marginLeft = "-" + this.num + "px";
    },
    leftEnter() {
      //  var tag= document.getElementsByTagName("allSpice")[0]
      this.$refs.spiceAll.style.position = "relative";
      this.num = this.num - 200;
      this.$refs.spiceAll.style.marginLeft = "-" + this.num + "px";
    }
  },
  mounted() {
    var w = document.getElementsByClassName("searchTips")[0].offsetWidth;
    var w1 = document.getElementsByClassName("tipsBtn")[0].offsetWidth;
    var w2 = document.getElementsByClassName(" cont-right")[0].offsetWidth;
    this.widthData = w - w1 - w2 - 80+"px";
    console.log(this.widthData);
    console.log(w, w1, w2);
  }
};
</script>
<style lang="scss" scoped>
.searchTips {
  margin: 0;
  overflow: hidden;
  padding-left: 5px;
  height: 34px;
  border: 1px solid rgba(216, 226, 231, 1);
  opacity: 1;
  line-height: 34px;
  .tipsCont {
    overflow: hidden;
    .textW {
      width: 65px;
    }
    .cont-left {
      font-size: 13px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 17px;
      color: rgba(119, 124, 130, 1);
      opacity: 1;
      line-height: 34px;
      overflow: hidden;
    }
    .allSpice {
      overflow: hidden;
      height: 34px;
      margin: 0;
      padding: 0;
    }
    .cont-right {
      position: absolute;
      right: 106px;
    }
    .spiceTips {
      padding: 0 5px;
      border: 1px solid rgba(188, 188, 188, 1);
    }
  }
  .tipsBtn {
    .icon {
        cursor: pointer;
      display: inline-block;
      width: 39px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-left: 1px solid rgba(216, 226, 231, 1);
      opacity: 1;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>