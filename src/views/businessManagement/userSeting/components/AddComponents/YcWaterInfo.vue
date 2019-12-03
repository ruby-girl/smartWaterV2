<template>
  <el-form :inline="true" ref="data" :model="data" :rules="rules" label-width="100px">
    <!--远程水表 s-->
    <el-form-item label="水表编号：" prop="WaterMeterNo">
      <el-input v-model="data.WaterMeterNo " size="small" placeholder="按enter建查询水表信息"
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
  import { getToken } from '@/utils/auth'

  export default {
    name: "YcWaterInfo",
    data() {
      return {
        waterMeterStyles:[],//水表样式
        MeterDiameters:[],//水表口径
        data: {
          WaterMeterNo:"",//水表编号 （存）
          ConcentratorNo:"",//:集中器编号
          CollectorNo:"",//:采集器编号
          AlarmMoney :"",//报警金额 （存）
          OverdraftMoney  :"",//透支金额 （存）
          ReadNum:"",//当前读书
          WaterMeterStyle:"",//水表样式
          InstallAddress:"",//地址 （存）
          Remark:"",//备注 （存 WaterRemark）
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
        let _this = this
        if(this.data.WaterMeterNo==''){
          promptInfoFun(this,1,"水表编号不能为空");
          return
        }
        /*犹豫axios 异步请求导致获取不到返回值 股用以下方式解决*/
        let url = this.baseUrl+'/api/Customer/GetYCWaterMeterByWaterMeterNo',
          data = {WaterMeterNo:this.data.WaterMeterNo}
        this.$http.get(url,{
          params: data,
          headers: {'Authorization': getToken()}//设置header信息
        }).then((res) => {
            if (res.data.code == 0) {
              _this.data = res.data.data
            }else {
              if(res.data.message.indexOf('已绑定用户') != -1){
                this.$confirm(res.data.message, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  iconClass:"el-icon-question questionIcon",
                  customClass: "warningBox",
                  showClose: false
                }).then(() => {
                  this.$router.push({path: '/waterMetermangments/waterMeterSetting', query: {CustomerQueryValue: this.data.WaterMeterNo,type:'3'}})
                })
              }else {
                promptInfoFun(this,1,res.data.message)
              }
            }
          })
      },
      /**********************转换保存字段名称**************/
      changeWordName(){
        let params = {
          WaterMeterNo: this.data.WaterMeterNo,
          AlarmMoney: this.data.AlarmMoney,
          OverdraftMoney: this.data.OverdraftMoney,
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

