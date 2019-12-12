<template>
  <div class="secur-content">
    <selected
      ref="selected"
      :selectHead="listQuery"
      @handleFilter="seachAccountOrder"
      @getText="getText"
    />
    <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excelInssud" />
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
            </div>
          </template>
        </el-table-column>
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
import { getInssuredHis, excelInssuredHis } from "@/api/inSecur";

export default {
  name: "UserSecurMangment",
  components: { Selected, Pagination, SearchTips },

  data() {
    return {
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        CustomerQueryType: "", //查询类型
        CustomerQueryValue: "", //查询值
        WaterMeter: -1, //水表类型
        StartTime: "", // 操作时间起
        EndTime: "", // 操作时间止
        InsuredState: -1, //低保户 状态
        AreaId: -1, //区域Id
        InsuredRecheckState: -1, //次年复审状态
        timevalue: [],
        tableId: "0000032"
      },
      checksData: [],
      tableKey: 0,
      tableData: [],
      tableHeight: null,
      total: 0,
      customHeight: "", //自定义高度
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {} //搜索存储对象
    };
  },

  mounted() {
    this.tableHeight =
      document.getElementsByClassName("el-tabs")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      98;
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
        this.listQuery.StartTime = "";
        this.listQuery.StartTime = "";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.seachAccountOrder();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    //查询低保户
    seachAccountOrder(num) {
      if (this.listQuery.timevalue.length > 0) {
        this.listQuery.StartTime =
          this.listQuery.StartTime.split(" ")[0] + " 00:00:00";
        this.listQuery.EndTime =
          this.listQuery.EndTime.split(" ")[0] + " 23:58:59";
      }
      if (num != 0) {
        this.orderData = Object.assign({}, this.listQuery);
      }
      getInssuredHis(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
      });
    },
    //导出
    excelInssud() {
      excelInssuredHis(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.seachAccountOrder();
    },
    detaile(id) {
      this.$emit("getDetaile", id);
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-content {
  .icongStyle {
    .icon {
      font-size: 16px;
      color: #777c82;
      padding-left: 10px;
      cursor: pointer;
    }
    .iconbiaodan1 {
      color: #b59200;
    }
    .iconlianhe1 {
      color: #00b2a1;
    }
  }
}
</style>