<template>
  <div class="cl-container">
    <div style="background: transparent;padding: 0">
      <div style="background: #fff;padding: 16px;">
        <div id="conditionBox">
          <!--查询条件组建 s-->
          <SelectHead ref="childSelect"></SelectHead>
          <!--查询条件组建 e-->
          <!--自定义组建 s-->
          <customTable ref="myChild" />
          <!--自定义组建 e-->
        </div>
        <!--列表组建 s-->
        <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges" highlight-current-row ref="multipleTable" @row-click="getCurInfo">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
            fixed="left"/>
          <template v-for="(item ,index) in tableHead" >
            <el-table-column
              v-if="item.IsFreeze"
              :key="index"
              min-width="200px"
              sortable='custom'
              :prop="item.ColProp"
              :align="item.Position"
              :label="item.ColDesc"
              :fixed= "item.Freeze"/>
            <el-table-column
              v-else
              :key="index"
              min-width="200px"
              sortable='custom'
              :prop="item.ColProp"
              :align="item.Position"
              :label="item.ColDesc"/>
          </template>
          <el-table-column label="操作" width="100px" align="center" fixed="right">
            <template slot-scope="scope">
              <a class="operation2" @click="handleDelete(scope.$index, scope.row)">删除</a>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="param.page"
          :limit.sync="param.limit"
          @pagination="searchFun"/>
        <!--列表组建 e-->
      </div>

      <!--抄表计划组建 s-->
      <MeterPlan v-if="screeWidth>1400" ref="planchild1"></MeterPlan>
      <MeterPlanSmall v-else ref="planchild2"></MeterPlanSmall>
      <!--抄表计划组建 e-->
    </div>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import customTable from '@/components/CustomTable/index'//自定义组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import MeterPlan from './components/MeterPlan'//查询条件组建
  import MeterPlanSmall from './components/MeterPlanSmall'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页
  import { BlockAreaGetList, BlockAreaUpDate, BlockAreaDelete, BlockAreaGetObjById } from "@/api/organize"//http 请求

  import { MeterReadingPageQuery, MeterReadingProcessQuery } from "@/api/meterReading"
  import { parseTime } from "@/utils/index"

  export default {
    name: 'meterSetUp',
    components: { customTable, Pagination, SelectHead, MeterPlan, MeterPlanSmall },
    data() {
      return {
        ID:'',
        waterFactory:[],//水厂数据集合
        tableHeight: null,//表格高度
        total: 0,
        param: {//查询条件对象集
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SA_MeterReadPlan_Id:'',//抄表计划ID
          SA_MeterReader_Id:'',//抄表员ID
          SA_RegisterBookInfo_Id:'',//表册ID
          CustomerQueryType:'1',//用户类型
          CustomerQueryValue:'',//用户类型数值
          MeterReadState:'',//抄表状态
          tableId: '0000014'
        },
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        customHeight: '',//自定义高度
        screeWidth:'',
      }
    },
    computed: {
      tableHead: function() {//获取表头信息
        const arrayHead = []
        const data = this.checksData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    watch: {
      customHeight() {//获取自定义模块高度
        let self = this
        self.$nextTick(() => {
          if(this.screeWidth>1400){
            self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 300
          }else{
            self.tableHeight = 340
            document.getElementsByClassName('cl-container')[0].style.overflow = 'auto'
            document.getElementsByClassName('cl-container')[0].style.height = 'auto'
          }
        })
      }
    },
    methods: {
      setCustomData() {//表格自定义方法
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      handleEdit(scope,row) {//编辑方法
        this.ID = row.Id
/*        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '编辑'*/
        let param = {Id: row.Id}
        BlockAreaGetObjById(param).then(res => {
          if (res.code == 0) {
           /* this.$refs.childDialog.ruleForm.newAreaName = res.data.BlockAreaName
            this.$refs.childDialog.ruleForm.waterFactoryName = res.data.WfList*/
          }
        })
      },
      handleDelete(scope,row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          BlockAreaDelete({Id: row.Id}).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              });
              this.searchFun()
            } else {
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              });
            }
          })
        })
      },
      searchFun() {//查询事件
        let param = Object.assign({}, this.param);//赋值对象转换参数类型
        param.CustomerQueryType !='' ? param.CustomerQueryType = parseInt(param.CustomerQueryType) : ''
        param.MeterReadState !=''? param.MeterReadState = parseInt(param.MeterReadState) : ''
        MeterReadingPageQuery(param).then(res => {
          if (res.code ==0 ) {
            let _this = this,datas = res.data
            _this.tableData = res.data.tableDatas;
            _this.total = res.count;

            if(res.count>0) {
              let curNum = 0;
              if (datas.IsLocation) {//判断是否需要定位
                _this.param.page = datas.PageIndex//定位页数
                curNum = datas.RowIndex//定为当前页行数
              } else {
                curNum = 0;
              }
              _this.$nextTick(() => {//选中默认行
                _this.$refs.multipleTable.setCurrentRow(_this.$refs.multipleTable.data[curNum]);
                _this.screeWidth>1400?_this.$refs.planchild1.currentContract = _this.$refs.multipleTable.data[curNum]:_this.$refs.planchild2.currentContract = _this.$refs.multipleTable.data[curNum]
              })
            }
            MeterReadingProcessQuery({'SA_MeterReadPlan_Id':this.param.SA_MeterReadPlan_Id,'SA_RegisterBookInfo_Id':this.param.SA_RegisterBookInfo_Id}).then(res => {//抄表进度
              if (res.code ==0 ) {
                  this.screeWidth>1400 ? this.$refs.planchild1.meterData = res.data : this.$refs.planchild2.meterData = res.data
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning',
                  duration: 4000
                });
              }
            })

          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
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
      getCurInfo(row){//表格选中事件
        this.screeWidth>1400?this.$refs.planchild1.currentContract = row : this.$refs.planchild2.currentContract = row
      }
    },
    mounted() {
      this.screeWidth = window.screen.width
      this.$refs.myChild.GetTable(this.param.tableId);
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段

      if (window.screen.width > 1400) {
        this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 300
      } else {
        this.tableHeight = 340
        document.getElementsByClassName('cl-container')[0].style.overflow = 'auto'
        document.getElementsByClassName('cl-container')[0].style.height = 'auto'
      }
    }
  }
</script>
