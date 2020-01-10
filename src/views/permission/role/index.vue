<template>
  <div class="section-container">
    <div ref="formHeight">
      <select-head :select-head="listQuery" @handleFilter="getList" @getText="getText" />
    </div>
    <div class="section-full-container tips-container" style="padding-top:0;">
      <el-button size="mini" class="btn-add" round  @click="addRole">
        <i class="iconfont icontianjia"></i>添加
      </el-button>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
        >
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              min-width="100px"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column label="操作" align="center" width="112px" class-name="small-padding">
            <template slot-scope="{row}">
             <div class="display-flex justify-content-flex-center secur-content">
                 <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="编辑"
                placement="bottom"
              >
                <i class="icon iconfont iconsuoyoubiaogelidebianji" @click="handleUpdate(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="删除"
                placement="bottom"
              >
                <i class="icon iconfont iconsuoyoubiaogelideshanchu" @click="delRow(row)"></i>
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
      <Dialog
        :show.sync="dialogFormVisible"
        :temp="temp"
        :dialog-status="dialogStatus"
        @createData="createData"
        @updateData="updateData"
      />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import Dialog from "./components/Dialog";
import {
  getRolesList,
  addRole,
  updateRole,
  deleteRole,
  exportExcel
} from "@/api/role";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem,isExport } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "RolePermission",
  components: { SelectHead, Pagination, Dialog, SearchTips },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        roleName: "", // 角色名称
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000004",
        timevalue: []
      },
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {}
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
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    getList(n) {
      if (!n) {
        this.orderData = Object.assign({}, this.listQuery);
        this.listQuery.page = 1;
        this.orderData.page = 1;
      }else{
        this.orderData.page=this.listQuery.page
      }
      getRolesList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.listQuery.page = 1;
        this.getList();
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    delRow(r) {
      this.$confirm("是否删除当前信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        deleteRole(r.Id).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    addRole() {
      this.temp = {Id:0};
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    createData(dialog,arr) {
      let obj={
        RoleName:this.temp.RoleName,
        MenusChk:arr
      }
      addRole(obj).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        this.getList();
      });
    },
    updateData(dialog,arr) {
      let obj={
        RoleName:this.temp.RoleName,
        MenusChk:arr,
        Id:dialog.Id
      }
      updateRole(obj).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        // for (const v of this.tableData) {
        //   if (v.Id == this.temp.Id) {
        //     const index = this.tableData.indexOf(v);
        //     this.tableData.splice(index, 1, this.temp);
        //     break;
        //   }
        // }
        this.getList();
        this.dialogFormVisible = false;
      });
    },
    excel() {
      //导出
      if(!isExport(this.tableData)) return
      exportExcel(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-content {
    .icon {
      font-size: 16px;
      cursor: pointer;
      color:#00B3A1;
    }
    .iconsuoyoubiaogelideshanchu{
      color: #ff3d3d;
      padding-left:15px;
    }
}
</style>

