<template>
  <div class="section-container">
    <div>
      <div ref="formHeight" class="cash-padding-bg">
        <select-head :select-head="listQuery" @handleFilter="handleFilter" />
      </div>

      <!-- 表格模式 -->
      <div class="container-bottom-box display-flex">
        <!-- 左边表格 -->
        <div class="cash-padding-bg flex-1">
          <div class="table-top-btn-padding display-flex justify-content-flex-justify">
            <div class="display-flex">
              <div @click="type=1">表格</div>
              <div @click="type=2">卡片</div>
            </div>
            <div>
              <el-button type="success" size="mini" @click="excel">
                <i class="iconfont icondaochuexcel"></i>导出Excel
              </el-button>
              <el-button type="warning" size="mini" @click="setCustomData()">
                <i class="iconfont iconbiaogezidingyi"></i>表格自定义
              </el-button>
            </div>
          </div>
          <components
            :is="typeComponents"
            :listQuery="listQuery"
            :total="total"
            :tableHeight="tableHeight"
            ref="tableTypeCard"
            :tableData="tableData"
          ></components>
        </div>
        <!-- 左边表格end -->
        <!-- 右 -->
        <div class="cash-padding-bg cash-right-box">阿萨德</div>
        <!-- 右 -->
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import TableType from "./components/TableType";
import CardType from "./components/CardType";
import {
  getRolesList,
  addRole,
  updateRole,
  deleteRole,
  exportExcel
} from "@/api/role";
export default {
  name: "RolePermission",
  components: { SelectHead, TableType, CardType },
  data() {
    return {
      total: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        roleName: "", // 角色名称
        editUserId: "-1", // 操作人
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000004"
      },
      type: 1, //左侧展示模式 1：表格 2：卡片
      typeComponents: "TableType", //默认表格模式
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableHeight: 0,
      tableData:[]
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 220;
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 220;
      };
    });
  },
  watch: {
    type(v, o) {
      this.typeComponents = v == 1 ? "TableType" : "CardType";
    }
  },
  methods: {
    getList() {
      getRolesList(this.listQuery).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    setCustomData() {
      this.$refs.tableTypeCard.$refs.myChild.isCustom = !this.$refs
        .tableTypeCard.$refs.myChild.isCustom;
      if (this.$refs.tableTypeCard.$refs.myChild.isCustom)
        this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
    createData(dialog) {
      addRole(dialog.RoleName).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        this.handleFilter();
      });
    },
    updateData(dialog) {
      updateRole(dialog.RoleName, dialog.Id).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.dialogFormVisible = false;
        for (const v of this.tableData) {
          if (v.Id == this.temp.Id) {
            const index = this.tableData.indexOf(v);
            this.tableData.splice(index, 1, this.temp);
            break;
          }
        }
        this.dialogFormVisible = false;
      });
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
.container-bottom-box {
  border-top: 15px solid #eff1f4;
}
.cash-padding-bg {
  padding: 20px;
  background: #fff;
}
.cash-right-box {
  width: 347px;
}
</style>