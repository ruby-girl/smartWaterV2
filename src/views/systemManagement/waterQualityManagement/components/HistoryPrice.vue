<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="1020px"
    center
    :close-on-click-modal="false"
  >
    <div class="table-top-btn-padding display-flex justify-content-flex-justify">
      <div></div>
      <div>
        <el-button type="success" size="mini" @click="excel">
          <i class="iconfont icondaochuexcel"></i>导出Excel
        </el-button>

        <el-button type="warning" size="mini" @click="setCustomData()">
          <i class="iconfont iconbiaogezidingyi"></i>表格自定义
        </el-button>
      </div>
    </div>
    <customTable ref="historyPrice" />
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        height="360"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'7px 0'}"
        @sort-change="sortChanges"
      >
        <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :key="index"
            min-width="160px"
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
              <div class="main-color-warn" @click="constitute(row)" v-permission="['1010106']">
                <a>水价构成</a>
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
    </div>
  </el-dialog>
</template>
<script>
import customTable from "@/components/CustomTable/index";
import Pagination from "@/components/Pagination";
import { GetWaterPropertyById } from "@/api/system";
const actions = {
  "0": ["OneLadderWaterNum", "OneLadderPrice", "OneTotalPrice"],
  "1": ["TwoLadderWaterNum", "TwoLadderPrice", "TwoTotalPrice"],
  "2": ["ThreeLadderWaterNum", "ThreeLadderPrice", "ThreeTotalPrice"],
  "3": ["FourLadderWaterNum", "FourLadderPrice", "FourTotalPrice"],
  "4": ["FiveLadderWaterNum", "FiveLadderPrice", "FiveTotalPrice"]
};
export default {
  props: {
    id: {
      type: String
    },
    historyShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    customTable,
    Pagination
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  watch: {
    historyShow() {
      this.AdialogFormVisible = this.historyShow;
      let _this = this;
      setTimeout(function() {
        _this.getTabel();
      }, 500);
      if (!this.historyShow) return false; //如果监听ID，编辑行数据后，ID依然不会变，所以在弹窗显示再请求数据
      this.getList();
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:historyShow", val);
    }
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  data() {
    return {
      tableKey: 11,
      AdialogFormVisible: false,
      tableData: [],
      checksData: [],
      
      total: 0,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000013"
      }
    };
  },
  methods: {
    getTabel() {
      this.$refs.historyPrice.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.historyPrice.checkData; // 获取自定义字段中选中了字段
    },
    excel() {
      GetWaterPropertyHisList_OutExcel({ id: this.id }, this.listQuery).then(
        res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        }
      );
    },
    constitute() {},
    getList() {
      //   GetWaterPropertyById({id:this.id},this.listQuery).then(res => {
      //   });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.getList();
    },
    setCustomData() {
      this.$refs.historyPrice.isCustom = !this.$refs.historyPrice.isCustom;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

