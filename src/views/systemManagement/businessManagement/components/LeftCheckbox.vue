<template>
  <div class="check_innerboxs">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                 v-show="data.length>1&&ifSow">全选
    </el-checkbox>
    <el-checkbox-group v-model="checkList" @change="handlecheckListChange">
      <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title"
                   v-show="item.hide&&item.Id != -1">
        <div>{{item.Name}}</div>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
  import Bus from '@/utils/bus'

  export default {
    name: "LeftCheckbox",
    props: ['data','ifSow','type'],
    data() {
      return {
        isIndeterminate:false,
        checkAll:false,
        checkList:[]
      }
    },
    watch:{
      data(){
        this.data.forEach(item=>{//动态添加右侧信息，title属性
          switch (item.ProcessMemberType) {
            case 3002:
              item.Title = item.Name
              break
            case 3004:
              let titleName = []
              if(typeof (item.cbList) == 'undefined')
                return false
              item.cbList.forEach(i=>{//只有岗位人员信息需要匹配以下所属部门信息
                titleName.push(i.Name)
              })
              item.Title = '所属岗位：'+ titleName.toString()
              break
          }
        })
      },
      checkList() {
        let obj = {
          list:this.checkList,
          type:this.type
        }
        Bus.$emit('setListData',obj)//可重复触发
      }
    },
    methods:{
      handleCheckAllChange(val){
        this.checkList = []
        if(val){
          this.data.forEach(item=>{//显示所有hide属性为true的选项
            item.hide ? this.checkList.push(item.Id) : ''
          })
        }else {
          this.checkList = []
        }
        this.isIndeterminate = false;
      },
      handlecheckListChange(value) {//非全选
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.data.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.data.length;//控制全选按钮样式
      }
    }
  }
</script>
<style lang="scss">
  .check_innerboxs {
    width: 100%;
    .el-checkbox{
      display: block;
      margin: 0px 0px 10px 0;
    }
  }
</style>
