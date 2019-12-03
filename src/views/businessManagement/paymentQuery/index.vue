<template>
  <!-- 收费查询 -->
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head
          :select-head="listQuery"
          @handleFilter="handleFilter"
          @toggleShow="toggleShow"
        />
      </div>
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
      <customTable ref="myChild"/>
      <div class="main-padding-20-y">
        <table-total :list="tableTotal"></table-total>
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
            <template
               slot-scope="scope">
                          <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
                        
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
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
      <select-pint :selectPintShow.sync="selectPintShow"/>
      <!-- 账单详情弹窗 -->
    </div>
  </div>
</template>
<script>
  import SelectHead from "./components/SelectHead";
  import SelectPint from "./components/SelectPint";
  import Pagination from "@/components/Pagination";
  import customTable from "@/components/CustomTable/index";
  import TableTotal from "@/components/TableTotal/index";
  import {
    SelectPayMentDataList, GetWaterTypeCustomerNum, RedPayMentDataByPayMentId, SelectPayMentDataListToExcel
  } from "@/api/cashCharge";

  export default {
    name: "paymentQuery",
    components: {SelectHead, Pagination, customTable, TableTotal, SelectPint},
    data() {
      return {
        total: 0,
        tableKey: 0,
        tableHeight: 0,
        temp: {},
        listQuery: {
          // 查询条件
          page: 1,
          limit: 10,
          filed: "",
          sort: "",
          CustomerQueryType: "1", //用户类型
          CustomerQueryValue: '', // input值
          WaterMeterTypeId: "-1",//水表类型
          PayMentState: "-1",//缴费状态
          PayMentType: "-1",//缴费方式
          StartPayMentDate: '',//缴费时间起
          EndPayMentDate: '',//缴费时间止
          ReceiveMoneyUser: "-1",//收款人
          WaterFactory: "-1",//水厂
          editStartTime: "", // 操作时间起
          editEndTime: "", // 操作时间止
          tableId: "0000019"
        },
        selectPintShow: false,//票据打印弹窗
        tableData: [],
        checksData: [],
        tableTotal: [
          {num: 0, txt: "交易次数"},
          {num: 0, txt: "缴费金额"},
          {num: 0, txt: "预存金额"},
          {num: 0, txt: "实收金额"}
        ]
      };
    },
    computed: {
      tableHead: function () {
        let arrayHead = this.checksData.filter(item => {
          return item.IsCheck;
        });
        return arrayHead;
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        // 自适应表格高度
        this.toggleShow();
        this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
        this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      });
    },
    methods: {
      setCustomData() {
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
        if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
        else this.tableHeight = this.tableHeight + 80;
      },
      getList() {
        SelectPayMentDataList(this.listQuery).then(res => {
          this.total = res.count;
          this.tableData = res.data;
        });
        GetWaterTypeCustomerNum(this.listQuery).then(res => {
          this.tableTotal[0].num = res.data.NumberOfTrades
          this.tableTotal[1].num = res.data.PayMentMoney
          this.tableTotal[2].num = res.data.PrestoreMoney
          this.tableTotal[3].num = res.data.ReceiptsMoney
        })
      },
      sortChanges({prop, order}) {
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
      invoice(r) {
        this.$confirm("是否确认冲红该账单？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          RedPayMentDataByPayMentId({SA_Payment_Id: r.Id, Remark: ''}).then(res => {
            this.$message({
              message: res.message,
              type: "success",
              duration: 4000
            });
            this.getList();
          });
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
        setTimeout(function () {
          var formHeight = that.$refs.formHeight.offsetHeight;
          that.tableHeight = document.body.clientHeight - formHeight - 250;
        }, 350);
      },
      // 行票据打印
      pint(r) {
        this.selectPintShow = true
      },
      billDetails() {
        this.$router.push({
          path: '/businessManagement/billDetails',
          query: {
            id: 'qwe',
          }
        })
      }
    }
  };
</script>

