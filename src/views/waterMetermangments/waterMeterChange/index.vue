<template>
  <div class="tree_container">
    <div class="user_box">
      <left-box @getUp="getUp" :ifShow="ifShow"></left-box>
      <div class="user_table" style="padding:0;">
        <div ref="formHeight">
          <select-head
            :select-head="listQuery"
            @handleFilter="getList"
            @getText="getText"
            :searchWidth="searchWidth"
          />
        </div>
        <div class="section-full-container">
          <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
          <div class="main-padding-20-y">
            <el-table
              :key="tableKey"
              :data="tableData"
              border
              fit
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
        <span v-show="ifShow" class="telescopic telescopic1" @click="getUp(false)">
          水表换表
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import LeftBox from "./components/Left";
import {
  WaterMeterChangeList,
  AccountCanCellationList_Execl
} from "@/api/waterMeterMang";
import Pagination from "@/components/Pagination";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "waterMeterChange",
  components: { SelectHead, Pagination, LeftBox, SearchTips },
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
        waterFactoryId: "-1", //水厂
        customerQueryType: "", //查询用户类型
        customerQueryValue: "", //input值
        userType: "-1", //用户类型
        waterMeterType: "-1", //水表类型
        createUserId: "-1", //换表操作人
        changeMeterType: "-1", //换表类型
        changeStartTime: "", //开始时间
        changeEndTime: "", //结束时间
        tableId: "0000029",
        timevalue: []
      },
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024 //右侧宽度
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
  watch: {
    ifShow() {
      let _this = this;
      setTimeout(function() {
        _this.searchWidth = _this.$refs.formHeight.clientWidth;
      }, 250);
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getUp(true);
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 200;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.searchWidth = this.$refs.formHeight.clientWidth;
    });
  },
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.changeStartTime = "";
        this.listQuery.changeEndTime = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getUp(v) {
      this.ifShow = v;
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
      WaterMeterChangeList(this.orderData).then(res => {
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
      AccountCanCellationList_Execl(this.listQuery).then(res => {
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
.section-full-container{
  padding:0 15px 15px 15px;
}
</style>
