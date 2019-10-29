<template>
  <el-dialog
    class="cl_addDialog"
    :close-on-click-modal="false"
    top="0vh"
    title="添加"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="51%">
    <!--用户资料-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="机械水表" name="1">
        <MechanicalMeter ref="jxChild"  :formData="formData"></MechanicalMeter>
      </el-tab-pane>
      <el-tab-pane label="IC卡水表" name="2">
        <MechanicalMeter ref="icChild"  :formData="formData"></MechanicalMeter>
      </el-tab-pane>
      <el-tab-pane label="远传水表" name="3">
        <RemoteMeter ref="ycChild"  :ycData="ycData"></RemoteMeter>
      </el-tab-pane>
      <el-tab-pane label="物联网水表" name="4">
        <RemoteMeter ref="wlwChild"  :ycData="ycData"></RemoteMeter>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import MechanicalMeter from './AddComponents/MechanicalMeter'
  import RemoteMeter from './AddComponents/RemoteMeter'

  export default {
    name: "AddDialog",
    components: {MechanicalMeter, RemoteMeter},
    data() {
      return {
        activeName:'1',
        dialogVisible: false,
        formData:{//抄表及IC表数据
          SA_WaterFactory_Id: "",
          CustomerNo: "",
          SA_UserArea_Id: "",
          CustomerName: "",
          PeopleNo: 0,
          SA_UseWaterType_Id: "",
          IdentityNo: "",
          Tel: "",
          Address: "",
          UserType: 1201,
          SA_RegisterBookInfo_Id: "",
          TaxpayerNumber: "",
          Remark: "",
          WaterRemark: "",
          WaterMeterNo: "",
          WaterMeterStyle: 2101,
          MeterDiameter: 15,
          InstallAddress: "",
          StarReadNum: 0,
          AlarmMoney: 0,
          Idarr: []
        },
        ycData: {//远程物联网 ，MeterStyle 物联网
          SA_WaterFactory_Id: "",
          SA_UserArea_Id: "",
          CustomerName: "",
          CustomerNo: "",
          PeopleNo: 0,
          SA_UseWaterType_Id: "",
          IdentityNo: "",
          Tel: "",
          Address: "",
          UserType: 1201,
          TaxpayerNumber: "",
          UserRemark: "",
          WaterMeterNo: "",
          InstallAddress: "",
          AlarmMoney: 0,
          OverdraftMoney: 0,
          WaterRemark: "",
          MeterStyle: 2101,
          Idarr: []
        }
      }
    },
    methods: {
      handleClose(){//弹窗关闭初始化表单信息
        this.dialogVisible = false
        this.resetForm('ruleForm')
      },
      handleClick(){//水表切换
        switch (this.activeName) {
          case '1':
            this.$refs.jxChild.differ = false
            break;
          case '2':
            this.$refs.icChild.differ = true
            break;
          case '3':
            this.$refs.ycChild.differ = false
            break;
          case '4':
            this.$refs.wlwChild.differ = true
            break;
        }
      }
    }
  }
</script>
<style lang="scss">
  .cl_addDialog{
    .el-form--inline .el-form-item{margin-bottom: 15px;}
    .el-dialog{ background: #F5F5F5;}
  .cl_allLine {
    position: relative; width: 100%;
    .el-form-item__content { width: calc(100% - 140px);}
    .areaInput{width: 100%;height: 32px;line-height: 32px;border: solid 1px #D8E2E7;border-radius: 5px;margin: 0;cursor: pointer;padding: 0 10px 0 15px;position: relative;}
  }
  .cl_allArea {
    width: 100%;
    .el-form-item__content { width: calc(100% - 140px);}
    span{position: absolute;right: 10px;bottom: 0;color: #C0C8CC;font-size: 13px;}
   }
   .user_information{background: #fff;margin-bottom: 10px;padding-bottom: 10px;
   .add_title{font: bold 16px 'Microsoft YaHei';color: #5B5B5B;padding:18px 15px 0 15px;margin-top: 0;
   i{display: inline-block;width: 4px;background: #29BEB0;height: 18px;margin-right: 5px; vertical-align: middle;margin-top: -4px;}}
   }
    .el-tabs__header { margin: 0;
      .el-tabs__item{font-size: 13px;color: #5B5B5B}
      .el-tabs__item.is-active{color: #5B5B5B;font-size: 14px;font-weight: bold;}
      .el-tabs__nav{padding: 5px 0;}
      .el-tabs__nav-wrap::after{ background-color: transparent; }
    }
    .el-dialog__body{padding: 0px 20px 20px 20px}
  }
</style>
