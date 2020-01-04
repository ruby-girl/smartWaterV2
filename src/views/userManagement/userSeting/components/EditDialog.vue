<template>
  <el-dialog
    class="cl_editDialog"
    :close-on-click-modal="false"
    top="5vh"
    title="编辑用户信息"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="55%">
    <el-form :inline="true" ref="ruleForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="水厂  " prop="SA_WaterFactory_Id" >
        <el-select v-model="formData.SA_WaterFactoryName" placeholder=" " size="small" @change="getDataByWater" :disabled="true">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户编号  " prop="CustomerNo">
        <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
      </el-form-item>
      <el-form-item label="姓名  " prop="CustomerName">
        <el-input v-model="formData.CustomerName" placeholder="长度（1-30）" max-length="30" size="small"  @blur="getJMFun"/>
      </el-form-item>
      <el-form-item label="简码  " prop="NameCode">
        <el-input :disabled="true" v-model="formData.NameCode" size="small"/>
      </el-form-item>
      <el-form-item label="电话  " prop="Tel">
        <el-input v-model="formData.Tel " size="small"/>
      </el-form-item>
      <el-form-item label="人口  " prop="PeopleNo">
        <el-input v-model="formData.PeopleNo" size="small" :disabled="isMorePeople==1?true:false" />
      </el-form-item>
      <el-form-item label="用户类型  " prop="UserType">
        <el-select v-model="formData.UserType" placeholder=" " size="small" :disabled="formData.UserType==1201">
          <el-option v-for="(item,index) in userType" v-show="item.Id!=1201"  :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号  " prop="IdentityNo">
        <el-input v-model="formData.IdentityNo" size="small"/>
      </el-form-item>
      <el-form-item label="用水性质  " prop="SA_UseWaterType_Id">
        <el-select v-model="formData.SA_UseWaterTypeName" placeholder=" " size="small" :disabled="true">
          <el-option v-for="(item,index) in userWater" :key="index" :label="item.UseWaterTypeName" :value="item.SA_UseWaterType_Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="区域  " prop="SA_UserArea_Id" class="cl_allLine">
        <el-input v-model="formData.SA_UserArea_Id" style="display: none"></el-input>
        <p @click="setAreaFun" class="areaInput">{{areaName}}<i
          :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'"
          style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
        <AreaTree ref="areaTree" v-show="ifArea" @click="getArea" @watchChild="getCurAreaId"></AreaTree>
      </el-form-item>
      <el-form-item label="表册  ">
        <el-select v-model="formData.RegisterBookInfoName" placeholder=" " size="small" :disabled="true">
          <el-option v-for="(item,index) in RegisterBookInfo" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="纳税人识别号  " label-width="110px">
        <el-input v-model.trim="formData.TaxpayerNumber " size="small"/>
      </el-form-item>
      <el-form-item label="账号余额  " prop="Balance" class="money">
        <el-input v-model="formData.Balance " size="small" :disabled="true" />
      </el-form-item>

      <el-form-item label="地址" class="cl_allArea">
        <el-input type="textarea" v-model="formData.Address" max-length="500" @input="descInput('Address')"
                  rows="1"></el-input>
        <span>{{Address}}/500</span>
      </el-form-item>
      <el-form-item label="备注  " class="cl_allArea">
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
  import { convertToPinyinUpper } from "@/utils/convert"
  import { WaterFactoryComboBoxListAuth } from "@/api/organize"//具有权限的水厂
  import { GetAreaListByWaterFactory } from "@/api/userArea"//区域接口
  import { getDictionaryOption } from "@/utils/permission"
  import { GetWaterPropertyList,GetBlObjById, UpdateCustomerInfo } from "@/api/userSetting"//区域接口
  import {DeleteList} from "@/api/upload"
  import Bus from '@/utils/bus'
  import { ComboBoxListByWaterFactory } from "@/api/registerBook"//根据水厂获取表册
  import { GetConfigValueByKey } from "@/api/index"

  export default {
    name: "EditDialog",
    components: {uploadBox, AreaTree},
    data() {
      return {
        RegisterBookInfo:[],//表册数据
        waterFactory:[],//水厂
        userType:[],//用户类型
        userWater:[],//用水性质
        ifArea: false,
        dialogVisible: false,
        formData: {},//根据用户ID 获取该条用户详情
        Enclosure: {},
        areaName: '',//暂存区域名称
        Address: 0,//计算剩余字数
        Remark: 0,//计算剩余字数
        rules: {
          SA_WaterFactory_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_UseWaterType_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          Balance: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerNo: [{required: true, message: '不能为空', trigger: 'change'}],
          NameCode: [{required: true, message: '不能为空', trigger: 'change'}],
          PeopleNo: [{required: true, message: '不能为空', trigger: 'change'}],
          UserType: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerName: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_UserArea_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          Tel:[{
            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            message: '手机号格式有误',
            trigger: 'blur'
          }],
          IdentityNo:[{
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }]
        },
        upload: {//上传文件集合
          file: []
        },
        ec:{},//更新用户对象
        backFile:[],//审核失败回滚上传文件数据
        isMorePeople:0//人口可否编辑标识
      }
    },
    methods: {
      /**************获取区域下拉最后选择数据Id*******************/
      getCurAreaId(data){
        this.ifArea = false
        this.areaName = data.Name
        this.formData.SA_UserArea_Id = data.Id
      },
      /************************获取简码*************************/
      getJMFun(){
        this.formData.NameCode = convertToPinyinUpper(this.formData.CustomerName)
      },
      /**********************获得具有权限的水厂*******************/
      getWater(){
        WaterFactoryComboBoxListAuth().then(res => {
          if (res.code ==0 ) {
            this.waterFactory = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /************************用水性质*************************/
      GetWaterProperty(){
        alert(222)
        GetWaterPropertyList().then(res => {
          if (res.code ==0 ) {
            this.userWater = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /****************获取水厂获取数据**************************/
      getDataByWater(Id){
        this.getTreeData(Id)
        this.getRegister(Id)
      },
      /************************获取表册*************************/
      getRegister(Id){
        ComboBoxListByWaterFactory({'SA_WaterFactory_Id':Id}).then(res => {
          if (res.code ==0 ) {
            this.RegisterBookInfo = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /****************获取水厂获取区域数据**********************/
      getTreeData(Id) {
        this.$refs.areaTree.data = []
        GetAreaListByWaterFactory({'waterFactoryId':Id}).then(res => {
          if (res.code ==0 ) {
            this.$refs.areaTree.data.push(res.data)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
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
      /************************编辑保存提交*********************/
      submitForm(formName){
        let backIds = []
        this.backFile.forEach(item=>{
          backIds.push(item.Id)
        })
        let _this = this
        this.ec = {
          Id: this.formData.Id,
          CustomerName: this.formData.CustomerName,
          Tel: this.formData.Tel,
          IdentityNo: this.formData.IdentityNo,
          SA_UserArea_Id: this.formData.SA_UserArea_Id,
          Remark: this.formData.Remark,
          Idarr: [],
          TaxpayerNumber: this.formData.TaxpayerNumber,
          backIdarr:backIds,
          Addreass: this.formData.Address,
          UserType: parseInt(this.formData.UserType)
        }
        for (let j = 0; j < this.upload.file.length; j++) {//获取上传文件ID集合
          this.ec.Idarr.push(this.upload.file[j].id)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
          UpdateCustomerInfo(_this.ec).then(res => {//更新保存
              if (res.code == 0) {
                promptInfoFun(this,2,res.message)
                Bus.$emit('queryData')//触发父级列表查询
                _this.$refs[formName].resetFields()
                _this.dialogVisible = false
              } else {
                promptInfoFun(this,1,res.message)
              }
            })
          } else {
            return false
          }
        })
      },
      /**********************取消操作**************************/
      resetForm(formName){
        this.dialogVisible = false
        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {
        })
        this.$refs[formName].resetFields()
      },
      /***********************获取详情*************************/
      getInfo(id) {//根据id获取详情
        GetBlObjById({CusId: id}).then(res => {
          if (res.code == 0) {
            console.log(res.data)
            this.backFile = JSON.parse(JSON.stringify(res.data.saList))
            res.data.UserType = JSON.stringify(res.data.UserType)
            this.formData = res.data
            let fileList = res.data.saList//已经上传文件信息
            this.$refs.getFiles.setFiles(fileList)
            if(res.data.SA_WaterFactory_Id)
            this.getTreeData(res.data.SA_WaterFactory_Id)//默认加载区域下拉
            if(res.data.SA_UserArea_Id)
            this.$refs.areaTree.Id = res.data.SA_UserArea_Id//回填区域下拉数据
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getisMorePeople(){//获取人口是否可编辑
        GetConfigValueByKey({configkey:'IsMorePeople'}).then(res => {
          if (res.code ==0 ) {
            this.isMorePeople = parseInt(res.data)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      this.userType = getDictionaryOption('用户类型')
    /*  this.getWater()*/
     /* this.GetWaterProperty()*/
      this.getisMorePeople()
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
        height: 26px;
        line-height: 26px;
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
