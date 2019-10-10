<template>
  <div class="meter_Small">
    <div class="meter_left">
      ss
    </div>
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
            <el-checkbox label="字轮是否翻页" name="type"></el-checkbox>
            8
            <el-checkbox label="自动载入下一户" name="type"></el-checkbox>
            <el-checkbox label="异常倍率" name="type">
              异常倍率&nbsp;&nbsp;&nbsp;<el-select v-model="input1" placeholder="请选择" size="mini"
                                               @keyup.enter.native="searchFun">
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
</template>

<script>
  export default {
    name: "MeterPlanSmall"
  }
</script>

<style lang="scss">
  .meter_Small {
    display: flex;
    margin-top: 16px;
    padding: 16px;
    background: #fff;

    .meter_left{
      width: 250px
    }
    .meter_nums {
      flex: 1;
      position: relative;
      padding: 0 0px 15px 22px;

      > div {
        width: 50%;
        float: left
      }

      .meter_remark {
        width: 100%;
        margin: 10px 0 16px 0;

        .el-input-group__prepend {
          padding: 0 5px 0 0;
          color: #777C82;
          font: normal 14px 'Microsoft YaHei';
          border: none;
        }
      }
    }

    .meter_box {
      display: flex;

      p {
        width: 90px;
        background: #F0F2F5;
        text-align: center;
        font: normal 13px 'Microsoft YaHei';
        color: #777C82;
        margin: 0;
        border: solid 1px #D8E2E7
      }

      .el-input {
        flex: 1;
      }

      .el-input--medium .el-input__inner {
        border-radius: 0;
      }
    }

    .meter_box1 {
      .el-input--medium .el-input__inner {
        height: 30px;
        border-bottom: none;
      }

      .el-input--medium .el-input__icon {
        line-height: 30px;
      }

      p {
        height: 30px;
        line-height: 30px;
        border-bottom: none;
        border-right: none;
      }
    }

    .meter_box2 {
      .el-input--medium .el-input__inner {
        height: 53px;
      }

      .el-input--medium .el-input__icon {
        line-height: 53px;
      }

      p {
        height: 53px;
        line-height: 53px;
        border-right: none;
      }
    }

    .meter_box3 {
      .el-input--medium .el-input__inner {
        height: 84px;
        color: #00B3A1;
        font-size: 34px;
      }

      .el-input--medium .el-input__icon {
        line-height: 84px;
      }

      p {
        height: 84px;
        line-height: 84px;
        border-right: none;
        border-left: none;
      }
    }

    .plan_box2 {
      padding: 14px 0;

      a {
        font-size: 14px;

        label {
          font-size: 16px;
          color: #777C82
        }
      }
    }

    .plan_box3 {
      background: #fff;
      padding: 0 18px 20px 18px;
      margin-top: 13px;
      height: 172px;
      overflow: auto;

      h2 {
        color: #777C82;
        font-size: 20px;
        padding: 16px 0 10px 0;
        margin: 0;
      }
    }

    .unit {
      color: #777C82;
      font: normal 14px/38px 'Microsoft YaHei';

      span {
        color: #33B300
      }

      label {
        color: #46494C
      }

      i {
        color: #FF3D3D;
        font: normal 20px 'Microsoft YaHei'
      }
    }

    .unit:nth-child(2) {
      text-align: center
    }

    .unit:nth-child(3) {
      text-align: right
    }
  }
</style>
