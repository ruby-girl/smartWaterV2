<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :select-head="listQuery" @handleFilter="handleFilter" :role-list="roleList" />
      </div>
      <div class="table-top-btn-padding display-flex justify-content-flex-justify">
        <el-button type="primary" size="mini"  @click="addRole"><i class="iconfont icontianjia"></i>添加</el-button>
        <div>
          <el-button
          type="success"
          size="mini"
          @click="excel"
        ><i class="iconfont icondaochuexcel"></i>导出Excel</el-button>
        <el-button
          type="warning"
          size="mini"
          @click="setCustomData()"
        ><i class="iconfont iconbiaogezidingyi"></i>表格自定义</el-button>
        </div>
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
          :cell-class-name="cellClass"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              :min-width="item.ColProp=='EditTime'?'160px':'110px'"
              :prop="item.ColProp"
              align="center"
              sortable="custom"
              :label="item.ColDesc"
            /> 
          </template>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            width="313px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center method-font">
                <div class="main-color-warn" @click="handleUpdate(row)" v-permission="['1010106']">
                  <a>水价构成</a>
                </div>
                <div class="pl-20" @click="cancel(row)" v-permission="['1010105']">
                  <a>历史水价</a>
                </div>
                <div class="main-color pl-20" @click="reset(row)" v-permission="['1010107']">
                  <a>水价调整</a>
                </div>
                <div class="main-color-red pl-20" @click="cancel(row)" v-permission="['1010105']">
                  <a>删除</a>
                </div>
              </div>
              
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
         <add-dialog
        :add-show.sync="addDialogFormVisible"
        :temp="temp"
        @createData="createData"
        :role-list="roleList"
      />
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; 
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
import AddDialog from "./components/Add";
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
  name: "WaterQualityManagement",
  directives: { permission },
  components: {
    SelectHead,
    Pagination,
    customTable,
    AddDialog
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
        loginName: "", //账号,
        isLadder:'1',
        name:'羊',
        num:11
      },
      restId: "", //重置行ID
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
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
        tableId: "0000005"
      },
      roleList: [], //角色下拉框，传递给组件
      addDialogFormVisible: false, // 新增弹窗
      dialogFormVisible: false, // 编辑弹窗
      resetdialogFormVisible: false, // 重置弹窗
      tableData: [],
      checksData: []
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
      that.tableHeight = document.body.clientHeight - formHeight - 220;
      this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      getRoles().then(res => {
        this.roleList = res.data;
      });
    });
  },
  methods: {
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
    getList() {
      getAccountList(this.listQuery).then(res => {
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
    handleFilter() {
      this.listQuery.page = 1;
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
        userNum: "",
        num:11,
        isLadder:'1',
         name:'羊'
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

