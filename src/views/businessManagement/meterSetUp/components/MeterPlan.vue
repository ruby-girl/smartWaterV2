<template>
  <div class="meter_modular" :gutter="20">
    <div class="plan_box">
      <p class="plan_box1 clearfix">
        <a style="text-align: left"><span>抄表计划：</span>123333</a>
        <a><span>用户编码：</span>123333</a>
        <a><span>姓名：</span>123333</a>
        <a style="font-size: 14px;text-align: right"><span>水表类型：</span>机械表</a>
      </p>
      <div class="meter_nums clearfix">
          <div>
            <div class="meter_box meter_box1">
              <p>抄表日期</p>
              <el-date-picker
                v-model="input1"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="meter_box meter_box2">
              <p>上次读书</p>
              <el-input v-model="input1" placeholder="按[enter]键确定"></el-input>
            </div>
          </div>
          <div class="meter_box meter_box3">
            <p>本次读书</p>
            <el-input v-model="input1" placeholder=""></el-input>
          </div>
          <el-input class="meter_remark" placeholder="请输入内容" v-model="input1">
              <template slot="prepend">备注：</template>
          </el-input>
          <el-row style="width: 100%">
            <el-col :span="20">
              <el-checkbox-group v-model="input">
                <el-checkbox label="字轮是否翻页" name="type"></el-checkbox>8
                <el-checkbox label="自动载入下一户" name="type"></el-checkbox>
                <el-checkbox label="异常倍率" name="type">
                  异常倍率&nbsp;&nbsp;&nbsp;<el-select v-model="input1" placeholder="请选择" size="mini" @keyup.enter.native="searchFun">
                    <el-option label="1.5" value="1.5"/>
                    <el-option label="2" value="2"/>
                    <el-option label="2.5" value="2.5"/>
                  </el-select>
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="4">
              <el-button style="float: right" type="primary" size="small">确定</el-button>
            </el-col>
          </el-row>
      </div>
    </div>
    <div class="meter_forms">
      <p class="plan_box1 plan_box2 clearfix">
        <a>表册：<label style="color: #777C82">全部</label></a>
        <a>合计：<label style="color: #46494C">100</label></a>
        <a>已抄：<label style="color: #00B3A1">11</label></a>
        <a>未抄：<label style="color: #FF3D3D">sdf</label></a>
      </p>
      <div class="plan_box3">
        <h2>水量水费预估</h2>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MeterPlan",
    data() {
      return {
        input1: '',
        input:[]
      }
    }
  }
</script>
<style lang="scss">
  .meter_modular {
    margin-top: 12px;
    height: 216px;
    > div {
      float: left
    }
    .plan_box {
      width: 60%;
      padding-right: 12px;;
    }
    .meter_forms {
      width: 40%;
    }
    .plan_box1 {
      background: #fff;
      margin: 0;
      padding: 12px 22px;
    }
    .plan_box1 a {
      span {
        color: #777C82;font-size: 13px;
      }
      width: 25%;
      display: block;
      text-align: center;
      font: normal 13px 'Microsoft YaHei';
      color: #46494C;
      text-decoration: none;
      float: left;
    }
    .meter_nums {
      position: relative;
      padding: 0 22px 15px 22px;
      background: #fff;
      >div {width: 50%;float: left}
      .meter_remark {
        width: 100%;margin: 10px 0 16px 0;
        .el-input-group__prepend{padding: 0 5px 0 0;color: #777C82;font: normal 14px 'Microsoft YaHei';border: none;}
      }
    }
    .meter_box {
      display: flex;
      p{width: 90px;background: #F0F2F5;text-align: center;font: normal 13px 'Microsoft YaHei';color: #777C82;margin: 0;border: solid 1px #D8E2E7}
      .el-input{flex: 1;}
      .el-input--medium .el-input__inner{border-radius: 0;}
    }
    .meter_box1{
      .el-input--medium .el-input__inner{height: 30px;border-bottom: none;}
      .el-input--medium .el-input__icon{line-height: 30px;}
      p{height: 30px;line-height: 30px;border-bottom: none;border-right: none;}
    }
    .meter_box2{
      .el-input--medium .el-input__inner{height: 53px;}
      .el-input--medium .el-input__icon{line-height: 53px;}
      p{height: 53px;line-height: 53px;border-right: none;}
    }
    .meter_box3{
      .el-input--medium .el-input__inner{height: 84px;color: #00B3A1;font-size: 34px;}
      .el-input--medium .el-input__icon{line-height: 84px;}
      p{height: 84px;line-height: 84px;border-right: none;border-left: none;}
    }
    .plan_box2{
      padding: 14px 0;
      a{
        font-size: 14px;
        label{font-size: 16px;color: #777C82}
      }
    }
    .plan_box3{
      background: #fff;padding: 0 18px 20px 18px;margin-top: 13px;height: 172px;overflow: auto;
      h2{color: #777C82;font-size: 20px;padding: 16px 0 10px 0;margin: 0;}
    }
    .unit{color: #777C82;font: normal 14px/38px 'Microsoft YaHei' ;
      span{color: #33B300}
      label{color: #46494C}
      i{color: #FF3D3D;font: normal 20px 'Microsoft YaHei'}
    }
    .unit:nth-child(2){text-align: center}
    .unit:nth-child(3){text-align: right}
  }
</style>

