<template>
    <el-dialog
      class="cl_addDialog"
      :close-on-click-modal="false"
      top="5vh"
      title="低保户申请"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :width="screenWidth >= 1920 ? '68%':'80%'">
      <div class="user_information" style="padding: 0 20px 10px 20px">
        <h3 class="add_title"><i></i>用户信息</h3>
        <el-form :inline="true" ref="formData" :model="formData" label-width="80px">
          <el-form-item label="用户编号" prop="SA_WaterFactory_Id">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="水厂">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="水表类型">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="用水性质">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="电话">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
          <el-form-item label="开户时间">
            <el-input :disabled="true" v-model="formData.CustomerNo" size="small"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="user_information" style="padding: 0 20px 10px 20px">
        <h3 class="add_title"><i></i>附件信息</h3>
        <el-form :inline="true" ref="Enclosure" :model="Enclosure" label-width="100px">
          <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
          <el-form-item label="生效日期">
            <el-date-picker
              v-model="formData.timeStart"
              type="date"
              style="width: 180px;"
              placeholder="选择日期">
            </el-date-picker>
            &nbsp;&nbsp;~&nbsp;&nbsp;
            <el-date-picker
              v-model="formData.timeEnd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注 " class="cl_allArea" prop="WaterRemark">
            <el-input type="textarea" v-model="Enclosure.CustomerNo" max-length="500" @input="descInput('WaterRemark')"></el-input>
            <span>{{WaterRemark}}/500</span>
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

    export default {
      name: "LowIncome",
      components: { uploadBox },
      data() {
        return {
          dialogVisible: false,
          formData:{
            CustomerNo:'',
            timeStart:'',//生效日期
            timeEnd:'',//生效日期
          },
          WaterRemark: 0,//剩余字数
          upload: {//上传文件集合
            file: []
          },
          Enclosure:{},
          screenWidth:''
        }
      },
      methods:{
        handleClose(){
          this.resetForm()
        },
        /********************获取上传文件信息**********************/
        getFileFun(data) {
          this.upload.file = data
        },
        /**********************计算textares 输入字数**************/
        descInput(type) {
          this[type] = this.formData[type].length
        },
        /************************保存提交*************************/
        submitForm() {
          this.dialogVisible = false
          let _this = this
          _this.formData.Idarr = []//初始化，避免重复添加
          for (let j = 0; j < _this.upload.file.length; j++) {//过滤获取上传文件信息ID
            _this.formData.Idarr.push(_this.upload.file[j].id)
          }
        },
        /************************重置表单*************************/
        resetForm(){//取消时初始化表单信息
          this.dialogVisible = false
          let ids = []
          for (let i = 0; i < this.upload.file.length; i++) {
            ids.push(this.upload.file[i].id)
          }
          if (ids.length <= 0)
            return
          DeleteList({idarr: ids}).then(res => {//删除未提交但已经上传的文件信息
          })
        },
      },
      mounted() {
        this.screenWidth = window.screen.width
        this.$nextTick(()=>{//隐藏上传文件类型选择
          this.$refs.getFiles.ifShow = false
        })
      }
    }
  </script>
