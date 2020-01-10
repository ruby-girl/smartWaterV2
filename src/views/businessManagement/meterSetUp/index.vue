<template>
  <div class="cl-container">
    <div style="background: transparent;padding: 0;width: 100%;position: relative">
      <div style="background: #fff;padding: 16px;width: 100%;position: relative">
        <SelectHead ref="childSelect" @getText="getText" @searchFunion="searchFun"></SelectHead>
        <!--列表组建 s-->
        <div class="cl-center-box">
          <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips"/>
          <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%;" border
                    @sort-change="sortChanges" highlight-current-row ref="multipleTable"
                    :row-class-name="tableRowClassName"
                    @row-click="getCurInfo">
            <el-table-column type="index" fixed="left" label="#" width="60" align="center">
              <template slot-scope="scope">
                <span>{{(param.page - 1) * param.limit+ scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <template v-for="(item ,index) in tableHead">
              <el-table-column
                v-if="item.IsFreeze&&item.ColProp!='MeterReadStateName'&&item.ColProp!='ChargeFlagName'"
                min-width="110"
                :key="index"
                :sortable="item.IsSortBol ? 'custom' : null"
                :prop="item.ColProp"
                :align="item.Position"
                :label="item.ColDesc"
                :fixed="item.Freeze"/>
              <el-table-column
                v-else-if="!item.IsFreeze&&item.ColProp!='MeterReadStateName'&&item.ColProp!='ChargeFlagName'"
                min-width="110"
                :key="index"
                :sortable="item.IsSortBol ? 'custom' : null"
                :prop="item.ColProp"
                align="center"
                :label="item.ColDesc"/>
              <el-table-column
                v-else-if="item.ColProp=='MeterReadStateName'"
                :key="index"
                min-width="200px"
                :sortable="item.IsSortBol ? 'custom' : null"
                :align="item.Position"
                :label="item.ColDesc">
                <template slot-scope="scope">
                  <label style="color: #00B2A1" v-if="scope.row.MeterReadStateName=='已抄表'">{{scope.row.MeterReadStateName}}</label>
                  <label style="color: #FF5656" v-else="scope.row.MeterReadStateName=='未抄表'">{{scope.row.MeterReadStateName}}</label>
                </template>
              </el-table-column>
                <el-table-column
                  v-else-if="item.ColProp=='ChargeFlagName'"
                  :key="index"
                  min-width="200px"
                  :sortable="item.IsSortBol ? 'custom' : null"
                  :align="item.Position"
                  :label="item.ColDesc">
                  <template slot-scope="scope">
                     <label style="color: #00B2A1" v-if="scope.row.ChargeFlagName=='已缴费'">{{scope.row.ChargeFlagName}}</label>
                     <label style="color: #FF5656" v-else="scope.row.ChargeFlagName=='未缴费'">{{scope.row.ChargeFlagName}}</label>
                  </template>
              </el-table-column>
            </template>
            <el-table-column label="操作" width="100px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-tooltip effect="light" content="查看历史记录" placement="bottom-start">
                  <a class="operation4" @click="handleHistory(scope.row)"><i class="iconfont icon iconxianjinjiaofei-lishijilu"></i></a>
                </el-tooltip>
                <el-tooltip effect="light" content="删除" placement="bottom-start" v-if=" scope.row.MeterReadState != 1402 ">
                  <a class="operation2" @click="handleDelete(scope.row)"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
                </el-tooltip>
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
      </div>
      <!--抄表计划组建 s-->
      <MeterPlan ref="planchild1"></MeterPlan>
      <!--抄表计划组建 e-->
    </div>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import SearchTips from "@/components/SearchTips/index";
  import customTable from '@/components/CustomTable/index'//自定义组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import MeterPlan from './components/MeterPlan'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页
  import {MeterReadingPageQuery, MeterReadingProcessQuery, getReadDelete} from "@/api/meterReading"
  import {parseTime, promptInfoFun} from "@/utils/index"
  import {legalTime} from "@/utils/index";
  import {delTips, getText, pushItem} from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'meterSetUp',
    components: {customTable, Pagination, SelectHead, MeterPlan, SearchTips},
    data() {
      return {
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
        ID: '',
        waterFactory: [],//水厂数据集合
        tableHeight: null,//表格高度
        total: 0,
        param: {//查询条件对象集
          tableId: '0000014'
        },
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        customHeight: '',//自定义高度
        screeWidth: '',
        curRow: 0, //记录当前点击行数
        isPage: false// true 为加载下一条
      }
    },
    computed: {
      tableHead: function () {//获取表头信息
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
    methods: {
      handleDelete(row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass: "el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          getReadDelete({MeterRecordId: row.Id}).then(res => {
            if (res.code == 0) {
              promptInfoFun(this, 2, res.message)
              this.searchFun()
            } else {
              promptInfoFun(this, 1, res.message)
            }
          })
        })
      },
      searchFun() {//查询事件
        let param = Object.assign({}, this.param);//赋值对象转换参数类型
        param.CustomerQueryType != '' ? param.CustomerQueryType = parseInt(param.CustomerQueryType) : ''
        param.MeterReadState != '' ? param.MeterReadState = parseInt(param.MeterReadState) : ''
        MeterReadingPageQuery(param).then(res => {
          if (res.code == 0) {
            this.tipsData = pushItem(this.tipsDataCopy);
            let _this = this, datas = res.data
            _this.tableData = res.data.tableDatas;
            let timeObj = res.data.tableDatas//过滤不合法时间
            timeObj.forEach((item, index) => {
              for (let i in item) {
                i == 'ReadDate' ? item[i] = legalTime(item[i]) : ''
              }
            })
            _this.total = res.count;
            if (res.count > 0) {
              let curNum = 0;
              if (datas.IsLocation) {//判断是否需要定位
                _this.param.page = datas.PageIndex//定位页数
                curNum = datas.RowIndex - 1//定为当前页行数
                this.$refs.childSelect.param.CustomerQueryValue = ''
                //动态设置滚动条位置
                let curRowHeight = curNum * 44
                let seeHeight = document.getElementById('table').offsetHeight - 90
                if (curRowHeight > seeHeight)
                  this.$refs.multipleTable.bodyWrapper.scrollTop = curRowHeight
              } else {
                curNum = 0;
              }
              _this.$nextTick(() => {//选中默认行
                if (!this.isPage) {//不翻页直接选中默认行
                  _this.$refs.multipleTable.setCurrentRow(_this.$refs.multipleTable.data[curNum]);
                  _this.$refs.planchild1.currentContract = _this.$refs.multipleTable.data[curNum]
                } else {//勾选翻页时候，加载下一条数据
                  _this.$refs.multipleTable.setCurrentRow(_this.$refs.multipleTable.data[_this.curRow]);
                  _this.$refs.planchild1.currentContract = _this.$refs.multipleTable.data[_this.curRow]
                }
                _this.$refs.planchild1.$refs.ReadNumInput.$el.querySelector('input').focus()
              })
            }

            MeterReadingProcessQuery({
              'SA_MeterReadPlan_Id': this.param.SA_MeterReadPlan_Id,
              'SA_RegisterBookInfo_Id': this.param.SA_RegisterBookInfo_Id
            }).then(res => {//抄表进度
              if (res.code == 0) {
                this.$refs.planchild1.meterData = res.data
              } else {
                promptInfoFun(this, 1, res.message)
              }
            })

          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      },
      nextPageFun(next) {//抄表成功加载下一条数据
        if (next) {
          this.isPage = true //需要加载下一条标志
          if (this.curRow === this.param.limit - 1) {//判断当前点击行数是否为最后一行，是则需要翻页
            this.curRow = 0
            ++this.param.page
          } else if ((this.param.page - 1) * this.param.limit + (this.curRow + 2) > this.total) {//判断是否为最后一条信息
            return false
          } else {
            ++this.curRow
          }
          this.searchFun()
        }
        //动态设置滚动条位置
        let curRowHeight = this.curRow * 44
        let seeHeight = document.getElementById('table').offsetHeight - 90
        if (curRowHeight > seeHeight)
          this.$refs.multipleTable.bodyWrapper.scrollTop = curRowHeight
      },
      sortChanges({prop, order}) {//排序
        this.param.filed = prop
        this.param.sort = order == 'ascending' ? 'ASC' : (order == 'descending' ? 'DESC' : '')
        if (this.tableData.length > 0) {
          this.param.page = 1
          this.searchFun()
        }
      },
      tableRowClassName({row, rowIndex}) {//为table添加当前行索引
        row.index = rowIndex;
        if(row.MeterReadStateName=='已抄表'){
          return 'warning-row'
        }
      },
      getCurInfo(row) {//表格选中事件
        this.curRow = row.index
        this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[row.index]);
        this.$refs.planchild1.currentContract = this.$refs.multipleTable.data[row.index]
        this.$refs.planchild1.$refs.ReadNumInput.$el.querySelector('input').focus()
        this.$refs.planchild1.param.ReadNum = ''
        this.$refs.planchild1.MaxReadDate = row.MaxReadDate//上次抄表时间
      },
      handleHistory(row) {// 查看历史数据，跳转表册设置
        row.SA_MeterReadPlan_Id =  this.param.SA_MeterReadPlan_Id
        this.$router.push({path: '/businessManagement/meterQuery', query: {CustomerInfo: row}})
       // Bus.$emit('getPlanData',row)
      },
      /**
       *val 对应绑定的参数
       *this this对象
       * this.tipsDataCopy   存储面包屑数据的数组
       * param  对应搜索条件的对象名
       */
      delTips(val) {
        if (val == "SA_MeterReadPlan_Id") {
          promptInfoFun(this, 1, '抄表计划不能为空')
          return false
        } else if(val=='SA_RegisterBookInfo_Id'){
          promptInfoFun(this, 1, '表册不能为空')
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
      }
    },
    mounted() {
      this.screeWidth = window.screen.width
      this.$refs.searchTips.$refs.myChild.GetTable(this.param.tableId); // 先获取所有自定义字段赋值
      this.$refs.searchTips.showExcel = false; // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 305
    }
  }
</script>
<style lang="scss">
  .cl-container {
    .el-table .warning-row {
      background: #feddd8;
    }
  }
</style>
