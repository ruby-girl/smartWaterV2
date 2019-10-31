<template>
  <div>
    <!--远传表及物联表-->
    <div class="user_information">
      <h3 class="add_title"><i></i>用户资料</h3>
      <el-form :inline="true" ref="ycData" :model="ycData" :rules="rules" label-width="100px">
        <el-form-item label="水厂：" prop="SA_WaterFactory_Id">
          <el-select v-model="ycData.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getDataByWater">
            <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户编码：">
          <el-input :disabled="true" v-model="ycData.CustomerNo" size="small"/>
        </el-form-item>
        <el-form-item label="姓名：" prop="CustomerName">
          <el-input v-model.trim="ycData.CustomerName" placeholder="长度（1-30）" max-length="30" size="small"  @blur="getJMFun"/>
        </el-form-item>
        <el-form-item label="简码：" prop="NameCode">
          <el-input :disabled="true" v-model="ycData.NameCode" size="small"/>
        </el-form-item>
        <el-form-item label="电话：" prop="Tel">
          <el-input v-model="ycData.Tel " size="small"/>
        </el-form-item>
        <el-form-item label="人口：" prop="PeopleNo">
          <el-input v-model.number="ycData.PeopleNo" size="small"/>
        </el-form-item>
        <el-form-item label="用户类型：" prop="UserType">
          <el-select v-model="ycData.UserType" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in userType" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号：" prop="IdentityNo">
          <el-input v-model="ycData.IdentityNo" size="small"/>
        </el-form-item>
        <el-form-item label="区域：" prop="SA_UserArea_Id" class="cl_allLine">
          <el-input v-model="ycData.SA_UserArea_Id" style="display: none"></el-input>
          <p @click="setAreaFun" class="areaInput">{{areaName}}<i
            :class="ifArea?'el-icon-arrow-up':'el-icon-arrow-down'"
            style="float: right; margin-top: 7px;color: #C0C4CC"></i></p>
          <AreaTree ref="areaTree" v-show="ifArea" @click="getArea" @watchChild="getCurAreaId"></AreaTree>
        </el-form-item>
        <el-form-item label="用水性质：" prop="SA_UseWaterType_Id">
          <el-select v-model="ycData.SA_UseWaterType_Id" placeholder="请选择" size="small">
            <el-option v-for="(item,index) in userWater" :key="index" :label="item.UseWaterTypeName" :value="item.SA_UseWaterType_Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="表册：" v-show="differ" prop="SA_RegisterBookInfo_Id">
          <el-select v-model="ycData.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
            <el-option label="编号" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号：" label-width="110px" prop="TaxpayerNumber">
          <el-input v-model.trim="ycData.TaxpayerNumber " size="small"/>
        </el-form-item>
        <el-form-item label="地址：" class="cl_allArea" prop="Address">
          <el-input type="textarea" v-model="ycData.Address" max-length="500" @input="descInput('Address')" rows="1"></el-input>
          <span>{{Address}}/500</span>
        </el-form-item>
        <el-form-item label="备注：" class="cl_allArea" prop="UserRemark">
          <el-input type="textarea" v-model="ycData.UserRemark" max-length="500" @input="descInput('UserRemark')"></el-input>
          <span>{{UserRemark}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <!--水表信息-->
    <div class="user_information">
      <h3 class="add_title"><i></i>水表信息</h3>
      <el-form :inline="true" ref="ycData1" :model="ycData" :rules="rules" label-width="100px">
        <!--远程水表 s-->
        <el-form-item label="水表编号：" prop="WaterMeterNo" v-show="!differ">
          <el-input v-model="ycData.WaterMeterNo " size="small" placeholder="【按enter建查询水表信息】" @keyup.enter.native="GetYCWaterByWaterMeterNo"/>
        </el-form-item>
        <el-form-item label="集中器号：" v-show="!differ" prop="ConcentratorNo">
          <el-input :disabled="true" v-model="waterInfo.ConcentratorNo" size="small"/>
        </el-form-item>
        <el-form-item label="采集器号：" v-show="!differ" prop="CollectorNo">
          <el-input :disabled="true" v-model="waterInfo.CollectorNo" size="small"/>
        </el-form-item>
        <el-form-item label="报警金额：" prop="AlarmMoney" v-show="!differ">
          <el-input :disabled="true" v-model="ycData.AlarmMoney " size="small"/>
        </el-form-item>
        <el-form-item label="透支金额：" prop="OverdraftMoney" v-show="!differ">
          <el-input :disabled="true" v-model="ycData.OverdraftMoney " size="small"/>
        </el-form-item>
        <!--远程水表 e-->
        <!--物联网 s -->
        <el-form-item label="水表编号：" v-show="differ" prop="WaterMeterNo">
          <el-input v-model.trim="ycData.WaterMeterNo" size="small" placeholder="【按enter建查询水表信息】" @keyup.enter.native="GetYCWaterByWaterMeterNo"/>
        </el-form-item>
        <el-form-item label="报警量：" prop="AlarmYield" v-show="differ" >
          <el-input size="small" v-model="ycData.AlarmYield"/>
        </el-form-item>
        <el-form-item label="透支量：" prop="OverdraftYield" v-show="differ" >
          <el-input  size="small" v-model="ycData.OverdraftYield"/>
        </el-form-item>
        <!--远传网 不需存s-->
        <el-form-item label="当前读数：" v-show="!differ" prop="ReadNum">
          <el-input :disabled="true" v-model="waterInfo.ReadNum" size="small"/>
        </el-form-item>
        <!--物联网 不需存e -->
        <el-form-item label="当前读数：" v-show="differ" prop="TotalCumulateWater">
          <el-input :disabled="true" v-model="waterInfo.TotalCumulateWater" size="small"/>
        </el-form-item>
        <el-form-item label="水表样式：" prop="MeterStyle">
          <el-select v-model="ycData.MeterStyle" placeholder="请选择" size="small" :disabled="true">
            <el-option v-for="(item,index) in waterMeterStyles" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="水表口径：" prop="MeterDiameter">
          <el-select v-model="ycData.MeterDiameter" placeholder="请选择" size="small" :disabled="true">
            <el-option v-for="(item,index) in MeterDiameters" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置：" class="cl_allArea" prop="InstallAddress">
          <el-input :disabled="true" type="textarea" v-model="ycData.InstallAddress" max-length="500" @input="descInput('InstallAddress')" rows="1"></el-input>
          <span>{{InstallAddress}}/500</span>
        </el-form-item>
        <el-form-item label="备注：" class="cl_allArea" prop="WaterRemark">
          <el-input :disabled="true" type="textarea" v-model="ycData.WaterRemark" max-length="500" @input="descInput('WaterRemark')"></el-input>
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
      <el-button type="primary" size="mini" @click="submitForm()">提交审核/确定</el-button>
      <el-button size="mini" @click="resetForm()">取 消</el-button>
    </p>
  </div>
</template>

<script>
  import AreaTree from './AreaTree'
  import uploadBox from '@/components/Upload'
  import { promptInfoFun } from "@/utils/index"
  import { getDictionaryOption } from "@/utils/permission"
  import { convertToPinyinUpper } from "@/utils/convert"
  import {DeleteList} from "@/api/upload"
  import Bus from '@/utils/bus'
  import { AddYCCustomer, AddWLWCustomer, GetWaterPropertyList, ReleaseCustomerNo, GetYCWaterMeterByWaterMeterNo, GetWLWWaterMeterByWaterMeterNo } from "@/api/userSetting"//区域接口
  import { GetAreaListByWaterFactory } from "@/api/userArea"//区域接口

  export default {
    name: "RemoteMeter",
    components: {AreaTree, uploadBox},
    props:['ycData'],
    data() {
      return {
        waterMeterStyles:[],//水表样式
        MeterDiameters:[],//水表口径
        waterFactory:[],//水厂集合
        userType:[],//用户类型
        userWater:[],//用水性质
        differ:false,//true 物联网 false 远传
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
          OverdraftMoney: [{required: true, message: '不能为空', trigger: 'change'}],
          AlarmYield: [{required: true, message: '不能为空', trigger: 'change'}],
          OverdraftYield: [{required: true, message: '不能为空', trigger: 'change'}],
          NameCode: [{required: true, message: '不能为空', trigger: 'change'}],
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
        areaName:'',
        InstallAddress: 0,//剩余字数
        WaterRemark: 0,//剩余字数
        Address: 0,
        UserRemark: 0,
        upload: {//上传文件集合
          file: []
        },
        Enclosure:{},
        waterInfo:{//根据水表编号查询水表数据
          ConcentratorNo:'',//集中器号
          CollectorNo:'',//采集器号
          ReadNum:'',//远传当前读书
          TotalCumulateWater:'',//物联当前读书
        }
      }
    },
    methods: {
      /**************获取区域下拉最后选择数据Id*******************/
      getCurAreaId(data){
        let _this = this
        _this.areaName = ''//初始化区域地址
        this.ifArea = false//关闭模拟下拉弹窗
        data.forEach(item=>{
          _this.areaName  += item[0].label + " "
          item[1] ? _this.ycData.SA_UserArea_Id = item[0].Id:''
        })
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
        this[type] = this.ycData[type].length
      },
      /********************获取上传文件信息**********************/
      getFileFun(data) {
        this.upload.file = data
      },
      /************************保存提交*************************/
      submitForm() {
        let _this = this
        _this.ycData.Idarr = []//初始化，避免重复添加
        for (let j = 0; j < _this.upload.file.length; j++) {//过滤获取上传文件信息ID
          _this.ycData.Idarr.push(_this.upload.file[j].id)
        }
        this.$refs['ycData'].validate((valid) => {
          if (valid) {
            _this.$refs['ycData1'].validate((valid) => {
              if (valid) {
                let functionName = _this.differ ? AddWLWCustomer : AddYCCustomer//true 物联网 false 远传
                functionName(_this.ycData).then(res => {
                  if (res.code == 0) {
                    promptInfoFun(_this,2,res.message)
                    _this.$refs.getFiles.certificates = '身份证'
                    _this.$refs.getFiles.fileList = []
                    _this.$refs['ycData'].resetFields();
                    _this.$refs['ycData1'].resetFields();
                    _this.areaName = ''
                    if(_this.ifGoOn){
                      _this.ifGoOn = false
                      _this.$parent.$parent.$parent.$parent.getUserCode()
                    }else{
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
      resetForm(){
        if(this.ycData.CustomerNo!='')
          ReleaseCustomerNo({'CustomerNo':this.ycData.CustomerNo}).then(res => {})//清除未占用用户编码
         this.$refs['ycData'].resetFields();
         this.$refs['ycData1'].resetFields();
         this.$parent.$parent.$parent.$parent.dialogVisible = false
        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {//删除未提交但已经上传的文件信息
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
        this.ycData.NameCode = convertToPinyinUpper(this.ycData.CustomerName)
      },
      GetYCWaterByWaterMeterNo(){
        if(this.ycData.WaterMeterNo==''){
          promptInfoFun(this,1,"水表编号不能为空");
          return
        }
        let funName = '';//true 为物联网，false 远传
        this.differ ? funName = GetWLWWaterMeterByWaterMeterNo : funName = GetYCWaterMeterByWaterMeterNo
        funName({'WaterMeterNo':this.ycData.WaterMeterNo}).then(res => {
          if (res.code ==0 ) {
             console.log(res)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /****************获取水厂获取数据**************************/
      getDataByWater(Id){
        this.getTreeData(Id)
      },
      /****************获取水厂获取区域数据**********************/
      getTreeData(Id) {
        GetAreaListByWaterFactory({'waterFactoryId':Id}).then(res => {
          if (res.code ==0 ) {
            this.$refs.areaTree.data.push(res.data)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      this.waterFactory = this.$parent.$parent.$parent.$parent.waterFactory
      this.userType = getDictionaryOption('用户类型')
      this.waterMeterStyles = getDictionaryOption('水表样式')
     // this.MeterDiameters = getDictionaryOption('水表口径')
      this.GetWaterProperty()
    }
  }
</script>
