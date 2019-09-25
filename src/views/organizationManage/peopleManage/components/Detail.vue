<template>
  <el-dialog
    :close-on-click-modal="false"
    top="5vh"
    title="人员管理详情"
    :visible.sync="detailVisible"
    :before-close="handleClose3"
    width="60%">
    <div class="cl-container cl-container3" style="padding: 0;height: auto">
      <div class="detailBox">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="50">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="人员编号:">
                <span>{{ form.EmpNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="人员名称:">
                <span>{{ form.EmpName }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="性别:">
                <span>{{ form.Gender }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="出生日期:">
                <span>{{ form.Birthday }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="电话号码:">
                <span>{{ form.MobileNumber }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="身份证号:">
                <span>{{ form.IDNumber }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="入职时间:">
                <span> {{ form.EnrollingTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="邮箱:">
                <span> {{ form.EmailAddress }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6">
              <el-form-item label="岗位状态:">
                <span>{{ form.JobStatus }}</span>
              </el-form-item>
            </el-col>
            <el-col v-for="(item,index) in form.blList" :key="index" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" style="padding-left: 0">
                <el-form-item label="部门:">
                  <span>{{ item.SYS_DepartmentName }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" style="padding-left: 0;">
                <el-form-item label="岗位:" style="margin-left: 25px;">
                  <span>{{ item.OA_JobName }}</span>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="地址:">
                <span>{{ form.Address }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="file.length>0">
              <el-form-item>
                <ul :class="maxHeight? 'fileBox clearfix fileBoxHeight':'fileBox clearfix'">
                  <li v-for="(item,index) in file" :key="index" class="detailFile">
                    <p v-show="item.type === 0?true:false"><img :src="item.url"></p>
                    <p v-show="item.type === 1?true:false"><span class="icon iconfont" style="color:#345e9e;font-size: 60px;">&#xe65d;</span></p>
                    <p v-show="item.type === 2?true:false"><span class="icon iconfont" style="color:#389850;font-size: 60px;">&#xe693;</span></p>
                    <p v-show="item.type === 3?true:false"><span class="icon iconfont" style="color:#dc2e1b;font-size: 60px;">&#xe691;</span></p>
                    <i @click="handlePreview(item)">{{ item.name }}</i>
                  </li>
                </ul>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
              <el-form-item label="操作人:">
                <span>{{ form.EditUser }}</span>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="操作时间:">
                <span>{{ form.EditTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-show="ifImg" class="cl-image-viewer">
        <div class="cl-image-viewer__mask" @click="ifImg=false" />
        <img :src="curSrc" alt="">
      </div>
      <!--全屏预览图片 s-->
      <el-dialog
        :visible.sync="dialogVisible"
        :fullscreen="dialogVisible">
        <iframe :src="iframeUrl" width="100%" frameborder="0" :height="clientHeight-100" />
      </el-dialog>
      <!--全屏预览图片 e-->
    </div>
  </el-dialog>
</template>

<script>
  import { GetBlObjById } from "@/api/organize"
  import '@/styles/organization.scss'
  export default {
    name: 'detail',
    data() {
      return {
        detailVisible:false,//详情弹窗隐藏标识
        maxHeight:false,//上传文件区域最大高度
        form: {//详情表单信息
          Address: '',//地址
          Birthday: '',//生日
          CreateTime: '',//操作时间
          CreateUser: '',//操作人
          CreateUserId: '',//操作人ID
          EmailAddress: '',//邮箱
          EmpName: '',//人员名称
          EmpNo: '',//人员编号
          EnrollingTime: '',//入职时间
          Gender: '',//性别
          IDNumber: '',//身份证
          Id: '',
          JobStatus: '',//工作状态
          LoginName: '',//账户名称
          MobileNumber: '',//手机号码
          ResignTime: '',//注册时间
          SYS_User_Id: '',
          blList:[//部门集合
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
        file: [],//上传文件集合
        curSrc: '',//当前图片路径
        ifImg: false,//是否显示图片标识
        dialogVisible: false,//弹窗标识
        iframeUrl: '',//预览图片路径
        clientHeight: ''//预览图片高度
      }
    },
    methods: {
      handleClose3(){//弹窗关闭事件
        this.resetForm('form')
        this.detailVisible = false
      },
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
      getInfo(id) {//根据ID 获取当前数据详情信息
        GetBlObjById({id:id}).then(res => {
          if(res.code==0){
            this.file = []
            if(res.data.Birthday!=null){
              res.data.Birthday = res.data.Birthday.split(' ')[0]
            }
            if(res.data.EnrollingTime!=null){
              res.data.EnrollingTime = res.data.EnrollingTime.split(' ')[0]
            }
            this.form = res.data
            let fileData = res.data.saList
            let obj = {}
            for(let i=0;i<fileData.length;i++){//区分不同文件类型设置不同展示样式
              let thisType;
              const Suffix = fileData[i].FileExtName.split('.')[1]
              if (Suffix === 'docx' || Suffix === 'doc') {
                thisType = 1
              } else if (Suffix === 'xlsx' || Suffix === 'xls') {
                thisType = 2
              } else if (Suffix === 'pdf') {
                thisType = 3
              }else {
                thisType = 0
              }
              obj = {
                id: fileData[i].Id,
                name:fileData[i].FileName,
                type: thisType,
                url: this.baseUrl + (fileData[i].RelativePath).replace("~",""),
              }
              this.file.push(obj)
              if(this.file.length>16){//根据文件个数动态设置，文件显示区域高度
                this.maxHeight = true
              }else{
                this.maxHeight = false
              }
            }
          }else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      resetForm(formName) {//重置清空避免点击下次信息页面显示错乱
        this.$refs[formName].resetFields()
        this.file = []
      }
    },
    mounted() {
      let self = this
      this.clientHeight = document.documentElement.clientHeight
      window.onresize = function temp() {
        this.clientHeight = document.documentElement.clientHeight
      }
      document.addEventListener('keydown', function(e){//手动清空，避免点击下一条数据，预览图片弹窗没有关闭
        if(e.which == 27){
           self.ifImg = false
        }
      }, false);
    }
  }
</script>
