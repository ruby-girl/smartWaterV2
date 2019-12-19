<template>
  <div>
    <div ref="formHeight">
      <select-head
        :select-head="listQuery"
        @handleFilter="getList"
        @getText="getText"
        :water-property="WaterProperty"
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
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            width="80px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center method-font">
                <el-tooltip class="item" effect="dark" content="变更用水性质" placement="bottom">
                  <i class="iconfont main-color iconlianhe pointer" @click="edit(row)"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
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
    <Dialog :water-property="WaterProperty" @getList="getList" :show.sync="show" :temp="temp" />
  </div>
</template>
<script>
import SelectHead from "./SelectHead";
import Dialog from "./Dialog";
import Pagination from "@/components/Pagination";
import { getDictionaryOption } from "@/utils/permission";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { GetCustomerDataList, GetWaterPropertyList } from "@/api/userSetting"; //用户列表、开启的用水性质
import permission from "@/directive/permission/index.js"; // 权限判断指令
export default {
  name: "changeOperation",
  directives: { permission },
  components: {
    SelectHead,
    Dialog,
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
        WaterFactoryId: "-1", //水厂
        UserType: "-1", //用户类型
        UserState: "-1", //用户状态
        AreaId: "-1", //区域
        WaterTypeId: "-1", //水表类型
        WaterPropertyId: "-1", //用水性质
        limit: 20,
        page: 1,
        sort: "",
        filed: "",
        tableId: "0000016"
      },
      show: false,
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: [],
      WaterProperty: [] //开启的用水性质
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
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 190;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      GetWaterPropertyList().then(res => {
        res.data.forEach(item => {
          //SearchTips组件 需要Name Key，这里进行再次赋值
          item.Name = item.UseWaterTypeName;
        });
        this.WaterProperty = res.data;
      });
    });
  },
  methods: {
    delTips(val) {
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
      }
      GetCustomerDataList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    edit(r) {
      this.temp = Object.assign({}, r);
      this.show = true;
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


