
<template>
  <!-- 收费查询 -->
  <div class="section-container">
   <div class="back-fff height-container">
      <div ref="formHeight">
      <select-head
        :select-type.sync="selectType"
        :select-head="listQuery"
        :factory-query="factoryQuery"
        @handleFilter="handleFilter"
        @handleFilterFactory="handleFilterFactory"
        @toggleShow="toggleShow"
        @OrdersFeeCancels="OrdersFeeCancelsFunc"
      />
    </div>
    <div>
       <components 
       :totalUser="totalUser"
       :totalFactory="totalFactory"
       :tableTotal="tableTotal"
        :tableDataUser="tableDataUser"      
        :tableDataFactory="tableDataFactory"
        :is="selectTypeComponents"
        :factoryQuery="factoryQuery" 
        :listQuery="listQuery" 
        :tableHeightUser.sync="tableHeightUser" 
        :tableHeightSave.sync="tableHeightSave"
        :checkedDataId.sync="checkedDataId"
        @handleFilterFactory="handleFilterFactory"
        @handleFilter="handleFilter"
        @factoryToUser="factoryToUser"
        ></components>
    </div>
   </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import UserType from "./components/UserType"
import FactoryType from "./components/FactoryType"
import { GetList,GetListByWaterFactory,OrdersFeeCancels } from "@/api/cashCharge";
export default {
  name: "arrearsManagement",
  components: { SelectHead,UserType,FactoryType },
  data() {
    return {
      totalUser: 0,
      totalFactory:0,
      tableKey: 0,
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
      tableDataFactory:[],
      tableDataUser:[],
      selectPintShow: false, //票据打印弹窗
      tableData: [],
      checksData: [],
      tableTotal: [
        { num: 0, txt: "费用笔数" },
        { num: 0, txt: "剩余未缴（元）" }
      ],
      selectTypeComponents:'UserType',
      tableHeightSave:0,
      tableHeightUser:0,
      checkedDataId:[]//批量撤销ID
    };
  },
  watch: {
    selectType(v){
      v==1?this.selectTypeComponents='UserType':this.selectTypeComponents='FactoryType'
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
      var formHeight = this.$refs.formHeight.offsetHeight;      
        this.tableHeightUser = document.body.clientHeight - formHeight - 250;
        this.tableHeightSave = document.body.clientHeight - formHeight - 180; 
    });
  },
  methods: {
    
    getList() {
      //按用户查询列表
      GetList(this.listQuery).then(res => {
       
        this.totalUser = res.count;
         this.tableTotal[0].num = res.data.ot.OrderCount;
         this.tableTotal[1].num = res.data.ot.PriceSurplus;
         this.tableDataUser = res.data.list;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilterFactory() {
      this.factoryQuery.page = 1;
      this.getListFactory();
    },
    getListFactory() {
      //水厂查询列表
      GetListByWaterFactory(this.factoryQuery).then(res => {
        this.totalFactory = res.count;    
         this.tableDataFactory = res.data;
        
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
        that.tableHeightUser = document.body.clientHeight - formHeight - 250;
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
    },
    factoryToUser(query,factoryId){
      this.selectType='1'
      this.listQuery={  
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        Enumcqt: "1", //用户条件下拉
        Customer: "", //输入框
        SA_WaterFactory_Id:factoryId, //水厂
        SA_UserArea_Id: "-1", //区域
        Star_TotalPrice: "", //欠费费用起
        End_TotalPrice: "", //欠费费用起
        Enumut:query.Enumut, //用户类型
        Enumwm:query.Enumwm, //水表类型
        Enumcf:query.Enumcf, //费用状态
        Enumot:query.Enumot, //费用类型
        Star_ArrearsDate:query.Star_ArrearsDate, // 操作时间起
        End_ArrearsDate: query.End_ArrearsDate, // 操作时间止
        tableId: "0000019"
      }
      this.getList();
    },
    OrdersFeeCancelsFunc(){
      OrdersFeeCancels({SA_Order_Ids:this.checkedDataId}).then(res=>{
        this.$message({
          message: res.msg,
          type: "success",
          duration: 4000
        });
        this.handleFilter();
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.back-fff{
background:#fff;
}
.height-container{
  height:100%;
}
</style>

