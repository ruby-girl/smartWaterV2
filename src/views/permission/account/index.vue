<template>
  <div class="section-container">
   <div class="section-full-container">
      <div ref="formHeight">
      <select-head :select-head="listQuery" @handleFilter="handleFilter" :role-list="roleList"/>
    </div>
    <div class="table-top-btn-padding">
      <el-button type="primary" size="mini" class="iconfont icontianjia" @click="addRole">添加</el-button>
      <el-button type="success" size="mini" class="iconfont icondaochuexcel" @click="excel">导出Excel</el-button>
      <el-button type="warning" size="mini" class="iconfont iconbiaogezidingyi" @click="setCustomData()">表格自定义</el-button>
    </div>
    <customTable ref="myChild" />
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        :height="tableHeight"
        style="width: 100%;"
        :row-class-name="tableRowClassName"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'7px 0'}"
        @sort-change="sortChanges"
      >
        <el-table-column type="index" />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :key="index"
            min-width="100px"
            :prop="item.prop"
            :align="item.position"
            sortable='custom'
            :label="item.text"
          />
        </template>
        <el-table-column label="操作" align="center" class-name="small-padding" min-width="150px">
          <template slot-scope="{row}">
            <div class="display-flex justify-content-flex-center" v-if="row.UserStatusCode=='ZC'">
              <div class="main-color" @click="handleUpdate(row)" v-permission="['1010106']"><a>编辑</a></div>
              <div class="main-color-red pl-15" @click="cancel(row)" v-permission="['1010105']"><a>注销</a></div>
              <div class="main-color-red pl-15" @click="reset(row)" v-permission="['1010107']"><a>重置密码</a></div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <!-- 编辑弹窗 -->
    <reset-dialog :reset-show.sync="resetdialogFormVisible" :id="restId" />
    <edit-dialog :show.sync="dialogFormVisible" :temp="temp" @updateData="updateData" :role-list="roleList"/>
    <add-dialog :add-show.sync="addDialogFormVisible" :temp="temp" @createData="createData" :role-list="roleList"/>
   </div>
  </div>
</template>
<script>
import SelectHead from './components/SelectHead'
import Pagination from '@/components/Pagination'
import EditDialog from './components/EditDialog'
import ResetDialog from './components/ResetDialog'
import AddDialog from './components/AddDialog'
import customTable from '@/components/CustomTable/index'
import {getAccountList,getAccountDetail,deitAccount,addAccount,cancelAccount,exportExcel} from '@/api/account'
import {getRoles} from '@/api/role' //获取角色下拉框
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  name:"AccountPermission",
  directives: { permission },
  components: { SelectHead, Pagination, EditDialog, customTable, AddDialog,ResetDialog},
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {
        empNo:'',//用户编号，请求后端得到employeeId
        roleId:'',
        userId: '',
        loginName: ''//账号
      },
      restId:'',//重置行ID
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        sort:'',//升序
        filed:'',//排序字段
        roldId: '-1', // 角色ID
        userState: '-1', // 账号状态
        empNo: '', // 人员编号
        editUserId: '-1', // 操作人
        editStartTime: '', // 操作时间起
        editEndTime: '' // 操作时间止
      },
      roleList:[],//角色下拉框，传递给组件
      addDialogFormVisible: false, // 新增弹窗
      dialogFormVisible: false, // 编辑弹窗
      resetdialogFormVisible: false, // 重置弹窗
      tableData: [],
      checksData: [],
      checkAllData: [// 所有列可选项
        { checked: true, text: '人员编号', prop: 'EmpNo', position: 'left' },
        { checked: true, text: '角色', prop: 'RoleName', position: 'left' },
        { checked: true, text: '账号', prop: 'LoginName', position: 'left' },
        { checked: true, text: '状态', prop: 'UserStatus', position: 'left' },
        { checked: true, text: '操作人', prop: 'CreateUser', position: 'left' },
        { checked: true, text: '操作时间', prop: 'EditTime', position: 'left' }
      ],
    }
  },
  computed: {
    tableHead: function() {
      let arrayHead= this.checksData.filter((item)=>{
          return item.checked
      })
      return arrayHead
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight
      const that = this
      that.tableHeight = document.body.clientHeight - formHeight-220
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 220
      }
      this.$refs.myChild.checkData = this.checkAllData // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData // 获取自定义字段中选中了字段
      getRoles().then(res=>{
        this.roleList=res.data
      })
    })
  },
  methods: {
    tableRowClassName({row}){//不能编辑行的样式
      if (row.UserStatusCode=='ZX') {
          return 'no-del';
      } 
      return '';
    },
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
    },
    getList() {
     getAccountList(this.listQuery).then((res)=>{
        this.total=res.count
        this.tableData=res.data
     })
    },
    sortChanges({prop, order }){//筛选
      this.listQuery.page=1
      this.listQuery.filed=prop
      this.listQuery.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {//获取详情
      getAccountDetail(row.Id).then((res)=>{
        this.temp.empNo=res.data.EmpNo//人员编号
        this.temp.roleId=res.data.SYS_Role_Id
        this.temp.userId=res.data.Id
        this.temp.loginName=res.data.LoginName
      })
      this.dialogFormVisible = true
    },
    addRole() {
      this.temp = {
        employeeId: '',
        roleId:'',
        loginName:'',
        loginPwd:'',
        userId:'',
        userNum:''
      }
      this.addDialogFormVisible = true
    },
    createData() {
     addAccount(this.temp).then((res)=>{
        this.addDialogFormVisible = false
        this.$message({
            message: res.message,
            type: "success"
          });
        this.getList()
      })
    },
    updateData() {
      deitAccount(this.temp).then((res)=>{
        this.dialogFormVisible = false
        this.$message({
            message: res.message,
            type: "success"
          });
        this.getList()
      })
    },
    cancel(row){
      this.$confirm("是否申请注销当前账号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        cancelAccount(row.Id).then((res)=>{
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getList()
        })
      });    
    },
    reset(row){
      this.restId=row.Id
      this.resetdialogFormVisible=true
    },
    excel(){//导出
      exportExcel(this.listQuery).then((res)=>{
        window.location.href = `${this.common.excelPath}${res.data}`;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

