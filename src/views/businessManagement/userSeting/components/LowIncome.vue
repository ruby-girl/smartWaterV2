<template>
  <el-dialog
    class="cl_addDialog lowIncome_addDialog"
    :close-on-click-modal="false"
    top="5vh"
    title="低保户申请"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width="screenWidth >= 1920 ? '68%':'80%'">
    <div class="user_information" style="padding: 0 20px 10px 20px">
      <h3 class="add_title"><i></i>用户信息</h3>
      <el-form :inline="true" ref="formData" :model="curObj" label-width="80px">
        <el-form-item label="用户编号" prop="SA_WaterFactory_Id">
          <el-input :disabled="true" v-model="curObj.CustomerNo" size="small"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="curObj.CustomerName" size="small"/>
        </el-form-item>
        <el-form-item label="水厂">
          <el-input :disabled="true" v-model="curObj.CustomerNo" size="small"/>
        </el-form-item>
        <el-form-item label="所属区域">
          <el-input :disabled="true" v-model="curObj.AreaName" size="small"/>
        </el-form-item>
        <el-form-item label="水表类型">
          <el-input :disabled="true" v-model="curObj.WaterMeterTypeName" size="small"/>
        </el-form-item>
        <el-form-item label="用水性质">
          <el-input :disabled="true" v-model="curObj.UseWaterTypeName" size="small"/>
        </el-form-item>
        <el-form-item label="电话">
          <el-input :disabled="true" v-model="curObj.Tel" size="small"/>
        </el-form-item>
        <el-form-item label="开户时间">
          <el-input :disabled="true" v-model="curObj.OperAccountDate" size="small"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="user_information" style="padding: 0 20px 10px 20px">
      <h3 class="add_title"><i></i>低保户资质</h3>
      <el-form :inline="true" ref="param" :model="param" label-width="80px">
        <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
        <el-form-item label="生效日期">
          <el-date-picker
            v-model="param.StartDate"
            type="date"
            style="width: 180px;"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="生效时间起">
          </el-date-picker>
          &nbsp;&nbsp;~&nbsp;&nbsp;
          <el-date-picker
            v-model="EndDate"
            type="date"
            :disabled="true"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="生效时间止">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注 " class="cl_allArea" prop="Remark">
          <el-input type="textarea" v-model="param.Remark" max-length="500"
                    @input="descInput('Remark')"></el-input>
          <span>{{Remark}}/500</span>
        </el-form-item>
      </el-form>
    </div>
    <p style="text-align: center">
      <el-button type="primary" size="mini" @click="submitForm()">提交审核/确定</el-button>
      <el-button size="mini" @click="resetForm()">取 消</el-button>
    </p>
  </el-dialog>
</template>

<script>
  import uploadBox from '@/components/Upload'
  import {DeleteList} from "@/api/upload"
  import {promptInfoFun} from "@/utils/index";
  import {InsuredMessageApply} from "@/api/organize";

  export default {
    name: "LowIncome",
    components: {uploadBox},
    props: ['curObj'],
    data() {
      return {
        dialogVisible: false,
        formData: {
          CustomerNo: '',
          timeStart: '',//生效日期
          timeEnd: '',//生效日期
        },
        Remark: 0,//剩余字数
        upload: {//上传文件集合
          file: []
        },
        Enclosure: {},
        screenWidth: '',

        param: {//申请低保户对象
          SA_Customer_Id: "",
          Idarr: [],
          StartDate: "",
          EndDate: "",
          Remark: ""
        }
      }
    },
    watch: {
      dialogVisible() {
        this.$nextTick(_ => {
          this.dialogVisible ? this.$refs.getFiles.ifShow = false : ''
        })
      }
    },
    computed: {
      EndDate: function () {
        let oneYear = (parseInt(this.param.StartDate.split('-')[0]) + 1).toString();
        this.param.EndDate = this.param.StartDate.replace(this.param.StartDate.split('-')[0], oneYear).replace('00:00:00', '23:59:59')
        return this.param.EndDate
      }
    },
    methods: {
      handleClose() {
        this.resetForm()
      },
      /********************获取上传文件信息**********************/
      getFileFun(data) {
        this.upload.file = data
      },
      /**********************计算textares 输入字数**************/
      descInput(type) {
        this[type] = this.param[type].length
      },
      /************************保存提交*************************/
      submitForm() {
        let _this = this
        if (_this.curObj.Id == '') {
          promptInfoFun(this, 1, '请选择用户！')
        } else {
          _this.param.SA_Customer_Id = _this.curObj.Id
          _this.dialogVisible = false
          _this.param.Idarr = []//初始化，避免重复添加
          for (let j = 0; j < _this.upload.file.length; j++) {//过滤获取上传文件信息ID
            _this.param.Idarr.push(_this.upload.file[j].id)
          }
          InsuredMessageApply(this.param).then(res => {
            res.code == 0 ? promptInfoFun(this, 2, res.message) : promptInfoFun(this, 1, res.message)
          })
        }
      },
      /************************重置表单*************************/
      resetForm() {//取消时初始化表单信息
        this.dialogVisible = false
        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {})
        this.$refs.getFiles.fileList = []
        this.param = {//申请低保户对象
            StartDate: "",
            EndDate: "",
            Remark: ""
        }
      },
    },
    mounted() {
      this.screenWidth = window.screen.width
    }
  }
</script>
<style lang="scss">
  .lowIncome_addDialog {
     .uploadPart { margin: 0px 25px 20px !important; }
   .cl_allArea .el-form-item__content {
      width: calc(100% - 106px) !important;
    }
  }
</style>
