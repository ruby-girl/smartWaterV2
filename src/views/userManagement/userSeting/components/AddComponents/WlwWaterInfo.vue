<template>
  <el-form :inline="true" ref="data" :model="data" :rules="rules" label-width="100px">
    <el-form-item label="水表编号 " prop="WaterMeterNo">
      <el-input v-model="data.WaterMeterNo" size="small" placeholder="按enter建查询水表信息"
                @keyup.enter.native="GetYCWaterByWaterMeterNo"  maxlength="20"/>
    </el-form-item>
    <el-form-item label="报警量" prop="WaterAmountAlarm" v-show="!ifCBen">
      <el-input size="small" v-model="data.WaterAmountAlarm"/>
    </el-form-item>
    <el-form-item label="透支量 " prop="WaterAmountOverdraft" v-show="!ifCBen">
      <el-input size="small" v-model="data.WaterAmountOverdraft"/>
    </el-form-item>

    <el-form-item label="报警金额" prop="WaterAmountAlarm" v-show="ifCBen">
      <el-input size="small" v-model="data.WaterAmountAlarm"/>
    </el-form-item>
    <el-form-item label="透支金额" prop="WaterAmountOverdraft" v-show="ifCBen">
      <el-input size="small" v-model="data.WaterAmountOverdraft"/>
    </el-form-item>

    <el-form-item label="当前读数 " prop="TotalCumulateWater">
      <el-input :disabled="true" v-model="data.TotalCumulateWater" size="small"/>
    </el-form-item>
    <el-form-item label="水表样式 " prop="WaterMeterStyle">
      <el-select v-model="data.WaterMeterStyle.toString()" placeholder="请选择" size="small" :disabled="true">
        <el-option v-for="(item,index) in waterMeterStyles" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="水表口径 " prop="MeterDiameter">
      <el-select v-model="data.MeterDiameter" placeholder="请选择" size="small" :disabled="true">
        <el-option v-for="(item,index) in MeterDiameters" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="备注 " class="cl_allArea" prop="Remark">
      <el-input :disabled="true" type="textarea" v-model="data.Remark" maxlength="500"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import {GetWLWWaterMeterByWaterMeterNo} from "@/api/userSetting"//区域接口
  import {promptInfoFun} from "@/utils/index"
  import {getDictionaryOption} from "@/utils/permission"
  import { getToken } from '@/utils/auth'

  export default {
    name: "WlwWaterInfo",
    data() {
      return {
        ifCBen:false,
        waterMeterStyles: [],//水表样式
        MeterDiameters: [],//水表口径
        data: {
          WaterMeterNo: '',//编号 （存）
          WaterAmountAlarm: '',//报警量 （存 AlarmYield）
          WaterAmountOverdraft: '',//透支量 （存 OverdraftYield）
          TotalCumulateWater: '',//当前读书
          WaterMeterStyle: '',//水表样式 （存 MeterStyle）
          MeterDiameter: '',//口径
          InstallAddress: '',//地址 （存）
          Remark: '',//备注 （存 WaterRemark）
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
        let _this = this
        if (this.data.WaterMeterNo == '') {
          promptInfoFun(this, 1, "水表编号不能为空");
          return
        }
        /*由于axios 异步请求导致获取不到返回值 股用以下方式解决*/
        let url = this.baseUrl+'/api/Customer/GetWLWWaterMeterABCByWaterMeterNo',
            data = {WaterMeterNo:this.data.WaterMeterNo}
        this.$http.get(url,{
          params: data,
          headers: {'Authorization': getToken()}//设置header信息
        }).then((res) => {
            if (res.data.code == 0) {
              _this.data = res.data.data
              res.data.data.WMType == 1104 ? _this.ifCBen = false : _this.ifCBen = true //1104 AB版本 05 C版本
            }else {
              if(res.data.message.indexOf('已绑定用户') != -1){
                this.$confirm(res.data.message, "提示", {
                  confirmButtonText: "确定",
                  iconClass:"el-icon-question questionIcon",
                  customClass: "warningBox",
                  showClose: false,
                  showCancelButton:false,
                }).then(() => {
                 // this.$router.push({path: '/waterMetermangments/waterMeterSetting', query: {CustomerQueryValue: this.data.WaterMeterNo,type:'4'}})
                })
              }else {
                promptInfoFun(this,1,res.data.message)
              }
            }
          })
      },
      /**********************转换保存字段名称**************/
      changeWordName() {
        let params = {
          WaterMeterNo: this.data.WaterMeterNo,
          AlarmYield: this.data.WaterAmountAlarm,
          OverdraftYield: this.data.WaterAmountOverdraft,
          MeterStyle: this.data.WaterMeterStyle,
          InstallAddress: this.data.InstallAddress,
          WaterRemark: this.data.Remark,
        }
        return params
      }
    },
    mounted() {
      this.waterMeterStyles = getDictionaryOption('水表样式')
      this.MeterDiameters = getDictionaryOption('口径类型')
    }
  }
</script>
