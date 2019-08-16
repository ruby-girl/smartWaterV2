<template>
  <div class="cl-container cl-container3">
    <div>
      <el-form ref="jp" :model="jp" :rules="rules" label-width="100px">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="人员编号:">
              <el-input size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="人员名称:" prop="EmpName">
              <el-input v-model="jp.EmpName" size="small" maxlength="10" placeholder="请输入人员名称" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="性别:" prop="Gender">
              <el-select v-model="jp.Gender" placeholder="请选择" size="small">
                <el-option label="女" value="女" />
                <el-option label="男" value="男" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="出生日期:" prop="Birthday">
              <el-date-picker v-model="jp.Birthday" type="date" placeholder="年月日" size="small" value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="电话号码:" prop="MobileNumber">
              <el-input v-model="jp.MobileNumber" size="small" maxlength="11" placeholder="请输入11位电话号码" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="身份证号:" prop="IDNumber">
              <el-input v-model="jp.IDNumber" size="small" maxlength="18" placeholder="请输入18位身份证号" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="入职时间:" prop="EnrollingTime">
              <el-date-picker v-model="jp.EnrollingTime" type="date" placeholder="年月日" size="small" value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="邮箱:">
              <el-input v-model="jp.EmailAddress" size="small" maxlength="10" placeholder="长度0-50" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
            <el-form-item label="岗位状态:" prop="JobStatus">
              <el-input v-model="jp.JobStatus" size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col v-for="(item,index) in sojList" :key="index" :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
            <el-row>
              <el-col :span="12" style="position: relative">
                <span style="position: absolute;color: #F56C6C;left: 45px;top:10px;">*</span>
                <span v-show="item.SYS_Department_Id==''&&isFlag" style="position: absolute;color: #F56C6C;left: 100px;top:40px;font-size: 12px;">不能为空</span>
                <el-form-item label="部门:" label-width="100px" :class="item.SYS_Department_Id==''&&isFlag?'on':''" >
                  <el-select v-model="item.SYS_Department_Id" placeholder="请选择" size="small" @change="getPostList(item.SYS_Department_Id,index)">
                    <el-option
                      v-for="(items,indexs) in item.depart"
                      :key="indexs"
                      :label="items.Name"
                      :value="items.Id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" style="position: relative">
                <span style="position: absolute;color: #F56C6C;left: 15px;top:10px;">*</span>
                <span v-show="item.OA_Job_Id==''&&isFlag" style="position: absolute;color: #F56C6C;left: 70px;top:40px;font-size: 12px;">不能为空</span>
                <el-form-item label="岗位:" label-width="70px" :class="item.OA_Job_Id==''&&isFlag?'on':''" >
                  <el-select v-model="item.OA_Job_Id" placeholder="请选择" size="small" @change="recurFun(index)" >
                    <el-option
                      v-for="(items,indexs) in item.post"
                      :key="indexs"
                      :label="items.Name"
                      :value="items.Id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-show="index<=sojList.length-2" :span="1">
                <span class="el-icon-minus" style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold" @click="reduceFun(index)" />
              </el-col>
              <el-col v-show="index==sojList.length-1 && sojList.length>1" :span="1">
                <span class="el-icon-minus" style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold" @click="reduceFun(index)" />
              </el-col>
              <el-col v-show="index==sojList.length-1" :span="1">
                <span class="el-icon-plus" style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold" @click="addFun" />
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="地址:" prop="Address">
              <el-input v-model="jp.Address" type="textarea" size="small" maxlength="100" placeholder="长度100" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item>
              <uploadImg @getFileFun="getFileFun" ref="uploadCom"/>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="footBox">
          <el-checkbox v-model="goOn">继续添加</el-checkbox>
          <el-button type="primary" size="small" @click="submitForm('jp')">保存</el-button>
          <el-button size="small" @click="resetForm('jp')">取消</el-button>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
  import '../../styles/organization.scss'
  import uploadImg from '../../components/Upload/index'
  import { peopleAdd, ComboBoxList, linkComboBoxList } from "@/api/organize"
  import Bus from '@/utils/bus.js'

  export default {
    name: 'PeopleAdd',
    components: { uploadImg },
    data() {
      return {
        isFlag:false,
        goOn: false,
        rules: {
          EmpName: [
            { required: true, message: '请输入人员名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          SYS_Department_Id: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          OA_Job_Id: [
            { required: true, message: '请选择岗位', trigger: 'change' }
          ],
          MobileNumber: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
              message: '手机号格式有误',
              trigger: 'blur'
            }
          ],
          IDNumber: [
            { required: true, message: '请输入证件号', trigger: 'blur' },
            {
              pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: '证件号码格式有误！',
              trigger: 'blur'
            }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
        jp: {
          EmpName: '',
          oeoList:[],
          Gender: '',
          Birthday: '',
          MobileNumber: '',
          IDNumber: '',
          EnrollingTime: '',
          JobStatus: '在职',
          Address: '',
          Idarr:[],
          EmailAddress:''
        },
        upload: {
          file: []
        },
        sojList:[
          {
            SYS_Department_Id: '',
            OA_Job_Id: '',
            post: [],
            depart: []
          },
        ],
      }
    },
    mounted() {
      this.getComboBoxList()
    },
    methods: {
      /**
       * 增加部门
       * */
      addFun() {
        this.sojList.push({
          SYS_Department_Id: '',
          OA_Job_Id: '',
          post: [],
          depart: []
        })
        this.getComboBoxList()
      },
      /**
       * 删除部门
       * */
      reduceFun(index) {
        this.sojList.splice(index,1);//从start的位置开始向后删除delCount个元素
        this.getComboBoxList()
      },
      /**
       * 提交
       * */
      submitForm(formName) {
        this.isFlag = true;
        for(let i=0;i< this.sojList.length; i++) {//部门岗位信息
          this.jp.oeoList.push({
            SYS_Department_Id: this.sojList[i].SYS_Department_Id,
            OA_Job_Id: this.sojList[i].OA_Job_Id
          })
        }
        for(let j =0;j<this.upload.file.length;j++){
          this.jp.Idarr.push(this.upload.file[j].id)
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
              peopleAdd(this.jp).then(res => {
                if(res.code==0){
                  this.$message({
                    message: res.message,
                    type: 'success'
                  });
                  if(this.goOn){
                    this.sojList = [{
                      SYS_Department_Id: '',
                      OA_Job_Id: '',
                      post: [],
                      depart: []
                    }]
                    this.getComboBoxList()
                    this.isFlag = false
                    this.$refs.uploadCom.certificates = '身份证'
                    this.$refs.uploadCom.fileList = []
                    this.$refs[formName].resetFields()
                  }else{
                    Bus.$emit('msg', this.$route)
                  }
                }else {
                  this.$message({
                    message: res.message,
                    type: 'warning'
                  });
                }
              })

          } else {
            return false
          }
        })
      },
      /**
       * 重置
       * */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        Bus.$emit('msg', this.$route)
      },
      /**
       * 获取上传文件信息
       * */
      getFileFun(data) {
        this.upload.file = data
      },
      /**
       * 获取部门信息
       * */
      getComboBoxList() {
        ComboBoxList().then(res => {
          if(res.code==0){
            for(let i = 0;i< this.sojList.length;i++) {
              res.data.shift()
              this.sojList[i].depart = res.data
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      },
      /**
       * 岗位联动
       * */
      getPostList(id,index) {
        let params = { SYS_Department_Id : id}
        linkComboBoxList(params).then(res => {
          if(res.code==0){
            for(let i = 0;i< this.sojList.length;i++) {
              if(i==index){
                res.data.shift()
                this.sojList[i].post = res.data
              }
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      },
      /**
       * 添加岗位部门信息去重
       * */
      recurFun(index) {
        let arr = []
        for(let i=0;i<this.sojList.length;i++){
          arr.push(this.sojList[i].OA_Job_Id)
        }
        var nary = arr.sort();
        for(var i = 0; i < nary.length - 1; i++)
        {
          if (nary[i] == nary[i+1])
          {
            this.$message({
              message: '个人所属岗位不能重复',
              type: 'warning'
            });
            this.sojList[index].OA_Job_Id = ''
          }
        }
      }
    }
  }
</script>
