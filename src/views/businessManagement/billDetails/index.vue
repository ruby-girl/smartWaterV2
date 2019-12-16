<template>
  <!-- 账单详情 -->
  <div class="section-container">
      <div ref="formHeight" class="position-search-head">
        <select-head
          :select-head="listQuery"
          @handleFilter="getList"
          @toggleShow="toggleShow"
          @getText="getText"
        />
      </div>
       <div class="section-full-container">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
      <div class="main-padding-20-y">
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
            <template slot-scope="scope">
            <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
          </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              min-width="130px"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
            class-name="small-padding"
          >
            <template slot-scope="{row}">
              <div class="display-flex">
                <div class="main-color-warn pl-15" @click="details(row)">
                  <a>费用详情</a>
                </div>
                <div class="pl-15" @click="reset(row)">
                  <a>费用撤销</a>
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
          @pagination="getList(1)"
        />
      </div>
      <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp"/>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
import ChargesDetails from "../cashCharge/components/ChargesDetails"; //水费详情弹窗-共用现金收费的费用详情
import {
  SelectBillDataList,SelectBillDataListToExcel,OrderFeeCancel
} from "@/api/cashCharge";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { parseStartTimeFunc, parseEndTimeFunc } from "@/utils/index";
export default {
  name: "billDetails",
  components: { SelectHead, Pagination,ChargesDetails,SearchTips},
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        CustomerQueryType: "1", //用户类型
        CustomerQueryValue: '', // input值
        WaterMeterTypeId:"-1",//水表类型
        // PayMentState:"-1",//缴费状态
        PayMentType:"-1",//缴费方式
        FeeType:"-1",//费用类型
        FeeState:"-1",//费用状态
        StartPayMentDate:'',//缴费时间起
        EndPayMentDate:'',//缴费时间止
        ReceiveMoneyUser:"-1",//收款人
        WaterFactory:"-1",//水厂
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000020",
        timevalue:[]
      },
      tableData: [],
      checksData: [],
      chargesDetailsShow:false,//费用弹窗
       tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData:{}
    };
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
      // 是否需要时间默认值--待确认

      //  let start = parseStartTimeFunc(new Date());
      // let end = parseEndTimeFunc(new Date());
      // this.listQuery.editStartTime=start
      // this.listQuery.editEndTime=end   
      // this.listQuery.timevalue.push(new Date(start));
      // this.listQuery.timevalue.push(new Date(end));
      // this.getText(start+'~'+end, "timevalue", "", "缴费日期");
      // this.tipsData = pushItem(this.tipsDataCopy);
      var formHeight = this.$refs.formHeight.offsetHeight;
      this.tableHeight = document.body.clientHeight - formHeight - 220;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    });
  },
  methods: {
     delTips(val) {
       if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.editStartTime = "";
        this.listQuery.editEndTime = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      console.info(this.listQuery)
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getList(n) {
      if(!n){
         this.orderData = Object.assign({}, this.listQuery);
         this.orderData.page=1
      }
      SelectBillDataList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
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
    reset(r) {
      this.$confirm("是否确认撤销费用？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        OrderFeeCancel({SA_Order_Id:r.Id}).then(res => {
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
      SelectBillDataListToExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    // 点击展开收起搜索条件时，处理表格高度
    toggleShow() {
      const that = this;
      setTimeout(function() {
        var formHeight = that.$refs.formHeight.offsetHeight;
        that.tableHeight = document.body.clientHeight - formHeight - 220;
      }, 350);
    },
    // 费用详情
    details(item){
      this.temp=item
      this.chargesDetailsShow=true
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container .section-full-container{
  padding-top:0 !important;
}
</style>

