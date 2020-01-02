<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    title="切换水厂"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="400px">
    <el-form :inline="true" ref="formData" :model="formData" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="水厂：" prop="waterFactoryId">
        <el-select v-model="formData.waterFactoryId" placeholder="请选择" size="small">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <p style="text-align: center">
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="resetForm('formData')">取 消</el-button>
      </p>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    name: "SwitchFactory",
    data() {
      return {
        dialogVisible: false,
        formData: {
          waterFactoryId:'',
        },
        waterFactory:[],
        rules: {
          waterFactoryId: [{required: true, message: '不能为空', trigger: 'change'}],
        }
      }
    },
    methods:{
      submitForm(formData){//确定
        this.$refs[formData].validate((valid) => {
          if (valid) {
            this.waterFactory.forEach(item=>{
              item.Id == this.formData.waterFactoryId ? this.$parent.waterFactoryName = item:''
            })
            this.dialogVisible = false
            this.$parent.getTreeData()
          }
        })
      },
      resetForm(formData){//取消
        this.$refs[formData].resetFields();
        this.dialogVisible = false
      },
      handleClose(){//弹窗关闭
        this.resetForm('formData')
      },
    },
    mounted() {
 /*     this.waterFactory = this.$store.state.user.waterWorks*/
    }
  }
</script>
