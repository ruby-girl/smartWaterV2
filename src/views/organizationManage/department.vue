<template>
  <div class="cl-container">
    <div>
      <el-row>
        <el-col :span="4">
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
        <el-col :span="4">
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
        <el-col :span="4">
          <el-button type="primary" size="small" class="cl-search"><i class="icon iconfont">&#xe694;</i> 搜索</el-button>
        </el-col>
      </el-row>
      <div class="cl-operation1">
        <el-button type="primary" size="small" class="cl-search" ><i class="icon iconfont">&#xe689;</i> 添加</el-button>
        <el-button type="success" size="small" class="cl-search" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        <el-button type="primary" size="small" class="cl-search cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
      </div>
      <customTable ref="myChild"></customTable>

      <el-table :data="tableData" style="width: 100%" height="300" border>
        <el-table-column
          type="selection"
          width="55"
        />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            min-width="200px"
            :key="index"
            :prop="item.prop"
            :align="item.position"
            sortable
            :label="item.text"
          />
        </template>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import '../../styles/organization.scss'
import customTable from '../../components/CustomTable/index'
export default {
  name: 'Department',
  components: { customTable },
  data() {
    return {
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
        { checked: true, text: '日期', prop: 'date', position: 'left' },
        { checked: true, text: '姓名', prop: 'name', position: 'left' },
        { checked: false, text: '地址', prop: 'address', position: 'left' },
        { checked: false, text: '年龄', prop: 'age', position: 'left' },
        { checked: false, text: '性别', prop: 'sex', position: 'left' },
        { checked: false, text: '身高', prop: 'height', position: 'left' }
      ],
      checksData: []
    }
  },
  methods: {
    /**
     * 表格自定义
     * */
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
    },
    exportExcel() {
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
  mounted() {
    this.$refs.myChild.checkData = this.checkAllData//先获取所有自定义字段赋值
    this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
  }
}
</script>
