<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" />
      </div>
      <div class="contanier">
        <p class="notice">
          <i class="icon iconfont" style="margin-right:5px;">&#xe69c;</i>
          提示：当前短信剩余{{surpNum}}条，已用{{sendNum}}条
        </p>
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
            :cell-style="{'padding':'5px 0'}"
          >
            <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
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
              />
            </template>
            <el-table-column label="操作" width="80px" align="center" fixed="right">
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
      <detaile-template :detaile-show.sync="detaileDialogFormVisible" />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; //查询条件组件
import DetaileTemplate from "./components/DetaileTemplate"; //详情
import Pagination from "@/components/Pagination/index"; //分页
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import {
  getSelectList,
  getAllNum,
  getSendNum,
  delTemplate,
  getSendModel
} from "@/api/shotMsg";
export default {
  name: "smsStaues",
  components: {
    SelectHead,
    Pagination,
    SearchTips,
    DetaileTemplate
  },
  data() {
    return {
      total: 0,
      // 查询条件
      selectHead: {
        page: 1,
        limit: 10,
        SendState: "", //短信状态
        TemplateId: "", //模板名称
        TimerStartTime: "", //定时发送时间
        TimerEndTime: "",
        WaterMeterType: -1, //水表类型
        AreaId: -1, //区域
        CustomerQueryType: "",
        CustomerQueryValue: "",
        sort: "", //升序
        filed: "", //排序字段
        warterMeterPlanDate: [],
        tableId: "0000067"
      },
      checksData: [],
      tableData: [],
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      addDialogFormVisible: false,
      detaileDialogFormVisible: false,
      detaileModel: {},
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024,
      surpNum: 0, //剩余
      sendNum: 0 //已发
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
      this.getNum();
    });
  },
  methods: {
    //删除面包屑
    delTips(val) {
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");

      this.searchTableList();
      //返回的查询条件的属性
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },

    searchTableList(num) {
      //查询列表
      const that = this;
      if (num != 0) {
        this.orderData = Object.assign({}, this.selectHead);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.selectHead.page;
      }
      getSelectList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
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
    //详情
    Detail(id) {
      getSendModel({ sendId: id }).then(res => {
        this.detaileModel = res.data;
        this.detaileDialogFormVisible = true;
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
        .catch(() => {});
    },
    getNum() {
      // surpNum: 0, //剩余
      // sendNum: 0 //已发
      //已发
      getSendNum().then(res => {
        if (res.code == 0) {
          this.sendNum = res.data;
        }
      });
      //剩余
      getAllNum().then(res => {
        if (res.code == 0) {
          this.sendNum = res.data;
        }
      });
    },
    //新增抄表计划
    addPlan() {
      this.addDialogFormVisible = true;
    }
  }
};
</script>
<style lang="scss"  scoped>
.notice {
  margin: 0;
  margin-bottom: 11px;
  padding: 0;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 19px;
  color: rgba(255, 61, 61, 1);
}
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
.plan-table {
  position: relative;
}
.showPlan {
  position: absolute;
  right: 0px;
  overflow: hidden;
}
.borderClass {
  border-color: #6da783;
  color: #6da783;
  font-size: 14px;
  .icon {
    font-size: 12px;
    padding-right: 4px;
  }
}
.borderClass:hover {
  color: #8ecca5;
  border: solid 1px #8ecca5;
  background: #f7fcf9;
}
.display-flex {
  margin: 7px 0;
}
</style>