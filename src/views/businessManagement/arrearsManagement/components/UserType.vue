
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
      <customTable ref="myChildUser" />
      <div class="main-padding-20-y">
        <mytable-total :list="tableTotal"></mytable-total>
        <el-table
          :key="tableKey"
          :data="tableDataUser"
          border
          :height="tableHeightUser"
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
                <div class="main-color-warn" @click="details(row)">
                  <a>费用详情</a>
                </div>
                <div class=" pl-15 pr-15" @click="reset(row.Id)">
                  <a>费用撤销</a>
                </div>
                <div class="main-color" @click="feeWaiverFunc(row)">
                  <a>费用减免</a>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalUser>0"
          :total="totalUser"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getListFactory"
        />
      </div>
      <!-- 费用详情弹窗 -->
      <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp"/>
      <!-- 费用减免 -->
      <fee-waiver
      :feeWaiverShow.sync="feeWaiverShow"
      :feeWaiverItem="feeWaiverItem"
      @getList="getList"
    />
    </div>
  </div>
</template>
<script>
import customTable from "@/components/CustomTable/index";
import Pagination from "@/components/Pagination";
import MytableTotal from "@/components/TableTotal/index";
import ChargesDetails from "../../cashCharge/components/ChargesDetails"; //水费详情弹窗-共用现金收费的费用详情
import { OrderFeeCancel } from "@/api/cashCharge";//费用撤销
import FeeWaiver from "../../cashCharge/components/FeeWaiver"; //水费减免弹窗
export default {
 props: {
    listQuery: {
      //按水厂查询条件
      type: Object,
      default: function() {
        return {};
      }
    },
    tableTotal:{},
    tableDataUser:{},
    totalUser:0,
    tableHeightUser:{}
  },
  components: {Pagination, customTable, MytableTotal,ChargesDetails,FeeWaiver},
  data() {
    return {
      tableKey: 2,
      temp: {},
      selectPintShow: false, //票据打印弹窗
      tableData: [],
      // tableHeightUser:0,
      checksData: [],
      chargesDetailsShow:false,
      feeWaiverItem:{},
      feeWaiverShow:false
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
      this.$refs.myChildUser.isCustom = !this.$refs.myChildUser.isCustom;
      if (this.$refs.myChildUser.isCustom) this.tableHeightUser = this.tableHeightUser - 80;
      else this.tableHeightUser = this.tableHeightUser + 80;
    },
    excel(){
        
    },
    sortChanges(){},
    getListFactory(){},
      getTableHead(){//获取表头自定义
      this.$refs.myChildUser.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChildUser.checkData; // 获取自定义字段中选中了字段
    },
    details(row){
      this.temp=row
      this.chargesDetailsShow=true
    },
      // 费用撤回
    reset(id) {
      this.$confirm("是否确认撤销欠费？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        OrderFeeCancel({ SA_Order_Id: id }).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    getList(){
      this.$emit("handleFilter", this.listQuery);
    },
    // 费用减免
    feeWaiverFunc(item) {
      this.feeWaiverItem=item
      this.feeWaiverShow = true;
    },
  }
};
</script>

