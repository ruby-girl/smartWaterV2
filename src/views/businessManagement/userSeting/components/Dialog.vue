<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="400px">
    <el-form :inline="true" ref="ruleForm" :model="param" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="上级目录：">
        <el-input
          :disabled="true"
          v-model.trim="param.pieName"
          size="small"/>
      </el-form-item>
      <el-form-item label="区域编号：">
        <el-input
          :disabled="true"
          v-model.trim="param.AreaNo"
          size="small"/>
      </el-form-item>
      <el-form-item label="区域名称：" prop="AreaName">
        <el-input
          v-model.trim="param.AreaName"
          placeholder="(长度1-50内)"
          maxlength="50"
          size="small"/>
      </el-form-item>
      <p style="text-align: center">
        <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交审核/确定</el-button>
        <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
      </p>
    </el-form>
  </el-dialog>
</template>

<script>
  import { AddArea, UpdateAreaName } from "@/api/userArea"//区域接口
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Dialog",
    data() {
      return {
        title:'',
        dialogVisible: false,
        param:{//新增或编辑区域对象
          Id:'',
          pieName:'',
          AreaName: '',
          Pid: '',
          AreaNo: ''
        },
        rules: {
          AreaName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        formArry:[],//表册类型
        waterFactory:[],//具有权限水厂数据
        meterArry:[]//抄表员
      }
    },
    methods: {
      submitForm(formName) {//编辑新增保存事件
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              UpdateAreaName({'areaId':this.param.Id,name:this.param.AreaName}).then(res => {
                if (res.code ==0 ) {
                  promptInfoFun(this,2,res.message)
                  _this.dialogVisible = false
                  _this.$parent.getTreeData()
                  _this.handleClose()
                } else {
                  promptInfoFun(this,1,res.message)
                }
              })
            } else {//新增区域
              _this.param = {
                Id: this.param.Id,
                AreaName: this.param.AreaName,
                Pid: this.param.Pid,
                AreaNo: this.param.Pid
              }
              AddArea(this.param).then(res => {
                if (res.code ==0 ) {
                  promptInfoFun(this,2,res.message)
                  _this.dialogVisible = false
                  _this.$parent.getTreeData()
                  _this.handleClose()
                } else {
                  promptInfoFun(this,1,res.message)
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
        this.$refs[formName].resetFields();
      },
      handleClose(){//弹窗关闭初始化表单信息
        this.resetForm('ruleForm')
      },
      getMeterRead(id){
        this.$parent.getMeterReaderList(2,id)
      }
    },
    mounted() {
      this.formArry = getDictionaryOption('表册类型')
    }
  }
</script>
