<template>
  <div class="condition_result">
    <div>
      <div v-show="type === 1" class="check_box">
        <leftCheckBox :data="data" :ifSow="ifSow" :type="type" ref="checkBoxChild1" v-on:setListData = setListIndo></leftCheckBox>
      </div>
      <div v-show="type ===2" class="check_box">
        <leftCheckBox :data="data" :ifSow="ifSow" :type="type"  ref="checkBoxChild2"></leftCheckBox>
      </div>
      <div v-show="type ===3" class="check_box">
        <leftCheckBox :data="data" :ifSow="ifSow" :type="type"  ref="checkBoxChild3"></leftCheckBox>
      </div>
      <div v-show="type ===4" class="check_box">
        <leftCheckBox :data="data" :ifSow="ifSow" :type="type"  ref="checkBoxChild4"></leftCheckBox>
      </div>
      <div v-show="type ===5" class="check_box">
        <leftCheckBox :data="data" :ifSow="ifSow" :type="type"  ref="checkBoxChild5"></leftCheckBox>
      </div>
    </div>
    <result v-if="curtype==1" ref="resultChild1" :curtype="curtype"></result>
    <result v-else ref="resultChild2" :curtype="curtype"></result>
  </div>
</template>

<script>
  import leftCheckBox from './LeftCheckbox'
  import Bus from '@/utils/bus'
  import result from './Result'

  export default {
    name: "CheckNodes",
    components:{ leftCheckBox: leftCheckBox,result:result},
    data() {
      return {
        curtype:1,
        data:[],//复选框数据源
        ifSow:false,//控制复选框全选按钮显示隐藏
        type:1,//1 部门，2，岗位，3，岗位姓名，4，角色，5，角色姓名
        checkList1:[],//岗位选中项
        checkList2:[],//部门选中项
        checkList3:[],//岗位姓名选中项
        checkList4:[],//角色选中项
        checkList5:[],//角色姓名
      }
    },
    watch:{
      checkList1(){
        let personData = this.checkList2.concat(this.checkList3,this.checkList1)
        this.$refs.resultChild1.getCheckListData(personData)
        //this.getCheckListData(personData)
      },
      checkList2(){
        let personData = this.checkList1.concat(this.checkList3,this.checkList2)
        this.$refs.resultChild2.getCheckListData(personData)
        //this.getCheckListData(personData)
      },
      checkList3(){
        let personData = this.checkList1.concat(this.checkList2,this.checkList3)
        this.getCheckListData(personData)
      },
      checkList4(){
        let personData = this.checkList4.concat(this.checkList5)
        this.getCheckListData(personData)
      },
      checkList5(){
        let personData = this.checkList4.concat(this.checkList5)
        this.getCheckListData(personData)
      },
    },
    methods:{
      setListIndo(data){
        switch (data.type) {
          case 1:
            this.checkList1 = data.list
            break;
          case 2:
            this.checkList2 = data.list
            break;
          case 3:
            this.checkList3 = data.list
            break;
          case 4:
            this.checkList4 = data.list
            break;
          case 5:
            this.checkList5 = data.list
            break;
        }
      },
      removeFun(id){//删除前端暂存人员数据
        /*   this.checkList.forEach((item,index)=>{
             if(item === id)
               this.checkList.splice(index,1);
             this.handlecheckListChange(this.checkList)
           })*/
      },
    },
    mounted() {
      Bus.$off('setListData')
      Bus.$on('setListData', (msg) => {//接受当前子元素所选中的内容
        this.setListIndo(msg)
      })
    }
  }
</script>

<style scoped lang="scss">
  .condition_result {
    #ant{color: red}
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    .none{display: none}
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

  .condition_result >div:first-child{
    position: relative;
    padding: 18px;
    width: 270px;
    border-right: solid 1px #D8E2E7;
    height: 360px;
    overflow: auto;
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
