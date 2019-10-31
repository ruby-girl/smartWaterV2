<template>
  <el-form :inline="true" ref="data" :model="data" :rules="rules" label-width="100px">
    <el-form-item label="水表编号："  prop="WaterMeterNo">
      <el-input v-model="data.WaterMeterNo" size="small" placeholder="【按enter建查询水表信息】" @keyup.enter.native="GetYCWaterByWaterMeterNo"/>
    </el-form-item>
    <el-form-item label="报警量：" prop="WaterAmountAlarm"  >
      <el-input size="small" v-model="data.WaterAmountAlarm"/>
    </el-form-item>
    <el-form-item label="透支量：" prop="WaterAmountOverdraft"  >
      <el-input  size="small" v-model="data.WaterAmountOverdraft"/>
    </el-form-item>
    <el-form-item label="当前读数："  prop="TotalCumulateWater">
      <el-input :disabled="true" v-model="data.TotalCumulateWater" size="small"/>
    </el-form-item>
    <el-form-item label="水表样式：" prop="WaterMeterStyle">
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
      <el-input :disabled="true" type="textarea" v-model="data.InstallAddress" max-length="500" rows="1"></el-input>
      <!--<span>{{InstallAddress}}/500</span>-->
    </el-form-item>
    <el-form-item label="备注：" class="cl_allArea" prop="Remark">
      <el-input :disabled="true" type="textarea" v-model="data.Remark" max-length="500" ></el-input>
     <!-- <span>{{Remark}}/500</span>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import {GetWLWWaterMeterByWaterMeterNo} from "@/api/userSetting"//区域接口
  import {promptInfoFun} from "@/utils/index"
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "WlwWaterInfo",
    data() {
      return {
        waterMeterStyles:[],
        MeterDiameters:[],
        data: {
          WaterMeterNo:'',//编号
          WaterAmountAlarm:'',//报警量
          WaterAmountOverdraft:'',//透支量
          TotalCumulateWater:'',//当前读书
          WaterMeterStyle:'',//水表样式
          MeterDiameter:'',//口径
          InstallAddress:'',//地址
          Remark:'',//备注
        },
        rules: {
          WaterMeterNo: [{required: true, message: '不能为空', trigger: 'change'}],
          WaterAmountAlarm: [{required: true, message: '不能为空', trigger: 'change'}],
          WaterAmountOverdraft: [{required: true, message: '不能为空', trigger: 'change'}],
        },
      }
    },
    methods: {
      /**********************根据编号获取数据**************/
      GetYCWaterByWaterMeterNo() {
        if (this.data.WaterMeterNo == '') {
          promptInfoFun(this, 1, "水表编号不能为空");
          return
        }
        GetWLWWaterMeterByWaterMeterNo({'WaterMeterNo': this.data.WaterMeterNo}).then(res => {
          if (res.code == 0) {
            console.log(res)
            console.log("物联网水表")
            this.data = res.data
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
       }
      },
    mounted() {
      this.waterMeterStyles = getDictionaryOption('水表样式')
    }
  }
</script>
