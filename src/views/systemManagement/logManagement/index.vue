
<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" ref="seachChild" />
      </div>
      <div class="contanier">
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" />
        <div class="main-padding-20-y" id="table">
          <el-table
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
            <el-table-column prop="SA_WaterFactory_Name" align="center" width="200px" label="水厂"></el-table-column>
            <el-table-column prop="EditTime" width="200px" align="center" label="操作时间"></el-table-column>
            <el-table-column prop="SYS_Model_Name" width="200px" align="center" label="模块"></el-table-column>
            <el-table-column prop="EditUser" width="200px" align="center" label="操作人"></el-table-column>
            <el-table-column prop="IP" width="200px" align="center" label="操作人IP"></el-table-column>
            <el-table-column prop="Content" width="800px" label="操作内容">
              <template slot-scope="scope">
                <span v-html="replaceColor(scope.row.Content)"></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./components/SelectHead";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { getLogList } from "@/api/log";
export default {
  name: "logManagement",
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        page: 1,
        limit: 20,
        sA_WaterFactory_Id: "-1", //水厂
        sYS_Model_Name: "-1", //模块名称
        content: "", //内容
        user_Id: -1, //操作员
        sort: "",
        filed: "",
        starDateTime: "",
        endDateTime: ""
      },
      tableHeight: null,
      tableData: [], //表格数据
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024
    };
  },
  methods: {
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.YearMonth = "";
        this.$refs.seachChild.dateArr = [];
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },

    //查询
    searchTableList() {
      getLogList(this.selectHead).then(res => {
        this.tableData = res.data;
        this.tipsData = pushItem(this.tipsDataCopy);
      });
    },
    replaceColor(str) {
      let str1 = str;
      let textArr = [
        { name: "添加", class: "logTKJ" },
        { name: "编辑", class: "logBSTBS" },
        { name: "删除", class: "logSX" },
        { name: "分配", class: "logFGY" },
        { name: "注销", class: "logZX" },
        { name: "重置", class: "logCSCB" },
        { name: "移除", class: "logFGY" },
        { name: "清空", class: "logClearAll" },
        { name: "生成", class: "logBSTBS" },
        { name: "开启", class: "logTKJ" },
        { name: "开户", class: "logTKJ" },
        { name: "关闭", class: "logFGY" },
        { name: "撤销", class: "logCY" },
        { name: "减免", class: "logTKJ" },
        { name: "冲红", class: "logSXC" },
        { name: "调整", class: "logBSTBS" },
        { name: "升级", class: "logCSCB" },
        { name: "以旧换新", class: "logCSCB" },
        { name: "用户互换", class: "logCY" },
        { name: "制卡", class: "logTran" },
        { name: "补卡", class: "logCSCB" },
        { name: "低保户申请", class: "logInsur" },
        { name: "过户", class: "logTran" },
        { name: "销户", class: "logSXC" },
        { name: "低保户复审", class: "logInsur" },
        { name: "变更", class: "logBSTBS" },
        { name: "审核", class: "logBSTBS" },
        { name: "修改", class: "logEdit" }
      ];
      textArr.forEach(val => {
        if (str.indexOf(val.name) != -1) {
          let rText = "<span class='" + val.class + "'>" + val.name + "</span>";
          str1 = str.replace(val.name, rText);
        }
      });
      return str1;
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -
        4;

      this.$refs.searchTips.showTabBtn = false;
      this.$refs.searchTips.showExcel = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.section-full-container {
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
//添加 开启 开户 减免
/deep/.logTKJ {
  color: #00b2a1;
}
//编辑 生成 调整 变更 审核
/deep/.logBSTBS {
  color: #b9b300;
}
//删除 销户 冲红
/deep/.logSXC {
  color: #ff3d3d;
}
//撤销 用户互换
/deep/.logCY {
  color: #019b8b;
}
//分配 关闭 移除
/deep/.logFGY {
  color: #009253;
}
//修改：#B59200
/deep/.logEdit {
  color: #B59200;
}
//注销
/deep/.logZX {
  color: #ff6f00;
}
//重置 升级 以旧换新 补卡
/deep/.logCSCB {
  color: #46be56;
}
//清空
/deep/.logClearAll {
  color: #b59200;
}
//制卡 过户
/deep/.logTran {
  color: #8ad120;
}
//低保户申请 低保户复审
/deep/.logInsur {
  color: #fa9806;
}
</style>
