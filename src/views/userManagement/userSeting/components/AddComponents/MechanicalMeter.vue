<template>
  <!--机械表及IC表-->
  <div>
    <div class="user_information">
      <h3 class="add_title"><i></i>用户资料</h3>
      <el-form :inline="true" ref="formData" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="水厂" prop="SA_WaterFactory_Id">
          <el-select v-model="formData.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getDataByWater">
            <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户编号">
          <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
        </el-form-item>
        <el-form-item label="姓名" prop="CustomerName">
          <el-input v-model="formData.CustomerName" placeholder="长度（1-30）" maxlength="30" size="small" @blur="getJMFun"/>
        </el-form-item>
        <el-form-item label="简码" prop="NameCode">
          <el-input :disabled="true" v-model="formData.NameCode" size="small"/>
        </el-form-item>
        <el-form-item label="电话" prop="Tel">
          <el-input v-model="formData.Tel " size="small" maxlength="11"/>
        </el-form-item>
        <el-form-item label="人口" prop="PeopleNo">
          <el-input v-model.number="formData.PeopleNo" size="small" maxlength="2"/>
        </el-form-item>
        <el-form-item label="用户类型" prop="UserType">
          <el-select v-model="formData.UserType" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in userType" :key="index" :label="item.Name" :value="item.Id" v-show="item.Id!=1201"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号 " prop="IdentityNo">
          <el-input v-model="formData.IdentityNo" size="small" maxlength="18"/>
        </el-form-item>
        <el-form-item label="区域 " class="cl_allLine" prop="SA_UserArea_Id">
          <el-input v-model="formData.SA_UserArea_Id" style="display: none"></el-input>
          <p @click="setAreaFun" class="areaInput">{{areaName}}<i
            :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'"
            style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
          <AreaTree ref="areaTree" v-show="ifArea" @click="getArea" @watchChild="getCurAreaId"></AreaTree>
        </el-form-item>
        <el-form-item label="用水性质 " prop="SA_UseWaterType_Id">
          <el-select v-model="formData.SA_UseWaterType_Id" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in userWater" :key="index" :label="item.UseWaterTypeName" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="表册 "  prop="SA_RegisterBookInfo_Id" v-if="!differ">
          <el-select clearable v-model="formData.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in RegisterBookInfo" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号 " label-width="110px" prop="TaxpayerNumber">
          <el-input v-model.trim="formData.TaxpayerNumber " size="small" maxlength="30"/>
        </el-form-item>
        <el-form-item label="地址 " class="cl_allArea" prop="Address">
          <el-input type="textarea" v-model="formData.Address" maxlength="500" @input="descInput('Address')" rows="1"></el-input>
          <span>{{Address}}/500</span>
        </el-form-item>
        <el-form-item label="备注 " class="cl_allArea" prop="Remark">
          <el-input type="textarea" v-model="formData.Remark" maxlength="500" @input="descInput('Remark')"></el-input>
          <span>{{Remark}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <!--水表信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>水表信息</h3>
        <el-form :inline="true" ref="formData1" :model="formData" label-width="100px"  v-if="!differ">
        <el-form-item label="水表编号 " prop="WaterMeterNo">
          <el-input v-model="formData.WaterMeterNo" size="small" maxlength="20"/>
        </el-form-item>
        <el-form-item label="水表样式 "  prop="WaterMeterStyle" >
          <el-select clearable v-model="formData.WaterMeterStyle" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in waterMeterStyles" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="水表口径 "  prop="MeterDiameter">
          <el-select clearable v-model="formData.MeterDiameter" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in MeterDiameters" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="起始读数 " prop="StarReadNum">
          <el-input v-model="formData.StarReadNum" size="small"/>
        </el-form-item>
        <el-form-item label="备注 " class="cl_allArea" prop="WaterRemark">
          <el-input type="textarea" v-model="formData.WaterRemark" maxlength="500" @input="descInput('WaterRemark')"></el-input>
          <span>{{WaterRemark}}/500</span>
        </el-form-item>
      </el-form>

      <el-form :inline="true" ref="formData1" :model="formData" :rules="rules" label-width="100px" v-else>
        <el-form-item label="水表编号 " prop="WaterMeterNo">
          <el-input v-model="formData.WaterMeterNo" size="small" maxlength="20"/>
        </el-form-item>
        <el-form-item label="水表样式 "  prop="WaterMeterStyle">
          <el-select clearable v-model="formData.WaterMeterStyle" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in waterMeterStyles" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="水表口径 " prop="MeterDiameter">
          <el-select v-model="formData.MeterDiameter" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in MeterDiameters" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="报警金额 " prop="AlarmMoney">
          <el-input v-model="formData.AlarmMoney" size="small"/>
        </el-form-item>
        <el-form-item label="备注 " class="cl_allArea" prop="WaterRemark">
          <el-input type="textarea" v-model="formData.WaterRemark" maxlength="500"
                    @input="descInput('WaterRemark')"></el-input>
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
      <el-button type="primary" size="mini" @click="submitForm()" v-if="ifExamine">提交审核</el-button>
      <el-button type="primary" size="mini" @click="submitForm()" v-else>确定</el-button>
      <el-button size="mini" @click="resetForm()">取 消</el-button>
    </p>
  </div>
</template>

<script>
  import AreaTree from './AreaTree'
  import uploadBox from '@/components/Upload'
  import { promptInfoFun } from "@/utils/index"
  import { convertToPinyinUpper } from "@/utils/convert"
  import { getDictionaryOption } from "@/utils/permission"
  import {DeleteList} from "@/api/upload"
  import { AddJXCustomer, AddICCustomer, GetWaterPropertyList } from "@/api/userSetting"//区域接口
  import Bus from '@/utils/bus'
  import { GetAreaListByWaterFactory } from "@/api/userArea"//区域接口
  import { ComboBoxListByWaterFactory } from "@/api/registerBook"//根据水厂获取表册

  export default {
    name: "MechanicalMeter",
    components: {AreaTree, uploadBox},
    props:['formData','dialogVisible','waterFactory','ifExamine'],
    data() {
      return {
        RegisterBookInfo:[],//表册集合
        waterMeterStyles:[],//水表样式
        MeterDiameters:[],//水表口径
       //waterFactory:[],//水厂集合
        userType:[],//用户类型
        userWater:[],//用水性质
        differ:false,//true IC表,false,机械
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
          Tel:[{
            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
            message: '手机号格式有误',
            trigger: 'blur'
          }],
          IdentityNo:[{
            required: true,
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '证件号码格式有误！',
            trigger: 'blur'
          }]
        },
        areaName:'',//暂存区域名称
        InstallAddress: 0,//剩余字数
        WaterRemark: 0,//剩余字数
        Address: 0,//剩余字数
        Remark: 0,//剩余字数
        upload: {//上传文件集合
          file: []
        },
        Enclosure:{}
      }
    },
    methods: {
      /**************获取区域下拉最后选择数据Id*******************/
      getCurAreaId(data){
        this.ifArea = false
        this.areaName = data.Name
        this.formData.SA_UserArea_Id = data.Id
      },
      /**********************选择区域数据回填********************/
      getArea() {
        this.ifArea = true
      },
      /**********************模拟下拉显示区域数据****************/
      setAreaFun() {
        this.ifArea = !this.ifArea
      },
      /**********************计算textares 输入字数**************/
      descInput(type) {
        this[type] = this.formData[type].length
      },
      /********************获取上传文件信息**********************/
      getFileFun(data) {
        this.upload.file = data
      },
      /************************保存提交*************************/
      submitForm() {
        let _this = this
        _this.formData.Idarr = []//初始化，避免重复添加
        for (let j = 0; j < _this.upload.file.length; j++) {//过滤获取上传文件信息ID
          _this.formData.Idarr.push(_this.upload.file[j].id)
        }
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            _this.$refs['formData1'].validate((valid) => {
              if (valid) {
                let functionName = _this.differ ? AddICCustomer : AddJXCustomer//true IC表,false,机械
                functionName(_this.formData).then(res => {
                  let ObjData = Object.assign({},this.formData)
                  if (res.code == 0) {
                    promptInfoFun(_this,2,res.message)
                    _this.$refs.getFiles.certificates = '身份证'
                    _this.$refs.getFiles.fileList = []
                    _this.$refs['formData'].resetFields();
                    _this.$refs['formData1'].resetFields();
                    if(_this.ifGoOn){
                      _this.formData.SA_WaterFactory_Id = ObjData.SA_WaterFactory_Id
                      _this.formData.SA_UserArea_Id = ObjData.SA_UserArea_Id
                      _this.formData.SA_UseWaterType_Id = ObjData.SA_UseWaterType_Id
                      _this.formData.SA_RegisterBookInfo_Id = ObjData.SA_RegisterBookInfo_Id
                      _this.$parent.$parent.$parent.$parent.getUserCode()
                    }else{
                      _this.formData.SA_UserArea_Id = ''
                      _this.areaName = ''
                      _this.$parent.$parent.$parent.$parent.dialogVisible = false
                      Bus.$emit('queryData')//给兄弟组件传值
                    }
                  } else {
                    promptInfoFun(_this,1,res.message)
                  }
                })
              }
            })
          }
        })
      },
      /************************重置表单*************************/
      resetForm(){//取消时初始化表单信息
        this.$refs.getFiles.certificates = '身份证'
        this.$refs.getFiles.fileList = []
        this.areaName = ''
        this.$refs['formData'].resetFields();
        this.$refs['formData1'].resetFields();
        this.$parent.$parent.$parent.$parent.dialogVisible = false
        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {//删除未提交但已经上传的文件信息
          if(res.code ==0){
            this.upload.file = []
          }
        })
      },
      /************************用水性质*************************/
      GetWaterProperty(){
        GetWaterPropertyList().then(res => {
          if (res.code ==0 ) {
            this.userWater = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /************************获取简码*************************/
      getJMFun(){
        this.formData.NameCode = convertToPinyinUpper(this.formData.CustomerName)
      },
      /****************获取水厂获取数据**************************/
      getDataByWater(Id) {
        this.getTreeData(Id)
        this.getRegister(Id)
        this.formData.SA_UserArea_Id = ''//清空区域选择数据
        this.areaName = ''
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
        GetAreaListByWaterFactory({'waterFactoryId':Id}).then(res => {
          if (res.code ==0 ) {
            this.$refs.areaTree.data = []
            this.$refs.areaTree.data.push(res.data)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      this.userType = getDictionaryOption('用户类型')
      this.waterMeterStyles = getDictionaryOption('水表样式')
      this.MeterDiameters = getDictionaryOption('口径类型')
      this.GetWaterProperty()

    }
  }
</script>
