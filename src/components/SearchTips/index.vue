<template>
  <div class="searchTips">
    <div class="tipsCont fl">
      <div class="cont-left fl">
        <span class="textW fl">已选条件：</span>
        <div class="allSpice fl" :style="{width:widthData}">
          <p ref="spiceAll" :style="{width:widthData1}" style="margin:0;transition: margin 0.2s;">
            <span v-for="item in tipsData" class="spiceTips">
              {{item.seachName+":"}}{{item.name}}
              <i
                class="icon iconfont"
                @click="delTips(item.model)"
              >&#xe68a;</i>
            </span>
          </p>
        </div>
      </div>
      <div class="cont-right fr" v-if="showBtn">
        <i class="icon iconfont" @click="leftEnter">&#xe65a;</i>
        <i class="icon iconfont" @click="rightEnter">&#xe65f;</i>
      </div>
    </div>
    <div class="tipsBtn fr">
      <i v-if="showExcel" class="icon iconfont" @click="excel" title="导出excel">&#xe64f;</i>
      <i
        class="icon iconfont"
        :class="{thisTableClass:thisTable}"
        @click="setCustomData"
        title="自定义表格"
      >&#xe64a;</i>
    </div>
    <table-custom ref="myChild" class="table-custom" />
  </div>
</template>
<script>
import TableCustom from "@/components/TableCustom/index"; //自定义表格
export default {
  name: "SearchTips",
  components: { TableCustom },
  props: {
    tipsData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    tipsData() {
      const length = this.tipsData.length;
      this.tipsDataCopy = this.tipsData;
      if (length == 0) {
        this.widthData1 = null;
        this.showBtn = false;
      } else {
        this.widthData1 = length * 150;
        if (this.widthData1 < this.widthData) {
          this.showBtn = true;
        }
      }
    }
  },
  data() {
    return {
      widthData: null,
      widthData1: null,
      w: "200px",
      num: 0,
      thisTable: false,
      tipsDataCopy: [],
      showBtn: false,
      showExcel: true //是否有导出按钮
    };
  },
  methods: {
    //表格自定义方法
    setCustomData() {
      this.thisTable = !this.thisTable;
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      // this.customHeight = this.$refs.myChild.isCustom;
    },
    excel() {
      //导出
      this.$emit("excel");
    },
    getArrData(val, model, arr, name) {
      let obj = {};
      let obj1 = {};
      obj1.model = model;
      obj1.seachName = name;
      if (arr) {
        if (val == "-1") {
          obj1.name = "全部";
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].Id == val) {
              obj = arr[i];
              obj1.name = obj.Name;
            }
          }
        }
      } else {
        obj1.name = val;
      }
      return obj1;
    },
    delTips(val) {
      this.$emit("delTips", val);
    },
    rightEnter() {
      this.num = this.num + 200;

      //  var tag= document.getElementsByTagName("allSpice")[0]
      if (this.num >= this.widthData1) {
        this.num = 0;
        return false;
      }
      this.$refs.spiceAll.style.position = "relative";
      this.$refs.spiceAll.style.marginLeft = "-" + this.num + "px";
    },
    leftEnter() {
      this.num = this.num - 200;
      if (this.num <= 0) {
        this.num = 0;
        return false;
      }
      //  var tag= document.getElementsByTagName("allSpice")[0]
      this.$refs.spiceAll.style.position = "relative";
      this.$refs.spiceAll.style.marginLeft = "-" + this.num + "px";
    },
    getWidth() {
      var w = document.getElementsByClassName("searchTips")[0].offsetWidth;
      var w1 = document.getElementsByClassName("tipsBtn")[0].offsetWidth;
      this.widthData = w - w1 - 150 + "px";
      // console.log(document.getElementsByClassName("el-main")[0].offsetWidth);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getWidth();
    });
  }
};
</script>
<style lang="scss" scoped>
.searchTips {
  user-select: none;
  margin: 0;
  overflow: hidden;
  padding-left: 5px;
  height: 34px;
  border: 1px solid rgba(216, 226, 231, 1);
  opacity: 1;
  line-height: 34px;
  .icon:hover {
    color: #00b2a1 !important;
    cursor: pointer;
  }
  .table-custom {
    margin-top: 33px;
  }
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
      cursor: pointer;
      .icon {
        font-size: 22px;
        color: #808080;
      }
    }
    .spiceTips {
      padding: 2px 5px;
      border: 1px solid rgba(188, 188, 188, 1);
      margin-right: 5px;
      border-radius: 2px;
      font-size: 12px;
      line-height: 22px;
      .icon {
        // line-height: 22px;
        font-size: 12px;
      }
    }
  }
  .tipsBtn {
    position: relative;
    top: -1px;
    .icon {
      cursor: pointer;
      float: left;
      color: #808080;
      width: 34px;
      height: 34px;
      background: rgba(255, 255, 255, 1);
      border-left: 1px solid rgba(216, 226, 231, 1);
      opacity: 1;
      font-size: 14px;
      text-align: center;
    }

    .thisTableClass {
      color: #00b2a1;
    }
  }
}
</style>