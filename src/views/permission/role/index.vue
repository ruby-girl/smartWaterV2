<template>
  <div class="pipeline-select-padding">
    <div ref="formHeight">
      <select-head :select-head="listQuery" @handleFilter="handleFilter" />
    </div>
    <div class="table-top-btn-padding">
      <el-button type="primary" size="mini" class="iconfont icontianjia">添加</el-button>
      <el-button type="success" size="mini" class="iconfont icondaochuexcel">导出Excel</el-button>
      <el-button type="warning" size="mini" class="iconfont iconbiaogezidingyi">表格自定义</el-button>
    </div>
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        fit
        stripe
        :height="tableHeight"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F5FF'}"
        :cell-style="{'padding':'7px 0'}"
        >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding">
          <template slot-scope="{row}">
            <div class="display-flex justify-content-flex-center">
              <div class="main-color" @click="handleUpdate(row)"><a>操作</a></div>
              <div class="main-color-red pl-15" @click="delRow"><a>删除</a></div>
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
  </div>
</template>
<script>
import SelectHead from './components/SelectHead'
import Pagination from '@/components/Pagination'
export default {
  components: { SelectHead, Pagination },
  data() {
    return {
      total: 1,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
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
      tableData: [{ role: '123', roleName: '羊阿萨德' }]
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      var formHeight = this.$refs.formHeight.offsetHeight
      const that = this
      that.tableHeight = document.body.clientHeight - formHeight - 250
      window.onresize = () => {
        that.tableHeight = document.body.clientHeight - formHeight - 250
      }
    })
  },
  methods: {
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    delRow() {
      this.$confirm('这里是需要确认的信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'warningBox',
        showClose: false
      }).then(() => {
        console.log('asd')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pipeline-select-padding {
  padding: 20px 20px 10px 20px;
}
</style>

