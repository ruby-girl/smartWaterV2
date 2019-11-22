<template>
  <div class="condition_result">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" v-show="data.length>1&&data[0].hide">全选</el-checkbox>
      <el-checkbox-group v-model="checkList" @change="handlecheckListChange">
        <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title" v-show="item.hide&&item.Id != -1">
          <div>{{item.Name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="result_box">
      <p v-for="(item,index) in persons" :key="index" v-if="item.Id != -1" :title="item.Title">
        <i class="iconfont iconrenyuan" v-if="item.ProcessMemberType===3004"></i>
        <i class="iconfont icongangwei" v-else-if="item.ProcessMemberType===3001"></i>
        <i class="iconfont iconlujing" v-else-if="item.ProcessMemberType===3002"></i>
        <i class="iconfont iconlujing" v-else></i>
        <span>{{ item.Name }}</span>
        <label class="iconfont iconguanbi fr" @click="removeFun(item.Id)"></label>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CheckNodes",
    data() {
      return {
        checkAll:false,
        isIndeterminate:false,
        checkList: [],
        data:[],//复选框数据源
        persons:[],//右侧选中信息
      }
    },
    watch:{
      checkList() {//监听复选框选中内容
        this.persons = []
        let data = this.checkList
        let total = this.data
        data.forEach(item=>{
          total.forEach(items=>{
            if(item == items.Id){
                this.persons.push(items)
            }
          })
        })
      }
    },
    methods:{
      handleCheckAllChange(val) {//全选
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
      },
      removeFun(id){//删除前端暂存人员数据
        this.checkList.forEach((item,index)=>{
          if(item === id)
            this.checkList.splice(index,1);
            this.handlecheckListChange(this.checkList)
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .condition_result {
    #ant{color: red}
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    .none{display: none}
    .el-checkbox{font-size: 14px;color: #777C82;margin-bottom: 12px;display: block}
    .result_box {
      padding: 18px;
      >p{
        position: relative;
        color: #777C82;
        font-size: 14px;
        display: inline-block;
        margin: 0 10px 10px 0;
        width: 140px;
        padding: 5px 10px;
        background: #F5F5F5;
        cursor: pointer;
        i{margin: -8px 2px 0 0;vertical-align: middle;display: inline-block;}
        span{display: inline-block;width: 78px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
        label{cursor: pointer}
      }
      >p:nth-child(3n){margin-right: 0;}
    }
  }

  .condition_result >div:first-child {
    padding: 18px;
    width: 270px;
    border-right: solid 1px #D8E2E7;
    height: 360px;
    overflow: auto
  }

  .condition_result >div:last-child {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-flex: 1;;
    border-right: solid 1px #D8E2E7;
    height: 360px;
    overflow: auto
  }
</style>
