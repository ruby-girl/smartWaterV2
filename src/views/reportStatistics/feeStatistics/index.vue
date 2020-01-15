<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <!--列表组建 s-->
      <p class="legacyArrears">{{waterFactoryInfo}}</p>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" style="margin-top: 68px;"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(param.page - 1) *param.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="WaterFactoryName"
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
          prop="WaterMeterTypeName"
          label="水表类型"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="UserTypeName"
          label="用户类型"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="CurrentWaterYield"
          label="本期水量"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column label="本期">
          <el-table-column
            prop="WaterPrice"
            label="清水费"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="PollutionDischarge"
            label="污水费"
            align="center"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="FreePrice"
          label="减免费用"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="PricePaid"
          label="账户本期扣减"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column label="本期应收">
          <el-table-column
            prop="CPollutionDischarge"
            label="清水费"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="CPollutionDischarge"
            label="污水费"
            align="center"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期实收">
          <el-table-column
            prop="APrice"
            align="center"
            label="清水费"
            width="120">
          </el-table-column>
          <el-table-column
            prop="APollutionDischarge"
            label="污水费"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="RechargeMoney"
            label="预存"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="LateFee"
            label="违约金"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="GarbageSS"
            label="垃圾费"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="OtherFeeSS"
            label="其他费用"
            align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="TotalPriceSS"
            label="总额"
            align="center"
            width="120">
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="NewArrears"
          label="本期新增欠款"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="PastArrears"
          label="往期遗留欠款"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="RecoverArrears"
          label="追回往期欠款"
          align="center"
          min-width="200px">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import SelectHead from './components/SelectHead'//查询条件组建
  import { promptInfoFun } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
  import { FeeStatisticsReportGetList, FeeStatisticsReportGetListToExcel, GetPastArrears } from "@/api/reportInfo";


  export default {
    name: 'feeStatistics',
    components: { SelectHead, SearchTips },
    data() {
      return {
        waterFactoryInfo:'',
        tableHeight: null,//表格高度
        param: {page:1,limit:10},
        tableData: [],//表格数据
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
      }
    },
    methods: {
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          promptInfoFun(this,1,"当前列表无数据，不可导出")
          return false
        }
        FeeStatisticsReportGetListToExcel(this.param).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      searchFun() {//查询事件
        FeeStatisticsReportGetList(this.param).then(res => {
          if (res.code == 0 ) {
            this.tableData = res.data;
            this.tipsData = pushItem(this.tipsDataCopy)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      sortChanges({prop, order }){//排序
        this.param.filed = prop
        this.param.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.param.page = 1
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
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "param"); //返回删除后的数据传给组件
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
      },
      getNoBack(id){//获取水厂遗留欠款
        GetPastArrears({'SA_WaterFactory_Id':id}).then(res => {
           this.waterFactoryInfo = res.data
        })
      }
    },
    mounted() {
      this.$refs.searchTips.showTabBtn = false//隐藏自定义按钮
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 40
    }
  }
</script>
