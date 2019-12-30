<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" />
      </div>
      <div class="contanier">
        <div class="cl-operation1 clearfix" style="margin-bottom:7px;">
          <el-button size="mini" class="fl borderClass" round @click="send">
            <i class="icon iconfont">&#xe6b0;</i>发送
          </el-button>
          <el-button size="mini" class="fl borderClass" round @click="sendAll">
            <i class="icon iconfont">&#xe6b2;</i>发送全部用户
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
            :cell-style="{'padding':'5px 0'}"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="55" fixed="left"></el-table-column>
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
      <change-template ref="change" />
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead"; //查询条件组件ChangeTemplate
import ChangeTemplate from "./components/ChangeTemplate"; //查询条件组件
import Pagination from "@/components/Pagination/index"; //分页
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { getSMSList, sendShorMsg, sendShorMsgAll } from "@/api/shotMsg";

export default {
  name: "sendManua",
  components: {
    SelectHead,
    Pagination,
    SearchTips,
    ChangeTemplate
  },
  data() {
    return {
      total: 0,
      // 查询条件
      selectHead: {
        page: 1,
        limit: 10,
        CustomerQueryType: "",
        CustomerQueryValue: "",
        WaterTypeId: "", //水表类型
        AreaId: "", //q区域
        sort: "", //升序
        filed: "", //排序字段
        tableId: "0000016"
      },

      checksData: [],
      tableData: [],
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: {},
      searchWidth: 1024,
      ids: []
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
      // 自适应表格高度
      const that = this;
      that.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -47 
      this.$refs.searchTips.$refs.myChild.GetTable(this.selectHead.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      this.searchWidth = this.$refs.formHeight.clientWidth;
      this.$refs.searchTips.showExcel=false
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
      }else {
        this.orderData.page =this.selectHead.page
      }
      getSMSList(this.orderData).then(res => {
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
    selectionChange(selection) {
      this.ids = [];
      if (selection.length) {
        selection.forEach(element => {
          this.ids.push(element.Id);
        });
      }
    },
    send() {
      if (this.ids.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择数据后在操作"
        });
        return false;
      }
      this.$refs.change.AdialogFormVisible = true;
      this.$refs.change.allSend = true;
    },
    sendAll() {
      if (Object.keys(this.orderData).length == 0) {
        this.$message({
          message: "请查询之后再操作",
          type: "warning"
        });
        return false;
      }
      this.$refs.change.AdialogFormVisible = true;
      this.$refs.change.allSend = false;
    },
    sendList(id) {
      //templateId

      sendShorMsg({ cusIds: this.ids, templateId: id }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message ? res.message : "操作成功"
          });
          this.$refs.change.AdialogFormVisible = false;
          this.searchTableList();
        }
      });
    },
    sendAllList(id) {
      this.$refs.change.allSend = false;
      sendShorMsgAll({ obj: this.orderData, templateId: id }).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message ? res.message : "操作成功"
          });
          this.$refs.change.AdialogFormVisible = false;
          this.searchTableList();
        }
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
</style>