<template>
  <div class="section-container">
    <div>
      <div ref="formHeight" class="cash-padding-bg">
        <select-head :select-head="listQuery" @handleFilter="handleFilter" />
      </div>

      <!-- 表格模式 -->
      <el-row :gutter="10" class="container-bottom-box display-flex">
        <!-- 左边表格 -->
        <el-col :md="14" :lg="16" :xl="16" class="cash-padding-bg">
          <div class="table-top-btn-padding display-flex justify-content-flex-justify">
            <div class="display-flex">
              <div
                @click="type=2"
                :class="{'change-tab':true,'iconfont':true,'iconzu':true,'tab-active': this.type==2}"
              ></div>
              <div
                @click="type=1"
                :class="{'change-tab':true,'iconfont':true,'iconzu1':true,'tab-active': this.type==1}"
                style="border:none"
              ></div>
            </div>
            <div v-if="type==1">
              <el-button type="success" size="mini" @click="excel">
                <i class="iconfont icondaochuexcel"></i>导出Excel
              </el-button>
              <el-button type="warning" size="mini" @click="setCustomData()">
                <i class="iconfont iconbiaogezidingyi"></i>表格自定义
              </el-button>
            </div>
            <div v-else>
              <el-checkbox :indeterminate="isIndeterminateParent" v-model="checkedAllParent" @change="parentChange">全选</el-checkbox>
            </div>
          </div>
          <components
            :is="typeComponents"
            :listQuery="listQuery"
            :total="total"
            :tableHeight="tableHeight"
            ref="tableTypeCard"
            :tableData="tableData"
            :saveTableHeight="saveTableHeight"
            :checkedAllParent.sync="checkedAllParent"
            :isIndeterminateParent.sync="isIndeterminateParent"
          ></components>
        </el-col>
        <!-- 左边表格end -->
        <!-- 右 -->
        <el-col :md="10" :lg="8" :xl="8" class="cash-padding-bg cash-right-box">
          <right-box></right-box>
        </el-col>
        <!-- 右 -->
      </el-row>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import TableType from "./components/TableType";
import CardType from "./components/CardType";
import RightBox from "./components/RightBox";
import {
  getRolesList,
  addRole,
  updateRole,
  deleteRole,
  exportExcel
} from "@/api/role";
export default {
  name: "cashCharge",
  components: { SelectHead, TableType, CardType, RightBox },
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
      tableData: [],
      saveTableHeight: 0,
      checkedAllParent: false, //全选
      isIndeterminateParent:false//复选框属性
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 240;
      that.saveTableHeight = that.tableHeight;
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 240;
      };
    });
  },
  watch: {
    type(v, o) {
      this.typeComponents = v == 2 ? "CardType" : "TableType";
    }
  },
  methods: {
    getList() {
      getRolesList(this.listQuery).then(res => {
        this.total = res.count;
        res.data.filter(item => {
          if (item.Id == "ad0a3b59-f6c3-4a83-bca1-88a38b824e84") {
            //demo
            item.tooltip = "这是提示语句";
          }
        });
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
    },
    parentChange(v){
      this.isIndeterminateParent=false
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
  border-left: 15px solid #eff1f4;
  padding: 15px;
}
/deep/ .is-disabled .el-checkbox__inner {
  background: #ddd !important;
}
.change-tab {
  background: #f0f0f0;
  font-size: 13px;
  padding: 5px 20px 2px 20px;
  line-height: 24px;
  border-right: 1px solid #d9d9d9;
  cursor: pointer;
  color: #999999;
}
.tab-active {
  color: #00b2a1;
}
</style>