<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">公司：</label>
              <el-select v-model="value" placeholder="请选择（单选）" size="small">
                <el-option
                  v-for="item in company"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <div class="cl-inlineItem">
              <label class="cl-label">部门：</label>
              <el-input
                placeholder="部门（长度10以内）"
                v-model="department"
                maxlength="10"
                size="small">
              </el-input>
            </div>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button>
          </el-col>
        </el-row>
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="success" size="small" class="cl-search" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          <el-button type="primary" size="small" class="cl-search cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
        </div>
        <customTable ref="myChild"></customTable>
      </div>
      <el-table :data="tableData" :height="tableHeight" id="table"  style="width: 100%" border>
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :min-width="item.width"
            :key="index"
            :prop="item.prop"
            :align="item.position"
            :label="item.text"
          />
        </template>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <a class="operation1" @click="handleEdit(scope.$index, scope.row)">编辑</a>
            <a class="operation2" @click="handleDelete(scope.$index, scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="searchFun"
      />
    </div>

    <!--编辑或新增窗口 s-->
    <el-dialog
      :title=title
      :visible.sync="dialogVisible"
      width="22%">
      <div>
        <div class="cl-inlineItem">
          <label class="cl-label">公司：</label>
          <el-select v-model="value" placeholder="请选择（单选）" size="small">
            <el-option
              v-for="item in company"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="cl-inlineItem">
          <label class="cl-label">部门：</label>
          <el-input
            placeholder="判断是否存在 已存在提示红色"
            maxlength="20"
            size="small">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveFun" size="small">确 定</el-button>
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        </span>
    </el-dialog>
    <!--编辑或新增窗口 e-->
    <!--警告信息 s-->
    <el-dialog
      title= '提示'
      class="warningBox"
      :visible.sync="warnVisible"
      width="20%">
      <p class="warnInfo">
        <i class="icon iconfont icontishixunwen"></i> 是否删除当前信息？
      </p>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteFun" size="small">确 定</el-button>
          <el-button @click="warnVisible = false" size="small">取 消</el-button>
        </span>
    </el-dialog>
    <!--警告信息 e-->
  </div>
</template>

<script>
import '../../styles/organization.scss'
import customTable from '../../components/CustomTable/index'
import Pagination from '../../components/Pagination/index'
export default {
  name: 'Department',
  components: { customTable, Pagination },
  data() {
    return {
      tableHeight: '',
      warnVisible: false,
      dialogVisible: false,
      title: '',
      total: 100,
      page: 10,
      limit: 10,
      company: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      department: '',
      tableData: [
        {
          date: '2012-10-30',
          name: ' 机库顶',
          address: '新世纪欧式党纪国法',
          age: '12',
          sex: '女',
          height: '120'
        },
        {
          date: '2012-10-31',
          name: ' 西涵涵',
          address: '第三个根本不被覆盖不是多',
          age: '13',
          sex: '男',
          height: '130'
        }
      ],
      checkAllData: [// 所有列可选项
        { checked: true, text: '日期', prop: 'date', position: 'center', width: '200px' },
        { checked: true, text: '姓名', prop: 'name', position: 'center', width: '200px' },
        { checked: false, text: '地址', prop: 'address', position: 'center', width: '200px' },
        { checked: false, text: '年龄', prop: 'age', position: 'center', width: '200px' },
        { checked: false, text: '性别', prop: 'sex', position: 'center', width: '200px' },
        { checked: false, text: '身高', prop: 'height', position: 'center', width: '200px' }
      ],
      checksData: [],
      customHeight: ''
    }
  },
  methods: {
    /**
     * 表格自定义
     * */
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
      this.customHeight = this.$refs.myChild.isCustom
    },
    /**
     * 导出
     * */
    exportExcel() {
      alert('导出')
    },
    /**
     * 编辑及新增
     * */
    handleEdit() {
      this.dialogVisible = true
      this.title = '编辑'
    },
    addNewFun() {
      this.dialogVisible = true
      this.title = '添加'
    },
    /**
     * 删除
     * */
    handleDelete() {
      this.warnVisible = true
    },
    deleteFun() {
      this.warnVisible = false
    },
    /**
     * 查询
     * */
    searchFun() {
    },
    /**
     * 编辑新增保存
     * */
    saveFun() {
    }
  },
  computed: {
    tableHead: function() {
      const arrayHead = []
      const data = this.checksData
      for (let i = 0; i < data.length; i++) { // 过滤选中列
        if (data[i].checked) {
          arrayHead.push(data[i])
        }
      }
      return arrayHead
    }
  },
  watch: {
    customHeight(val, oldVal) {
      this.$nextTick(() => {
        this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      })
    }
  },
  mounted() {
    this.$refs.myChild.checkData = this.checkAllData//先获取所有自定义字段赋值
    this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
    this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
  }
}
</script>
