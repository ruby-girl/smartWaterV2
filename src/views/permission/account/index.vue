<template>
  <div class="section-container">
      <div ref="formHeight">
        <select-head :select-head="listQuery" @handleFilter="getList" :role-list="roleList" @getText="getText"/>
      </div>
       <div class="section-full-container" style="padding-top:0;">
      <div class="main-padding-20-y tips-container">
        <el-button size="mini" class="btn-add" round @click="addRole"><i class="icon iconfont">&#xe689;</i>添加</el-button>
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :cell-class-name="cellClass"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
        >
           <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
            <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
          </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              :min-width="item.ColProp=='EditTime'?'160px':'110px'"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            /> 
          </template>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            width="140px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex  justify-content-flex-justify secur-content">
                <el-tooltip
                :class="{'main-color':row.UserStatusCode=='101'}"
                :popper-class="row.UserStatusCode=='101'?'tooltip':''"
                :effect="row.UserStatusCode=='101'?'light':'dark'"
                :visible-arrow="row.UserStatusCode=='101'?false:true"
                :content="row.UserStatusCode=='101'?'编辑':'该账号异常不允许操作'"
                placement="bottom"
              >
                <i class="icon iconfont iconsuoyoubiaogelidebianji" @click="row.UserStatusCode=='101'?handleUpdate(row):''"></i>
              </el-tooltip>
              <el-tooltip
                :class="{'main-color-pink':row.UserStatusCode=='101'?true:false}"
               :popper-class="row.UserStatusCode=='101'?'tooltip':''"
                :effect="row.UserStatusCode=='101'?'light':'dark'"
                :visible-arrow="row.UserStatusCode=='101'?false:true"
                :content="row.UserStatusCode=='101'?'注销':'该账号异常不允许操作'"
                placement="bottom"
              >
                <i class="icon iconfont iconzhuxiao" @click="row.UserStatusCode=='101'?cancel(row):''"></i>
              </el-tooltip>
          
              
              <el-tooltip
                :class="{'main-color':row.UserStatusCode=='101'}"
               :popper-class="row.UserStatusCode=='101'?'tooltip':''"
                :effect="row.UserStatusCode=='101'?'light':'dark'"
                :visible-arrow="row.UserStatusCode=='101'?false:true"
                :content="row.UserStatusCode=='101'?'重置密码':'该账号异常不允许操作'"
                placement="bottom"
              >
                <i class="icon iconfont icon_zhongzhi1" @click="row.UserStatusCode=='101'?reset(row):''"></i>
              </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList(1)"
        />
      </div>
      <!-- 编辑弹窗 -->
      <reset-dialog :reset-show.sync="resetdialogFormVisible" :id="restId" />
      <edit-dialog
        :show.sync="dialogFormVisible"
        :temp="temp"
        @updateData="updateData"
        :role-list="roleList"
      />
      <add-dialog
        :add-show.sync="addDialogFormVisible"
        :temp="temp"
        @createData="createData"
        :role-list="roleList"
      />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; 
import Pagination from "@/components/Pagination";
import EditDialog from "./components/EditDialog";
import ResetDialog from "./components/ResetDialog";
import AddDialog from "./components/AddDialog";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import {
  getAccountList,
  getAccountDetail,
  deitAccount,
  addAccount,
  cancelAccount,
  exportExcel
} from "@/api/account";
import { getRoles } from "@/api/role"; //获取角色下拉框
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "AccountPermission",
  directives: { permission },
  components: {
    SelectHead,
    Pagination,
    EditDialog,
    SearchTips,
    AddDialog,
    ResetDialog
  },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {
        empNo: "", //用户编号，请求后端得到employeeId
        roleId: "",
        userId: "",
        loginName: "" //账号
      },
      restId: "", //重置行ID
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        sort: "", //升序
        filed: "", //排序字段
        roldId: "-1", // 角色ID
        userState: "-1", // 账号状态
        empNo: "", // 人员编号
        empName:"",//人员姓名
        loginName:"",//账号
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000005",
        timevalue:[]
      },
      roleList: [], //角色下拉框，传递给组件
      addDialogFormVisible: false, // 新增弹窗
      dialogFormVisible: false, // 编辑弹窗
      resetdialogFormVisible: false, // 重置弹窗
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: []
    };
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 200;
     this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      getRoles().then(res => {
        this.roleList = res.data;
      });
    });
  },
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.editStartTime = "";
        this.listQuery.editEndTime = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    cellClass({row, column, rowIndex, columnIndex}){
      if(row.UserStatusCode=='ZX'&&column.property=='UserStatus'){
        return 'main-color-red'
      }
    },
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    getList(n) {
      if (!n) {
        this.orderData = Object.assign({}, this.listQuery);
        this.orderData.page = 1;
      }
      getAccountList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.getList();
    },
    handleUpdate(row) {
      //获取详情
      getAccountDetail(row.Id).then(res => {
        this.temp.empNo = res.data.EmpNo; //人员编号
        this.temp.roleId = res.data.SYS_Role_Id;
        this.temp.userId = res.data.Id;
        this.temp.loginName = res.data.LoginName;
      });
      this.dialogFormVisible = true;
    },
    addRole() {
      this.temp = {
        employeeId: "",
        roleId: "",
        loginName: "",
        loginPwd: "",
        loginPwdSave:"",
        userId: "",
        userNum: ""
      };
      this.addDialogFormVisible = true;
    },
    createData() {
      addAccount(this.temp).then(res => {
        this.addDialogFormVisible = false;
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    },
    updateData() {
      deitAccount(this.temp).then(res => {
        this.dialogFormVisible = false;
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.getList();
      });
    },
    cancel(row) {
      this.$confirm("是否注销当前账号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        cancelAccount(row.Id).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    reset(row) {
      this.restId = row.Id;
      this.resetdialogFormVisible = true;
    },
    excel() {
      //导出
      exportExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-content {
  padding: 0 20px;
    .icon {
      font-size: 16px;
      color:#D8E2E7;
      cursor: pointer;
    }
}
</style>
