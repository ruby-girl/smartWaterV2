<template>
  <div class="condition_result">
    <div>
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkList" @change="handlecheckListChange">
        <el-checkbox v-for="(item,index) in data" :label="item.id" :key="index">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="result_box">
      <p v-for="(item,index) in persons" :key="index">
        <i class="iconfont iconrenyuan" v-if="item.type===1"></i>
        <i class="iconfont icongangwei" v-else-if="item.type===2"></i>
        <i class="iconfont iconlujing" v-else-if="item.type===3"></i>
        <i class="iconfont iconlujing" v-else></i>
        <span>{{ item.name }}</span>
        <label class="iconfont iconguanbi fr" @click="removeFun(item.id)"></label>
      </p>
    </div>
  </div>
</template>

<script>
  const cityOptions = ['1002', '1003', '1005', '1006'];

  export default {
    name: "CheckNodes",
    data() {
      return {
        checkAll:false,
        isIndeterminate:false,
        checkList: [],
        cities: cityOptions,
        data:[
          {
            type:1,
            name:'人员',
            id:'1002'
          },
          {
            type:2,
            name:'研发',
            id:'1003'
          },
          {
            type:3,
            name:'钢厂',
            id:'1005'
          },
          {
            type:4,
            name:'财务',
            id:'1006'
          }
        ],//复选框数据源
        persons:[]//右侧选中信息
      }
    },
    watch:{
      checkList() {//监听复选框选中内容，替换右侧人员信息
        this.persons = []
        let data = this.checkList
        let total = this.data
        data.forEach((item,index)=>{
          total.forEach((items,indexs)=>{
            if(item==items.id){
                this.persons.push(items)
            }
          })
        })
      }
    },
    methods:{
      handleCheckAllChange(val) {//全选
        this.checkList = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handlecheckListChange(value) {//非全选
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      removeFun(id){//删除前端暂存人员数据
        this.checkList.forEach((item,index)=>{
          if(item === id)
            this.checkList.splice(index,1);
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  .condition_result {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    .el-checkbox{display: block;font-size: 14px;color: #777C82;margin-bottom: 12px;}
    .result_box {
      padding: 18px;
      p{
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
      p:nth-child(3n){margin-right: 0;}
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
