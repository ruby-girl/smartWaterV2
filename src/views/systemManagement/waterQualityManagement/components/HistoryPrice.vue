<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="历史水价"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="1020px"
    center
    :close-on-click-modal="false"
    @opened="opened"
  >
    <div class="display-flex justify-content-flex-justify">
      <div></div>
      <div style="margin-bottom:10px;">
        <el-button size="mini" class="special-btn" round  @click="excel"><i class="iconfont icondaochuexcel"></i>导出Excel</el-button>
        <el-button size="mini" class="special-btn" round  @click="setCustomData"><i class="iconfont iconbiaogezidingyi"></i>表格自定义</el-button>
      </div>
    </div>
     <table-custom ref="myChild" class="table-custom" />
    <!-- <customTable ref="historyPrice" /> -->
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        height="360"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        @sort-change="sortChanges"
        ref="cargoTable"
      >
        <el-table-column type="expand" width="1" class="row-expand-cover">
          <template slot-scope="props">
            <div class="ladder-box display-flex align-items-center">
              <div class="ladder-item pl-30">
                污水费：
                <span>{{details.SewagePrice}}</span>
              </div>
              <div class="ladder-item ladder-center-box">
                其他费用1：
                <span>{{details.OtherPrice1}}</span>
              </div>
              <div class="ladder-item ladder-center-box">
                其他费用2：
                <span>{{details.OtherPrice2}}</span>
              </div>
            </div>
            <div v-if="details.IsLadder">
              <div v-for="(item,i) in details.ladder" class="ladder-bottom-box">
                <div class="display-flex" v-if="details.LadderNumber>i">
                  <div class="display-flex align-items-center ladder-item">
                    <div class="circle-num">{{i+1}}</div>
                    <span>{{i+1}}阶单价：</span>
                    <div class="table-input-y">
                      <span>{{item.LadderPrice}}元/吨</span>
                    </div>
                  </div>
                  <div class="display-flex align-items-center ladder-item ladder-center-box">
                    <span>{{i+1}}阶起始量：</span>
                    <div class="table-input-y">
                      <span>{{item.LadderWaterNum}}吨</span>
                    </div>
                  </div>
                  <div
                    class="display-flex align-items-center ladder-item color-more-black ladder-center-box"
                  >
                    <span>{{i+1}}阶合计单价：</span>
                    <div class="table-input-y">
                      <span class="big-blue-color">{{item.TotalPrice}}</span>元/吨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
         <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
            <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
          </template>
          </el-table-column>
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
          width="100px"
          fixed="right"
        >
          <template slot-scope="{row}">
            <div class="display-flex justify-content-flex-center method-font secur-content">
              <!-- <div class="main-color-warn" @click="constitute(row)">
                <a>水价构成</a>
              </div> -->
               <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="水价构成"
                placement="bottom"
              >
                <i class="icon iconfont iconyongshuixingzhishezhi-shuijiagoucheng"  @click="constitute(row)"></i>
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
  </el-dialog>
</template>
<script>
import TableCustom from "@/components/TableCustom/index"; //自定义表格
import Pagination from "@/components/Pagination";
import {
  GetWaterPropertyById,
  SelectWaterPropertyHisInfo,
  GetWaterPropertyHisList_OutExcel
} from "@/api/system";
import { ladderChangeArr } from "@/utils/index";
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
    TableCustom,
    Pagination
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  watch: {
    historyShow() {
      this.AdialogFormVisible = this.historyShow;
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
        limit: 20,
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000013",
        UseWaterTypeId:''
      },
      details: {},
      orderData:{}
    };
  },
  methods: {
    excel() {
      GetWaterPropertyHisList_OutExcel(this.orderData).then(
        res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        }
      );
    },
    // 点击水价构成
    constitute(row) {
      this.toogleExpandCargo(row);
      SelectWaterPropertyHisInfo({ id: row.Id }).then(res => {
        this.details = ladderChangeArr(res.data); //阶梯转换数组
      });
    },
    getList(n) {
      if(!n){
         this.orderData = Object.assign({}, this.listQuery);
         this.orderData.page=1
         this.listQuery.page = 1;
      }else{
        this.orderData.page=this.listQuery.page
      }
      GetWaterPropertyById(this.orderData).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    opened(){ 
        this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
        this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
        this.listQuery.UseWaterTypeId=this.id
        this.getList()
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
     //表格自定义方法
    setCustomData() {
      // this.thisTable = !this.thisTable;
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      // this.customHeight = this.$refs.myChild.isCustom;
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
/deep/ .el-table__expanded-cell{
   .ladder-box,.ladder-bottom-box{
     padding-left: 65px;
   }
}
/deep/ .el-table__expand-icon {
  display: none;
}
.ladder-item {
  width: 245px;
  line-height: 35px;
  .big-blue-color {
    color: #33b300;
    font-size: 20px;
  }
}
.circle-num {
  background: #00b2a1;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-family: "Script MT", "Arial Narrow", Arial, sans-serif;
  text-align: center;
  color: #fff;
  margin-right: 8px;
  line-height: 16px;
}
.pl-30 {
  padding-left: 26px;
}
.color-more-black {
  color: #46494c;
}
.secur-content {
    .icon {
      font-size: 16px;
      color:#777c82;
      cursor: pointer;
    }
    .iconyongshuixingzhishezhi-shuijiagoucheng {
      color: #b59200 !important;
    }
    }
</style>

