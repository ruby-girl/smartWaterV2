<template>
  <el-dialog
    :close-on-click-modal="false"
    top="30vh"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="800px">
    <el-form :inline="true" ref="ruleForm" :model="rb" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="表册名称" prop="BookName">
        <el-input
          v-model.trim="rb.BookName"
          placeholder="(长度1-20内)"
          maxlength="20"
          size="small"
          style="width: 250px"/>
      </el-form-item>
      <!--根据操作人员权限判断是否可以选择水厂-->
      <el-form-item label="水厂" prop="SA_WaterFactory_Id">
        <el-select :disabled="title=='编辑'" style="width: 250px" v-model="rb.SA_WaterFactory_Id" @change="getMeterRead">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员" prop="MeterReaderId">
        <el-select style="width: 250px" v-model="rb.MeterReaderId">
          <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="表册类型" prop="BookTypeKey">
        <el-select :disabled="title=='编辑'" style="width: 250px" v-model="rb.BookTypeKey">
          <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
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
  import { registerAdd, registerUpDate } from "@/api/registerBook"
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Dialog",
    data() {
      return {
        title:'',
        dialogVisible: false,
        rb:{
          Id:'',//编辑表册ID
          SA_WaterFactory_Id:'',//水厂ID
          BookName:'',//表册名称
          BookTypeKey:'601',//表册类型 '1机械', '2IC', '3远程', '4物联', '-1'
          MeterReaderId:''//抄表员ID
        },
        rules: {
          SA_WaterFactory_Id: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          BookName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          BookTypeKey: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          MeterReaderId: [
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              registerUpDate(this.rb).then(res => {
                if (res.code ==0 ) {
                  promptInfoFun(this,2,res.message)
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.$parent.searchFun()
                } else {
                  promptInfoFun(this,1,res.message)
                }
              })
            } else {
              registerAdd(this.rb).then(res => {
                if (res.code == 0) {
                  promptInfoFun(this,2,res.message)
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.$parent.searchFun()
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
