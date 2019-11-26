
<template>
  <!-- 收费查询 -->
  <div>
    <div class="section-full-container" style="padding-top:0;">
      <div class="display-flex justify-content-flex-justify">
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
      <customTable ref="myChildFactory" />
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableDataFactory"
          border
          :height="tableHeightSave"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
            <span>{{(factoryQuery.page - 1) *factoryQuery.limit+ scope.$index + 1}}</span>
          </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              min-width="150px"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column
            label="操作"
            width="280"
            align="center"
            fixed="right"
            class-name="small-padding"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center">
                <div class="main-color-warn" @click="toUser(row.Id)">
                  <a>查看明细</a>
                </div>
              
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalFactory>0"
          :total="totalFactory"
          :page.sync="factoryQuery.page"
          :limit.sync="factoryQuery.limit"
          @pagination="getList"
        />
      </div>
      <!-- 账单详情弹窗 -->
    </div>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index";
import Pagination from "@/components/Pagination";
import TableTotal from "@/components/TableTotal/index";
import { GetListByWaterFactory_Execl} from "@/api/cashCharge";//费用撤销
export default {
 props: {
    factoryQuery: {
      //按水厂查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    tableDataFactory:{},
    totalFactory:{},
    tableHeightSave:{}
  },
   components: {Pagination, customTable, TableTotal},
  data() {
    return {
      total: 0,
      tableKey: 2,
      temp: {},
      selectPintShow: false, //票据打印弹窗
      tableData: [],
      checksData: [],
      
      tableTotal: [
        { num: 0, txt: "费用笔数" },
        { num: 0, txt: "剩余未缴（元）" }
      ]
    }
      
  },
  mounted: function() {
  this.getTableHead()
  },
   computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  methods: {
    setCustomData() {
       let height=this.tableHeightSave
      this.$refs.myChildFactory.isCustom = !this.$refs.myChildFactory.isCustom;
      if (this.$refs.myChildFactory.isCustom) this.$emit("update:tableHeightSave", height - 100);
      else this.$emit("update:tableHeightSave", height +100);
    },
       //导出
    excel() {
      GetList_execl(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    sortChanges({ prop, order }){
       //筛选
      this.factoryQuery.filed = prop;
      this.factoryQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableDataFactory.length > 0) {
        this.factoryQuery.page = 1;
        this.getList();
      }
    },
    getTableHead(){//获取表头自定义
      this.$refs.myChildFactory.GetTable(this.factoryQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChildFactory.checkData; // 获取自定义字段中选中了字段
    },
    toUser(rowId){
      this.$emit("factoryToUser", this.factoryQuery,rowId);
    },
     getList(){
      this.$emit("handleFilterFactory", this.listQuery);
    },
  }
};
</script>

