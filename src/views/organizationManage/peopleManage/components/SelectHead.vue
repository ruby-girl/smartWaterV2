<template>
  <div>
    <el-form
      ref="formName"
      :inline="true"
      :model="queryData"
      :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item label="部门" prop="SYS_Department_Id" :class="!ifMore?'firstItem':''">
        <el-select v-model="queryData.SYS_Department_Id" placeholder="请选择" size="small" @change="getPostList"
                   @keyup.enter.native="searchFun">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="(item,index) in departArray"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="OA_Job_Id">
        <el-select v-model="queryData.OA_Job_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(queryData.OA_Job_Id,'OA_Job_Id',postArray,'岗位')">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="(item,index) in postArray"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <transition name="fade">
      <el-form-item label="人员" v-show="screenWdth<1400?ifMore:true" prop="EmpNo">
        <el-input
          @change="getText(queryData.EmpNo,'EmpNo','','人员')"
          @keyup.enter.native="searchFun"
          v-model="queryData.EmpNo"
          placeholder="人员名称/员工编号"
          maxlength="10"
          size="small"
        />
      </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="岗位状态 " v-show="screenWdth<=1680?ifMore:true" prop="JobStatus">
          <el-select v-model="queryData.JobStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun"  @change="getText(queryData.JobStatus,'JobStatus',jobsArray,'岗位状态')">
            <el-option v-for="(item,index) in jobsArray" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="性别 " v-show="ifMore" prop="Gender">
          <el-select v-model="queryData.Gender" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(queryData.Gender,'Gender',GenderArray,'性别')">
            <el-option v-for="(item,index) in GenderArray" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="电话号码 " v-show="ifMore" prop="MobileNumber">
          <el-input
            @change="getText(queryData.MobileNumber,'MobileNumber','','电话号码')"
            @keyup.enter.native="searchFun"
            v-model="queryData.MobileNumber"
            placeholder="请输入11位电话号码"
            maxlength="11"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="身份证号 " v-show="ifMore" prop="IDNumber">
          <el-input
            @change="getText(queryData.IDNumber,'IDNumber','','身份证号')"
            @keyup.enter.native="searchFun"
            v-model.trim="queryData.IDNumber"
            placeholder="请输入18位身份证号"
            maxlength="18"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="账号状态 " v-show="ifMore" prop="AccountStatus">
          <el-select v-model="queryData.AccountStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(queryData.AccountStatus,'AccountStatus',AccountArray,'账号状态')">
            <el-option v-for="(item,index) in AccountArray" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="邮箱 " v-show="ifMore" prop="EmailAddress">
          <el-input
            @change="getText(queryData.EmailAddress,'EmailAddress','','邮箱')"
            @keyup.enter.native="searchFun"
            v-model="queryData.EmailAddress"
            placeholder="长度0-50"
            maxlength="50"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="操作人" v-show="ifMore" prop="editUserId">
          <el-select v-model="queryData.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun"
                     @change="getText(queryData.editUserId,'editUserId',operationArray,'操作人')">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="(item,index) in operationArray"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="出生日期 " v-show="ifMore" prop="birthdayTime">
          <el-date-picker
            @keydown.enter.native="searchFun"
            :editable="false"
            v-model="birthdayTime"
            :unlink-panels="true"
            size="small"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime2"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="入职时间 " v-show="ifMore" prop="EntryTime">
          <el-date-picker
            @keydown.enter.native="searchFun"
            :editable="false"
            v-model="EntryTime"
            :unlink-panels="true"
            size="small"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime1"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="操作时间 " v-show="ifMore" prop="operationTime">
          <el-date-picker
            @keydown.enter.native="searchFun"
            :editable="false"
            v-model="operationTime"
            :unlink-panels="true"
            size="small"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTime3"
          />
        </el-form-item>
      </transition>
      <el-form-item label="">
        <i v-show="ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
        <i v-show="!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
        <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
        <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import {ComboBoxList, linkComboBoxList, GetRoleNameList} from "@/api/organize"

  export default {
    name: "SelectHead",
    data() {
      return {
        jobsArray:[{Name:'在职',Id:'在职'}],
        AccountArray:[
          {Name:'全部',Id:'-1'},
          {Name:'已分配',Id:'已分配'},
          {Name:'未分配',Id:'未分配'}
          ],
        GenderArray:[
          {Name:'全部',Id:'-1'},
          {Name:'女',Id:'女'},
          {Name:'男',Id:'男'}
          ],
        ifMore: false,//判断是否查询隐藏条件
        queryData: {
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SYS_Department_Id: '-1',//部门
          OA_Job_Id: '-1',//岗位
          EmpNo: '',//员工编号或名称
          JobStatus: '在职',//职位
          EnrollingTime: '',//入职开始结束时间
          EnrollingTimeEnd: '',
          Gender: '-1',//性别
          IDNumber: '',//身份证
          MobileNumber: '',//手机号
          Birthday: '',//生日开始结束时间
          BirthdayEnd: '',
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          EmailAddress: '',//邮箱地址
          AccountStatus: '-1',//账号状态
          tableId: '0000003'
        },//查询条件对象
        operationTime: [],//操作时间
        birthdayTime: [],//生日
        EntryTime: [],//入职时间
        departArray: [],//部门数值
        postArray: [],//岗位值
        operationArray: [],//操作人值
        screenWdth:''
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun() {
        this.$parent.queryData =  Object.assign({},this.queryData)
        this.$parent.searchFun();
      },
      /**
       * 从日期组建中分割开始结束时间
       * */
      getTime1(data) {
        this.getText(this.EntryTime,'EntryTime','','入职时间')
        if (data != null) {
          this.queryData.EnrollingTime = data[0]
          this.queryData.EnrollingTimeEnd = data[1]
        } else {
          this.queryData.EnrollingTime = ''
          this.queryData.EnrollingTimeEnd = ''
        }
      },
      getTime2(data) {
      this.getText(this.birthdayTime,'birthdayTime','','出生日期')
        if (data != null) {
          this.queryData.Birthday = data[0]
          this.queryData.BirthdayEnd = data[1]
        } else {
          this.queryData.Birthday = ''
          this.queryData.BirthdayEnd = ''
        }
      },
      getTime3(data) {
        this.getText(this.operationTime,'operationTime','','操作时间')
        if (data != null) {
          this.queryData.editStartTime = data[0]
          this.queryData.editEndTime = data[1]
        } else {
          this.queryData.editStartTime = ''
          this.queryData.editEndTime = ''
        }
      },
      /**
       * 获取部门信息
       * */
      getComboBoxList() {
        ComboBoxList().then(res => {
          if (res.code == 0) {
            this.departArray = res.data;
            this.getPostList('-1')
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      /**
       * 岗位联动
       * */
      getPostList(id) {
        this.getText(id,'SYS_Department_Id',this.departArray,'部门')
        let params = {SYS_Department_Id: id}
        linkComboBoxList(params).then(res => {
          if (res.code == 0) {
            this.postArray = res.data;
            this.queryData.OA_Job_Id = '-1'
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      /**
       * 获取操作员下拉
       * */
      GetRoleNameList() {
        GetRoleNameList().then(res => {
          if (res.code == 0) {
            this.operationArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.$parent.tipsDataCopy = []
        this.operationTime = []
        this.birthdayTime = []
        this.EntryTime = []

        this.queryData.EnrollingTime = ''
        this.queryData.EnrollingTimeEnd = ''
        this.queryData.Birthday = ''
        this.queryData.BirthdayEnd = ''
        this.queryData.editStartTime = ''
        this.queryData.editEndTime = ''
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.getComboBoxList()
      this.GetRoleNameList()
    }
  }
</script>

