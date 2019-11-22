<template>
  <el-dialog
    :title="title" :visible.sync="configVisible" :close-on-click-modal="false" top="5vh" width="820px" center
    class="configure_box">
    <!--流程审核人配置-->
    <el-form :inline="true" :model="form" class="person_form" v-show="type==1">
      <el-form-item label="名称：">
        <el-input v-model="form.user" placeholder="审核人" size="small"></el-input>
      </el-form-item>
      <el-form-item label="当审核不通过时，流程：">
        <el-select v-model="form.region" placeholder="结束"  size="small">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--配置公用审核人组-->
    <el-form :inline="true" :model="form" class="person_form" v-show="type==2">
      <el-form-item label="名称：">
        <el-input v-model="form.ModuleName" placeholder="审核人组" size="small"></el-input>
      </el-form-item>
    </el-form>
    <!--配置操作员-->
    <el-form :inline="true" :model="form" class="person_form" v-show="type==3">
      <el-form-item label="名称：">
        <el-input v-model="form.user" placeholder="操作员" size="small"></el-input>
      </el-form-item>
    </el-form>

    <div class="card_box">
      <el-tabs type="border-card">
        <!--按部门选择-->
        <el-tab-pane label="按部门选择">
          <check-nodes ref="departChild"></check-nodes>
        </el-tab-pane>
        <!--按岗位选择-->
        <el-tab-pane label="按岗位选择">
          <el-form :inline="true" :model="postForm" class="condition_form">
            <el-form-item label="部门：">
              <el-select v-model="postForm.department" placeholder="请选择" size="small" @change="getPostInfo">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in department" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <check-nodes ref="postChild"></check-nodes>
        </el-tab-pane>
        <!--按人员选择-->
        <el-tab-pane label="按人员选择">
          <el-form :inline="true" :model="peopleForm" class="condition_form">
            <el-form-item label="部门：">
              <el-select v-model="peopleForm.department" placeholder="请选择" size="small" @change="getPostInfo2">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in department" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位：">
              <el-select v-model="peopleForm.post" placeholder="请选择" size="small" @change="getPostPeopleInfo">
                <el-option v-for="(item,index) in post" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <check-nodes ref="peopleChild"></check-nodes>
        </el-tab-pane>
        <!--按角色选择-->
        <el-tab-pane label="按角色选择">
          <check-nodes ref="roleChild"></check-nodes>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="configVisible = false">确认</el-button>
      <el-button size="mini" @click="configVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Bus from '@/utils/bus'
  import CheckNodes from './CheckNodes1'
  import { UpdateProcessModuleInfo, CacheComboBoxByPIdZhuanYong, ComboBoxListByRoseZhuanYong, ComboBoxListZhuanYong } from "@/api/operationFlow"
  import { getRoles } from "@/api/role"
  import { ComboBoxList } from "@/api/organize"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "configureDialog",
    components:{CheckNodes:CheckNodes},
    data() {
      return {
        configVisible: false,
        type: 1,//1 流程节点配置, 2 公用审核组配置 3: 操作员配置
        title:'配置',
        form:{//模型组对象
          Id:'',
          ModuleName:'',
          Members:[
            {
              Id:'',
              ConfigType:'',
              ObjectId:'',
              ObjectName:''
            }
          ]
        },
        department:[],//部门下拉
        getRoles:[],//角色下拉
        post:[],//岗位下拉
        postForm:{//按岗位查
          department:'',
        },
        peopleForm:{//按角色查
          department:'',
          post:''
        }
      }
    },
    methods: {
      getSelectData(funName,type){//获取部门，角色下拉选项数据
        funName().then(res => {
          if (res.code ==0 ) {
            res.data.forEach(i=>{i.hide=true})
            type == 1 ? this.getRoles = res.data : this.department = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPostInfo(val){//根据部门获取岗位
        CacheComboBoxByPIdZhuanYong({SYS_Department_Id:val}).then(res => {
          if (res.code ==0 ) {
             if(val == -1){
               res.data.forEach(i=>{
                 i.hide = true
               })
               this.$refs.postChild.data = res.data
             }else {
               this.$refs.postChild.data.forEach(item=>{//模拟模糊查询,过滤不显示的复选框
                    if(res.data.length==0){
                      item.hide = false
                    }else {
                    for(let i=0;i<res.data.length;i++){
                      if(item.Id == res.data[i].Id){
                          item.hide = true
                          break
                      }else {
                          item.hide = false
                      }
                    }
                    }
               })
             }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPostInfo2(val){//人员岗位下拉
        CacheComboBoxByPIdZhuanYong({SYS_Department_Id:val}).then(res => {
          if (res.code ==0 ) {
            val == -1 ? res.data.unshift({Id:-1,Name:'全部'}):''
            this.post = res.data
            this.peopleForm.post = ''
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPostPeopleInfo(val){//根据岗位获取姓名
        ComboBoxListZhuanYong({PId:val}).then(res => {
          if (res.code ==0 ) {
            if(val==-1){
              res.data.forEach(i=>{
                i.hide = true
              })
              this.$refs.peopleChild.data = res.data
            }else{
              this.$refs.peopleChild.data.forEach(item=>{//模拟模糊查询,过滤不显示的复选框
                if(res.data.length==0){
                  item.hide = false
                }else {
                  for(let i=0;i<res.data.length;i++){
                    if(item.Id == res.data[i].Id){
                      item.hide = true
                      break
                    }else {
                      item.hide = false
                    }
                  }
                }
              })
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      Bus.$off('NodesSetFun')
      Bus.$on('NodesSetFun', (msg) => {//触发流程节点配置
        this.type = msg.type
        this.form = msg.item
        switch (msg.type) {
          case 1:
            this.title = '流程审核人配置'
            break
          case 2:
            this.title = '配置审核人'
            break
          case 3:
            this.title = '操作员配置'
            break
        }
        this.configVisible = true
        this.$nextTick(() => {//默认加载岗位部门数据
          this.$refs.departChild.data = this.department//获取全部部门
          this.$refs.roleChild.data = this.getRoles//获取全部角色

        })
      })
    },
    created() {
      this.getSelectData(getRoles,1)//角色数据集合
      this.getSelectData(ComboBoxList,2)//岗位数据集合
    }
  }
</script>
<style lang="scss">
  .configure_box {
    .el-dialog__body{background: #F5F5F5;padding: 0;}
    .person_form {background: #fff;padding: 35px 24px 13px 24px;margin-bottom: 10px;
      .el-form-item{margin-right: 90px;}}
    .card_box{background: #fff;padding: 30px 25px 15px 25px;
      .el-tabs__content{padding: 0;height: 430px}
    }
    .condition_form{background: #F0F2F5;padding: 15px 0 18px 16px;
      .el-form-item{margin-bottom: 0;}
    }
    .el-dialog__footer{background: #f5f5f5;padding: 22px 0;}
    .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
      background: #F0F2F5 !important;
    }
    .el-tabs--border-card > .el-tabs__header{
      background: #fff;
    }
  }
</style>
