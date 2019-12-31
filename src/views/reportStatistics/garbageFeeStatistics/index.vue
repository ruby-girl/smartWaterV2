<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <!--列表组建 s-->
      <p class="legacyArrears">截止今日XX水厂当前遗留垃圾费欠款为：XXXXX</p>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" style="margin-top: 50px;"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(sbap.page - 1) *sbap.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="水厂"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="日期"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="水表类型"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="用户类型"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="本期应收（垃圾费）"
          align="center"
          min-width="200px">
        </el-table-column>
        <el-table-column
          prop="date"
          label="实收总额（已缴费费用金额）"
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
  import { BlockAreaGetList, BlockAreaAdd, BlockAreaUpDate, BlockAreaDelete, BlockAreaExecl, BlockAreaGetObjById } from "@/api/organize"
  import { promptInfoFun } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'garbageFeeStatistics',
    components: { SelectHead, SearchTips },
    data() {
      return {
        tableHeight: null,//表格高度
        sbap: {page:1,limit:10},
        tableData: [{date:111,name:['小民族','刷卡啊额','安慰让我额']}],//表格数据
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
      }
    },
    methods: {
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          promptInfoFun(this,1,res.message)
          return false
        }
        BlockAreaExecl(this.sbap).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      searchFun() {//查询事件
        BlockAreaGetList(this.sbap).then(res => {
          if (res.code == 0 ) {
            this.tableData = res.data;
            this.tipsData = pushItem(this.tipsDataCopy)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      sortChanges({prop, order }){//排序
        this.sbap.filed = prop
        this.sbap.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.sbap.page = 1
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
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "sbap"); //返回删除后的数据传给组件
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
