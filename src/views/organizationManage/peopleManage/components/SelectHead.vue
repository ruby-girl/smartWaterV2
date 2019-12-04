<template>
  <div>
    <!--区分不同分辨率下样式-->
    <el-form
      :inline="true"
      :model="queryData"
      class="head-search-form form-inline-small-input ssearchText1"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item label="部门 ">
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
      <el-form-item label="岗位 ">
        <el-select v-model="queryData.OA_Job_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="(item,index) in postArray"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="人员 ">
        <el-input
          @keyup.enter.native="searchFun"
          v-model="queryData.EmpNo"
          placeholder="人员名称/员工编号"
          maxlength="10"
          size="small"
        />
      </el-form-item>
      <el-form-item label="岗位状态 ">
        <el-select v-model="queryData.JobStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
          <el-option label="在职" value="在职"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别 ">
        <el-select v-model="queryData.Gender" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="女" value="女"/>
          <el-option label="男" value="男"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
        <el-form-item label="电话号码 " v-show="ifMore">
          <el-input
            @keyup.enter.native="searchFun"
            v-model="queryData.MobileNumber"
            placeholder="请输入11位电话号码"
            maxlength="11"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="身份证号 " v-show="ifMore">
          <el-input
            @keyup.enter.native="searchFun"
            v-model.trim="queryData.IDNumber"
            placeholder="请输入18位身份证号"
            maxlength="18"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="账号状态 " v-show="ifMore">
          <el-select v-model="queryData.AccountStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
            <el-option label="全部" value="-1"/>
            <el-option label="已分配" value="已分配"/>
            <el-option label="未分配" value="未分配"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="邮箱 " v-show="ifMore">
          <el-input
            @keyup.enter.native="searchFun"
            v-model="queryData.EmailAddress"
            placeholder="长度0-50"
            maxlength="50"
            size="small"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="操作人 " v-show="ifMore">
          <el-select v-model="queryData.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
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
        <el-form-item label="出生日期 " v-show="ifMore">
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
        <el-form-item label="入职时间 " v-show="ifMore">
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
        <el-form-item label="操作时间 " v-show="ifMore">
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
      <el-form-item>
        <el-button type="primary" size="mini" class="cl-search" @click="searchFun"><i
          class="icon iconfont">&#xe694;</i> 搜索
        </el-button>
        <i v-show="ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">收起 &#xe692;</i>
        <i v-show="!ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">展开 &#xe68f;</i>
      </el-form-item>
    </el-form>
    <el-row class="ssearchText2">
      <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">部门&nbsp;</label>
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
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">岗位&nbsp;</label>
          <el-select v-model="queryData.OA_Job_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="(item,index) in postArray"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">人员&nbsp;</label>
          <el-input
            @keyup.enter.native="searchFun"
            v-model="queryData.EmpNo"
            placeholder="人员名称/员工编号"
            maxlength="10"
            size="small"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">岗位状态&nbsp;</label>
          <el-select v-model="queryData.JobStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
            <el-option label="在职" value="在职"/>
          </el-select>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">性别&nbsp;</label>
          <el-select v-model="queryData.Gender" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="女" value="女"/>
            <el-option label="男" value="男"/>
          </el-select>
        </div>
      </el-col>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="cl-inlineItem">
            <label class="cl-label">电话号码&nbsp;</label>
            <el-input
              @keyup.enter.native="searchFun"
              v-model="queryData.MobileNumber"
              placeholder="请输入11位电话号码"
              maxlength="11"
              size="small"
            />
          </div>
        </el-col>
      </transition>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="cl-inlineItem">
            <label class="cl-label">身份证号&nbsp;</label>
            <el-input
              @keyup.enter.native="searchFun"
              v-model.trim="queryData.IDNumber"
              placeholder="请输入18位身份证号"
              maxlength="18"
              size="small"
            />
          </div>
        </el-col>
      </transition>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="cl-inlineItem">
            <label class="cl-label">账号状态&nbsp;</label>
            <el-select v-model="queryData.AccountStatus" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
              <el-option label="全部" value="-1"/>
              <el-option label="已分配" value="已分配"/>
              <el-option label="未分配" value="未分配"/>
            </el-select>
          </div>
        </el-col>
      </transition>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="cl-inlineItem">
            <label class="cl-label">邮箱&nbsp;</label>
            <el-input
              @keyup.enter.native="searchFun"
              v-model="queryData.EmailAddress"
              placeholder="长度0-50"
              maxlength="50"
              size="small"
            />
          </div>
        </el-col>
      </transition>
      <transition name="fade">
      <el-col v-show="ifMore" :xs="24" :sm="8" :md="8" :lg="4" :xl="4">
        <div class="cl-inlineItem">
          <label class="cl-label">操作人&nbsp;</label>
          <el-select v-model="queryData.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="(item,index) in operationArray"
              :key="index"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </div>
      </el-col>
      </transition>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="cl-inlineItem" style="width: 100%">
            <label class="cl-label">出生日期&nbsp;</label>
            <el-date-picker
              @keydown.enter.native="searchFun"
              :editable="false"
              v-model="birthdayTime"
              :unlink-panels="true"
              style="width: 81%"
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
          </div>
        </el-col>
      </transition>
      <transition name="fade">
        <el-col v-show="ifMore" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="cl-inlineItem" style="width: 100%">
            <label class="cl-label">入职时间&nbsp;</label>
            <el-date-picker
              @keydown.enter.native="searchFun"
              :editable="false"
              v-model="EntryTime"
              :unlink-panels="true"
              style="width: 81%"
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
          </div>
        </el-col>
      </transition>
      <transition name="fade">
      <el-col v-show="ifMore" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <div class="cl-inlineItem" style="width: 100%">
            <label class="cl-label">操作时间&nbsp;</label>
            <el-date-picker
              @keydown.enter.native="searchFun"
              :editable="false"
              v-model="operationTime"
              :unlink-panels="true"
              style="width: 81%"
              size="small"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getTime3"
            />
          </div>
      </el-col>
      </transition>

      <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" style="margin-bottom: 20px;">
        <el-button type="primary" size="mini" class="cl-search" @click="searchFun"><i
          class="icon iconfont">&#xe694;</i> 搜索
        </el-button>
        <i v-show="ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">收起 &#xe692;</i>
        <i v-show="!ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">展开 &#xe68f;</i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import {ComboBoxList, linkComboBoxList, GetRoleNameList} from "@/api/organize"

  export default {
    name: "SelectHead",
    data() {
      return {
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
        operationArray: []//操作人值
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
        if (data != null) {
          this.queryData.EnrollingTime = data[0]
          this.queryData.EnrollingTimeEnd = data[1]
        } else {
          this.queryData.EnrollingTime = ''
          this.queryData.EnrollingTimeEnd = ''
        }
      },
      getTime2(data) {
        if (data != null) {
          this.queryData.Birthday = data[0]
          this.queryData.BirthdayEnd = data[1]
        } else {
          this.queryData.Birthday = ''
          this.queryData.BirthdayEnd = ''
        }
      },
      getTime3(data) {
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
      }
    },
    mounted() {
      this.getComboBoxList()
      this.GetRoleNameList()
    }
  }
</script>

