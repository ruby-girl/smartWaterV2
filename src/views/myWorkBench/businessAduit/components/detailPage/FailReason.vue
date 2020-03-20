<template>
  <el-dialog
    class="fail-reason"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
    :modal="false"
    top="20vh"
    title="备注"
    :visible.sync="dialogVisible"
    :before-close="handleClosed"
    width="436px">
    <el-form ref="form" :model="form" label-width="0px">
      <el-form-item style="margin-bottom: 20px">
        <el-input type="textarea" v-model="form.remark"  placeholder="请输入审核不通过的原因" rows="7" resize="none"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;margin-bottom: 8px">
        <el-button type="primary" @click="onSubmit" size="small">确认</el-button>
        <el-button size="small" @click="dialogVisible=!dialogVisible">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  export default {
    name: "FailReason",
    data(){
      return {
        dialogVisible: false,
        form: {
          remark:''
        }
      }
    },
    methods:{
      onSubmit(){
        this.form.remark !='' ? this.dialogVisible = false :  promptInfoFun(this,1,'请输入审核不通过的原因')
        this.$parent.$parent.successPassFun(2)
      },
      handleClosed(){
        this.dialogVisible = false
      }
    }
  }
</script>

