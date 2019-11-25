
<template>
  <!-- 收费查询 -->
  <div class="section-container">
    <div ref="formHeight">
      <select-head
        :select-type.sync="selectType"
        :select-head="listQuery"
        :factory-query="factoryQuery"
        @handleFilter="handleFilter"
        @handleFilterFactory="handleFilterFactory"
        @toggleShow="toggleShow"
      />
    </div>
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
      <customTable ref="myChild" />
      <div class="main-padding-20-y">
        <table-total :list="tableTotal"></table-total>
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
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
                <div class="main-color-warn" @click="billDetails(row)">
                  <a>账单详情</a>
                </div>
                <div class="main-color-red pl-15 pr-15" @click="invoice(row)">
                  <a>数据冲红</a>
                </div>
                <div @click="pint(row)">
                  <a>票据打印</a>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="page"
          :limit.sync="limit"
          @pagination="selectType==1?getList:getListFactory"
        />
      </div>
      <!-- 账单详情弹窗 -->
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
import TableTotal from "@/components/TableTotal/index";
import { GetList,GetListByWaterFactory } from "@/api/cashCharge";
export default {
  name: "arrearsManagement",
  components: { SelectHead, Pagination, customTable, TableTotal },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      page: 1,
      limit: 10,
      selectType: "1", //查询方式
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",

        Enumcqt: "1", //用户条件下拉
        Customer: "", //输入框
        SA_WaterFactory_Id: "-1", //水厂
        SA_UserArea_Id: "-1", //区域
        Star_TotalPrice: "", //欠费费用起
        End_TotalPrice: "", //欠费费用起
        Enumut: "-1", //用户类型
        Enumwm: "-1", //水表类型
        Enumcf: "-1", //费用状态
        Enumot: "-1", //费用类型
        Star_ArrearsDate: "", // 操作时间起
        End_ArrearsDate: "", // 操作时间止
        tableId: "0000019"
      },
      factoryQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        SA_WaterFactory_Id: "-1", //水厂
        SA_UserArea_Id: "-1", //区域
        Star_TotalPrice: "", //欠费费用起
        End_TotalPrice: "", //欠费费用起
        Enumut: "-1", //用户类型
        Enumwm: "-1", //水表类型
        Enumcf: "-1", //费用状态
        Enumot: "-1", //费用类型
        Star_ArrearsDate: "", // 操作时间起
        End_ArrearsDate: "", // 操作时间止
        tableId: "0000025"
      },
      selectPintShow: false, //票据打印弹窗
      tableData: [],
      checksData: [],
      tableTotal: [
        { num: 0, txt: "费用笔数" },
        { num: 0, txt: "剩余未缴（元）" }
      ]
    };
  },
  watch: {
    selectType(v, o) {
      if (v == 1) {
        this.page = this.listQuery.page;
        this.limit = this.listQuery.limit;
        
      } else {
        this.page = this.factoryQuery.page;
        this.limit = this.factoryQuery.limit;
      }
      this.getTableHead()
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
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      this.toggleShow();
      this.getTableHead()
    });
  },
  methods: {
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    getList() {
      //按用户查询列表
      GetList(this.listQuery).then(res => {
        this.total = res.count;
        this.tableTotal[0].num = res.data.ot.OrderCount;
        this.tableTotal[1].num = res.data.ot.PriceSurplus;
        this.tableData = res.data.list;
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
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilterFactory() {
      this.factoryQuery.page = 1;
      this.getListFactory();
    },
    getTableHead(){//获取表头自定义
      let id;
      if(this.selectType==1)
        id=this.listQuery.tableId
      else id=this.factoryQuery.tableId
      this.$refs.myChild.GetTable(id); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
    },
    clearData(){
      
    },
    getListFactory() {
      //水厂查询列表
      GetListByWaterFactory(this.factoryQuery).then(res => {
        this.total = res.count;
        this.tableData = res.data.list;
        console.info(this.tableData)
        this.tableTotal[0].num = res.data.ot.OrderCount;
        this.tableTotal[1].num = res.data.ot.PriceSurplus;
        
      });
    },
    invoice(r) {
      this.$confirm("是否确认冲红该账单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        RedPayMentDataByPayMentId({ SA_Payment_Id: r.Id, Remark: "" }).then(
          res => {
            this.$message({
              message: res.message,
              type: "success",
              duration: 4000
            });
            this.getList();
          }
        );
      });
    },
    excel() {
      //导出
      SelectPayMentDataListToExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    // 点击展开收起搜索条件时，处理表格高度
    toggleShow() {
      const that = this;
      setTimeout(function() {
        var formHeight = that.$refs.formHeight.offsetHeight;
        that.tableHeight = document.body.clientHeight - formHeight - 250;
      }, 350);
    },
    // 行票据打印
    pint(r) {
      this.selectPintShow = true;
    },
    billDetails() {
      this.$router.push({
        path: "/businessManagement/billDetails",
        query: {
          id: "qwe"
        }
      });
    }
  }
};
</script>

