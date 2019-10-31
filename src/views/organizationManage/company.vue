<template>
  <div class="cl-container cl-container1">
    <div>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="cl-searchCont">
            <label>公司：</label>
            <el-input
              maxlength="20"
              placeholder="公司（长度20内）"
              v-model="searchText"
              size="small">
            </el-input>
            <el-button type="primary" size="small" class="cl-search"><i class="icon iconfont">&#xe694;</i> 搜索</el-button>
          </div>
        </el-col>
        <el-col  :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="fr">
            <el-button type="primary" size="small" class="cl-search" @click="getCheckedNodes(1)"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
            <el-button type="primary" size="small" class="cl-search cl-color1" @click="getCheckedNodes(2)"><i class="icon iconfont">&#xe677;</i> 编辑</el-button>
            <el-button type="primary" size="small" class="cl-search cl-color2" @click="getCheckedNodes(3)"><i class="icon iconfont">&#xe687;</i> 删除</el-button>
            <el-button type="success" size="small" class="cl-search" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          </div>
        </el-col>
      </el-row>
      <myTree ref="myChild" :treeData = treeData></myTree>

      <img class="cl-baseImg" src="../../assets/source_img/build.png" alt="">
      <!--编辑或新增窗口 s-->
      <el-dialog
        :title=title
        :visible.sync="dialogVisible"
        width="400px">
        <div>
          <div class="cl-inlineItem">
            <label class="cl-label">公司：</label>
            <el-input
              placeholder="公司（长度20内）已存在提示红色"
              v-model="addName"
              maxlength="20"
              style="width: 250px"
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
  </div>
</template>

<script>
import '../../styles/organization.scss'
import myTree from '../../components/Tree/index1'

export default {
  name: 'company',
  components: { myTree },
  data() {
    return {
      searchText: '',
      title: '添加',
      addName: '',
      dialogVisible: false,
      warnVisible: false,
      treeData: []
    }
  },
  methods: {
    /**
     * 节点增删编辑事件
     * params type
     * 1 增加节点(最多只能建三级) 2：编辑节点 3：删除节点
     * */
    getCheckedNodes(type) {
      const _this = this
      const checkData = _this.$refs.myChild.curNode
      switch (type) {
        case 1:
          if (checkData === '') {
            _this.$message({
              message: '请选择一条信息进行操作',
              type: 'warning'
            })
          } else {
            _this.dialogVisible = true
            _this.title = '添加'
          }
          break
        case 2:
          if (checkData === '') {
            _this.$message({
              message: '请选择一条信息进行操作',
              type: 'warning'
            })
          } else {
            _this.dialogVisible = true
            _this.addName = checkData.label
            _this.title = '编辑'
          }
          break
        case 3:
          _this.$refs.myChild.getCheckedNodes()
          let ids = _this.$refs.myChild.deleteIds
          if (ids.length <= 0) {
            _this.$message({
              message: '请选择需要操作的数据',
              type: 'warning'
            })
          } else {
            _this.warnVisible = true
          }
          break
      }
    },
    /**
     * 添加或编辑弹窗保存
     * */
    saveFun() {
      this.dialogVisible = false
      this.getTreeData()
    },
    /**
    * 节点删除
    */
    deleteFun() {
      this.warnVisible = false
      this.getTreeData()
    },
    /**
     * 获取tree数据
    * */
    getTreeData() {
      this.treeData = [{
        id: 1,
        label: '一级 1',
        icon: 'icongongsishu-yiji',
        children: [{
          id: 4,
          label: '二级 1-1',
          icon: 'icongongsishu-erji',
          children: [{
            id: 9,
            label: '三级 1-1-1',
            icon: 'icongongsishu-sanji'
          }, {
            id: 10,
            label: '三级 1-1-2',
            icon: 'icongongsishu-sanji'
          }]
        }]
      }]
    },
    /**
     * 导出
    * */
    exportExcel() {}
  },
  mounted() {
    this.getTreeData()
  }
}
</script>

