<template>
  <!-- 表格样式-费用展示 -->
  <div>
    <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips"/>
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        ref="cashTable"
        :height="tableHeight-130"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        @sort-change="sortChanges"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="as"
          fixed="left"
          type="selection"
          width="55"
          :selectable="checkboxT"
        ></el-table-column>
         <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
            <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
          </template>
          </el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :key="index"
            min-width="120px"
            :prop="item.ColProp"
            align="center"
            :sortable="item.IsSortBol?'custom':null"
            :label="item.ColDesc"
          />
        </template>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="112"
          align="center"
          class-name="small-padding"
        >
          <template slot-scope="{row}">
           <div class="display-flex justify-content-flex-center secur-content">
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="费用详情"
                placement="bottom"
              >
                <i class="icon iconfont iconbiaodan1" @click="details(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="费用撤回"
                placement="bottom"
              >
                <i class="icon iconfont iconchexiao1" @click="reset(row)"></i>
              </el-tooltip>
              <!-- 费用类型仅为水费，OrderType==2001，才能进行减免 -->
              <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':row.OrderType==2001?false:true}"
                :popper-class="row.OrderType==2001?'tooltip':''"
                :effect="row.OrderType==2001?'light':'dark'"
                :visible-arrow="row.OrderType==2001?false:true"
                :content="row.OrderType==2001?'费用减免':'非水费类型不允许减免'"
                placement="bottom"
              >
                <i class="icon iconfont iconjianmianshui" @click="feeWaiver(row)"></i>
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
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { legalTime } from "@/utils/index";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { GetOrder } from "@/api/cashCharge";
export default {
  props: {
    listQuery: {
      type: Object,
      default: function() {
        return {};
      }
    },
    tableHeight: {
      type: Number,
      default: 100
    },
    tipsData:{},
    totalLength:{}
  },
  components: { Pagination, SearchTips },
  mounted() {
    this.$refs.searchTips.showExcel = false; // 先获取所有自定义字段赋值
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
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
      tableKey: 1,
      tableData: [],
      checksData: [],
      total: 0
    };
  },
  methods: {
     delTips() {
     this.$emit("delTips")
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
    getList() {
      //表格
      GetOrder(this.listQuery).then(res => {
        this.total = res.count;
        res.data.forEach(item => {
          if (item.ChargeFlag == 1003) {
            item.tooltip = "费用审核中，暂不能缴费";
          }
        });
      // 筛选可以选择的数据，需求（当用户有未缴纳的费用时，不可单独进行预存操作）
        let canChecked=res.data.filter(item => {
           return item.ChargeFlag !== 1003      
        });
        this.$emit("update:totalLength",canChecked.length);
        this.tableData = res.data;      
        this.$refs.cashTable.toggleAllSelection(true)//默认选择
      });
    },
    checkboxT(row, index) {//勾选禁用
      if (row.ChargeFlag==1003) {
        return false;
      }
      return true;
    },
    handleSelectionChange(val) {
      this.$emit("calculatedAmount", val);
    },
    details(row) {
      this.$emit("details", row);
    },
    reset(row) {
      this.$emit("reset",row.Id);
    },
    feeWaiver(row) {
      this.$emit("feeWaiver",row);
    }
  }
};
</script>
<style lang="scss" scoped>
.disable-checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #aaa;
  .disable-checkbox-small {
    width: 10px;
    height: 10px;
    margin: 1px;
    background: #aaa;
  }
}
.iconchexiao1{
  color:#777c82;
  padding:0 15px;
}
.secur-content {
    .icon {
      font-size: 16px;
      cursor: pointer;
    }
    .iconbiaodan1 {
      color: #b59200;
    }
}
</style>

