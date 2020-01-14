<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <!--列表组建 s-->
      <p class="legacyArrears">{{tableInfo.PriceSurplus}}</p>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" style="margin-top: 68px;"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(grp.page - 1) *grp.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="SA_WaterFactory_Name"
          label="水厂"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="YearMonth"
          label="日期"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="TotalPrice"
          label="本期应收"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="Aprice"
          label="实收总额"
          align="center"
          min-width="200px">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { GarbageReportDt, Execl_GarbageReportDt } from "@/api/reportInfo"
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import SelectHead from './components/SelectHead'//查询条件组建
  import { promptInfoFun } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'garbageFeeStatistics',
    components: { SelectHead, SearchTips },
    data() {
      return {
        tableHeight: null,//表格高度
        grp: {page:1,limit:10},
        tableData: [],//表格数据
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
        tableInfo:''
      }
    },
    methods: {
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          promptInfoFun(this,1,res.message)
          return false
        }
        Execl_GarbageReportDt(this.grp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      searchFun() {//查询事件
        let grp = Object.assign({},this.grp)
        grp.WaterMeter = parseInt(this.grp.WaterMeter)
        grp.UserType = parseInt(this.grp.UserType)
        GarbageReportDt(this.grp).then(res => {
          if (res.code == 0 ) {
            this.tableData = res.data.Table1;
            this.tableInfo = res.data.Table2[0];
            this.tipsData = pushItem(this.tipsDataCopy)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      sortChanges({prop, order }){//排序
        this.grp.filed = prop
        this.grp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.grp.page = 1
          this.searchFun()
        }
      },
      /**
       *val 对应绑定的参数
       *this this对象
       * this.tipsDataCopy   存储面包屑数据的数组
       * param  对应搜索条件的对象名
       */
      delTips(val) {
        if(val=='createStartTimes'){
          promptInfoFun(this,1,'日期不能为空!')
          return false
        }
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "grp"); //返回删除后的数据传给组件
        this.$refs.childSelect.searchFun()
      },
      /**
       *val 搜索数据值
       *model 对应绑定的属性
       * arr   下拉框循环的数组（输入框传“”）
       * name  对应的搜索lable
       */
      //处理搜索条件,面包屑
      getText(val, model, arr, name) {
        let obj = getText(val, model, arr, this.tipsDataCopy, this, name); //返回的组件需要的对象
        this.tipsDataCopy.push(obj);
      }
    },
    mounted() {
      this.$refs.searchTips.showTabBtn = false//隐藏自定义按钮
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 40

    }
  }
</script>
