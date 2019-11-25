<template>
  <el-dialog
    :title="title" :visible.sync="configVisible" :close-on-click-modal="false" top="5vh" width="830px" center
    class="configure_box" :before-close="resetFun">
    <!--流程审核人配置-->
    <el-form :inline="true" :model="form" class="person_form" v-show="type==1">
      <el-form-item label="名称：">
        <el-input v-model="form.ModuleName" placeholder="审核人" size="small"></el-input>
      </el-form-item>
      <el-form-item label="当审核不通过时，流程：">
        <el-select v-model="form.ToId" placeholder="结束"  size="small">
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
        <el-input v-model="form.ModuleName" placeholder="操作员" size="small"></el-input>
      </el-form-item>
    </el-form>

    <div class="card_box">
      <el-tabs type="border-card" v-model="activeName">
        <!--按人员选择-->
        <el-tab-pane label="按人员选择" name="1">
          <el-form :inline="true" :model="personForm" ref="personForm" class="condition_form">
            <el-form-item label="部门：" prop="department">
              <el-select v-model="personForm.department" placeholder="请选择" size="small" @change="getPostInfo" >
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in department" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="岗位：" prop="post">
              <el-select v-model="personForm.post" placeholder="请选择" size="small" @change="getPostPeopleInfo" >
                <el-option v-for="(item,index) in post" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名：" prop="person">
              <el-select v-model="personForm.person" placeholder="请选择"  size="small" @change="getPerson1Data" >
                <el-option v-for="(item,index) in person1" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <check-nodes ref="peopleChild"></check-nodes>
        </el-tab-pane>
        <!--按角色选择-->
        <el-tab-pane label="按角色选择" name="2">
          <el-form :inline="true" :model="roleForm" ref="roleForm" class="condition_form">
            <el-form-item label="角色：" prop="role">
              <el-select v-model="roleForm.role" placeholder="请选择"  size="small" @change="getRolePeopleInfo" >
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in getRoles" :label="item.Name" :value="item.Id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <check-nodes ref="roleChild"></check-nodes>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" v-show="type==1" @click="saveFun2">确认</el-button>
      <el-button size="mini" type="primary" v-show="type==2" @click="saveFun1">确认</el-button>
      <el-button size="mini" @click="cancleFun">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Bus from '@/utils/bus'
  import CheckNodes from './CheckNodes'
  import { UpdateProcessModuleInfo, CacheComboBoxByPIdZhuanYong, ComboBoxListByRoseZhuanYong, ComboBoxListZhuanYong } from "@/api/operationFlow"
  import { getRoles } from "@/api/role"
  import { ComboBoxList } from "@/api/organize"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "configureDialog",
    components:{CheckNodes:CheckNodes},
    data() {
      return {
        activeName:'1',
        choseItem:[],
        module:{},
        configVisible: false,
        type: 1,//1 流程节点配置, 2 公用审核组配置 3: 操作员配置
        title:'配置',
        form:{//模型组对象
          Id:'',
          ModuleName:'',
          ToId:'',
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
        person1:[],//岗位姓名下拉
        person2:[],//角色姓名下拉
        personForm:{//按人员查
          department:'',
          post:'',
          person:''
        },
        roleForm:{//按角色查
          role:'',
          person:''
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
        this.$refs.peopleChild.type = 1;
        CacheComboBoxByPIdZhuanYong({SYS_Department_Id:val}).then(res => {
          if (res.code ==0 ) {
            this.post = res.data
            res.data.length >1 ? this.post.unshift({Name:'全部',Id:'-1'}):''//手动添加岗位全选
            if(val == -1){//选择全部时,每次下拉切换不替换原始数据，模拟模糊查询根据当前选中ID匹配控制复选框显示与否
              this.department.forEach(i=>{
                i.hide = true
              })
              this.$refs.peopleChild.data = this.department
              this.$refs.peopleChild.ifSow = true//控制复选框全选按钮显示隐藏
            }else{
              this.$refs.peopleChild.ifSow = false
              this.department.forEach(item => {//模拟模糊查询,过滤不显示的复选框
                if (item.Id == val) {
                  item.hide = true
                } else {
                  item.hide = false
                }
              })
              this.$refs.peopleChild.data = this.department
            }
            this.$refs.peopleChild.type = 1
            this.personForm.post = ''
            this.personForm.person = ''
            this.person1 = []
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPostPeopleInfo(val){//根据岗位获取姓名
        this.$refs.peopleChild.type = 2;
        ComboBoxListZhuanYong({PId:val}).then(res => {
          if (res.code ==0 ) {
            this.$refs.peopleChild.data = []

            this.person1 = res.data
            res.data.length >1 ? this.person1.unshift({Name:'全部',Id:'-1'}) : ''//手动添加岗位姓名全选
            if(val == -1){//选择全部时
              this.post.forEach(i=>{
                i.hide = true
              })
              this.$refs.peopleChild.data = this.post
              this.$refs.peopleChild.ifSow = true//控制复选框全选按钮显示隐藏
            }else{
              this.$refs.peopleChild.ifSow = false
              this.post.forEach(item => {//模拟模糊查询,过滤不显示的复选框
                if (item.Id == val) {
                  item.hide = true
                } else {
                  item.hide = false
                }
              })
              this.$refs.peopleChild.data = this.post
            }
            this.$refs.peopleChild.type = 2
            this.personForm.person1 = ''
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPerson1Data(val){//岗位人员联动
        this.$refs.peopleChild.type = 3;
        this.$refs.peopleChild.data = []
        if(val == -1){//选择全部时，
          this.person1.forEach(i=>{
            i.hide = true
          })
          this.$refs.peopleChild.data = this.person1
          this.$refs.peopleChild.ifSow = true//控制复选框全选按钮显示隐藏
        }else{
          this.$refs.peopleChild.ifSow = false//控制复选框全选按钮显示隐藏
          this.person1.forEach(item => {//模拟模糊查询,过滤不显示的复选框
            if (item.Id == val) {
              item.hide = true
            } else {
              item.hide = false
            }
          })
          this.$refs.peopleChild.data = this.person1
        }
      },
      getRolePeopleInfo(val){//根据角色获取姓名
        this.$refs.roleChild.type = 4;
        ComboBoxListByRoseZhuanYong({PId:val}).then(res => {
          this.$refs.roleChild.data = []
          if (res.code ==0 ) {
            this.person2 = res.data
            res.data.length >1 ? this.person2.unshift({Name:'全部',Id:'-1'}):''//手动添加角色姓名全选
            if(val == -1){//全选
              this.getRoles.forEach(i=>{
                i.hide = true
              })
              this.$refs.roleChild.data = this.getRoles
              this.$refs.roleChild.ifSow = true//控制复选框全选按钮显示隐藏
            }else{
              this.$refs.roleChild.ifSow = false//控制复选框全选按钮显示隐藏
              this.getRoles.forEach(item => {//模拟模糊查询,过滤不显示的复选框
                if (item.Id == val) {
                  item.hide = true
                } else {
                  item.hide = false
                }
              })
              this.$refs.roleChild.data = this.getRoles
            }
            this.roleForm.person = ''
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      saveFun1(){//公用模块保存
        this.module.Members = []
        let choseData = this.$refs.peopleChild.persons
        choseData.forEach(item=>{
          if(item.isSow){
            let obj = {
              Id: '',
              ConfigType: item.ProcessMemberType,
              ObjectId: item.Id,
              ObjectName: item.Name
            }
            this.module.Members.push(obj)
          }
        })
        this.module.ModuleName = this.form.ModuleName
        UpdateProcessModuleInfo(this.module).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
            this.resetFun()
            Bus.$emit('getNewInfo')
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      saveFun2(){//流程保存
        this.module.Members = []
        let choseData = this.$refs.peopleChild.persons
        choseData.forEach(item=>{
          if(item.isSow){
            let obj = {
              Id: '',
              ConfigType: item.ProcessMemberType,
              ObjectId: item.Id,
              ObjectName: item.Name
            }
            this.module.Members.push(obj)
          }
        })
        this.module.ModuleName = this.form.ModuleName
        console.log(this.module)
      },
      cancleFun(){
        localStorage.removeItem('choseData');
        this.resetFun()
      },
      resetFun(){
        this.activeName = '1'
        this.configVisible = false
        this.$refs.peopleChild.data = []
        this.$refs.roleChild.data = []
        this.$refs['roleForm'].resetFields();
        this.$refs['personForm'].resetFields();
      }
    },
    mounted() {
      Bus.$off('NodesSetFun')
      Bus.$off('setCheckList')
      Bus.$off('deleteCheckList')
      Bus.$off('addCheckList')
      Bus.$on('NodesSetFun', (msg) => {//触发流程节点配置
        this.type = msg.type
        this.module = msg.item
        this.form.ModuleName = msg.item.ModuleName
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
        setTimeout(()=>{
          this.$refs.peopleChild.getLocalData(msg.item.Members)
          this.$refs.roleChild.getLocalData(msg.item.Members)
        },200)
      })
      Bus.$on('setCheckList', () => {//从父级页面整合两个模块中所选择的复选框数据
          let checkData = this.$refs.peopleChild.checkList1.concat(this.$refs.peopleChild.checkList2,this.$refs.peopleChild.checkList3,this.$refs.roleChild.checkList4)
          this.$refs.peopleChild.getCheckListData(checkData)
          this.$refs.roleChild.getCheckListData(checkData)

      })
      Bus.$on('deleteCheckList', (data) => {//从父级页面触发子页面复选框删除事件
        switch (data.ProcessMemberType) {
          case 3001:// 部门
            this.$refs.peopleChild.checkList1.forEach((item, index) => {
              if (item === data.Id)
                this.$refs.peopleChild.checkList1.splice(index, 1);
              this.$refs.peopleChild.handlecheckListChange1(this.$refs.peopleChild.checkList1)
            })
            break
          case 3002://岗位
            this.$refs.peopleChild.checkList2.forEach((item, index) => {
              if (item === data.Id)
                this.$refs.peopleChild.checkList2.splice(index, 1);
              this.$refs.peopleChild.handlecheckListChange2(this.$refs.peopleChild.checkList2)
            })
            break
          case 3003://角色
            this.$refs.roleChild.checkList4.forEach((item, index) => {
              if (item === data.Id)
                this.$refs.roleChild.checkList4.splice(index, 1);
              this.$refs.roleChild.handlecheckListChange4(this.$refs.roleChild.checkList4)
            })
            break
          case 3004://姓名
            this.$refs.peopleChild.checkList3.forEach((item, index) => {
              if (item === data.Id)
                this.$refs.peopleChild.checkList3.splice(index, 1);
              this.$refs.peopleChild.handlecheckListChange3(this.$refs.peopleChild.checkList3)
            })
            break
        }
      })
      Bus.$on('addCheckList', (data) => {//记录存储数据加载到本地已选择的复选框中
        data.forEach(item => {
          switch (item.ConfigType) {
            case 3001://部门
              this.$refs.peopleChild.checkList1.push(item.ObjectId)
              break;
            case 3002://岗位3002
              this.$refs.peopleChild.checkList2.push(item.ObjectId)
              break;
            case 3003://角色
              this.$refs.roleChild.checkList4.push(item.ObjectId)
              break;
            case 3004://岗位姓名 角色姓名
              this.$refs.peopleChild.checkList3.push(item.ObjectId)
              break;
          }
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
      .el-tabs__content{padding: 0;}
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
