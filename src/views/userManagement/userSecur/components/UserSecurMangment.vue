<template>
  <div class="secur-content">
    <div ref="formHeight">
      <selected
        :selectHead="listQuery"
        @handleFilter="seachAccountOrder"
        @getText="getText"
        :searchWidth="searchWidth"
      />
    </div>
    <div class="contanier">
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
          <el-table-column fixed="left" label="#" width="60" align="center">
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
              align="center"
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
                  <i
                    class="icon iconfont iconbiaodan1"
                    @click="detaile(scope.row.SA_InsuredMessage_Id)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="历史详情"
                  placement="bottom"
                >
                  <i class="icon iconfont" @click="goHisWeb(scope.row.CustomerNo)">&#xe670;</i>
                </el-tooltip>
                <el-tooltip
                  v-if="scope.row.InsuredStateName=='生效中'&&scope.row.RecheckStateName=='待复审'"
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="复审"
                  placement="bottom"
                  v-permission="['230']"
                >
                  <!-- <i  v-if="scope.row.RecheckStateName!='待复审'" class="icon iconfont iconlianhe1" style="color:#ccc;"></i> -->
                  <i class="icon iconfont iconlianhe1" @click="auitSecur(scope.row)"></i>
                </el-tooltip>
                <el-tooltip
                  v-else
                  class="item"
                  popper-class="tooltip"
                  :visible-arrow="false"
                  content="该用户已过期或已复审或未到审核日期"
                  placement="bottom"
                >
                  <!-- <i  v-if="scope.row.RecheckStateName!='待复审'" class="icon iconfont iconlianhe1" style="color:#ccc;"></i> -->
                  <i class="icon iconfont iconlianhe1" style="color:#d5d5d5" @click></i>
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
          @pagination="seachAccountOrder('0')"
        />
      </div>
    </div>
    <exam-secur ref="aduit" />
  </div>
</template>
<script>
import Selected from "./Selected";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { legalTime } from "@/utils/index"; //时间格式化
import SearchTips from "@/components/SearchTips/index";
import Pagination from "@/components/Pagination";
import ExamSecur from "./ExamSecur";
import { getInssured, excelInssured, getInssureDetaile } from "@/api/inSecur";
import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
  directives: { permission },
  name: "UserSecurMangment",
  components: { Selected, Pagination, SearchTips, ExamSecur },

  data() {
    return {
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        CustomerQueryType: "1", //查询类型
        CustomerQueryValue: "", //查询值
        WaterMeter: -1, //水表类型
        StartTime: "", // 操作时间起
        EndTime: "", // 操作时间止
        InsuredState: -1, //低保户 状态
        AreaId: "-1", //区域Id
        InsuredRecheckState: -1, //次年复审状态
        timevalue: [],
        tableId: "0000031"
      },
      checksData: [],
      tableKey: 0,
      tableData: [],
      tableHeight: null,
      total: 0,
      customHeight: "", //自定义高度
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {}, //搜索存储对象
      searchWidth: 1024
    };
  },
  mounted() {
    this.tableHeight =
      document.getElementsByClassName("el-tabs")[0].offsetHeight -
      document.getElementById("table").offsetTop -
      98;
    this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    this.searchWidth = this.$refs.formHeight.clientWidth;
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
      if(this.listQuery.timevalue){
        if (this.listQuery.timevalue.length > 0) {
          this.listQuery.StartTime =
            this.listQuery.StartTime.split(" ")[0] + " 00:00:00";
          this.listQuery.EndTime =
            this.listQuery.EndTime.split(" ")[0] + " 23:59:59";
        }

      }
      if (num != 0) {
        this.listQuery.page = 1;
        this.orderData = Object.assign({}, this.listQuery);
      } else {
        this.orderData.page = this.listQuery.page;
        this.orderData.limit = this.listQuery.limit;
      }
      getInssured(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
      });
    },
    //导出
    excelInssud() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      excelInssured(this.orderData).then(res => {
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
    //详情
    detaile(id) {
      this.$emit("getDetaile", id);
    },
    //历史详情
    goHisWeb(CustomerNo) {
      this.$emit("goHisWeb", CustomerNo);
    },
    auitSecur(data) {
      this.$refs.aduit.InsuredRecheckParam.InsuredMessageId =
        data.SA_InsuredMessage_Id;
      this.$refs.aduit.nextTimeArr = this.formatTime(data.EndDate);
      this.$refs.aduit.InsuredRecheckParam.FS_StartDate =
        this.$refs.aduit.nextTimeArr[0] + " 00:00:00";
      this.$refs.aduit.InsuredRecheckParam.FS_EndDate =
        this.$refs.aduit.nextTimeArr[1] + " 23:59:59";
      this.$refs.aduit.viewExam = true;
    },
    formatTime(data) {
      let arr = [];
      let time = new Date(data);
      time = new Date(time.setDate(time.getDate() + 1));
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }

      let nextSatrt = year + "-" + month + "-" + day;
      //一年
      let d1 = new Date(nextSatrt);
      let nextEnd = new Date(d1);
      nextEnd.setFullYear(nextEnd.getFullYear() + 1);
      nextEnd.setDate(nextEnd.getDate() - 1);
      let nextyear = nextEnd.getFullYear();
      let nextmonth = nextEnd.getMonth() + 1;
      let nextday = nextEnd.getDate();
      let nextTime = nextyear + "-" + nextmonth + "-" + nextday;
      arr.push(nextSatrt);
      arr.push(nextTime);
      return arr;
    }
  }
};
</script>
<style lang="scss" scoped>
.secur-content {
  .contanier {
    padding: 14px;
    padding-top: 0;
  }
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