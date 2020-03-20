<template>
  <div class="result_box">
    <p v-for="(item,index) in data1" :key="index" v-if="item.Id != -1&&curtype==1" :title="item.Title" :id="item.Id">
      <i class="iconfont iconrenyuan" v-if="item.ProcessMemberType===3004"></i>
      <i class="iconfont icongangwei" v-else-if="item.ProcessMemberType===3001"></i>
      <i class="iconfont iconlujing" v-else-if="item.ProcessMemberType===3002"></i>
      <i class="iconfont iconlujing" v-else></i>
      <span>{{ item.Name }}</span>
      <label class="iconfont iconguanbi fr" @click="removeFun(item.Id)"></label>
    </p>
    <p v-for="(item,index) in data2" :key="index" v-if="item.Id != -1&&curtype==2" :title="item.Title" :id="item.Id">
      <i class="iconfont iconrenyuan" v-if="item.ProcessMemberType===3004"></i>
      <i class="iconfont icongangwei" v-else-if="item.ProcessMemberType===3001"></i>
      <i class="iconfont iconlujing" v-else-if="item.ProcessMemberType===3002"></i>
      <i class="iconfont iconlujing" v-else></i>
      <span>{{ item.Name }}</span>
      <label class="iconfont iconguanbi fr" @click="removeFun(item.Id)"></label>
    </p>
  </div>
</template>

<script>
  import { UpdateProcessModuleInfo, CacheComboBoxByPIdZhuanYong, ComboBoxListByRoseZhuanYong, ComboBoxListZhuanYong } from "@/api/operationFlow"
  import { getRoles } from "@/api/role"
  import { ComboBoxList } from "@/api/organize"
  export default {
    name: "Result",
    props: ['curtype'],
    data(){
      return {
        data1:[],
        data2:[],
      }
    },
    methods: {
      removeFun(data) {
        console.log(data)
      },
      getCheckListData(data){//获取总选择数据集合
        this.data1=[]
        if(this.curtype==1){
          this.data1.forEach(k => {
            if (data.length == 0) {
              k.isSow = false
              document.getElementById(k.Id).style.display = 'none'
            } else {
              for(let  i =0;i<data.length;i++){
                if(data[i]==k.Id){
                  k.isSow = true
                  document.getElementById(k.Id).style.display = 'block'
                  return
                }else{
                  k.isSow = false
                  document.getElementById(k.Id).style.display = 'none'
                }
              }
            }
          })
        }else{
          this.data2.forEach(k => {
            if (data.length == 0) {
              k.isSow = false
              document.getElementById(k.Id).style.display = 'none'
            } else {
              for(let  i =0;i<data.length;i++){
                if(data[i]==k.Id){
                  k.isSow = true
                  document.getElementById(k.Id).style.display = 'block'
                  return
                }else{
                  k.isSow = false
                  document.getElementById(k.Id).style.display = 'none'
                }
              }
            }
          })
        }
      },
      getTotalInfo(funName,type){//获取全部数据
        let obj = {}
        switch (type) {
          case 3:
            obj = {SYS_Department_Id: '-1'}
            break
          case 4:
            obj = {PId: '-1'}
            break
          case 5:
            obj = {PId: '-1'}
            break
        }
        funName(obj).then(res => {
          if (res.code ==0 ) {
            res.data.forEach(i=>{
              i.isSow = true
              document.getElementById(i.Id).style.display = 'none'
              switch (type) {
                case 1:
                  this.data2.push(i)
                  break
                case 2:
                  this.data1.push(i)
                  break
                case 3:
                  this.data1.push(i)
                  break
                case 4:
                  this.data1.push(i)
                  break
                case 5:
                  this.data2.push(i)
                  break
              }
            })
          }
        })
      }

    },
    mounted() {
      this.$nextTick(()=>{
        this.getTotalInfo(getRoles,1)//角色
        this.getTotalInfo(ComboBoxList,2)//部门
        this.getTotalInfo(CacheComboBoxByPIdZhuanYong,3)//岗位
        this.getTotalInfo(ComboBoxListZhuanYong,4)//岗位姓名
        this.getTotalInfo(ComboBoxListByRoseZhuanYong,5)//角色姓名
      })
    }
  }
</script>
<style lang="scss">
  .result_box {
    padding: 18px;

    > p {
      position: relative;
      color: #777C82;
      font-size: 14px;
      display: inline-block;
      margin: 0 10px 10px 0;
      width: 140px;
      padding: 5px 10px;
      background: #F5F5F5;
      cursor: pointer;

      i {
        margin: -8px 2px 0 0;
        vertical-align: middle;
        display: inline-block;
      }

      span {
        display: inline-block;
        width: 78px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      label {
        cursor: pointer
      }
    }

    > p:nth-child(3n) {
      margin-right: 0;
    }
  }
</style>

