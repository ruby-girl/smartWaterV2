<template>
  <div class="cl-areatreeBox">
    <p><i></i><i></i><i></i><i></i></p>
    <ul id="userTree">
      <SubTree ref="subTreeChild" v-for="(item,index) in data" :treeData=item :key="index"></SubTree>
    </ul>
  </div>

</template>
<script>
  import SubTree from './SubTree'

  export default {
    name: 'AreaTree',
    components: {SubTree},
    data() {
      return {
        data: [],//树对象
        Id:'',//当前选中节点ID 用户数据回填
      }
    },
    watch:{
      data(){
        this.$nextTick(()=>{
          if(this.$refs.subTreeChild)
          this.$refs.subTreeChild[0].getParentId(this.Id,this.data[0])
        })
      }
    },
    methods:{
      /**
       * 获取选中节点数据
       * String Id: 选中节点ID
       * String Name: 选中节点及其所有父节点Name
       * */
      getParent(resultArry){
        let Obj = { Name:'', Id:'' }
        resultArry.forEach(item=>{
          Obj.Name  += item[0].label + " "
          item[1] ? Obj.Id = item[0].Id:''
        })
        this.$emit('watchChild', Obj)
      }
    }
  }
</script>
<style lang="scss">
  .cl-areatreeBox {
    .none {
      display: none
    }

    width: 100%;
    margin: 8px 0 0 0;
    box-shadow: 1px 1px 5px #cecece;
    height: 180px;
    overflow: hidden;
    position: absolute;
    z-index: 9;
    background: #fff;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    padding: 0;

    #userTree {
      width: 100%;
      height: 180px;
      overflow: auto;
      position: relative;
      padding: 10px 0;
      margin: 0;

      > li {
        height: 30px;
        position: relative;
        width: 20%;
        text-align: center;

        > ul {
          position: absolute;
          left: 100%;
          top: 0;
          padding: 0;
          width: 100%;

          > li {
            > ul {
              position: absolute;
              left: 100%;
              top: 0;
              padding: 0;
              width: 100%;

              > li {
                > ul {
                  position: absolute;
                  left: 100%;
                  top: 0;
                  padding: 0;
                  width: 100%;

                  > li {
                    > ul {
                      position: absolute;
                      left: 100%;
                      top: 0;
                      padding: 0;
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
        }

      }
    }

    p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;

      i {
        height: 100%;
        border-right: solid 1px #ebeeef;
        display: inline-block;
        float: left;
        margin-left: 20%
      }
    }

    li {
      list-style-type: none;
      color: #5B5B5B;
      font: normal 14px/30px 'Microsoft YaHei';
      cursor: pointer;
      padding: 0 10px;

      i {
        float: right;
        margin-top: 8px;
      }
    }

    li.on {
      color: #00B3A1;

      > span {
        > i {
          color: #00B3A1;
        }
      }
    }
  }
</style>
