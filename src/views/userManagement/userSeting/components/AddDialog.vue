<template>
  <el-dialog
    class="cl_addDialog"
    :close-on-click-modal="false"
    top="0vh"
    title="添加"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="55%">
    <!--用户资料-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="机械水表" name="1">
        <MechanicalMeter ref="jxChild" :formData="formData" :waterFactory="waterFactory" :ifExamine="ifExamine"></MechanicalMeter>
      </el-tab-pane>
      <el-tab-pane label="IC卡水表" name="2">
        <MechanicalMeter ref="icChild" :formData="formData" :waterFactory="waterFactory" :ifExamine="ifExamine"></MechanicalMeter>
      </el-tab-pane>
      <el-tab-pane label="远传水表" name="3">
        <RemoteMeter ref="ycChild" :ycData="ycData" :waterFactory="waterFactory" :ifExamine="ifExamine"></RemoteMeter>
      </el-tab-pane>
      <el-tab-pane label="物联网水表" name="4">
        <RemoteMeter ref="wlwChild" :ycData="ycData" :waterFactory="waterFactory" :ifExamine="ifExamine"></RemoteMeter>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import MechanicalMeter from './AddComponents/MechanicalMeter'
  import RemoteMeter from './AddComponents/RemoteMeter'
  import { WaterFactoryComboBoxListAuth } from "@/api/organize"//具有权限的水厂

  export default {
    name: "AddDialog",
    components: {MechanicalMeter, RemoteMeter},
    data() {
      return {
        ifExamine:false,
        activeName:'1',
        dialogVisible: false,
        formData:{//添加抄表及IC表对象
          SA_WaterFactory_Id: "",
          CustomerNo: "系统自动分配",
          SA_UserArea_Id: "",
          CustomerName: "",
          PeopleNo: 1,
          SA_UseWaterType_Id: "",
          IdentityNo: "",
          Tel: "",
          Address: "",
          UserType: "1202",
          SA_RegisterBookInfo_Id: "",
          TaxpayerNumber: "",
          Remark: "",
          WaterRemark: "",
          WaterMeterNo: "",
          WaterMeterStyle: "",
          MeterDiameter: "50",
          InstallAddress: "",
          StarReadNum: 0,
          AlarmMoney: 0,
          Idarr: [],
          NameCode:''
        },
        ycData: {//添加远传及物联网，用户信息数据，水表信息由下层提供
          SA_WaterFactory_Id: "",
          CustomerNo: "系统自动分配",
          CustomerName: "",
          NameCode:'',
          Tel: "",
          PeopleNo: 1,
          UserType: "1202",
          IdentityNo: "",
          SA_UserArea_Id: "",
          SA_UseWaterType_Id: "",
          TaxpayerNumber: "",
          Address: "",
          UserRemark: "",
          Idarr: [],
        },
        waterFactory:[]//水厂集合
      }
    },
    methods: {
      /***********************弹窗关闭事件**************************/
      handleClose(){//弹窗关闭初始化表单信息
        this.dialogVisible = false
        this.activeName = '1'
        this.$refs.jxChild.resetForm()
        this.$refs.icChild.resetForm()
        this.$refs.ycChild.resetForm()
        this.$refs.wlwChild.resetForm()
      },
      /***********************选项卡切换事件************************/
      handleClick(){//水表切换
        switch (this.activeName) {
          case '1'://机械
            this.$refs.jxChild.differ = false
            this.$refs.jxChild.areaName = ''
            this.$refs.jxChild.resetForm()
            this.dialogVisible = true
            break
          case '2'://IC
            this.$refs.icChild.differ = true
            this.$refs.icChild.areaName = ''
            this.$refs.icChild.resetForm()
            this.dialogVisible = true
            break;
          case '3'://远传
            this.$refs.ycChild.differ = false
            this.$refs.ycChild.areaName = ''
            this.$refs.ycChild.resetForm()
            this.dialogVisible = true
            break;
          case '4'://物联
            this.$refs.wlwChild.differ = true
            this.$refs.wlwChild.areaName = ''
            this.$refs.wlwChild.resetForm()
            this.dialogVisible = true
            break;
        }
      },
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
    .areaInput{width: 100%;height: 26px;line-height: 26px;border: solid 1px #D8E2E7;border-radius: 5px;margin: 3px 0 0 0;cursor: pointer;padding: 0 10px 0 15px;position: relative;}
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
