<template>
  <div class="box_sub">
    <div ref="fromHeight">
      <sub-selected :searchWidth="searchWidth" :selectHead="selectHead" @getText="getText" />
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
          @sort-change="sortChanges">
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(selectHead.page - 1) *selectHead.limit+ scope.$index + 1}}</span>
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
                  placement="bottom">
                  <i class="icon iconfont detaile" @click="detaile">&#xe653;</i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="审核环节"
                  placement="bottom">
                  <i class="icon iconfont" @click="toogleExpand(scope.row)">&#xe6a5;</i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand" fixed="right" width="1">
            <template slot-scope="props">
              <step />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="selectHead.page"
          :limit.sync="selectHead.limit"
          @pagination="seachAccountOrder('0')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SubSelected from "./selecteds/SubSelected";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination";
import Step from "./Step"; //流程图
export default {
  name: "SubMitted",
  components: { SubSelected, SearchTips, Pagination, Step },
  data() {
    return {
      searchWidth: 1024,
      selectHead: {
        page: 1,
        limit: 10,
        applyNo: "", //业务编号
        applyType: "", //申请类型
        timevalue: [], //时间
        tableId: "0000032"
      }, //查询对象
      checksData: [],
      tableKey: 0,
      tableData: [
        {
          reaId: "17ce4b89-3938-444b-beec-9683a4e010e2",
          AreaName: "根级区域",
          CustomerName: "夏侯渊",
          CustomerNo: "00000368",
          EndDate: "2021-12-09 23:59:59",
          FS_EndDate: null,
          FS_StartDate: null,
          InsuredState: 1501,
          InsuredStateName: "生效中",
          NameCode: "xhy",
          OpenAccountDate: "2019-12-11 16:02:48",
          OperEmpName: "系统",
          OperTime: "2020-12-08 16:05:09",
          RecheckState: 3501,
          RecheckStateName: "/",
          SA_InsuredMessage_Id: "35fd7450-c996-45e8-9e22-e84448409515",
          StartDate: "2020-12-10 00:00:00",
          UseWaterTypeName: "居民用水1",
          WaterFactoryName: "王强水厂",
          WaterMeterTypeId: 1103,
          WaterMeterTypeName: "远传表水表"
        },
        {
          reaId: "17ce4b89-3938-444b-beec-9683a4e010e211",
          AreaName: "根级区域",
          CustomerName: "夏侯渊",
          CustomerNo: "00000368",
          EndDate: "2021-12-09 23:59:59",
          FS_EndDate: null,
          FS_StartDate: null,
          InsuredState: 1501,
          InsuredStateName: "生效中",
          NameCode: "xhy",
          OpenAccountDate: "2019-12-11 16:02:48",
          OperEmpName: "系统",
          OperTime: "2020-12-08 16:05:09",
          RecheckState: 3501,
          RecheckStateName: "/",
          SA_InsuredMessage_Id: "35fd7450-c996-45e8-9e22-e84448409515",
          StartDate: "2020-12-10 00:00:00",
          UseWaterTypeName: "居民用水1",
          WaterFactoryName: "王强水厂",
          WaterMeterTypeId: 1103,
          WaterMeterTypeName: "远传表水表"
        }
      ],
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
    }
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("el-tabs")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      98;
    this.$refs.searchTips.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.searchWidth = this.$refs.fromHeight.clientWidth;
  },
  methods: {
    //删除面包屑
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.StartTime = "";
        this.selectHead.StartTime = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.selectHead.page = 1;
      this.selectHead.filed = prop;
      this.selectHead.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchTableList();
    },
    //查询
    searchTableList() {
      this.tipsData = pushItem(this.tipsDataCopy);
    },
    excelInssud() {
      console.log("导出");
    },
    //详情
    detaile() {},
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
