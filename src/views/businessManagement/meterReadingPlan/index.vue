<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head
          :companyOptions="companyParentOptions"
          :searchWidth="searchWidth"
          ref="child1"
          @getText="getText"
        />
      </div>
      <div class="contanier">
        <div
          class="display-flex justify-content-flex-justify"
          :class="{'plan-table':isShowAdPlanClass }"
        >
          <el-button
            v-show="isShowAdPlan"
            size="mini"
            class="cl-search cl-reset sysClass"
            round
            type="primary"
            @click="addPlan"
            style="margin:7px 0;"
            v-permission="['138']"
          >
            <i class="icon iconfont">&#xe689;</i>添加
          </el-button>
        </div>

        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportList" />
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
            :cell-style="cellStyle"
          >
            <el-table-column type="index" fixed="left" label="#" width="60" align="center">
              <template slot-scope="scope">
                <span>{{(selectHead.page - 1) * selectHead.limit+ scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <template v-for="(item ,index) in tableHeadData">
              <el-table-column
                v-if="item.IsFreeze"
                :key="index"
                min-width="230px"
                :sortable="item.IsSortBol?'custom':null"
                :prop="item.ColProp"
                align="center"
                :label="item.ColDesc"
                :fixed="item.Freeze"
              />
              <el-table-column
                v-else
                :key="index"
                min-width="230px"
                :sortable="item.IsSortBol?'custom':null"
                :prop="item.ColProp"
                align="center"
                :label="item.ColDesc"
              />
            </template>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <span style="display:inline-block;width:30px;">
                  <el-tooltip
                    v-show="scope.row.IsCanGenerateOrder==true"
                    class="item"
                    popper-class="tooltip"
                    effect="light"
                    :visible-arrow="false"
                    content="生成费用"
                    placement="bottom"
                    v-permission="['139']"
                  >
                    <i
                      class="iconStyle icon iconfont operation1"
                      @click="generateOrder(scope.row.Id)"
                    >&#xe69d;</i>
                  </el-tooltip>
                  <el-tooltip
                    v-show="scope.row.IsCanGenerateOrder==false"
                    class="item"
                    popper-class="tooltip"
                    :visible-arrow="false"
                    content="已生成过费用"
                    placement="bottom"
                  >
                    <i class="iconStyle icon iconfont operation1" style="color:#d5d5d5">&#xe69d;</i>
                  </el-tooltip>
                </span>
                <el-tooltip
                  v-if="scope.row.IsAllowDataSupplementaryInputFormat=='是'"
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="开启/关闭数据补录"
                  placement="bottom"
                  v-permission="['140']"
                >
                  <i
                    class="iconStyle icon iconfont operation2"
                    @click="changeInput(scope.row.Id,false)"
                  >&#xe676;</i>
                </el-tooltip>
                <el-tooltip
                  v-if="scope.row.IsAllowDataSupplementaryInputFormat=='否'"
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="开启/关闭数据补录"
                  placement="bottom"
                  v-permission="['140']"
                >
                  <i
                    class="iconStyle icon iconfont operation2-1"
                    @click="changeInput(scope.row.Id,true)"
                  >&#xe675;</i>
                </el-tooltip>
                <el-tooltip
                  effect="light"
                  content="详情"
                  :visible-arrow="false"
                  placement="bottom"
                  v-permission="['141']"
                >
                  <i
                    class="iconStyle icon iconfont operation3 iconbiaodan1"
                    @click="meterReadingPlanDetail(scope.row)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="删除"
                  placement="bottom"
                  v-permission="['132']"
                >
                  <i
                    class="icon iconfont iconStyle operation4"
                    @click="delMeterReadingPlan(scope.row.Id)"
                  >&#xe6a0;</i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="selectHead.page"
            :limit.sync="selectHead.limit"
            @pagination="searchTableList('0')"
          />
        </div>
      </div>
      <Add-ReadingPlan
        :add-show.sync="addDialogFormVisible"
        :companyOptions="companyParentOptions"
      />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; //查询条件组件
import customTable from "@/components/CustomTable/index"; //自定义表格
import Pagination from "@/components/Pagination/index"; //分页
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem, closeDelTip } from "@/utils/projectLogic"; //搜索条件面包屑
import AddReadingPlan from "./components/AddReadingPlan";
import permission from "@/directive/permission/index.js"; // 权限判断指令
import {
  searchPlanList,
  exportPlanList,
  changeListState,
  planConpanySelect,
  delPlanList,
  GenerateOrder,
  WhetherDisplay
} from "@/api/plan"; //http 请求
export default {
  directives: { permission },
  name: "MeterReadingPlan",
  components: {
    SelectHead,
    customTable,
    Pagination,
    AddReadingPlan,
    SearchTips
  },
  data() {
    return {
      total: 0,
      // 查询条件
      selectHead: {
        page: 1,
        limit: 20,
        SA_WaterFactory_Id: "-1", //水厂Id
        createStartTime: "", //计划开始日期
        createEndTime: "", //计划结束日期
        enumPlanState: "-1", //抄表计划状态
        sort: "", //升序
        filed: "", //排序字段
        warterMeterPlanDate: [],
        tableId: "0000008"
      },
      checksData: [],
      tableData: [],
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      customHeight: "", //自定义高度
      addDialogFormVisible: false,
      companyParentOptions: [],
      isShowAdPlan: false,
      isShowAdPlanClass: !this.isShowAdPlan,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024
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
  watch: {
    customHeight() {
      //获取自定义模块高度
      let that = this;
      that.$nextTick(() => {
        that.tableHeight =
          document.getElementsByClassName("section-container")[0].offsetHeight -
          document.getElementById("table").offsetTop -
          58;
      });
    }
  },
  created() {
    let that = this;
    this.getDefaulDate();
    WhetherDisplay({ configkey: "IsAutoCreateReadPlan" }).then(res => {
      //判断是否显示新增抄表计划
      if (res.data == "0") {
        that.isShowAdPlan = true;
      } else {
        that.isShowAdPlan = false;
      }
    });
    that.companyParentOptions = this.$store.state.user.waterWorks;
  },
  mounted() {
    this.$nextTick(function() {
      // 自适应表格高度
      const that = this;
      that.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -
        89;
      this.$refs.searchTips.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.searchWidth = this.$refs.formHeight.clientWidth;
    });
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.PlanStateName == "已完成" && column.property == "PlanStateName") {
        return "color:#00B2A1;";
      } else if (
        row.PlanStateName == "未完成" &&
        column.property == "PlanStateName"
      ) {
        return "color:#FF3D3D;";
      }
      if( row.IsAllowDataSupplementaryInputFormat == "否" &&
        column.property == "IsAllowDataSupplementaryInputFormat"){
          return "color:#00B2A1;";
        }
    },
    //删除面包屑
    delTips(val) {
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      if (val == "warterMeterPlanDate") {
        this.getDefaulDate();
      }
      this.searchTableList();
      //返回的查询条件的属性
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    setCustomData() {
      //表格自定义方法
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      this.customHeight = this.$refs.myChild.isCustom;
    },
    generateOrder(id) {
      //数据绑定
      let that=this
      GenerateOrder({ SA_MeterReadPlan_Id: id }).then(res => {
        if (res.code == 0) {
          that.$message({
            message: res.message ? res.message : "操作成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.message ? res.message : "操作失败",
            type: "warning"
          });
        }
        this.searchTableList();
      });
    },
    meterReadingPlanDetail(row) {
      // window.localtion.href=('businessManagement/meterQuery?id='+id);
      //详情 跳转到抄表设置
      let that=this
      this.$router.push({
        //核心语句
        path: "/businessManagement/meterQuery", //跳转的路径
        query: {
          //路由传参时push和query搭配使用 ，作用时传递参数
         planInfo:row
        }
      });
    },
    delMeterReadingPlan(id) {
      //生成费用
      let that = this;
      this.$confirm("是否删除当前信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox deleteBox",
        showClose: false
      })
        .then(() => {
          closeDelTip();
          delPlanList({ SA_MeterReadPlan_Id: id }).then(res => {
            if (res.code == 0) {
              that.$message({
                message: res.message ? res.message : "删除成功",
                type: "success"
              });
              that.searchTableList();
            } else {
              that.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {
          closeDelTip();
        });
    },
    sortChanges({ column, prop, order }) {
      //排序
      this.selectHead.page = 1;
      this.selectHead.filed = prop;
      this.selectHead.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.searchTableList();
    },
    searchTableList(num) {
      //查询列表
      const that = this;
      if (this.companyParentOptions.length == 1) {
        this.selectHead.SA_WaterFactory_Id = this.companyParentOptions[0].Id;
      }
      if (
        !this.selectHead.warterMeterPlanDate ||
        this.selectHead.warterMeterPlanDate.length < 1
      ) {
        that.$message({
          message: "计划抄表日期不能为空，请选择!",
          type: "warning"
        });
        return false;
      }

      this.$refs.child1.getTime();
      if (num != 0) {
        this.selectHead.page = 1;
        this.orderData = Object.assign({}, this.selectHead);
      } else {
        this.orderData.page = this.selectHead.page;
        this.orderData.limit = this.selectHead.limit;
      }

      searchPlanList(this.orderData).then(res => {
        if (res.code == 0) {
          this.tipsData = pushItem(this.tipsDataCopy);
          that.tableData = res.data;
          that.total = res.count;
        }
      });
    },
    exportList() {
      //导出
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      exportPlanList(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    getDefaulDate() {
      const time = new Date();
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      let lm, ly;
      let nm, ny;

      if (m - 6 < 0) {
        lm = m + 12 - 6;
        ly = y - 1;
      } else {
        lm = m - 6;
        ly = y;
      }
      if (m + 6 > 12) {
        nm = m + 6 - 12;
        ny = y + 1;
      } else {
        nm = m + 6;
        ny = y;
      }
      if (lm < 10) {
        lm = "0" + lm;
      }
      if (nm < 10) {
        nm = "0" + nm;
      }
      if (d < 10) {
        d = "0" + d;
      }

      let lastTime = ly + "-" + lm + "-" + d + " " + "00:00:00";
      let newTime = ny + "-" + nm + "-" + d + " " + "23:59:59";
      this.selectHead.warterMeterPlanDate.push(lastTime);
      this.selectHead.warterMeterPlanDate.push(newTime);
    },
    //新增抄表计划
    addPlan() {
      this.addDialogFormVisible = true;
    },
    changeInput(id, state) {
      //数据绑定or 数据补录
      let that = this;
      let parm = {
        SA_MeterReadPlan_Id: id,
        newDataSupplementaryInput: Boolean(state)
      };
      changeListState(parm).then(res => {
        if (res.code == 0) {
          that.$message({
            message: res.message,
            type: "success"
          });
          that.searchTableList();
        } else {
          that.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style  scoped>
.section-full-container {
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
.iconStyle {
  font-size: 16px;
  cursor: pointer;
}
.operation1 {
  color: #ff3d3d;
  font-size: 16px;
  margin: 10px;
}
.operation2 {
  color: #00b2a1;
  margin: 10px;
}
.operation2-1 {
  color: #acacac;
  margin: 10px;
}
.operation3 {
  color: #b59200;
  margin: 10px;
}
.operation4 {
  color: #ff5656;
  margin: 10px;
}
.plan-table {
  position: relative;
}
.showPlan {
  position: absolute;
  right: 0px;
  overflow: hidden;
}
.sysClass {
  color: #fff;
  background-color: #00b3a1;
  border-color: #00b3a1;
}
.sysClass:hover {
  background: #33c2b4;
  border-color: #33c2b4;
  color: #fff;
}
</style>