<template>
  <div>
    <div class="user_information">
      <h3 class="add_title"><i></i>用户资料</h3>
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
          <el-select v-model="formData.UserType" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号：">
          <el-input v-model="formData.IdentityNo" size="small"/>
        </el-form-item>
        <el-form-item label="区域：" prop="SA_UserArea_Id" class="cl_allLine">
          <el-input v-model="formData.SA_UserArea_Id" style="display: none"></el-input>
          <p v-model="areaName" @click="setAreaFun" class="areaInput"><i
            :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'"
            style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
          <AreaTree :areaTreeData=areaTreeData v-show="ifArea" @click="getArea"></AreaTree>
        </el-form-item>
        <el-form-item label="用水性质：" prop="SA_UseWaterType_Id">
          <el-select v-model="formData.SA_UseWaterType_Id" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表册：">
          <el-select v-model="formData.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号：" label-width="110px">
          <el-input v-model.trim="formData.TaxpayerNumber " size="small"/>
        </el-form-item>
        <el-form-item label="地址：" class="cl_allArea">
          <el-input type="textarea" v-model="formData.Address" max-length="500" @input="descInput('Address')" rows="1"></el-input>
          <span>{{Address}}/500</span>
        </el-form-item>
        <el-form-item label="备注：" class="cl_allArea">
          <el-input type="textarea" v-model="formData.Remark" max-length="500" @input="descInput('Remark')"></el-input>
          <span>{{Remark}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <!--水表信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>水表信息</h3>
      <el-form :inline="true" ref="ruleForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="水表编号：" prop="WaterMeterNo">
          <el-input v-model.trim="formData.WaterMeterNo" size="small"/>
        </el-form-item>
        <el-form-item label="水表样式：">
          <el-select v-model="formData.WaterMeterStyle" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水表口径：" prop="MeterDiameter">
          <el-select v-model="formData.MeterDiameter" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!--机械表 s-->
        <el-form-item label="起始读数：" v-show="!differ">
          <el-input v-model.trim="formData.StarReadNum" size="small"/>
        </el-form-item>
        <!--机械表 e-->
        <!--IC表 s-->
        <el-form-item label="报警金额：" prop="AlarmMoney" v-show="differ">
          <el-input v-model.trim="formData.AlarmMoney" size="small"/>
        </el-form-item>
        <!--IC表 e-->
        <el-form-item label="安装位置：" class="cl_allArea">
          <el-input type="textarea" v-model="formData.InstallAddress" max-length="500" @input="descInput('InstallAddress')" rows="1"></el-input>
          <span>{{InstallAddress}}/500</span>
        </el-form-item>
        <el-form-item label="备注：" class="cl_allArea">
          <el-input type="textarea" v-model="formData.WaterRemark" max-length="500" @input="descInput('WaterRemark')"></el-input>
          <span>{{WaterRemark}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <!--附件信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>附件信息</h3>
      <el-form :inline="true" ref="Enclosure" :model="Enclosure" :rules="rules" label-width="100px">
        <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
      </el-form>
    </div>
    <el-checkbox v-model="ifGoOn">勾选后继续添加</el-checkbox>
    <p style="text-align: center">
      <el-button type="primary" size="mini" @click="submitForm('ruleForm')">提交审核/确定</el-button>
      <el-button size="mini" @click="resetForm('ruleForm')">取 消</el-button>
    </p>
  </div>
</template>

<script>
  import AreaTree from './AreaTree'
  import uploadBox from '@/components/Upload'

  export default {
    name: "MechanicalMeter",
    components: {AreaTree, uploadBox},
    props:['formData'],
    data() {
      return {
        differ:false,
        ifGoOn:false,//是否继续添加
        ifArea: false,//区域下拉是否显示
        rules: {
          SA_WaterFactory_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerNo: [{required: true, message: '不能为空', trigger: 'change'}],
          CustomerName: [{required: true, message: '不能为空', trigger: 'change'}],
          PeopleNo: [{required: true, message: '不能为空', trigger: 'change'}],
          UserType: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_UserArea_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          SA_UseWaterType_Id: [{required: true, message: '不能为空', trigger: 'change'}],
          WaterMeterNo: [{required: true, message: '不能为空', trigger: 'change'}],
          MeterDiameter: [{required: true, message: '不能为空', trigger: 'change'}],
          AlarmMoney: [{required: true, message: '不能为空', trigger: 'change'}],
          NameCode: [{required: true, message: '不能为空', trigger: 'change'}],
        },
        areaName:'',
        areaTreeData: [],//区域数据
        InstallAddress: 0,//剩余字数
        WaterRemark: 0,//剩余字数
        Address: 0,
        Remark: 0,
        upload: {//上传文件集合
          file: []
        },
        Enclosure:{}
      }
    },
    methods: {
      getArea() {//选择区域数据回填
        this.ifArea = true
      },
      setAreaFun() {//模拟下拉显示区域数据
        this.ifArea = !this.ifArea
      },
      descInput(type) {//计算textares 输入字数
        this[type] = this.formData[type].length
      },
      getFileFun(data) {//获取上传文件信息
        this.upload.file = data
      },
      submitForm(formName) {//保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            return false
          }
        })
      },
      resetForm(formName){//取消时初始化表单信息
       // this.$refs[formName].resetFields();
      },
    }
  }
</script>
