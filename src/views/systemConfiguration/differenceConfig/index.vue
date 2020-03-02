<template>
  <div class="section-container">
    <div class="waterFactory-box">
      <span>水厂：</span>
      <el-select
        size="small"
        v-model="waterFactory"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getWaterYieldToFactory(waterFactory)"
      >
        <el-option v-for="item in waterWorksOption" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
      <span class="difference-red"><i class="iconfont iconbiaogezidingyi-tishi"></i>此页面供水量设置将运用到报表哦那估计-产销差统计里</span>
    </div>
    <!-- 配置 -->
    <div class="bottom-box position-absolute-head">
      <!-- 循环年 s-->
      <div class="year-box" v-for="(item,i) in arr" :key="i+'year'">
        <div class="year-box-border display-flex align-items-center justify-content-flex-justify">
          <div style="font-size: 18px;">{{item.TitleYear}}年</div>
          <div class="year-button display-flex align-items-center">
            <span @click="edit(i)">
              <i class="iconfont iconsuoyoubiaogelidebianji"></i>
              <span style="margin:0 10px 0 5px;">编辑</span>
            </span>
           <span class="isShow" :class="{tro:item.allShow}" style="margin-left:0">
          <i class="icon iconfont iconjianqu3" @click="item.allShow=!item.allShow"></i>
        </span>
          </div>
        </div>
        <!-- 循环月 -->
        <div class="display-flex align-items-center flex-wrap month-box-border" v-show="item.allShow">
          <!-- 1月 -->
          <!-- 未编辑 -->
          <div
            class="month-line display-flex align-items-center"
            v-for="(n,index) in item.WaterYields"
            v-show="!item.show"
            :key="index+'keys'"
          >
            <div class="month-box-bg">{{n.Month}}月</div>
            <div class="display-flex flex-1" style="color:#777C82;">
              <div class="read-left-box">供水量（吨）</div>
              <div>{{n.TotalWaterYield}}</div>
            </div>
          </div>
          <!-- 编辑状态 -->
          <div
            class="month-line display-flex align-items-center"
            v-for="(n,index) in item.WaterYields"
            v-show="item.show"
            :key="index+'key'"
          >
            <div class="month-box-bg">{{n.Month}}月</div>
            <div class="display-flex align-items-center flex-1" style="color:#777C82;">
              <div style="width:75px;text-align:center;">供水量</div>
              <el-input size="small" v-model="n.TotalWaterYield" @blur="handleInput($event,i,index)"></el-input>
              <span style="padding:0 10px;">吨</span>
            </div>
          </div>
          <!-- 1月 -->
        </div>

      </div>
      <!-- 循环年e -->

    </div>
    <div class="month-save-btn text-center" style="margin-top:10px;" v-permission="['282']">
          <el-button type="primary" size="mini" @click="saveMonth()">保存</el-button>
        </div>
  </div>
</template>
<script>
import {SelectWaterYieldToFactory,SaveYearMonthWaterYieldInfo} from "@/api/basicConfig"
import permission from "@/directive/permission/index.js"; // 权限判断指令
import {delDecimal_float } from "@/utils/index";
export default {
  name: "differenceConfig",
  data() {
    return {
      waterFactory: "",
      arr: [],
      waterWorksOption: []
    };
  },
  directives: { permission },
  mounted() {
    this.waterWorksOption = this.$store.state.user.waterWorks;
    this.waterFactory=this.waterWorksOption[0].Id
    this.getWaterYieldToFactory(this.waterFactory)
  },
  methods: {
    getWaterYieldToFactory(id){
      SelectWaterYieldToFactory({factoryId:id}).then(res=>{
      res.data.forEach((item,i)=>{
        item.show=false
        item.allShow=false
        if(i==0){
           item.allShow=true
        }
      })
      this.arr=res.data
    })
    },
    handleInput(e, i, n) {
      this.arr[i].WaterYields[n].TotalWaterYield = delDecimal_float(e.target.value);   
    },
    saveMonth(){
      SaveYearMonthWaterYieldInfo(this.arr).then(res=>{
        this.$message({
          message: "保存成功",
          type: "success",
          duration: 4000
        });
         this.getWaterYieldToFactory()
      })
    },
    edit(i){
      this.arr[i].show =!this.arr[i].show
      this.arr[i].allShow =true

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
.difference-red{
    color:red;
    font-size: 14px;
  }
.bottom-box {
  max-height: calc(100vh - 170px);
  overflow: scroll;
  .year-box {
    margin-top: 10px;
    background: #fff;
    padding: 18px;
  }
  .year-box-border {
    border-left: 4px solid #29beb0;
    padding-left:5px;
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
    width: 88px;
    padding-left: 2px;
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
