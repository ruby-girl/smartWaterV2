<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="400px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
      <el-form-item label="部门:" prop="SYS_Department_Id">
        <el-select v-model="ruleForm.SYS_Department_Id" placeholder="请选择（单选）" size="small" style="width: 250px">
          <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位:" prop="JobName">
        <el-input
          v-model.trim="ruleForm.JobName"
          placeholder="请输入岗位信息"
          maxlength="10"
          size="small"
          style="width: 250px"/>
      </el-form-item>
      <p class="footBox dialogFooter">
        <el-button type="primary" size="small" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
      </p>
    </el-form>
  </el-dialog>
</template>

<script>
  import { AddPost, UpDatePost } from "@/api/organize"// 请求方法
  export default {
    name: "Dialog",
    data() {
      return {
        ID:'',
        postArray: [],
        title:'',
        dialogVisible: false,
        ruleForm: {//编辑或新增操作对象
          SYS_Department_Id: '',
          JobName: ''
        },
        rules: {
          JobName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          SYS_Department_Id: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {//编辑新增保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              this.ruleForm.Id = this.ID
              UpDatePost(this.ruleForm).then(res => {
                if (res.code ==0 ) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.ruleForm = {
                    SYS_Department_Id: '',
                    JobName: ''
                  }
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
              AddPost(this.ruleForm).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.ruleForm = {
                    SYS_Department_Id: '',
                    JobName: ''
                  }
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
      resetForm(formName) {//编辑弹窗表格重置
        this.dialogVisible = false;
        this.ruleForm = {
          SYS_Department_Id: '',
          JobName: ''
        }
        this.$refs[formName].resetFields();
      },
      handleClose(){//编辑弹窗关闭事件
        this.dialogVisible = false;
        this.ruleForm = {
          SYS_Department_Id: '',
          JobName: ''
        }
        this.$refs['ruleForm'].resetFields();
      },
    }
  }
</script>
