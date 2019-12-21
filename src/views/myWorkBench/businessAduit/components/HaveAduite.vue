<template>
  <div class="box_sub">
    <div ref="fromHeight">
      <have-selected
        ref="MyAduite"
        :searchWidth="searchWidth"
        :query="query"
        @getText="getText"
      />
    </div>
    <div class="contanier">
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excelInssud"/>
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
          @sort-change="sortChanges">
          <el-table-column fixed="left" label="序号" width="60" align="center">
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
                  content="审核环节"
                  placement="bottom"
                >
                  <i class="icon iconfont" @click="toogleExpand(scope.row)">&#xe6a5;</i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand" fixed="right" width="1">
            <template slot-scope="props">
              <step :linkCont="linkCont" :processId="processId" :personId="personId"/>
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
    <component :is="currentView" ref="detailChild"></component>
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
  import {GetBusinessFlowRecordByCurrentUser, GetAuditDetail, GetAuditLink, GetAuditRecord} from '@/api/workBenck'
  import {promptInfoFun} from "@/utils/index"
  import HaveSelected from "./selecteds/HaveSelected";
  import {delTips, getText, pushItem} from "@/utils/projectLogic"; //搜索条件面包屑
  import SearchTips from "@/components/SearchTips/index";
  import Pagination from "@/components/Pagination";
  import Step from "./Step"; //流程图
  export default {
    name: "HaveAduite",
    components: {HaveSelected, SearchTips, Pagination, Step, meterAccount,
      EditAccount,
      LowInsureApply,
      Transfer,
      SalesAccount,
      ChangeNature,
      AddNature,
      BreachContract},
    data() {
      return {
        index: 0,
        componentsArr: [
          "EditAccount",//编辑开户
          "meterAccount",//用户开户
          "LowInsureApply",//低保户申请
          "Transfer",//过户
          "SalesAccount",//销户
          "ChangeNature",//用水性质变更
          "AddNature",//添加用水性质申请
          "BreachContract"//违约金减免
        ],
        personId:'',
        processId:'',
        linkCont:[],//查看审核环节
        searchWidth: null,
        query: {
          ProcessState: 0,
          VerifyState: 0,
          WaterFactoryId: "",
          ProcessMenuCode: 0,
          FlowNo: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 0,
          page: 0,
          sort: "",
          filed: "",
          tableId: "0000036"
        }, //查询对象
        checksData: [],
        tableKey: 0,
        tableData: [],
        tableHeight: null,
        total: 0,
        tipsData: [], //面包屑数据
        tipsDataCopy: [], //表单变化的值
        isBorde: true,
        orderData: {} //搜索存储对象
      };
    },
    computed: {
      tableHeadData: function () {
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
          this.query.StartTime = "";
          this.query.StartTime = "";
        }
        this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "query");
        this.searchTableList();
      },
      getText(val, model, arr, name) {
        let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
        this.tipsDataCopy.push(obj);
      },
      sortChanges({column, prop, order}) {
        //排序
        this.query.page = 1;
        this.query.filed = prop;
        this.query.sort =
          order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
        this.searchTableList();
      },
      //查询
      searchTableList() {//我已经审核
        GetBusinessFlowRecordByCurrentUser(this.query).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
            this.tipsData = pushItem(this.tipsDataCopy)
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      },
      excelInssud() {
        console.log("导出");
      },
      //详情
      detaile(row) {
        switch (row.ProcessMenuCode) {
          case 2901://用户开户
            this.index = 1
            break
          case 2902://用户销户
            this.index = 4
            break
          case 2903://用户过户
            this.index = 3
            break
          case 2904://用户变更用水性质
            this.index = 5
            break
          case 2905://低保户申请
            this.index = 2
            break
          case 2906://水费减免
            this.index = 1111
            break
          case 2907://违约金减免
            this.index = 7
            break
          //缺少编辑开户申请 和添加用书性质变更
        }
        this.$refs.detailChild.ifDetail = true //true 为详情 false为编辑
        this.$refs.detailChild.curObj = row
        this.$refs.detailChild.dialogVisible = true
        return
        GetAuditRecord({Id:row.Id}).then(res => {//详情右侧审核流程
          if (res.code ==0 ) {
            this.$refs.detailChild.auditLink = res.data
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      },
      //审核环节
      toogleExpand(row) {
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
        this.processId = row.Id
        this.personId = row.CreateUserId
        GetAuditLink({Id:row.Id}).then(res => {
          if (res.code ==0 ) {
            this.linkCont = res.data
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .box_sub {
    .contanier {
      padding: 14px;
      padding-top: 0;
    }

    .icon {
      color: #00b2a1;
      cursor: pointer;
      font-size: 14px;
    }

    .detaile {
      font-size: 16px;
      color: #b59200;
      padding-right: 18px;
    }
  }
</style>
