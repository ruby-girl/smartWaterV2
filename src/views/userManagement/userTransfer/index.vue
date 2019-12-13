<template>
  <div class="tree_container">
    <div class="user_box">
      <left-box @getUp="getUp" :ifShow="ifShow"></left-box>
      <div class="user_table">
        <div >
          <div ref="formHeight" class="position-search-head">
            <select-head :select-head="listQuery" @handleFilter="getList" @getText="getText" :searchWidth="searchWidth"/>
          </div>      
          <div class="section-full-container">
           <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
          <!-- <customTable ref="myChild" /> -->
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
                <template slot-scope="scope">
                  <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <template v-for="(item ,index) in tableHead">
                <el-table-column
                  :key="index"
                  :min-width="item.ColProp=='TransferDate'?'170px':'120px'"
                  :prop="item.ColProp"
                  align="center"
                  :sortable="item.IsSortBol?'custom':null"
                  :label="item.ColDesc"
                />
              </template>
            </el-table>
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="getList(1)"
            />
          </div>
          </div>
        </div>
        <span v-show="ifShow" class="telescopic telescopic1" @click="getUp(false)">
          用户过户
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import LeftBox from "./components/Left"
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import {TransferCustomerList,TransferCustomerList_Execl} from "@/api/userAccount";
import Pagination from "@/components/Pagination";
export default {
  name: "userTransfer",
  components: { SelectHead, Pagination,LeftBox,SearchTips},
  data() {
    return {
      ifShow: false,
      total: 0,
      tableKey: 9,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
       SA_WaterFactory_Id:'-1',//水厂
       UserType:'-1',//用户类型
       WaterTypeId:'-1',//水表类型
       TransferCustomer:'3301',//查询类型
       Customer:'',//Input值
       OpId:'-1',//过户操作员
       Star_TransferDate:'',//开始时间
       End_TransferDate:'',//开始时间
       tableId: "0000027",
       timevalue:[]
      },
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableData: [],
      checksData: [],
      orderData:null,
      tipsData:[],
      tipsDataCopy:[],
      searchWidth:1024,//右侧宽度
    };
  },
   watch:{
    ifShow(){
      let _this=this
      setTimeout(function(){
        _this.searchWidth=_this.$refs.formHeight.clientWidth
      },250) 
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
      this.getUp(true)
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 200;
     this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.searchWidth=this.$refs.formHeight.clientWidth
    });
  },
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.Star_TransferDate = "";
        this.listQuery.End_TransferDate = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getUp(v) {
      this.ifShow =v;
      if (this.ifShow) {
        document.getElementsByClassName("user_tree")[0].classList.add("hide");
      } else {
        document
          .getElementsByClassName("user_tree")[0]
          .classList.remove("hide");
      }
    },
    getList(n) {
      if (!n) {
        this.orderData = Object.assign({}, this.listQuery);
        this.orderData.page = 1;
      }
      TransferCustomerList(this.orderData).then(res => {
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
    excel() {
      //导出
      TransferCustomerList_Execl(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tree_container {
  background: #eff1f4;
  .telescopic {
    position: absolute;
    display: block;
    top: 300px;
    color: #00b2a1;
    font: normal 16px "Microsoft YaHei";
    width: 30px;
    margin: 0 auto;
    word-wrap: break-word;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    background: #fff;
    padding: 15px 0;
    z-index: 999;
    text-align: center;
    cursor: pointer;
    box-shadow: 1px 1px 5px #cecece;
  }
  .telescopic1 {
    left: 0;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
  position: relative;
  padding: 16px 16px 0 16px;
  height: calc(100vh - 74px);
  .user_box {
    display: flex;
    height: inherit;
    > div {
      transition: width 0.2s;
      -webkit-transition: width 0.2s;
      position: relative;
    }
    .user_table {
      flex: 1;
      -webkit-flex: 1;
      background: #fff;
      // padding: 16px;
      position: relative;
      overflow: hidden;
    }
  }
  .el-button--mini {
    padding: 7px 5px;
  }
  .hide {
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    margin-right: 0 !important;
  }
  .none {
    display: none;
  }
  .user_table {
    .el-button--small {
      padding: 7px 15px;
    }
  }
}
.section-full-container {
  padding: 15px;
  padding-top: 0;
}
</style>
