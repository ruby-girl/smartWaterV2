<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    custom-class="nopadding"
    :title="dialogStatus==='create'?'添加':'编辑'"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="10vh"
    width="1000px"
    center
    @open="opened"
  >
    <div class="role-top-box">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        class="form-inline-small-input head-search-form"
        size="small"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="temp.RoleName" maxlength="20" placeholder="长度20内" />
        </el-form-item>
      </el-form>
    </div>
    <div class="config-box">
      <div class="role-title">权限分配</div>
      <div class="config-container">
        <div v-for="(item,i) in arr" class="show-border">
          <div class="config-title">
            <el-checkbox
              :indeterminate="item.isIndeterminate"
              v-model="item.checked"
              @change="handleCheckedOne()"
            >{{item.name}}</el-checkbox>
          </div>
          <!-- 子集 循环 二级 body-->
          <div class="config-item" v-for="(temp,i) in item.child">
            <div
              v-if="temp.childrens.length<1"
              class="config-body-box display-flex align-items-center"
            >
              <div class="config-body-left">
                <el-checkbox :indeterminate="temp.isIndeterminate" :label="temp.nId" v-model="temp.checked" @change="handleCheckedTwo()">{{temp.name}}</el-checkbox>
              </div>
              <div class="config-body-right display-flex flex-wrap">
                <el-checkbox
                  v-model="btn.checked"
                  :label="btn.nId"
                  v-for="(btn,n) in temp.button"
                   @change="handleCheckedThree()"
                >{{btn.name}}</el-checkbox>
              </div>
            </div>
            <div v-else class="config-body-box">
              <!-- 有3级的第二个父级 -->
              <div class="display-flex align-items-center config-item">
                <div class="config-body-left">
                  <el-checkbox
                    :indeterminate="temp.isIndeterminate"
                    v-model="temp.checked"
                    @change="handleCheckedTwo()"
                  >{{temp.name}}</el-checkbox>
                </div>
                <div class="config-body-right display-flex flex-wrap">
                  <div>&nbsp;</div>
                </div>
              </div>
              <!-- 循环第3级 s-->
              <div class="config-item" v-for="(last,i) in temp.childrens">
                <div class="config-body-box display-flex align-items-center">
                  <div class="config-body-left three-title">
                    <el-checkbox :indeterminate="last.isIndeterminate" v-model="last.checked" :label="last.nId">{{last.name}}</el-checkbox>
                  </div>
                  <div class="config-body-right display-flex flex-wrap">
                    <el-checkbox @change="handleCheckedThree(n)"
                      v-model="btn.checked"
                      :label="btn.nId"
                      v-for="(btn,n) in last.button"
                    >{{btn.name}}</el-checkbox>
                  </div>
                </div>
              </div>
              <!-- 循环第3级 e-->
            </div>
          </div>
          <!-- 子集 -->
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        @click="dialogStatus==='create'?createData():updateData()"
      >确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogStatus: {
      type: String,
      default: function() {
        return "";
      }
    },
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        RoleName: [
          { required: true, message: "不能为空", trigger: "blur" },
          { max: 20, message: "最大长度20个字符", trigger: "blur" }
        ]
      },
      arr: [
        {
          name: "权限管理",
          checked: false,
          isIndeterminate: false,
          child: [
            {
              name: "账号管理",
              childrens: [],
              nId: 1,
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "添加", nId: 11, checked: false },
                { name: "编辑", nId: 22, checked: false }
              ]
            },
            {
              name: "角色管理",
              childrens: [],
              nId: 2,
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "添加", nId: 33, checked: false },
                { name: "编辑", nId: 44, checked: false }
              ]
            }
          ]
        },
        {
          name: "业务管理",
          checked: false,
          isIndeterminate: false,
          child: [
            {
              name: "抄表查询",
              checked: false,
              isIndeterminate: false,
              childrens: [
                {
                  name: "按抄表计划查询",
                  checked: false,
                  isIndeterminateThree: false,
                  button: [{ name: "删除",checked: false }]
                },
                {
                  name: "按抄表日期查询",
                  checked: false,
                  isIndeterminateThree: false,
                  button: [{ name: "删除", checked: false }]
                }
              ],
              button: []
            },
            {
              name: "抄表设置",
              childrens: [],
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "删除抄表记录",checked: false },
                { name: "抄表录入确定",checked: false }
              ]
            }
          ]
        }
      ],
      dialogFormVisible: false
    };
  },
  watch: {
    show() {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:show", val);
    }
  },
  methods: {
    opened() {
      let obj = {
        checked: false,
        isIndeterminate: false
      };
      this.arr = this.arr.map(item => {
        return { ...item, ...obj };
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        this.$emit("createData", this.temp);
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        this.$emit("updateData", this.temp);
      });
    },
    handleCheckedThree(){//按钮勾选  
       this.arr.forEach((item,i)=>{
        item.child.forEach(n=>{
          let btnCheckedArr=n.button.filter(m=>{
            return m.checked
          })
          if(btnCheckedArr.length==n.button.length){
            n.button.forEach(m=>{
              m.checked=true//按钮全选
              n.checked=true
              n.isIndeterminate=false
            })
            item.checked=true
            item.isIndeterminate=false
          }else if(btnCheckedArr.length==0){
            // m.checked=false        
            n.checked=false
            n.isIndeterminate=false
          }else{
            
            // n.checked=false
            // n.isIndeterminate=true
          }
        })   
      })
    },
    handleCheckedTwo() {
      this.arr.forEach((item,i)=>{
        let checkedArr=item.child.filter(i=>{//二级勾选
          return i.checked
        })
        if(checkedArr.length==item.child.length){//二级全选
          this.arr[i].checked=true//一级全选
          this.arr[i].isIndeterminate=false//
           this.arr[i].child.forEach(n=>{
            n.button.forEach(m=>{//按钮全选
              m.checked=true
            })
           })
        }else if(checkedArr.length==0){
          this.arr[i].checked=false//一级全选
          this.arr[i].isIndeterminate=false//
           this.arr[i].child.forEach(n=>{
            n.button.forEach(m=>{//按钮全选
              m.checked=false
            })
           })
        }else{
          this.arr[i].checked=false//一级全选 false
          this.arr[i].isIndeterminate=true//
           this.arr[i].child.forEach(n=>{
            n.button.forEach(m=>{//按钮
             if(n.checked){
               m.checked=true
             }else{
               m.checked=false
             }
         
            })
           })
        }   
      })
    },
    handleCheckedOne() {}
  }
};
</script>
<style lang="scss" scoped>
.role-top-box {
  border-bottom: 10px solid #eff1f4;
  padding: 20px 0 10px 0;
}
.role-title {
  color: #5b5b5b;
  font-size: 16px;
  font-weight: bold;
  border-left: 4px solid #29beb0;
  padding-left: 10px;
}
.config-box {
  padding: 16px 19px;
}
.config-container {
  border: 1px solid #e2e9ed;
  border-bottom: none;
  .config-title {
    background: #c2d6c7;
    color: #535353;
    padding: 9px 10px;
  }
  .config-body-box {
    line-height: 39px;
  }
  .config-body-left {
    padding-left: 30px;
    width: 235px;
  }
  .config-body-right {
    padding: 0 10px;
    border-left: 1px solid #e2e9ed;
  }
  .three-title {
    padding-left: 50px;
  }
}
.show-border {
  .config-item {
    border-bottom: 1px solid #e2e9ed;
    .config-item:last-child {
      border-bottom: none;
    }
  }
}
</style>

