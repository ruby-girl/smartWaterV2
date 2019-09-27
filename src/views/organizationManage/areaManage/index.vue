<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <!--查询条件组建 s-->
        <SelectHead ref="childSelect"></SelectHead>
        <!--查询条件组建 e-->
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
          <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        </div>
        <!--自定义组建 s-->
        <customTable ref="myChild" />
        <!--自定义组建 e-->
      </div>
      <!--列表组建 s-->
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
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
        <el-table-column label="操作" width="200px" align="center" fixed="right">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.$index, scope.row)">编辑</a>
            <a class="operation2" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isDelete">删除</a>
            <el-tooltip v-else effect="dark" content="已产生用户数据，不可进行操作" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">删除</a>
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
    <!--编辑或新增窗口 s-->
    <!--<el-dialog
      :close-on-click-modal="false"
      top="30vh"
      :title="title"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="400px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="片区:" prop="newAreaName">
          <el-input
            v-model.trim="ruleForm.newAreaName"
            placeholder="(长度1-20内)"
            maxlength="20"
            size="small"
            style="width: 250px"/>
        </el-form-item>
        <el-form-item label="水厂:" prop="waterFactoryName">
          <el-select  style="width: 250px" multiple v-model="ruleForm.waterFactoryName">
            <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
          </el-select>
        </el-form-item>
        <p class="footBox dialogFooter">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
        </p>
      </el-form>
    </el-dialog>-->
    <Dialog ref="childDialog"></Dialog>
    <!--编辑或新增窗口 e-->
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import Dialog from './components/Dialog'//新增或添加组建
  import customTable from '@/components/CustomTable/index'//自定义组建
  import SelectHead from './components/SelectHead'//查询条件组建
  import Pagination from '@/components/Pagination/index'//分页
  import { BlockAreaGetList, BlockAreaAdd, BlockAreaUpDate, BlockAreaDelete, BlockAreaExecl, BlockAreaGetObjById } from "@/api/organize"//http 请求
  import { parseTime } from "@/utils/index"

  export default {
    name: 'areaManage',
    components: { customTable, Pagination, SelectHead, Dialog },
    data() {
      return {
        ID:'',
        waterFactory:[],//水厂数据集合
        tableHeight: null,//表格高度
        //dialogVisible: false,//弹窗隐藏标识
        //title: '',//新增或编辑title
        total: 0,
        sbap: {//查询条件对象集
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          BlockAreaName: '',//片区名称
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          tableId: '0000007'
        },
      /*  ruleForm: {//新增对象
          newAreaName: '',
          waterFactoryName:[]
        },
        rules: {
          newAreaName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          waterFactoryName: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },*/
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        customHeight: ''//自定义高度
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
          self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
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
          type: "warning",
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
            this.total = res.count;
            this.tableData = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      /*submitForm(formName) {//编辑新增保存事件
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.title ==='编辑') {
              let params = { Id: editObj.Id, BlockAreaName: this.ruleForm.newAreaName,List: this.ruleForm.waterFactoryName}
              BlockAreaUpDate(params).then(res => {
                if (res.code ==0 ) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            } else {
              let iba = {
                BlockAreaName: this.ruleForm.newAreaName,List: this.ruleForm.waterFactoryName
              }

              BlockAreaAdd(iba).then(res => {
                if (res.code == 0) {
                  this.$message({
                    message: res.message,
                    type: 'success',
                    duration: 4000
                  });
                  this.dialogVisible = false
                  this.$refs[formName].resetFields();
                  this.searchFun()
                } else {
                  this.$message({
                    message: res.message,
                    type: 'warning',
                    duration: 4000
                  });
                }
              })
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName){//取消时初始化表单信息
        this.dialogVisible = false;
        this.ruleForm.waterFactoryName = ''
        this.$refs[formName].resetFields();
      },
      handleClose(){//弹窗关闭初始化表单信息
        this.resetForm('ruleForm')
      },*/
      sortChanges({prop, order }){//排序
        this.sbap.filed = prop
        this.sbap.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.sbap.page = 1
          this.searchFun()
        }
      }
    },
    mounted() {
      this.$refs.myChild.GetTable(this.sbap.tableId);
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    }
  }
</script>
