<template>
  <div class="section-container">
    <div class="waterFactory-box">
      <span>水厂：</span>
      <el-select
        size="small"
        v-model="waterFactory"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </div>
    <!-- 配置 -->
    <div class="bottom-box">
      <!-- 循环年 s-->
      <div class="year-box" v-for="(item,i) in arr">
        <div class="year-box-border display-flex align-items-center justify-content-flex-justify">
          <div>{{item.year}}</div>
          <div class="year-button display-flex align-items-center">
            <span @click="item.show =true">
              <i class="iconfont iconsuoyoubiaogelidebianji"></i>
              <span style="margin:0 10px 0 5px;">编辑</span>
            </span>
            <i class="iconfont iconjianqu3" v-show="!item.allShow" style="font-size:22px;" @click="item.allShow=true"></i>
            <i class="iconfont iconshouqi3" v-show="item.allShow" style="font-size:22px;" @click="item.allShow=false"></i>
          </div>
        </div>
        <!-- 循环月 -->
        <div class="display-flex align-items-center flex-wrap month-box-border" v-show="item.allShow">
          <!-- 1月 -->    
          <!-- 未编辑 -->
          <div
            class="month-line display-flex align-items-center"
            v-for="(n,index) in item.months"
            v-show="!item.show"
            :key="index"
          >
            <div class="month-box-bg">{{n.month}}月</div>
            <div class="display-flex flex-1" style="color:#777C82;">
              <div class="read-left-box">供水量（吨）</div>
              <div>123123</div>
            </div>
          </div>
          <!-- 编辑状态 -->
          <div
            class="month-line display-flex align-items-center"
            v-for="n in item.months"
            v-show="item.show"
            :key="n.month+11"
          >
            <div class="month-box-bg">{{n.month}}月</div>
            <div class="display-flex align-items-center flex-1" style="color:#777C82;">
              <div style="width:75px;text-align:center;">供水量</div>
              <el-input size="small"></el-input>
              <span style="padding:0 10px;">吨</span>
            </div>
          </div>
          <!-- 1月 -->
        </div>
        <div class="month-save-btn" v-show="item.show&&item.allShow">
          <el-button type="primary" size="mini" @click="saveMonth(i)">保存</el-button>
        </div>
      </div>
      <!-- 循环年e -->
    </div>
  </div>
</template>
<script>
import {SelectWaterYieldToFactory} from "@/api/basicConfig"
export default {
  name: "differenceConfig",
  data() {
    return {
      waterFactory: "",
      arr: [
        {
          year: "1990年",
          show: false,
          allShow:true,
          months: [
            { month: 1, value: 10 },
            { month: 2, value: 10 },
            { month: 3, value: 10 },
            { month: 4, value: 10 },
            { month: 5, value: 10 },
            { month: 6, value: 10 },
            { month: 7, value: 10 },
            { month: 8, value: 10 },
            { month: 9, value: 10 },
            { month: 10, value: 10 },
            { month: 11, value: 10 },
            { month: 12, value: 10 }
          ]
        },
        {
          year: "1991年",
          show: false,
          allShow:true,
          months: [
            { month: 1, value: 10 },
            { month: 2, value: 10 },
            { month: 3, value: 10 },
            { month: 4, value: 10 }
          ]
        }
      ],
      waterWorks: []
    };
  },
  mounted() {
    this.waterWorks = this.$store.state.user.waterWorks;
    SelectWaterYieldToFactory({factoryId:this.waterWorks[0].Id})
  },
  methods: {
    saveMonth(i){
      this.arr[i].show =false;
    }
  }
};
</script>
<style lang="scss" scoped>
.waterFactory-box {
  background: #fff;
  padding: 15px;
  color: #777c82;
}
.bottom-box {
  height: calc(100vh - 130px);
  .year-box {
    margin-top: 10px;
    background: #fff;
    padding: 18px;
  }
  .year-box-border {
    border-left: 4px solid #29beb0;
  }
  .year-button {
    color: #29beb0;
    font-size: 14px;
    cursor: pointer;
  }
  .month-box-bg {
    background: #9cb85c;
    height: 100%;
    width: 40px;
    text-align: center;
    color: #fff;
  }
  .month-line {
    height: 53px;
    font-size: 14px;
    line-height: 53px;
    background: #f5f5f5;
    border-bottom: 1px solid #d8e2e7;
  }
  .month-box-border {
    border: 1px solid #d8e2e7;
    border-bottom: none;
     margin-top: 18px;
  }
  .read-left-box {
    background: #ebeff5;
    width: 85px;
    height: 52px;
    text-align: center;
    & + div {
      flex: 1;
      text-align: center;
      border-left: 1px solid #d8e2e7;
    }
  }
  .month-save-btn {
    text-align: right;
    margin: 15px 0 5px 0;
  }
  @media screen and (min-width: 960px) and (max-width: 1200px) {
    .month-line {
      min-width: 33.33%;
    }
  }
  @media screen and (min-width: 1201px) and (max-width: 1440px) {
    .month-line {
      min-width: 25%;
    }
  }
  @media screen and (min-width: 1441px) and (max-width: 1600px) {
    .month-line {
      min-width: 25%;
    }
  }
  @media screen and (min-width: 1601px) and (max-width: 1981px) {
    .month-line {
      min-width: 16.66%;
    }
  }
}
</style>