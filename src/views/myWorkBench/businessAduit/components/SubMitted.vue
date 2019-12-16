<template>
  <div class="box_sub">
    <div ref="fromHeight">
      <sub-selected :searchWidth="searchWidth" :selectHead="selectHead" @getText="getText" />
    </div>
    <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excelInssud" />
    <div class="main-padding-20-y" id="table">
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
              <i
                class="icon iconfont iconbiaodan1"
                @click="detaile(scope.row.SA_InsuredMessage_Id)"
                title="详情"
              ></i>
              <i class="icon iconfont" @click="goHisWeb(scope.row.CustomerNo)" title="历史详情">&#xe670;</i>
              <i class="icon iconfont iconlianhe1" @click="auitSecur(scope.row)" title="复审"></i>
            </div>
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
</template>
<script>
import SubSelected from "../selecteds/SubSelected";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination";
export default {
  name: "SubMitted",
  components: { SubSelected, SearchTips, Pagination },
  data() {
    return {
      searchWidth: 1024, //
      selectHead: {
        page: 1,
        limit: 10,
        applyNo: "", //业务编号
        applyType: "", //申请类型
        timevalue: [], //时间
        tableId: ""
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
      debugger;

      this.tipsData = pushItem(this.tipsDataCopy);
    },
    excelInssud() {
      console.log("导出");
    }
  }
};
</script>
<style lang="scss" scoped>
.box_sub {
  padding: 12px;
}
</style>