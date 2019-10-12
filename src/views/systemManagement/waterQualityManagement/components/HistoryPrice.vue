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
        ref="cargoTable"
      >
        <el-table-column type="expand" width="1" class="row-expand-cover">
          <template slot-scope="props">
            <div class="ladder-box display-flex justify-content-flex-justify align-items-center">
              <div>
                污水费：
                <span class="color-more-black">20元/吨</span>
              </div>
              <div>
                其他费用1：
                <span class="color-more-black">20元/吨</span>
              </div>
              <div>
                其他费用2：
                <span class="color-more-black">20元/吨</span>
              </div>
            </div>
            <div v-if="details.IsLadder">
              <div v-for="(item,i) in details.ladder" class="ladder-bottom-box">
                <div
                  class="display-flex justify-content-flex-justify"
                  v-if="details.LadderNumber>i"
                >
                  <div class="display-flex align-items-center ladder-item">
                    <div class="circle-num">{{i+1}}</div>
                    <span>{{i+1}}阶单价：</span>
                    <div class="table-input-y">
                      <span>{{item.LadderPrice}}元/吨</span>
                    </div>
                  </div>
                  <div class="display-flex align-items-center ladder-item">
                    <span>{{i+1}}阶起始量：</span>
                    <div class="table-input-y">
                      <span>{{item.LadderWaterNum}}吨</span>
                    </div>
                  </div>
                  <div class="display-flex align-items-center ladder-item color-more-black">
                    <span>{{i+1}}阶合计单价：</span>
                    <div class="table-input-y">
                      <span>{{item.TotalPrice}}元/吨</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" fixed="left" label="序号" width="50" align="center" />
        <template>
          <div v-for="(item ,index) in tableHead" :key="index">
            <el-table-column
              :key="index"
              min-width="160px"
              :prop="item.ColProp"
              align="center"
              sortable="custom"
              :label="item.ColDesc"
            />
          </div>
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
              <div class="main-color-warn" @click="constitute(row)">
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
import {
  GetWaterPropertyById,
  SelectUpdateWaterPropertyBeforeInfo
} from "@/api/system";
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

      if (!this.historyShow) return false; //如果监听ID，编辑行数据后，ID依然不会变，所以在弹窗显示再请求数据
      setTimeout(function() {
        _this.getTabel();
      }, 500);
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
      a: false,
      total: 0,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000013"
      },
      details: {
        ladder: [
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 },
          { LadderPrice: 0, LadderWaterNum: 0, TotalPrice: 0 }
        ]
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
    // 点击水价构成
    constitute(row) {
      this.toogleExpandCargo(row);
      SelectUpdateWaterPropertyBeforeInfo({ id: row.Id }).then(res => {
        this.details = { ...res.data, ...this.details };
        this.details.ladder.map(function(item, i) {
          this.details.ladder[i].LadderWaterNum = this.details[actions[i][0]];
          this.details.ladder[i].LadderPrice = this.details[actions[i][1]];
          this.details.ladder[i].TotalPrice = this.details[actions[i][2]];
        }, this);
      });
    },
    getList() {
      GetWaterPropertyById({ id: this.id }, this.listQuery).then(res => {
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
    setCustomData() {
      this.$refs.historyPrice.isCustom = !this.$refs.historyPrice.isCustom;
    },
    toogleExpandCargo(row) {
      let $table = this.$refs.cargoTable;
      this.tableData.map(item => {
        if (row.Id != item.Id) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .el-table__expanded-cell{
//     width:200px !important;
// }
/deep/ .el-table__expand-icon {
  display: none;
}
</style>

