<template>
  <div>
    <div v-for="(item,index) in sojList" :key="index">
      <el-form-item label="部门" label-width="100px" :class="item.SYS_Department_Id==''&&isFlag?'on':''" style="position: relative">
        <span style="position: absolute;color: #F56C6C;left: -42px;top:3px;">*</span>
        <span v-show="item.SYS_Department_Id==''&&isFlag"
              style="position: absolute;color: #F56C6C;left: 0px;top:20px;font-size: 12px;">不能为空</span>
        <el-select v-model="item.SYS_Department_Id" placeholder="请选择" size="small"
                   @change="getPostList(item.SYS_Department_Id,index)">
          <el-option
            v-for="(items,indexs) in item.depart"
            :key="indexs"
            :label="items.Name"
            :value="items.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" label-width="100px" :class="item.OA_Job_Id==''&&isFlag?'on':''" style="position: relative">
        <span style="position: absolute;color: #F56C6C;left: -42px;top:3px;">*</span>
        <span v-show="item.OA_Job_Id==''&&isFlag"
              style="position: absolute;color: #F56C6C;left: -0px;top:20px;font-size: 12px;">不能为空</span>
        <el-select v-model="item.OA_Job_Id" placeholder="请选择" size="small" @change="recurFun(index)">
          <el-option
            v-for="(items,indexs) in item.post"
            :key="indexs"
            :label="items.Name"
            :value="items.Id"
          />
        </el-select>
        <span class="el-icon-minus" v-show="index<=sojList.length-2"
              style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold;position: absolute;right: -25px;top:-5px"
              @click="reduceFun(index)"/>
        <span class="el-icon-minus" v-show="index==sojList.length-1 && sojList.length>1"
              style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold;position: absolute;right: -25px;top:-5px"
              @click="reduceFun(index)"/>
        <span class="el-icon-plus" v-show="index==sojList.length-1"
              style="margin: 10px 0 0 8px;font-size: 14px;cursor: pointer;color: #00B3A1;font-weight: bold;position: absolute;right: -25px;top:-5px"
              @click="addFun"/>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  import { ComboBoxList, linkComboBoxList} from "@/api/organize"
  export default {
    name: "PostInfo",
    data() {
      return {
        sojList: [//岗位信息初始化
          {
            SYS_Department_Id: '',
            OA_Job_Id: '',
            post: [],
            depart: []
          }
        ],
        isFlag:false
      }
    },
    methods: {
      getComboBoxList() {//获取部门信息
        ComboBoxList().then(res => {
          if (res.code == 0) {
            for (let i = 0; i < this.sojList.length; i++) {
              this.sojList[i].depart = res.data
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      reduceFun(index) {//删除部门
        this.sojList.splice(index, 1);//从start的位置开始向后删除delCount个元素
        this.getComboBoxList()
      },
      addFun() {//增加部门
        this.sojList.push({//新增一条空数据
          Id: '',
          OA_EmployeeName: '',
          OA_Employee_Id: '',
          OA_JobName: '',
          OA_Job_Id: '',
          SYS_DepartmentName: '',
          SYS_Department_Id: '',
          SYS_User_Id: '',
          post: [],
          depart: []
        })
        this.isFlag = false;
        this.getComboBoxList()
      },
      recurFun(index) {//添加岗位部门信息去重
        let arr = []
        for (let i = 0; i < this.sojList.length; i++) {
          arr.push(this.sojList[i].OA_Job_Id)
        }
        var nary = arr.sort();
        for (var i = 0; i < nary.length - 1; i++) {
          if (nary[i] == nary[i + 1] && nary[i] != '') {
            this.$message({
              message: '个人所属岗位不能重复',
              type: 'warning',
              duration: 4000
            });
            this.sojList[index].OA_Job_Id = ''
          }
        }
      },
      getPostList(id, index, type) {
        let params = {SYS_Department_Id: id}
        linkComboBoxList(params).then(res => {
          if (res.code == 0) {
            for (let i = 0; i < this.sojList.length; i++) {
              if (i == index) {
                this.sojList[i].post = res.data
                if (type != 0) {//编辑部门时候初始化岗位
                  this.sojList[i].OA_Job_Id = ''
                }
              }
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      }
    },
    mounted() {
      this.getComboBoxList()//初始赋值岗位数据
    }
  }
</script>
