<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <div class="table-setting">
        <el-button size="mini" class="cl-search cl-reset" round @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
      </div>

      <!--列表组建 s-->
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(sbap.page - 1) * sbap.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead" >
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"/>
        </template>
        <el-table-column label="操作" width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="编辑" placement="bottom-start">
              <a class="operation1" @click="handleEdit(scope.$index, scope.row)"><i class="iconfont icon iconsuoyoubiaogelidebianji"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="删除" placement="bottom-start"  v-if="scope.row.isDelete">
              <a class="operation2" @click="handleDelete(scope.$index, scope.row)"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="已产生用户数据，不可进行操作" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="sbap.page"
        :limit.sync="sbap.limit"
        @pagination="searchFun"/>
      <!--列表组建 e-->
    </div>
    <Dialog ref="childDialog"></Dialog>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import Dialog from './components/Dialog'//新增或添加组建
  import customTable from '@/components/CustomTable/index'//自定义组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页
  import { BlockAreaGetList, BlockAreaAdd, BlockAreaUpDate, BlockAreaDelete, BlockAreaExecl, BlockAreaGetObjById } from "@/api/organize"//http 请求
  import { parseTime } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'areaManage',
    components: { customTable, Pagination, SelectHead, Dialog, SearchTips },
    data() {
      return {
        ID:'',
        waterFactory:[],//水厂数据集合
        tableHeight: null,//表格高度
        total: 0,
        sbap: {//查询条件对象集
          tableId: '0000007'
        },
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        customHeight: '',//自定义高度
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
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
    methods: {
      setCustomData() {//表格自定义方法
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        BlockAreaExecl(this.sbap).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(scope,row) {//编辑方法
        this.ID = row.Id
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '编辑'
        let sbap = {Id: row.Id}
        BlockAreaGetObjById(sbap).then(res => {
          if (res.code == 0) {
            this.$refs.childDialog.ruleForm.newAreaName = res.data.BlockAreaName
            this.$refs.childDialog.ruleForm.waterFactoryName = res.data.WfList
          }
        })
      },
      addNewFun() {//新增方法
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '添加'
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
        BlockAreaGetList(this.sbap).then(res => {
          if (res.code ==0 ) {
            this.total = res.data.length;
            this.tableData = res.data;
            this.tipsData = pushItem(this.tipsDataCopy)
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
        if(val=='createStartTimes'){
          this.$refs.childSelect.createStartTimes = []
          this.$refs.childSelect.sbap.editStartTime = ''
          this.$refs.childSelect.sbap.editEndTime = ''
        }
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
      this.$refs.searchTips.$refs.myChild.GetTable(this.sbap.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 70

    }
  }
</script>
