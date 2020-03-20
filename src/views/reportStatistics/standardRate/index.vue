<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <!--列表组建 s-->
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" style="margin-top: 50px;"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(param.page - 1) *param.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="MeterReadPlanName"
          label="抄表计划"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="WaterFactoryName"
          label="水厂"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          label="抄表员"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.OpName" :key="index" class="multiColumn">
              {{item}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="MeterReadStartTime"
          label="开始日期"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="MeterReadEndTime"
          label="截止日期"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          label="应抄数"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.yingchaoshu" :key="index" class="multiColumn">
              {{item}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="zongyingchaoshu"
          label="总应抄数"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          label="已抄数"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.yichaoshu" :key="index" class="multiColumn">
              {{item}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="zongyichaoshu"
          label="总已抄数"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          label="未抄数"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.weichaoshu" :key="index" class="multiColumn">
              {{item}}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="zongweichaoshu"
          label="总未抄数"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="FinishPercent"
          label="完成率"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.wanchenglv" :key="index" class="multiColumn">
              {{item}}%
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="总完成率"
          align="center"
          min-width="200px">
          <template slot-scope="scope">
            {{scope.row.zongwanchenglv}}%
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { MeterReadPercentStatistics, MeterReadPercentStatistics_ToExcel } from "@/api/reportInfo"
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import SelectHead from './components/SelectHead'//查询条件组建
  import { promptInfoFun } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'standardRate',
    components: { SelectHead, SearchTips },
    data() {
      return {
        tableHeight: null,//表格高度
        param: {
          page:1,
          limit:10
        },
        tableData: [],//表格数据
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
      }
    },
    methods: {
      /*当前列表无数据，不可导出*/
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          promptInfoFun(this,1,'当前列表无数据，不可导出')
          return false
        }
        MeterReadPercentStatistics_ToExcel(this.param).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      searchFun() {//查询事件
        MeterReadPercentStatistics(this.param).then(res => {
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
          promptInfoFun(this,1,'抄表计划日期不能为空！')
          return
        }if(val=='WaterFactoryId'){
          promptInfoFun(this,1,'水厂不能为空！')
          return
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
      }
    },
    mounted() {
      this.$refs.searchTips.showTabBtn = false//隐藏自定义按钮
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 40

    }
  }
</script>
