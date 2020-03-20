<template>
  <div class="box_sub">
    <div ref="fromHeight">
      <sub-selected :searchWidth="searchWidth" @getText="getText" ref="selectChild" />
    </div>
    <div class="contanier">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excelInssud" />
      <div class="main-padding-20-y" id="table">
        <el-table
          :key="tableKey"
          :data="tableData"
          ref="table"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
        >
          <el-table-column fixed="left" label="#" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(query.page - 1) *query.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHeadData">
            <el-table-column
              :key="index"
              min-width="190px"
              :sortable="item.IsSortBol?'custom':null"
              :prop="item.ColProp"
              :align="item.Position"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column label="操作" width="120px" align="center" fixed="right">
            <template slot-scope="scope">
              <div class="icongStyle">
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="详情"
                  placement="bottom"
                >
                  <i class="icon iconfont detaile" @click="detaile(scope.row)">&#xe653;</i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="查看审核环节"
                  placement="bottom"
                >
                  <i class="icon iconfont" @click="toogleExpand(scope.row)">&#xe6a5;</i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand" fixed="right" width="1">
            <template slot-scope="props">
              <step :linkCont="linkCont" :processId="processId" :haveExamine="haveExamine" />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="searchTableList()"
        />
      </div>
    </div>
    <component :is="currentView" ref="detailChild" :auditLink="auditLink"></component>
  </div>
</template>
<script>
import meterAccount from "./detailPage/WatreMeterAccount";
import EditAccount from "./detailPage/EditAccount";
import LowInsureApply from "./detailPage/LowInsureApply";
import Transfer from "./detailPage/Transfer";
import SalesAccount from "./detailPage/SalesAccount";
import ChangeNature from "./detailPage/ChangeNature";
import AddNature from "./detailPage/AddNature";
import BreachContract from "./detailPage/BreachContract";
import {
  GetInfosBySubmission,
  GetAuditDetail,
  GetAuditLink,
  GetAuditRecord,
  GetInfosBySubmissionExcel
} from "@/api/workBenck";
import { promptInfoFun } from "@/utils/index";
import SubSelected from "./selecteds/SubSelected";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination";
import Step from "./Step"; //流程图
import { ladderChangeObj } from "@/utils/index";

