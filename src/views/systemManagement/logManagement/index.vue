
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
            <el-table-column prop="Content" width="800px" align="center" label="操作内容">
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
        page:1,
        limit:20,
        sA_WaterFactory_Id: "-1", //水厂
        sYS_Model_Name: "-1", //模块名称
        content: "", //内容
        user_Id: -1, //操作员
        sort:"",
        filed:"",
        starDateTime:"",
        endDateTime:"",
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
    replaceColor(str){
      let str1=str
      let textArr=[{name:"添加",class:"logtianjia"},{name:"编辑",class:"red"},{name:"删除",class:"logshanchu"},{name:"分配",class:"logFenPei"},
      {name:"注销",class:"red"},{name:"重置",class:"red"},{name:"移除",class:"red"},{name:"清空",class:"red"},{name:"生成", class:"red"},
      {name:"开启",class:"red"},{name:"关闭",class:"red"},{name:"撤销",class:"red"},{name:"减免",class:"red"},{name:"冲红",class:"red"}
      ,{name:"调整",class:"red"},{name:"升级",class:"red"},{name:"以旧换新",class:"red"},{name:"用户互换",class:"red"},
      {name:"开户",class:"red"},{name:"制卡",class:"red"},{name:"补卡",class:"red"},{name:"低保户申请",class:"red"},
      {name:"过户",class:"red"} , {name:"销户",class:"red"},{name:"低保户复审",class:"red"},{name:"变更",class:"red"},{name:"审核",class:"red"},]
      // let textArr=["添加","编辑","删除","分配","注销","重置","移除","清空","生成","开启","关闭","撤销","减免",
      // "冲红","调整","升级","以旧换新","用户互换","开户","制卡","补卡","低保户申请","过户","销户","低保户复审","变更","审核"]
      textArr.forEach(val=>{
        if(str.indexOf(val.name)!=-1){
        let rText="<span class='"+val.class+"'>"+val.name+"</span>"
         str1=str.replace(val.name,rText)
        }
      })
      return str1
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
/deep/.red{
  color:#f00!important
}
.blue{
  color:#00f
}
.green{
  color:#0f0
}
/deep/.logFenPei{
  color: #B59200
}
/deep/.logtianjia{
  color: #00B2A1
}
/deep/.logshanchu{
  color: #FF3D3D
}
</style>
