<template>
  <div class="tree_container">
      <div class="user_box">
        <!--左侧树形菜单-->
        <div class="user_tree">
          <h2>区域</h2>
          <div id="operate_area">
            <el-button type="primary" size="mini" @click="getCheckedNodes(1)" class="btn_one"><i class="el-icon-plus"></i> 添加</el-button>
            <el-button size="mini" @click="getCheckedNodes(2)" class="btn_two"><i class="el-icon-edit"></i> 编辑</el-button>
            <el-button size="mini" @click="getCheckedNodes(3)" class="btn_three"><i class="el-icon-close"></i> 删除</el-button>
            <el-input placeholder="请输入内容" v-model="searchText" size="small" style="margin: 18px 0">
              <el-button slot="append" icon="el-icon-search" size="small" class="search_btn">搜索</el-button>
            </el-input>
          </div>
          <p>公司名称</p>
          <myTree id="my_tree" ref="myChild" :treeData = treeData></myTree>
          <span v-show="!ifShow" class="telescopic telescopic2" @click="getUp"> 收起 <i class="iconfont iconshouqi2" style="font-size: 12px;"></i></span>
        </div>
        <!--右侧列表数据-->
        <div class="user_table">
          <SelectHead></SelectHead>
          <span v-show="ifShow" class="telescopic telescopic1" @click="getUp"> 展开 <i class="iconfont iconshouqi1" style="font-size: 12px;"></i></span>
        </div>
      </div>

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
</template>

<script>
  import '@/styles/organization.scss'
  import myTree from '@/components/Tree/index'
  import SelectHead from './components/SelectHead'//查询条件组建

  export default {
    name: 'userSeting',
    components: { myTree, SelectHead },
    data() {
      return {
        ifShow:false,
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
      * 伸缩功能
      * */
      getUp(){
        this.ifShow = !this.ifShow
        if(this.ifShow){
          document.getElementById('operate_area').classList.add('none')
          document.getElementsByClassName('user_tree')[0].classList.add('hide')
        }else {
          document.getElementsByClassName('user_tree')[0].classList.remove('hide')
          setTimeout(()=>{
            document.getElementById('operate_area').classList.remove('none')
          },160)
        }
      },
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
            }
            ]
          }]
        },{
          id: 2,
          label: '二级 1',
          icon: 'icongongsishu-yiji',
          children: [{
            id: 5,
            label: '二级 1-1',
            icon: 'icongongsishu-erji',
            children: [{
              id: 11,
              label: '三级 1-1-1',
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
      let maxHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('my_tree').offsetTop - 50
      document.getElementById('my_tree').style.height = maxHeight + 'px'
      window.onresize = function () {
        maxHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('my_tree').offsetTop - 50
        document.getElementById('my_tree').style.height = maxHeight + 'px'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tree_container{
    .telescopic{position: absolute;display: block;top:39%;;color: #777C82;font: normal 16px 'Microsoft YaHei';width: 30px;margin: 0 auto;word-wrap: break-word;
      -webkit-box-shadow: 1px 1px 5px #cecece;background: #fff;padding: 15px 0;z-index: 999;text-align: center;cursor: pointer;
      box-shadow: 1px 1px 5px #cecece;
    }
    .telescopic1{
      left: 0;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
    }
    .telescopic2{
      right: 0px;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
    }
    position: relative;
    padding: 16px 16px 0 16px;
    height: calc(100vh - 74px);
    .user_box{ display: flex;height: inherit;
      >div {transition:width .2s;-webkit-transition:width .2s;position: relative}
    .user_tree {
      width: 240px;position: relative;background: #fff;padding: 0 15px;
      h2 {font: bold 16px 'Microsoft YaHei';color: #46494C}
      >p{background: #CAD9E0;font: bold 14px/38px 'Microsoft YaHei';color: #46494C;margin: 0;padding: 0 12px;}
      i{font-size: 12px;}
      .btn_one{color: #fefefe}
      .btn_two{color: #00B2A1;border: solid 1px #00B2A1;}
      .btn_three{color: #FF5656;border: solid 1px #FF5656;}
      .btn_three:hover{background: #fef0f0}
      #my_tree{overflow: auto;}
      .search_btn{background: #00B3A1;color: #FEFEFF;padding-left: 6px;padding-right: 6px;border-top-left-radius: 0;border-bottom-left-radius: 0;}
      margin-right: 16px;
    }
    .user_table{flex: 1;-webkit-flex: 1;background: #fff;padding: 16px;position: relative;}
    }
    .el-button--mini{padding: 7px 6px;}
    .hide {width: 0 !important;padding: 0 !important;overflow: hidden;margin-right: 0 !important;}
    .none {display: none}
  }
</style>
