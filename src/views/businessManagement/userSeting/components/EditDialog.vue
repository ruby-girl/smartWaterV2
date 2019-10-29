<template>
  <el-dialog
    class="cl_editDialog"
    :close-on-click-modal="false"
    top="5vh"
    title="编辑用户信息"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="51%">
    <el-form :inline="true" ref="ruleForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="水厂：" prop="SA_WaterFactory_Id">
        <el-select v-model="formData.SA_WaterFactory_Id" placeholder="请选择" size="small">
          <el-option label="简码" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户编码：" prop="CustomerNo">
        <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
      </el-form-item>
      <el-form-item label="姓名：" prop="CustomerName">
        <el-input v-model.trim="formData.CustomerName" placeholder="长度（1-30）" max-length="30" size="small"/>
      </el-form-item>
      <el-form-item label="简码：" prop="NameCode">
        <el-input :disabled="true" v-model="formData.NameCode" size="small"/>
      </el-form-item>
      <el-form-item label="电话：">
        <el-input v-model.number="formData.Tel " size="small"/>
      </el-form-item>
      <el-form-item label="人口：" prop="PeopleNo">
        <el-input v-model.number="formData.PeopleNo" size="small"/>
      </el-form-item>
      <el-form-item label="用户类型：" prop="UserType">
        <el-select v-model="formData.UserType" placeholder="请选择" size="small" :disabled="true">
          <el-option label="编号" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号：">
        <el-input v-model="formData.IdentityNo" size="small"/>
      </el-form-item>
      <el-form-item label="用水性质：" prop="UserType">
        <el-select v-model="formData.UserType" placeholder="请选择" size="small" :disabled="true">
          <el-option label="编号" value="1" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区域：" prop="SA_UserArea_Id" class="cl_allLine">
        <el-input v-model="formData.SA_UserArea_Id" style="display: none"></el-input>
        <p v-model="areaName" @click="setAreaFun" class="areaInput"><i
          :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'"
          style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
        <AreaTree :areaTreeData=areaTreeData v-show="ifArea" @click="getArea"></AreaTree>
      </el-form-item>
      <el-form-item label="表册：">
        <el-select v-model="formData.SA_RegisterBookInfo_Id" placeholder="请选择" size="small" :disabled="true">
          <el-option label="编号" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="纳税人识别号：" label-width="110px">
        <el-input v-model.trim="formData.TaxpayerNumber " size="small"/>
      </el-form-item>
      <el-form-item label="账号余额：" prop="SA_RegisterBookInfo_Id" class="money">
        <el-input v-model="formData.SA_RegisterBookInfo_Id " size="small" :disabled="true" />
      </el-form-item>

      <el-form-item label="地址：" class="cl_allArea">
        <el-input type="textarea" v-model="formData.Address" max-length="500" @input="descInput('Address')"
                  rows="1"></el-input>
        <span>{{Address}}/500</span>
      </el-form-item>
      <el-form-item label="备注：" class="cl_allArea">
        <el-input type="textarea" v-model="formData.Remark" max-length="500" @input="descInput('Remark')"></el-input>
        <span>{{Remark}}/500</span>
      </el-form-item>
    </el-form>
    <el-form :inline="true" ref="Enclosure" :model="Enclosure" :rules="rules" label-width="100px">
      <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
    </el-form>
    <p style="text-align: center">
      <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交审核/确定</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
    </p>
  </el-dialog>
</template>

<script>
  import {promptInfoFun} from "@/utils/index"
  import uploadBox from '@/components/Upload'
  import AreaTree from './AddComponents/AreaTree'

  export default {
    name: "EditDialog",
    components: {uploadBox, AreaTree},
    data() {
      return {
        ifArea: false,
        dialogVisible: false,
        formData: {},
        Enclosure: {},
        areaTreeData: [],
        areaName: [],
        Address: 0,
        Remark: 0,
        rules: {
          SA_WaterFactory_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerNo: [{required: true, message: '不能为空', trigger: 'change'}],
          NameCode: [{required: true, message: '不能为空', trigger: 'change'}],
          PeopleNo: [{required: true, message: '不能为空', trigger: 'change'}],
          UserType: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_RegisterBookInfo_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerName: [{required: true, message: '不能为空', trigger: 'change'}],
          PeopleNo: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_UserArea_Id: [{required: true, message: '不能为空', trigger: 'change'}],
        }
      }
    },
    methods: {
      getFileFun(data) {//获取上传文件信息
        this.upload.file = data
      },
      getArea() {//选择区域数据回填
        this.ifArea = true
      },
      setAreaFun() {//模拟下拉显示区域数据
        this.ifArea = !this.ifArea
      },
      descInput(type) {//计算textares 输入字数
        this[type] = this.formData[type].length
      },
      handleClose() {//弹窗关闭
        this.dialogVisible = false
      },
      submitForm(){//提交

      },
      resetForm(){//取消

      }
    }

  }
</script>
<style lang="scss">
  .cl_editDialog {
    .money .el-form-item__label{color: #FF3D3D;}
    .el-form--inline .el-form-item {
      margin-bottom: 15px;
    }

    .cl_allLine {
      position: relative;
      width: 100%;

      .el-form-item__content {
        width: calc(100% - 155px);
      }

      .areaInput {
        width: 100%;
        height: 32px;
        line-height: 32px;
        border: solid 1px #D8E2E7;
        border-radius: 5px;
        margin: 0;
        cursor: pointer;
        padding: 0 10px 0 15px;
        position: relative;
      }
    }

    .cl_allArea {
      width: 100%;

      .el-form-item__content {
        width: calc(100% - 155px);
      }

      span {
        position: absolute;
        right: 10px;
        bottom: 0;
        color: #C0C8CC;
        font-size: 13px;
      }
    }
  }
</style>
