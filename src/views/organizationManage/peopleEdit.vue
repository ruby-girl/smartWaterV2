<template>
  <div class="cl-container cl-container3">
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="50">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="人员编号:">
              <el-input v-model="ruleForm.code" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="人员名称:" prop="name">
              <el-input v-model="ruleForm.name" size="small" maxlength="10" placeholder="长度10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="公司:" prop="company">
              <el-select v-model="ruleForm.company" placeholder="请选择（单选）" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="水厂:" prop="waterworks">
              <el-select v-model="ruleForm.waterworks" placeholder="请选择（单选）" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="部门:" prop="department">
              <el-select v-model="ruleForm.department" placeholder="请选择（单选）" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="岗位:" prop="post">
              <el-select v-model="ruleForm.post" placeholder="请选择（单选）" size="small">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="性别:">
              <el-select v-model="ruleForm.sex" placeholder="请选择（单选）" size="small">
                <el-option label="女" value="女"></el-option>
                <el-option label="男" value="男"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="出生日期:">
              <el-date-picker type="date" placeholder="年月日（单选）" v-model="ruleForm.birthday" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="电话号码:" prop="phone">
              <el-input v-model="ruleForm.phone" size="small" maxlength="11" placeholder="长度11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="身份证号:" prop="id">
              <el-input v-model="ruleForm.id" size="small" maxlength="18" placeholder="长度18"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="入职时间:">
              <el-date-picker type="date" placeholder="年月日（单选）" v-model="ruleForm.entryTime" size="small"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="岗位状态:">
              <el-input v-model="ruleForm.status" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="地址:" prop="adress">
              <el-input type="textarea" v-model="ruleForm.adress" size="small" maxlength="100" placeholder="长度100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item label="附件:">
              <el-select v-model="ruleForm.certificates" placeholder="请选择（单选）" size="small">
                <el-option label="身份证" value="身份证"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item>
              <uploadImg @getFileFun="getFileFun"></uploadImg>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="footBox">
          <el-checkbox v-model="goOn">继续添加</el-checkbox>
          <el-button type="primary" @click="submitForm('ruleForm')" size="small">保存</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">取消</el-button>
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
import '../../styles/organization.scss'
import uploadImg from '../../components/Upload/index'
export default {
  name: 'PeopleEdit',
  components: { uploadImg },
  data() {
    return {
      goOn: false,
      ruleForm: {
        code: '',
        name: '',
        company: '',
        waterworks: '',
        department: '',
        post: '',
        sex: '',
        birthday: '',
        phone: '',
        id: '',
        entryTime: '',
        status: '在职',
        adress: '',
        Certificates: '',
        file: []
      },
      rules: {
        name: [
          { required: true, message: '请输入人员名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        waterworks: [
          { required: true, message: '请选择水厂', trigger: 'change' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        post: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: '手机号格式有误',
            trigger: 'blur'
          }
        ],
        id: [
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
      }
    }
  },
  methods: {
    /**
     * 提交
     * */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 重置
     * */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /**
     * 获取上传文件信息
     * */
    getFileFun(data) {
      this.ruleForm.file = data
    }
  }
}
</script>
