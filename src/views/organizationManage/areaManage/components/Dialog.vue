<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="400px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="片区 " prop="newAreaName">
        <el-input
          v-model.trim="ruleForm.newAreaName"
          placeholder="(长度1-20内)"
          maxlength="20"
          size="small"
          style="width: 250px"/>
      </el-form-item>
      <el-form-item label="水厂 " prop="waterFactoryName">
        <el-select multiple v-model="ruleForm.waterFactoryName">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <p class="footBox dialogFooter">
        <el-button type="primary" size="mini" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      </p>
    </el-form>
  </el-dialog>
</template>

<script>
  import { WaterFactoryComboBoxList, BlockAreaUpDate, BlockAreaAdd  } from "@/api/organize"//http 请求

  export default {
    name: "Dialog",
    data() {
      return {
        waterFactory:[],
        title:'',
        dialogVisible: false,
        ruleForm: {//新增对象
          newAreaName: '',
          waterFactoryName:[]
        },
        rules: {
          newAreaName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          waterFactoryName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
      }
    },
    methods: {
      submitForm(formName) {//编辑新增保存事件
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              let params = { Id: this.$parent.ID, BlockAreaName: this.ruleForm.newAreaName,List: this.ruleForm.waterFactoryName}
              BlockAreaUpDate(params).then(res => {
                if (res.code ==0 ) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.$parent.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            } else {
              let iba = {
                BlockAreaName: this.ruleForm.newAreaName,List: this.ruleForm.waterFactoryName
              }

              BlockAreaAdd(iba).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.$parent.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName){//取消时初始化表单信息
        this.dialogVisible = false;
        this.ruleForm.waterFactoryName = ''
        this.$refs[formName].resetFields();
      },
      handleClose(){//弹窗关闭初始化表单信息
        this.resetForm('ruleForm')
      },
      getWaterFactoryList(){//获取水厂数据集合
        WaterFactoryComboBoxList({SA_BlockArea_Id:''}).then(res => {
          if (res.code ==0 ) {
            this.waterFactory = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      }
    },
    mounted() {
      this.getWaterFactoryList()//调用获取水厂数据集合方法
    }
  }
</script>
