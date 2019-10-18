<template>
  <!-- 选择用户弹窗 -->
  <el-dialog
    title="用户选择"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="792px"
    center
    custom-class="nopadding dialog-head-lv"
    :close-on-click-modal="false"
  >
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        height="250"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'7px 0'}"
        @sort-change="sortChanges"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="name" label="用户编号" width="120"></el-table-column>
        <el-table-column prop="name" label="用户名称" width="120"></el-table-column>
        <el-table-column prop="name" label="电话" width="120"></el-table-column>
        <el-table-column prop="name" label="所属区域" width="120"></el-table-column>
        <el-table-column prop="name" label="水表类型" width="120"></el-table-column>
        <el-table-column prop="name" label="地址" width="180"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  props: {
    selectUserShow: {
      type: Boolean,
      default: false
    }
  },
  components: { Pagination },
  watch: {
    selectUserShow() {
      this.dialogFormVisible = this.selectUserShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:selectUserShow", val);
    }
  },
  data() {
    return {
      radio: 1,
      dialogFormVisible: false,
      total: 1,
      tableKey: 9,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: ""
      },
      tableData: [
        { id: 1, name: "yang", addr: "成都市" },
        { id: 2, name: "yang", addr: "成都市" }
      ]
    };
  },
  methods: {
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
    getList() {}
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-head-lv .el-dialog__header {
  background-color: #5e920e !important;
}
.main-padding-20-y{
    padding: 25px;
}
</style>

