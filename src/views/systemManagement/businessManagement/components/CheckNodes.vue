<template>
  <div class="condition_result">
    <div v-show="type === 1" class="check_box">
      <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1" v-show="data.length>1&&ifSow">全选</el-checkbox>
      <el-checkbox-group v-model="checkList1" @change="handlecheckListChange1">
        <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title" v-show="item.hide&&item.Id != -1">
          <div>{{item.Name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-show="type === 2" class="check_box">
      <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2" v-show="data.length>1&&ifSow">全选</el-checkbox>
      <el-checkbox-group v-model="checkList2" @change="handlecheckListChange2">
        <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title" v-show="item.hide&&item.Id != -1">
          <div>{{item.Name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-show="type === 3" class="check_box">
      <el-checkbox :indeterminate="isIndeterminate3" v-model="checkAll3" @change="handleCheckAllChange3" v-show="data.length>1&&ifSow">全选</el-checkbox>
      <el-checkbox-group v-model="checkList3" @change="handlecheckListChange3">
        <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title" v-show="item.hide&&item.Id != -1">
          <div>{{item.Name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div v-show="type === 4" class="check_box">
      <el-checkbox :indeterminate="isIndeterminate4" v-model="checkAll4" @change="handleCheckAllChange4" v-show="data.length>1&&ifSow">全选</el-checkbox>
      <el-checkbox-group v-model="checkList4" @change="handlecheckListChange4">
        <el-checkbox v-for="(item,index) in data" :label="item.Id" :key="index" :title="item.Title" v-show="item.hide&&item.Id != -1">
          <div>{{item.Name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div class="result_box">
      <div>
        <p v-for="(item,index) in persons" :key="index" v-if="item.Id != -1" :title="item.Title" v-show="item.isSow">
          <i class="iconfont iconrenyuan" v-if="item.ProcessMemberType===3004"></i>
          <i class="iconfont icongangwei" v-else-if="item.ProcessMemberType===3001"></i>
          <i class="iconfont iconlujing" v-else-if="item.ProcessMemberType===3002"></i>
          <i class="iconfont iconjiaose" v-else></i>
          <span>{{ item.Name }}</span>
          <label class="iconfont iconguanbi fr" @click="removeFun(item)"></label>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { CacheComboBoxByPIdZhuanYong, ComboBoxListByRoseZhuanYong, ComboBoxListZhuanYong } from "@/api/operationFlow"
  import { getRoles } from "@/api/role"
  import { ComboBoxList } from "@/api/organize"
  import Bus from '@/utils/bus'

  export default {
    name: "CheckNodes",
    data() {
      return {
        checkAll1:false,
        checkAll2:false,
        checkAll3:false,
        checkAll4:false,
        isIndeterminate1:false,
        isIndeterminate2:false,
        isIndeterminate3:false,
        isIndeterminate4:false,
        checkList1: [],//岗位
        checkList2: [],//部门
        checkList3: [],//右侧信息汇总
        checkList4: [],//右侧信息汇总
        data:[],//复选框数据源
        ifSow:false,//控制复选框全选按钮显示隐藏
        type:1,//1 部门，2，岗位，3，岗位姓名，4，角色，5，角色姓名
        persons:[],
      }
    },
    watch:{
      data:{
        handler(newVal,oblVal){//3001 部门 3002 岗位 3004 姓名 3003 角色
          let dataType;
          if(newVal[1]){
            dataType = newVal[1].ProcessMemberType

            switch (dataType) {//回填全部样式
              case 3001:
                this.checkAll1 =  this.checkList1.length == newVal.length;
                let checkedCount = this.checkList1.length
                this.isIndeterminate1 = checkedCount > 0 && checkedCount < newVal.length;//控制全选按钮样式
                break
              case 3002:
                this.checkAll2 =  this.checkList2.length == newVal.length;
                let checkedCount2 = this.checkList2.length
                this.isIndeterminate2 = checkedCount2 > 0 && checkedCount2 < newVal.length;//控制全选按钮样式
                break
              case 3003:
                this.checkAll3 =  this.checkList3.length == newVal.length;
                let checkedCount3 = this.checkList3.length
                this.isIndeterminate3 = checkedCount3 > 0 && checkedCount3 < newVal.length;//控制全选按钮样式
                break
              case 3004:
                this.checkAll4 =  this.checkList4.length == newVal.length;
                let checkedCount4 = this.checkList4.length
                this.isIndeterminate4 = checkedCount4 > 0 && checkedCount4 < newVal.length;//控制全选按钮样式
                break
            }
          }
        }
      },
      checkList1: {//部门下拉集合
        handler() {
          this.$nextTick(()=>{
            this.checkList1 = this.removeRepeat(this.checkList1)
            Bus.$emit('setCheckList')
          })
        }
      },
      checkList2: {//岗位下拉集合
        handler () {
          this.$nextTick(()=>{
            this.checkList2 = this.removeRepeat(this.checkList2)
            Bus.$emit('setCheckList')
          })
        }
      },
      checkList3: {//姓名下拉集合
        handler () {
          this.$nextTick(()=>{
            this.checkList3 = this.removeRepeat(this.checkList3)
            Bus.$emit('setCheckList')
          })
        }
      },
      checkList4: {//角色下拉集合
        handler () {
          this.$nextTick(()=>{
            this.checkList4 = this.removeRepeat(this.checkList4)
            Bus.$emit('setCheckList')
          })
        }
      },
    },
    methods:{
      getCheckListData(data){//获取总选择数据集合
        this.persons.forEach(k=>{
          if(data.length == 0)
              k.isSow = false
            for(let i=0;i<data.length;i++){
              if(data[i] === k.Id){
                k.isSow = true
                return
              }else {
                k.isSow = false
              }
            }
          })
      },
      handleCheckAllChange1(val) {//部门全选
        this.totalChose(1,val)
      },
      handleCheckAllChange2(val) {//全选
        this.totalChose(2,val)
      },
      handleCheckAllChange3(val) {//全选
        this.totalChose(3,val)
      },
      handleCheckAllChange4(val) {//全选
        this.totalChose(4,val)
      },
      totalChose(type,val){//公用全选
        switch(type){
          case 1:
            if(val){
              this.data.forEach(item=>{//显示所有hide属性为true的选项
                item.hide ? this.checkList1.push(item.Id) : ''
              })
            }else {
              this.checkList1 = []
            }
            this.isIndeterminate1 = false;
            break;
          case 2:
            if(val){
              this.data.forEach(item=>{//显示所有hide属性为true的选项
                item.hide ? this.checkList2.push(item.Id) : ''
              })
            }else {
              this.checkList2 = []
            }
            this.isIndeterminate2 = false;
            break;
          case 3:
            if(val){
              this.data.forEach(item=>{//显示所有hide属性为true的选项
                item.hide ? this.checkList3.push(item.Id) : ''
              })
            }else {
              this.checkList3 = []
            }
            this.isIndeterminate3 = false;
            break;
          case 4:
            if(val){
              this.data.forEach(item=>{//显示所有hide属性为true的选项
                item.hide ? this.checkList4.push(item.Id) : ''
              })
            }else {
              this.checkList4 = []
            }
            this.isIndeterminate4 = false;
            break;
        }
      },
      handlecheckListChange1(value) {//非全选
        let checkedCount = value.length;
        this.checkAll1 = checkedCount === this.data.length;
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.data.length;//控制全选按钮样式
      },
      handlecheckListChange2(value) {//非全选
        let checkedCount = value.length;
        this.checkAll2 = checkedCount === this.data.length;
        this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.data.length;//控制全选按钮样式
      },
      handlecheckListChange3(value) {//非全选
        let checkedCount = value.length;
        this.checkAll3 = checkedCount === this.data.length;
        this.isIndeterminate3 = checkedCount > 0 && checkedCount < this.data.length;//控制全选按钮样式
      },
      handlecheckListChange4(value) {//非全选
        let checkedCount = value.length;
        this.checkAll4 = checkedCount === this.data.length;
        this.isIndeterminate4 = checkedCount > 0 && checkedCount < this.data.length;//控制全选按钮样式
      },
      removeFun(data){//删除前端暂存人员数据
        Bus.$emit('deleteCheckList',data)
      },
      getLocalData(data){//记录存储数据加载到本地已选择的复选框中
        this.checkList1 = []
        this.checkList2 = []
        this.checkList3 = []
        this.checkList4 = []
         Bus.$emit('addCheckList',data)
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
        }
        funName(obj).then(res => {
          if (res.code ==0 ) {
            res.data.forEach(i=>{
              i.isSow = false
              switch (i.ProcessMemberType) {
                case 3002:
                  i.Title = i.Name
                  break
                case 3004:
                  let titleName = []
                  if(typeof (i.cbList) == 'undefined')
                    return false
                  i.cbList.forEach(i=>{//只有岗位人员信息需要匹配以下所属部门信息
                    titleName.push(i.Name)
                  })
                  i.Title = '所属岗位：'+ titleName.toString()
                  break
              }
              this.persons.push(i)
            })
          }
        })
      },
      removeRepeat(arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr.indexOf(arr[i]) != i) {
            arr.splice(i, 1);//删除数组元素后数组长度减1后面的元素前移
            i--;//数组下标回退
          }
        }
        return arr;
      }
    },
    created() {//初始化全部数据
      this.getTotalInfo(getRoles, 1)//角色
      this.getTotalInfo(ComboBoxList, 2)//部门
      this.getTotalInfo(CacheComboBoxByPIdZhuanYong, 3)//岗位
      this.getTotalInfo(ComboBoxListZhuanYong, 4)//岗位姓名
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
    .el-checkbox{font-size: 14px;color: #777C82;margin-bottom: 12px;display: block}
    .result_box {
      padding: 18px;
      p{
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
    //  p:nth-child(3n){margin-right: 0;}
    }
  }

  .condition_result .check_box {
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
