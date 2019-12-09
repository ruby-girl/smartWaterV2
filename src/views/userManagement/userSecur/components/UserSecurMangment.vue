<template>
  <div class="secur-content">
    <selected :selectHead="listQuery" @handleFilter="seachAccountOrder" @getText="getText" />
    <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" />
    <!-- <customTable ref="myChild" /> -->
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
            <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>

        <template v-for="(item ,index) in tableHeadData">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="190px"
            :sortable="item.IsSortBol?'custom':null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed="item.Freeze"
          />
          <el-table-column
            v-else
            :key="index"
            min-width="190px"
            sortable="custom"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
          />
        </template>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="seachAccountOrder('0')"
      />
    </div>
  </div>
</template>
<script>
import Selected from "./Selected";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { legalTime } from "@/utils/index"; //时间格式化
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination";
export default {
  name: "UserSecurMangment",
  components: { Selected,Pagination,SearchTips },
  data() {
    return {
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        customerQueryType: "", //查询类型
        customerQueryValue: "", //查询值
        waterMeterType: -1, //水表类型
        createStartTime: "", // 操作时间起
        createEndTime: "", // 操作时间止
        securType:-1,//低保户 状态
        timevalue: [],
        tableId: "0000026"
      },
      checksData: [],
      tableKey: 0,
      tableData: [],
      tableHeight: null,
      total: 10,
      customHeight: "", //自定义高度
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {} //搜索存储对象
    };
  },
  mounted() {
    console.log(document.getElementsByClassName("el-tabs")[0].offsetHeight)
    console.log(document.getElementById("table").offsetTop)
    this.tableHeight =
      document.getElementsByClassName("el-tabs")[0].offsetHeight -
      document.getElementById("table").offsetTop -98
  console.log(this.tableHeight)
    this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
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
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.StartUpgradeDate = "";
        this.listQuery.EndUpgradeDate = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.seachAccountOrder();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    seachAccountOrder(num) {
      if (this.listQuery.timevalue.length > 0) {
        this.listQuery.StartUpgradeDate =
          this.listQuery.StartUpgradeDate.split(" ")[0] + " 00:00:00";
        this.listQuery.EndUpgradeDate =
          this.listQuery.EndUpgradeDate.split(" ")[0] + " 23:58:59";
      }
      if (num != 0) {
        this.orderData = Object.assign({}, this.listQuery);
      }
      this.tipsData = pushItem(this.tipsDataCopy);
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.seachAccountOrder();
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-content {
}
</style>