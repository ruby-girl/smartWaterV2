<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" />
      </div>
      <div class="contanier">
        <div class="display-flex justify-content-flex-justify">
          <el-button
            size="mini"
            class="cl-search cl-reset sysClass"
            round
            @click="addPlan"
            style="margin:7px 0;"
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
          >
            <el-table-column type="index" fixed="left" label="#" width="60" align="center">
              <template slot-scope="scope">
                <span>{{(selectHead.page - 1) * selectHead.limit+ scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <template v-for="(item ,index) in tableHeadData">
              <el-table-column
                :key="index"
                min-width="230px"
                :sortable="item.IsSortBol?'custom':null"
                :prop="item.ColProp"
                :align="item.Position"
                :label="item.ColDesc"
                :fixed="item.Freeze"
                :show-overflow-tooltip="true"
              />
            </template>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="light"
                  :visible-arrow="false"
                  content="详情"
                  placement="bottom"
                >
                  <i
                    class="iconStyle icon iconfont operation3"
                    @click="Detail(scope.row.Id)"
                  >&#xe653;</i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="light"
                  :visible-arrow="false"
                  content="编辑"
                  placement="bottom"
                >
                  <i class="iconStyle icon iconfont operation5" @click="edit(scope.row.Id)">&#xe69f;</i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  popper-class="tooltip"
                  effect="light"
                  :visible-arrow="false"
                  content="删除"
                  placement="bottom"
                >
                  <i
                    class="icon iconfont iconStyle operation4"
                    @click="delTem(scope.row.Id)"
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
      <Add-template :add-show.sync="addDialogFormVisible" />
      <edit-template :edit-show.sync="editDialogFormVisible" :editModel="editModel" />
      <detaile-template
        :detaile-show.sync="detaileDialogFormVisible"
        :ShortMsgTempParam="detaileModel"
      />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; //查询条件组件
import Pagination from "@/components/Pagination/index"; //分页
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import AddTemplate from "./components/AddTemplate";
import DetaileTemplate from "./components/DetaileTemplate";
import EditTemplate from "./components/EditTemplate";
import { getSettingList, delTemplate, detaileTemplate } from "@/api/shotMsg";
export default {
  name: "sysSetting",
  components: {
    SelectHead,
    Pagination,
    AddTemplate,
    SearchTips,
    DetaileTemplate,
    EditTemplate
  },
  data() {
    return {
      total: 0,
      // 查询条件
      selectHead: {
        page: 1,
        limit: 10,
        isSysTemplate: "", //模板类型
        templateName: "", //模板名称
        sendMethod: "", //发送方式
        sendModality: "", //发送时间
        timerSendStartTime: "", //计划结束日期
        timerSendEndTime: "", //抄表计划状态
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000066"
      },
        warterMeterPlanDate: [],
      checksData: [],
      tableData: [],
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      addDialogFormVisible: false,
      detaileDialogFormVisible: false,
      editDialogFormVisible: false,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024,
      detaileModel: {},
      editModel: {}
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
    this.$nextTick(function() {
      this.$refs.searchTips.showExcel = false;
      // 自适应表格高度
      const that = this;
      that.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -
        47;
      this.$refs.searchTips.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.searchWidth = this.$refs.formHeight.clientWidth;
    });
  },
  methods: {
    //删除面包屑
    delTips(val) {
      if(val=="warterMeterPlanDate"){
        this.selectHead.timerSendStartTime=""
        this.selectHead.timerSendEndTime=""
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");

      this.searchTableList();
      //返回的查询条件的属性
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },

    searchTableList(num) {
      //查询列表timerSendStartTime: "", //计划结束日期
       // timerSendEndTime: "", //抄表计划状态
      if(Boolean(this.selectHead.timerSendStartTime)!=Boolean(this.selectHead.timerSendEndTime)){
           this.$message({
          message: "请选择完整的定时发送时间",
          type: "warning"
        });
        return false;
      }
      const that = this;
      if (num != 0) {
        this.orderData = Object.assign({}, this.selectHead);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.selectHead.page;
      }
      getSettingList(this.orderData).then(res => {
        this.tableData = res.data;
        this.total = res.count;
        this.tipsData = pushItem(this.tipsDataCopy);
      });
    },
    exportList() {
      //导出
      if (Object.keys(this.orderData).length == 0) {
        this.$message({
          message: "请查询之后再操作",
          type: "warning"
        });
        return false;
      }
      exportPlanList(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },

    //新增抄表计划
    addPlan() {
      this.addDialogFormVisible = true;
    },
    //详情
    Detail(id) {
      this.detaileDialogFormVisible = true;
      detaileTemplate({ tempId: id }).then(res => {
        this.detaileModel = res.data;
      });
    },
    //删除
    delTem(id) {
      let that = this;
      this.$confirm("是否删除当前模板信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      })
        .then(() => {
          delTemplate({ tempId: id }).then(res => {
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
        });
    },
    //编辑
    edit(id) {
      this.editDialogFormVisible = true;
      detaileTemplate({ tempId: id }).then(res => {
        this.editModel = res.data;
      });
    }
  }
};
</script>
<style lang="scss"  scoped>
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
  color: #46494c;
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
.operation5 {
  color: #00b2a1;
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