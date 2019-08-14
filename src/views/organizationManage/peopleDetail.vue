<template>
  <div class="cl-container cl-container3">
    <div>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="人员编号:">
              <span>{{ form.EmpNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="人员名称:">
              <span>{{ form.EmpName }}</span>
            </el-form-item>
          </el-col>

          <el-col v-for="(item,index) in form.blList" :key="index" :xs="24" :sm="24" :md="24" :lg="24" :xl="16">
              <el-col :span="12">
                <el-form-item label="部门:">
                  <span>{{ item.SYS_DepartmentName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位:">
                  <span>{{ item.OA_JobName }}</span>
                </el-form-item>
              </el-col>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="性别:">
              <span>{{ form.Gender }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="出生日期:">
              <span>{{ form.Birthday }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="电话号码:">
              <span>{{ form.MobileNumber }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="身份证号:">
              <span>{{ form.IDNumber }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="入职时间:">
              <span> {{ form.EnrollingTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
            <el-form-item label="岗位状态:">
              <span>{{ form.JobStatus }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="24">
            <el-form-item label="地址:">
              <span>{{ form.Address }}</span>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item>
              <ul class="fileBox clearfix">
                <li v-for="(item,index) in file" :key="index">
                  <p v-show="item.type === 0?true:false"><img :src="item.url"></p>
                  <p v-show="item.type === 1?true:false"><span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span></p>
                  <p v-show="item.type === 2?true:false"><span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span></p>
                  <p v-show="item.type === 3?true:false"><span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span></p>
                  <i @click="handlePreview(item)">{{ item.name }}</i>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div v-show="ifImg" class="cl-image-viewer">
      <div class="cl-image-viewer__mask" @click="ifImg=false" />
      <img :src="curSrc" alt="">
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="dialogVisible"
    >
      <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100" />
    </el-dialog>
  </div>
</template>

<script>
import { GetBlObjById } from "@/api/organize"
import '../../styles/organization.scss'
export default {
  name: 'PeopleDetail',
  data() {
    return {
      form: {
        Address: '',
        Birthday: '',
        CreateTime: '',
        CreateUser: '',
        CreateUserId: '',
        EmailAddress: '',
        EmpName: '',
        EmpNo: '',
        EnrollingTime: '',
        Gender: '',
        IDNumber: '',
        Id: '',
        JobStatus: '',
        LoginName: '',
        MobileNumber: '',
        ResignTime: '',
        SYS_User_Id: '',
        blList:[
          {
            Id: '',
            OA_EmployeeName: '',
            OA_Employee_Id: '',
            OA_JobName: '',
            OA_Job_Id: '',
            SYS_DepartmentName: '',
            SYS_Department_Id: '',
            SYS_User_Id: '',
          },
        ],
      },
      file: [
        {
          name: 'city.jpeg',
          type: 0,
          url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg' },
        {
          name: 'sds1.xls',
          type: 2,
          url: 'https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls'
        },
        {
          name: 'PlayerAPI_v1.0.6.pdf',
          type: 3,
          url: 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf'
        }
      ],
      curSrc: '',
      ifImg: false,
      dialogVisible: false,
      iframeUrl: '',
      clientHeight: ''
    }
  },
  methods: {
    handlePreview(file) { // 点击文件列表中已上传的文件时的事件
      const type = file.type
      switch (type) { // 0.图片，1word,2excel,3pdf
        case 0:
          this.curSrc = file.url
          this.ifImg = true
          break
        case 1:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
        case 2:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
        case 3:
          this.dialogVisible = true
          this.iframeUrl = file.url
          break
      }
    },
    getInfo() {
      GetBlObjById({id:this.$route.params.id}).then(res => {
        if(res.code==0){
          this.form = res.data
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    }
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight
    window.onresize = function temp() {
      this.clientHeight = document.documentElement.clientHeight
    }
    this.getInfo()
  }
}
</script>
