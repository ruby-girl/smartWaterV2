<template>
  <div class="cl-container cl-container3" style="height: auto">
    <div style="padding: 0 30px 0 0;">
      <el-form :inline="true" ref="jp" :model="jp" :rules="rules" label-width="100px">
        <el-form-item label="人员编号:">
          <el-input size="small" disabled v-model="jp.EmpNo"/>
        </el-form-item>
        <el-form-item label="人员名称:" prop="EmpName">
          <el-input v-model.trim="jp.EmpName" size="small" maxlength="10" placeholder="请输入人员名称"/>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="jp.Gender" placeholder="请选择" size="small">
            <el-option label="女" value="女"/>
            <el-option label="男" value="男"/>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期:">
          <el-date-picker v-model="jp.Birthday" type="date" placeholder="年月日" size="small" value-format="yyyy-MM-dd" style="width: 185px"/>
        </el-form-item>
        <el-form-item label="电话号码:" prop="MobileNumber">
          <el-input v-model.trim="jp.MobileNumber" size="small" maxlength="11" placeholder="请输入11位电话号码"/>
        </el-form-item>
        <el-form-item label="身份证号:" prop="IDNumber">
          <el-input v-model.trim="jp.IDNumber" size="small" maxlength="18" placeholder="请输入18位身份证号"/>
        </el-form-item>
        <el-form-item label="入职时间:">
          <el-date-picker v-model="jp.EnrollingTime" type="date" placeholder="年月日" size="small"
                          value-format="yyyy-MM-dd" style="width: 185px"/>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="jp.EmailAddress" size="small" maxlength="50" placeholder="长度0-50"/>
        </el-form-item>
        <el-col v-for="(item,index) in sojList" :key="index" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" style="position: relative">
              <span style="position: absolute;color: #F56C6C;left: 45px;top:10px;">*</span>
              <span v-show="item.SYS_Department_Id==''&&isFlag"
                    style="position: absolute;color: #F56C6C;left: 100px;top:40px;font-size: 12px;">不能为空</span>
              <el-form-item label="部门:" label-width="100px" :class="item.SYS_Department_Id==''&&isFlag?'on':''">
                <el-select v-model="item.SYS_Department_Id" placeholder="请选择" size="small"
                           @change="getPostList(item.SYS_Department_Id,index)">
                  <el-option
                    v-for="(items,indexs) in item.depart"
                    :key="indexs"
                    :label="items.Name"
                    :value="items.Id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="10" :xl="6" style="position: relative">
              <span style="position: absolute;color: #F56C6C;left: -4px;top:10px;">*</span>
              <span v-show="item.OA_Job_Id==''&&isFlag"
                    style="position: absolute;color: #F56C6C;left: 70px;top:40px;font-size: 12px;">不能为空</span>
              <el-form-item label="岗位:" label-width="50px" :class="item.OA_Job_Id==''&&isFlag?'on':''">
                <el-select v-model="item.OA_Job_Id" placeholder="请选择" size="small" @change="recurFun(index)">
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
              <span class="el-icon-minus"
                    style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold"
                    @click="reduceFun(index)"/>
            </el-col>
            <el-col v-show="index==sojList.length-1 && sojList.length>1" :span="1">
              <span class="el-icon-minus"
                    style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold"
                    @click="reduceFun(index)"/>
            </el-col>
            <el-col v-show="index==sojList.length-1" :span="1">
              <span class="el-icon-plus"
                    style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold"
                    @click="addFun"/>
            </el-col>
          </el-row>
        </el-col>

        <el-form-item label="地址:" prop="adress" class="textAreaBox">
          <el-input v-model.trim="jp.Address" type="textarea" size="small" :rows="3" maxlength="100" placeholder="长度100"
                    resize="none"/>
        </el-form-item>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <uploadImg @getFileFun="getFileFun" ref="getFiles"/>
        </el-col>
        <el-form-item style="text-align: center;width: 100%">
          <el-button type="primary" size="small" @click="submitForm('jp')">保存</el-button>
          <el-button size="small" @click="resetForm('jp')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import uploadImg from '@/components/Upload/index'
  import {GetBlObjById, peopleUpDate, ComboBoxList, linkComboBoxList} from "@/api/organize"
  import {DeleteList} from "@/api/upload"

  export default {
    name: 'edit',
    components: {uploadImg},
    data() {
      return {
        isFlag: false,
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
        jp: {
          EmpNo: '',
          EmpName: '',
          oeoList: [],
          Gender: '',
          Birthday: '',
          MobileNumber: '',
          IDNumber: '',
          EnrollingTime: '',
          EmailAddress: '',
          JobStatus: '在职',
          Address: '',
          Idarr: []
        },
        upload: {
          file: []
        },
        sojList: [],
      }
    },
    methods: {
      /**
       * 增加部门
       * */
      addFun() {
        this.sojList.push({
          Id: '',
          OA_EmployeeName: '',
          OA_Employee_Id: '',
          OA_JobName: '',
          OA_Job_Id: '',
          SYS_DepartmentName: '',
          SYS_Department_Id: '',
          SYS_User_Id: '',
          post: [],
          depart: []
        })
        this.isFlag = false;
        this.getComboBoxList()
      },
      /**
       * 删除部门
       * */
      reduceFun(index) {
        this.sojList.splice(index, 1);//从start的位置开始向后删除delCount个元素
        this.getComboBoxList()
      },
      /**
       * 提交
       * */
      submitForm(formName) {
        let self = this
        this.isFlag = true;
        this.jp.oeoList = [];
        for (let i = 0; i < this.sojList.length; i++) {
          this.jp.oeoList.push({
            Id: this.sojList[i].Id,
            SYS_Department_Id: this.sojList[i].SYS_Department_Id,
            OA_Job_Id: this.sojList[i].OA_Job_Id,
            OA_EmployeeName: '',
            OA_Employee_Id: '',
            OA_JobName: '',
            SYS_DepartmentName: '',
            SYS_User_Id: ''
          })
        }
        this.jp.Idarr = []//初始上传文件ID集合字段
        delete this.jp.saList

        for (let j = 0; j < this.upload.file.length; j++) {
          this.jp.Idarr.push(this.upload.file[j].id)
        }
        for (let i = 0; i < this.jp.oeoList.length; i++) {
          if (this.jp.oeoList[i].OA_Job_Id == '' || this.jp.oeoList[i].SYS_Department_Id == '') {
            this.isFlag = true;
            return false
          } else {
            this.isFlag = false;
          }
        }

        this.$refs[formName].validate((valid) => {
          if (valid) {
            peopleUpDate(self.jp).then(res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.$emit("Changed1", 1)
              } else {
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
        this.$emit("Changed1", false)

        let ids = []
        for (let i = 0; i < this.upload.file.length; i++) {
          ids.push(this.upload.file[i].id)
        }
        if (ids.length <= 0)
          return
        DeleteList({idarr: ids}).then(res => {
        })
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
          if (res.code == 0) {
            for (let i = 0; i < this.sojList.length; i++) {
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
      getPostList(id, index, type) {
        let params = {SYS_Department_Id: id}
        linkComboBoxList(params).then(res => {
          if (res.code == 0) {
            for (let i = 0; i < this.sojList.length; i++) {
              if (i == index) {
                this.sojList[i].post = res.data
                if (type != 0) {//编辑部门时候初始化岗位
                  this.sojList[i].OA_Job_Id = ''
                }
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
       * 获取详情
       * */
      getInfo(id) {
        GetBlObjById({id: id}).then(res => {
          if (res.code == 0) {
            this.sojList = []
            let list = res.data.blList, obj = {}
            for (let i = 0; i < list.length; i++) {
              obj = {
                Id: list[i].Id,
                OA_EmployeeName: '',
                OA_Employee_Id: '',
                OA_JobName: '',
                OA_Job_Id: list[i].OA_Job_Id,
                SYS_DepartmentName: '',
                SYS_Department_Id: list[i].SYS_Department_Id,
                SYS_User_Id: '',
                post: [],
                depart: []
              }
              this.sojList.push(obj)
              this.getComboBoxList()
              this.getPostList(list[i].SYS_Department_Id, i, 0)
            }
            delete res.data.blList
            this.jp = res.data
            let fileList = res.data.saList//已经上传文件信息
            this.$refs.getFiles.setFiles(fileList)
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
        for (let i = 0; i < this.sojList.length; i++) {
          arr.push(this.sojList[i].OA_Job_Id)
        }
        var nary = arr.sort();
        for (var i = 0; i < nary.length - 1; i++) {
          if (nary[i] == nary[i + 1] && nary[i] != '') {
            this.$message({
              message: '个人所属岗位不能重复',
              type: 'warning'
            });
            this.sojList[index].OA_Job_Id = ''
          }
        }
      }
    },
    mounted() {
      this.getComboBoxList()
    }
  }
</script>
