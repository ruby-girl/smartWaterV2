<template>
  <el-form :inline="true" ref="data" :model="data" :rules="rules" label-width="100px">
    <!--远程水表 s-->
    <el-form-item label="水表编号：" prop="WaterMeterNo">
      <el-input v-model="data.WaterMeterNo " size="small" placeholder="【按enter建查询水表信息】"
                @keyup.enter.native="GetYCWaterByWaterMeterNo"/>
    </el-form-item>
    <el-form-item label="集中器号：" prop="ConcentratorNo">
      <el-input :disabled="true" v-model="data.ConcentratorNo" size="small"/>
    </el-form-item>
    <el-form-item label="采集器号：" prop="CollectorNo">
      <el-input :disabled="true" v-model="data.CollectorNo" size="small"/>
    </el-form-item>
    <el-form-item label="报警金额：" prop="AlarmMoney">
      <el-input :disabled="true" v-model="data.AlarmMoney" size="small"/>
    </el-form-item>
    <el-form-item label="透支金额：" prop="OverdraftMoney">
      <el-input :disabled="true" v-model="data.OverdraftMoney" size="small"/>
    </el-form-item>
    <el-form-item label="当前读数：" prop="ReadNum">
      <el-input :disabled="true" v-model="data.ReadNum" size="small"/>
    </el-form-item>
    <el-form-item label="水表样式：" prop="MeterStyle">
      <el-select v-model="data.WaterMeterStyle" placeholder="请选择" size="small" :disabled="true">
        <el-option v-for="(item,index) in waterMeterStyles" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="水表口径：" prop="MeterDiameter">
      <el-select v-model="data.MeterDiameter" placeholder="请选择" size="small" :disabled="true">
        <el-option v-for="(item,index) in MeterDiameters" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="安装位置：" class="cl_allArea" prop="InstallAddress">
      <el-input :disabled="true" type="textarea" v-model="data.InstallAddress" max-length="500"
                rows="1"></el-input>
    <!--  <span>{{InstallAddress}}/500</span>-->
    </el-form-item>
    <el-form-item label="备注：" class="cl_allArea" prop="Remark">
      <el-input :disabled="true" type="textarea" v-model="data.Remark" max-length="500"></el-input>
      <!--<span>{{Remark}}/500</span>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import {  GetYCWaterMeterByWaterMeterNo } from "@/api/userSetting"//区域接口
  import { promptInfoFun } from "@/utils/index"
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "YcWaterInfo",
    data() {
      return {
        waterMeterStyles:[],
        MeterDiameters:[],
        data: {
          WaterMeterNo:"",//水表编号
          ConcentratorNo:"",//:集中器编号
          CollectorNo:"",//:采集器编号
          AlarmMoney :"",//报警金额
          OverdraftMoney  :"",//透支金额
          ReadNum:"",//当前读书
          WaterMeterStyle:"",//水表样式
          MeterDiameter:"",//水表口径
          InstallAddress:"",//地址
          Remark:"",//备注
        },
        rules: {
          WaterMeterNo: [{required: true, message: '不能为空', trigger: 'change'}],
          AlarmMoney: [{required: true, message: '不能为空', trigger: 'change'}],
          OverdraftMoney: [{required: true, message: '不能为空', trigger: 'change'}],
        },
      }
    },
    methods:{
      /**********************根据编号获取数据**************/
      GetYCWaterByWaterMeterNo(){
        if(this.data.WaterMeterNo==''){
          promptInfoFun(this,1,"水表编号不能为空");
          return
        }
        GetYCWaterMeterByWaterMeterNo({'WaterMeterNo':this.data.WaterMeterNo}).then(res => {
          if (res.code ==0 ) {
            console.log(res)
            console.log("远程水表")
            this.data = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
     },
    mounted() {
      this.waterMeterStyles = getDictionaryOption('水表样式')
    }
  }
</script>

