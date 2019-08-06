<template>
  <div class="section-container">
    <div ref="formHeight">
      <select-head :select-head="listQuery" @handleFilter="handleFilter" />
    </div>
    <div class="table-top-btn-padding">
      <el-button type="primary" size="mini" class="iconfont icontianjia" @click="addRole">添加</el-button>
      <el-button type="success" size="mini" class="iconfont icondaochuexcel">导出Excel</el-button>
      <el-button type="warning" size="mini" class="iconfont iconbiaogezidingyi"  @click="setCustomData()">表格自定义</el-button>
    </div>
    <customTable ref="myChild"></customTable>
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        stripe
        :height="tableHeight"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'7px 0'}"
        >
        <el-table-column type="index"></el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            min-width="100px"
            :key="index"
            :prop="item.prop"
            :align="item.position"
            sortable
            :label="item.text"
          />
        </template>
        <el-table-column label="操作" align="center" class-name="small-padding">
          <template slot-scope="{row}">
            <div class="display-flex justify-content-flex-center">
              <div class="main-color" @click="handleUpdate(row)"><a>编辑</a></div>
              <div class="main-color-red pl-15" @click="delRow(row)"><a>删除</a></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <!-- 编辑弹窗 -->
    <edit-dialog :show.sync="dialogFormVisible" :temp="temp" @createData="createData"></edit-dialog>
    <add-dialog :addShow.sync="addDialogFormVisible" :temp="temp"  @updateData="updateData"></add-dialog>
  </div>
</template>
<script>
import SelectHead from './components/SelectHead'
import Pagination from '@/components/Pagination'
import EditDialog from './components/EditDialog'
import AddDialog from './components/AddDialog'
import customTable from '@/components/CustomTable/index'
export default {
  components: { SelectHead, Pagination, EditDialog, customTable, AddDialog},
  data() {
    return {
      total: 1,
      tableKey: 0,
      tableHeight: 0,
      temp: {
        role: '',
        roleName: '',
        userNum: [1]
      },
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        roleName: '', // 角色名称
        userName: '', // 人员名称
        userNum: '', // 人员编号
        editName: '', // 操作人
        startTime: '', // 操作时间起
        endTime: '' // 操作时间止
      },
      addDialogFormVisible: false, // 新增弹窗
      dialogFormVisible: false, // 编辑弹窗
      tableData: [{ role: '123', roleName: '羊阿萨德', time: '2018-01-01',userNum:[1,2]}],
      checksData: [],
      checkAllData: [// 所有列可选项
        { checked: true, text: '人员编号', prop: 'role', position: 'left' },
        { checked: true, text: '角色', prop: 'roleName', position: 'left' },
        { checked: true, text: '账号', prop: 'roleName', position: 'left' },
        { checked: true, text: '状态', prop: 'roleName', position: 'left' },
        { checked: true, text: '操作人', prop: 'roleName', position: 'left' },
        { checked: true, text: '操作时间', prop: 'time', position: 'left' }
      ],
    }
  },
  computed: {
    tableHead: function() {
      let arrayHead= this.checksData.filter((item)=>{
          return item.checked
      })
      return arrayHead
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight
      const that = this
      that.tableHeight = document.body.clientHeight - formHeight-220
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 220
      }
      this.$refs.myChild.checkData = this.checkAllData // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData // 获取自定义字段中选中了字段
    })
  },
  methods: {
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
    },
    getList() {
      console.log('请求')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogFormVisible = true
    },
    delRow(r) {
      this.$confirm('这里是需要确认的信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'warningBox',
        showClose: false
      }).then(() => {
        console.log(r)
      })
    },
    addRole() {
      this.temp = {
        role: '',
        roleName: '',
        userNum: []
      }
      this.addDialogFormVisible = true
    },
    createData() {
      console.log('添加了')
    },
    updateData() {
      console.log('编辑了')
    }
  }
}
</script>
<style lang="scss" scoped>
.pipeline-select-padding {
  padding: 20px 20px 10px 20px;
}
</style>

