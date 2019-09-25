<template>
  <el-dialog
    :close-on-click-modal="false"
    top="5vh"
    title="人员管理添加"
    :visible.sync="addVisible"
    :before-close="handleClose"
    width="60%">
      <div class="cl-container cl-container3" style="height: auto">
        <div style="padding: 0 30px 0 0;">
          <el-form :inline="true" ref="jp" :model="jp" :rules="rules" label-width="100px">
            <el-form-item label="人员编号:">
              <el-input size="small" disabled/>
            </el-form-item>
            <el-form-item label="人员名称:" prop="EmpName">
              <el-input v-model.trim="jp.EmpName" size="small" maxlength="10" placeholder="请输入人员名称"/>
            </el-form-item>
            <el-form-item label="性别:" prop="Gender">
              <el-select v-model="jp.Gender" placeholder="请选择" size="small">
                <el-option label="女" value="女"/>
                <el-option label="男" value="男"/>
              </el-select>
            </el-form-item>
            <el-form-item label="出生日期:" prop="Birthday">
              <el-date-picker v-model="jp.Birthday" type="date" placeholder="年月日" size="small" value-format="yyyy-MM-dd" style="width: 185px"/>
            </el-form-item>
            <el-form-item label="电话号码:" prop="MobileNumber">
              <el-input v-model.trim="jp.MobileNumber" size="small" maxlength="11" placeholder="请输入11位电话号码"/>
            </el-form-item>
            <el-form-item label="身份证号:" prop="IDNumber">
              <el-input v-model.trim="jp.IDNumber" size="small" maxlength="18" placeholder="请输入18位身份证号"/>
            </el-form-item>
            <el-form-item label="入职时间:" prop="EnrollingTime">
              <el-date-picker v-model="jp.EnrollingTime" type="date" placeholder="年月日" size="small"
                              value-format="yyyy-MM-dd" style="width: 185px"/>
            </el-form-item>
            <el-form-item label="邮箱:" prop="EmailAddress">
              <el-input v-model="jp.EmailAddress" size="small" maxlength="50" placeholder="长度0-50"/>
            </el-form-item>
            <el-form-item label="岗位状态:" prop="JobStatus">
              <el-input v-model.trim="jp.JobStatus" size="small" disabled/>
            </el-form-item>
            <!--部门岗位组件 s-->
            <PostInfo ref="childPost"></PostInfo>
            <!--部门岗位组件 e-->
            <el-form-item label="地址:" prop="Address" class="textAreaBox">
              <el-input v-model.trim="jp.Address" type="textarea" size="small" :row="3" maxlength="100" placeholder="长度100"
                        resize="none"/>
            </el-form-item>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <!--上传文件组建 s-->
                <uploadImg @getFileFun="getFileFun" ref="uploadCom"/>
              <!--上传文件组建 e-->
            </el-col>
            <el-form-item style="text-align: center;width: 100%">
              <el-checkbox v-model="goOn">继续添加</el-checkbox>
              <el-button type="primary" size="small" @click="submitForm('jp')">保存</el-button>
              <el-button size="small" @click="resetForm('jp')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
  </el-dialog>
</template>
<script>
  import '@/styles/organization.scss'
  import PostInfo from './PostInfo'
  import uploadImg from '@/components/Upload/index'
  import {peopleAdd, ComboBoxList, linkComboBoxList} from "@/api/organize"
  import {DeleteList} from "@/api/upload"

  export default {
    name: 'add',
    components: {uploadImg, PostInfo},
    data() {
      return {
        addVisible:false,//新增弹窗隐藏标识
        goOn: false,//是否继续添加标识
        rules: {
          EmpName: [
            {required: true, message: '请输入人员名称', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          SYS_Department_Id: [
            {required: true, message: '请选择部门', trigger: 'change'}
          ],
          OA_Job_Id: [
            {required: true, message: '请选择岗位', trigger: 'change'}
          ],
          MobileNumber: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {
              pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              message: '手机号格式有误',
              trigger: 'blur'
            }
          ],
          IDNumber: [
            {required: true, message: '请输入证件号', trigger: 'blur'},
            {
              pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: '证件号码格式有误！',
              trigger: 'blur'
            }
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        },
        jp: {//新增对象
          EmpName: '',//人员名称
          oeoList: [],//部门岗位数值
          Gender: '',//性别
          Birthday: '',//生日
          MobileNumber: '',//手机号
          IDNumber: '',//身份证号
          EnrollingTime: '',//入职时间
          JobStatus: '在职',
          Address: '',//地址
          Idarr: [],//上传文件ID
          EmailAddress: ''//邮箱
        },
        upload: {//上传文件数组信息
          file: []
        }
      }
    },
    methods: {
      submitForm(formName) {//提交方法
        this.$refs.childPost.isFlag = true;//先判断一条及多条部门岗位信息是否正确，默认不允许为空
        this.jp.oeoList = []
        for (let j = 0; j < this.upload.file.length; j++) {//过滤获取上传文件信息ID
          this.jp.Idarr.push(this.upload.file[j].id)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            for (let i = 0; i < this.$refs.childPost.sojList.length; i++) {//部门岗位信息
              if (this.$refs.childPost.sojList[i].SYS_Department_Id != '' && this.$refs.childPost.sojList[i].OA_Job_Id != '') {
                this.jp.oeoList.push({
                  SYS_Department_Id: this.$refs.childPost.sojList[i].SYS_Department_Id,
                  OA_Job_Id: this.$refs.childPost.sojList[i].OA_Job_Id
                })
              } else {
                return false
              }
            }
            peopleAdd(this.jp).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: 'success',
                  duration: 4000
                });
                this.$refs.childPost.sojList = [{//初始化岗位部门信息并赋值
                  SYS_Department_Id: '',
                  OA_Job_Id: '',
                  post: [],
                  depart: []
                }]
                this.$refs.childPost.getComboBoxList()
                this.$refs.childPost.isFlag = false
                this.$refs.uploadCom.certificates = '身份证'
                this.$refs.uploadCom.fileList = []
                this.$refs[formName].resetFields()
                if (!this.goOn) {//判断勾选继续添加选项
                  this.$refs[formName].resetFields()
                  this.$emit("Changed", 1)
                }
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning',
                  duration: 4000
                });
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm(formName) {//重置表单
        this.$refs[formName].resetFields()
        this.$emit("Changed", false)//触发父组件事件
        this.$refs.childPost.sojList = [{//初始化部门岗位信息
          SYS_Department_Id: '',
          OA_Job_Id: '',
          post: [],
          depart: []
        }]
        this.$refs.childPost.getComboBoxList()
        this.$refs.childPost.isFlag = false
        this.$refs.uploadCom.certificates = '身份证'
        this.$refs.uploadCom.fileList = []

        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {//删除未提交但已经上传的文件信息
        })
      },
      getFileFun(data) {//获取上传文件信息
        this.upload.file = data
      },
      handleClose(){//弹窗关闭事件
        this.resetForm('jp')
      }
    }
  }
</script>
