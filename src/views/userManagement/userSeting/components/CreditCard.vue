<template>
  <el-dialog
    class="card-dialog"
    :close-on-click-modal="false"
    top="30vh"
    title="提示"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width = '350px'>
    <el-form>
      <el-form-item label="是否已刷卡？">
        <i class="el-icon-question"></i>
        <el-switch v-model="isCard"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" size="mini">补卡</el-button>
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import HistoryBusiness from "./DetailComponents/HistoryBusiness"
  import WaterMeter from "./DetailComponents/WaterMeter"
  import ICWater from "./DetailComponents/ICWater"
  import WlwWaterMeter from "./DetailComponents/WlwWaterMeter"
  import YcWaterMeter from "./DetailComponents/YcWaterMeter"
  import { GetBlObjById } from "@/api/userSetting"//区域接口

  export default {
    name: 'DetailDialog',
    components:{ HistoryBusiness, WaterMeter, ICWater, WlwWaterMeter, YcWaterMeter },
    data() {
      return {
        dialogVisible:false,
        isCard:false
      }
    },
    methods: {
      handleClose(){//弹窗关闭事件
        this.dialogVisible = false
      },
      onSubmit(){
        this.dialogVisible = false
        this.$parent.getCardStatus(this.isCard)
      }
    }
  }
</script>
<style lang="scss">
  .card-dialog{
    .el-form-item__label{padding-left: 25px !important;}
    .el-icon-question{position: absolute;left: 0;top:5px;font-size: 18px;color: #006663;}
    .el-form-item:last-child{text-align: center;margin-bottom: 0;}
  }
</style>