export default {
  name: "SubMitted",
  components: {
    SubSelected,
    SearchTips,
    Pagination,
    Step,
    meterAccount,
    EditAccount,
    LowInsureApply,
    Transfer,
    SalesAccount,
    ChangeNature,
    AddNature,
    BreachContract
  },
  data() {
    return {
      auditLink: "", //详情右侧流程
      index: 0,
      componentsArr: [
        "EditAccount", //编辑开户
        "meterAccount", //用户开户
        "LowInsureApply", //低保户申请
        "Transfer", //过户
        "SalesAccount", //销户
        "ChangeNature", //用水性质变更
        "AddNature", //添加用水性质申请
        "BreachContract" //违约金减免
      ],
      haveExamine: "",
      processId: "",
      linkCont: [], //查看审核环节
      searchWidth: 1024,
      query: {
        ProcessState: 0,
        VerifyState: 0,
        WaterFactoryId: "",
        ProcessMenuCode: 2900,
        FlowNo: "",
        createUserId: "",
        createStartTime: "",
        createEndTime: "",
        editUserId: "",
        editStartTime: "",
        editEndTime: "",
        limit: 1,
        page: 20,
        sort: "",
        filed: "",
        tableId: "0000034"
      }, //查询对象
      checksData: [],
      tableKey: 0,
      tableData: [],
      tableHeight: null,
      total: 0,
      tipsData: [], //面包屑数据
      tipsDataCopy: [], //表单变化的值
      orderData: {} //搜索存储对象
    };
  },
  computed: {
    tableHeadData: function() {
      //获取表头信息
      const arrayHead = [];
      const data = this.checksData;
      for (let i = 0; i < data.length; i++) {
        // 过滤选中列
        if (data[i].IsCheck) {
          arrayHead.push(data[i]);
        }
      }
      return arrayHead;
    },
    currentView() {
      return this.componentsArr[this.index];
    }
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("el-tabs")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      98;
    this.$refs.searchTips.$refs.myChild.GetTable(this.query.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.searchWidth = this.$refs.fromHeight.clientWidth;
  },
  methods: {
    //删除面包屑
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.$refs.selectChild.timevalue = [];
        this.$refs.selectChild.query.createStartTime = "";
        this.$refs.selectChild.query.createEndTime = "";
      }
      this.tipsDataCopy = delTips(
        val,
        this.$refs.selectChild,
        this.tipsDataCopy,
        "query"
      );
      this.$refs.selectChild.handleFilter();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.query.page = 1;
      this.query.filed = prop;
      this.query.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchTableList();
    },
    //查询
    searchTableList() {
      GetInfosBySubmission(this.query).then(res => {
        if (res.code == 0) {
          this.total = res.count;
          this.tableData = res.data;
          this.tipsData = pushItem(this.tipsDataCopy);
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    },
    excelInssud() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表无数据，不可导出",
          type: "warning"
        });
        return false;
      }
      GetInfosBySubmissionExcel(this.query).then(res => {
        //详情右侧审核流程
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    //详情
    detaile(row) {
      GetAuditDetail({
        Id: row.Id,
        BusinessId: row.BusinessId,
        Code: row.ProcessMenuCode
      }).then(res => {
        //详情信息
        if (res.code == 0) {
          switch (row.ProcessMenuCode) {
            case 2901: //用户开户
              this.index = 1;
              this.getUserAccount(res.data, row);
              break;
            case 2902: //低保户申请
              this.index = 2;
              this.$nextTick(() => {
                this.$refs.detailChild.ifIcWter = true; //区分机械表与IC表信息
              });
              this.getAddNature(res.data, row);
              break;
            case 2903: //编辑开户
              this.index = 0;
              this.getAddNature(res.data, row);
              break;
            case 2904: //用户过户
              this.index = 3;
              this.getAddNature(res.data, row);
              break;
            case 2905: //用户销户
              this.index = 4;
              this.getAddNature(res.data, row);
              break;
            case 2906: //低保户复审
              this.index = 2;
              this.$nextTick(() => {
                this.$refs.detailChild.ifIcWter = false; //区分机械表与IC表信息
              });
              this.getAddNature(res.data, row);
              break;
            case 2907: //用户变更用水性质
              this.index = 5;
              this.getAddNature(res.data, row);
              break;
            case 2908: //添加用水性质
              this.index = 6;
              this.getAddNature(res.data, row);
              break;
            case 2911: //违约金减免
              this.index = 7;
              this.getAddNature(res.data, row);
              break;
          }
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
      GetAuditRecord({ Id: row.Id }).then(res => {
        //详情右侧审核流程
        if (res.code == 0) {
          this.auditLink = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    },
    getUserAccount(data, row) {
      //用户开户
      let waterType = data.Data.bl.WaterMeterTypeId;
      this.$nextTick(() => {
        this.$refs.detailChild.detailData = data;
        this.$refs.detailChild.dialogVisible = true;
        this.$refs.detailChild.ifDetail = true; //true 为详情 false为编辑
        this.$refs.detailChild.curObj = row;
        switch (waterType) {
          case 1101: //机械
            this.$refs.detailChild.index = 0;
            this.$refs.detailChild.ifIcWter = false; //区分机械表与IC表信息
            break;
          case 1102: //IC
            this.$refs.detailChild.index = 0;
            this.$refs.detailChild.ifIcWter = true; //区分机械表与IC表信息

            break;
          case 1103: //远传
            this.$refs.detailChild.index = 1;
            break;
          case 1104: //物联
            this.$refs.detailChild.index = 2;
            break;
        }
      });
    },
    getAddNature(data, row) {
      //公用详情方法
      this.$nextTick(() => {
        this.$refs.detailChild.detailData = data;
        this.$refs.detailChild.dialogVisible = true;
        this.$refs.detailChild.ifDetail = true; //true 为详情 false为编辑
        this.$refs.detailChild.curObj = row;
      });
    },
    toogleExpand(row) {
      //审核环节
      const _this = this;
      let $table = _this.$refs.table;
      _this.tableData.map((item, index) => {
        $table.toggleRowExpansion(item, false);
      });
      if (this.rotate == row.reaId) {
        $table.toggleRowExpansion(row, false);
        this.rotate = "";
        return false;
      }
      this.rotate = row.reaId;
      $table.toggleRowExpansion(row);
      this.processId = row.Id;
      this.haveExamine = false;
      GetAuditLink({ Id: row.Id }).then(res => {
        //审核流程环境
        if (res.code == 0) {
          this.linkCont = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.box_sub {
  // padding: 12px;
  .icon {
    color: #00b2a1;
    cursor: pointer;
    font-size: 14px;
  }
  .contanier {
    padding: 14px;
    padding-top: 0;
  }
  .detaile {
    font-size: 16px;
    color: #b59200;
    padding-right: 18px;
  }
}
</style>
