<template>
  <div class="cl-container">
    <div>
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <div class="table-setting">
        <el-button size="mini" type="primary" round @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
      </div>

      <!--列表数据 s-->
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(dp.page - 1) * dp.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            :width=" index == 0 ? 350+'px':'auto'"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            :width=" index == 0 ? 350+'px':'auto'"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"/>
        </template>
        <el-table-column label="操作" width="100px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="编辑" placement="bottom-start">
              <a class="operation1" @click="handleEdit(scope.row)"><i class="iconfont icon iconsuoyoubiaogelidebianji"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="删除" placement="bottom-start"  v-if="scope.row.isDelete">
              <a class="operation2" @click="handleDelete(scope.row)"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="岗位已关联人员，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="dp.page"
        :limit.sync="dp.limit"
        @pagination="searchFun"
      />
      <!--列表数据 e-->
    </div>
    <!--编辑或新增窗口 s-->
    <AddOrEdit ref="addChild"></AddOrEdit>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import customTable from '@/components/CustomTable/index'//自定义表格组建
  import AddOrEdit from './components/AddOrEdit'
  import SelectHead from './components/SelectHead'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页组建
  import { GetList, Delete, GetList_Execl,GetEditObjById } from "@/api/organize"
  import { parseTime, promptInfoFun } from "@/utils/index"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'department',
    components: { SelectHead, customTable, Pagination, AddOrEdit, SearchTips },
    data() {
      return {
        tableHeight: null,//表格高度
        title: '',//编辑或新增弹窗标题
        total: 0,//分页总条数
        dp: {//查询条件对象
          tableId: "0000001"
        },
        tableData: [],//列表数据
        checkAllData: [],
        checksData: [],//自定义字段中选中了字段
        customHeight: '',//自定义字段模块高度
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
      setCustomData() {//表格自定义
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom//给子组件变量赋值
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          this.$message({
            message: '当前列表无数据，不可导出',
            type: 'warning',
            duration: 4000
          });
          return false
        }
        GetList_Execl(this.dp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(row) {//编辑方法
        this.$refs.addChild.dialogVisible = true
        this.$refs.addChild.title = '编辑'
        GetEditObjById({id:row.Id}).then(res => {
          if(res.code==0){
            this.$refs.addChild.jp = res.data
          }
        })
      },
      addNewFun() {//新增方法
        this.$refs.addChild.dialogVisible = true
        this.$refs.addChild.title = '添加'
        this.$refs.addChild.jp.DeptName = ''
      },
      handleDelete(row) {//删除方法
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          Delete({ Id: row.Id }).then(res => {
            if (res.code ==0 ) {
              promptInfoFun(this, 2, res.message);
              this.dialogVisible = false
              this.searchFun()
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        });
      },
      searchFun() {
        GetList(this.dp).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
            this.tipsData = pushItem(this.tipsDataCopy)
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      },
      sortChanges({prop, order }){//列表排序方法
        this.dp.filed = prop
        this.dp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.dp.page = 1
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
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "dp"); //返回删除后的数据传给组件
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
      this.$refs.searchTips.$refs.myChild.GetTable(this.dp.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 70

    }
  }
</script>
