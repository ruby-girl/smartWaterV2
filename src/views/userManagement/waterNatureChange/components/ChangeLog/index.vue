<template>
  <div>
    <div ref="formHeight">
      <select-head
        :select-head="listQuery"
        @handleFilter="getList"
        @getText="getText"
        :type-list="typeList"
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
          <template>
            <div v-for="(item ,index) in tableHead" :key="index">
              <el-table-column
                :key="index"
                min-width="160px"
                :prop="item.ColProp"
                align="center"
                :sortable="item.IsSortBol?'custom':null"
                :label="item.ColDesc"
              />
            </div>
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
</template>
<script>
import SelectHead from "./SelectHead";
import Pagination from "@/components/Pagination";
import { getDictionaryOption } from "@/utils/permission";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem,isExport } from "@/utils/projectLogic"; //搜索条件面包屑
import { SelectWaterPropertyChangeList } from "@/api/system";
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "changeLog",
  directives: { permission },
  components: {
    SelectHead,
    Pagination,
    SearchTips
  },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        //右侧用户列表查询条件
        CustomerQueryType: "", //用户下拉框类型
        CustomerQueryValue: "",
        WaterMeterType: "-1", //水表类型
        UserType: "-1", //用户类型
        OpId: "-1", //操作人
        AreaId: "-1", //区域
        WaterFactoryId: "-1", //水厂
        StartChangeDate: "",
        EndChangeDate: "",
        limit: 20,
        page: 1,
        sort: "",
        filed: "",
        tableId: "0000030",
        timevalue: []
      },
      typeList: [], //用水性质类型，传递给组件
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: []
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
      // 自适应表格高度
      this.tableHeight = document.body.clientHeight - 245;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.typeList = getDictionaryOption("用水性质类型");
    });
  },
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.StartChangeDate = "";
        this.listQuery.EndChangeDate = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getList(n) {
      if (!n) {
        this.orderData = Object.assign({}, this.listQuery);
        this.orderData.page = 1;
        this.listQuery.page = 1;
      }
      SelectWaterPropertyChangeList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.getList();
    },
    //导出
    excel() {
      if(!isExport(this.tableData)) return
      GetWaterPropertyList_OutExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-full-container {
  padding-top: 0;
}
.color-more-black {
  color: #46494c;
}
.button-width {
  width: 80px;
  text-align: center;
}
</style>


