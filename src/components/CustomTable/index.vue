<template>
  <div class="customTableBox">
    <div class="customOption">
      <span class="fl">自定义选项：</span>
      <div class="fl">
        <el-checkbox v-for="check in checkData" :key="check.text" v-model="check.checked" v-dragging="{ item: check, list: checkData, group: 'check' }">{{ check.text }}</el-checkbox>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" height="300" border>
      <el-table-column
        type="selection"
        width="55"
      />
      <template v-for="(item ,index) in tableDataHead">
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
</template>

<script>
export default {
  name: 'CustomTable',
  data() {
    return {
      checkData: [// 所有列可选项
        { checked: true, text: '日期', prop: 'date', position: 'left' },
        { checked: true, text: '姓名', prop: 'name', position: 'left' },
        { checked: false, text: '地址', prop: 'address', position: 'left' },
        { checked: false, text: '年龄', prop: 'age', position: 'left' },
        { checked: false, text: '性别', prop: 'sex', position: 'left' },
        { checked: false, text: '身高', prop: 'height', position: 'left' }
      ],
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
      ]
    }
  },
  computed: {
    tableDataHead: function() {
      const arrayHead = []
      const data = this.checkData
      for (let i = 0; i < data.length; i++) { // 过滤选中列
        if (data[i].checked) {
          arrayHead.push(data[i])
        }
      }
      return arrayHead
    }
  },
  mounted() {
    this.$dragging.$on('dragged', ({ value }) => {})
  }
}
</script>
<style lang="scss">
  .customTableBox{
    .customOption {
        padding:0 30px;border: solid 1px #eee;margin-bottom: 20px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;height: 50px;
        color: #8b8c89;font-size: 14px;
      >span{display: inline-block;}
   }
  }
</style>
