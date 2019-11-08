<template>
  <li :key="treeData.Id" :data-id="treeData.Id">
    <span>{{treeData.label}} <i :class="treeData.children.length>0?'el-icon-caret-right':''"></i></span>
    <ul class="none" v-if="treeData.children.length>0">
      <SubTree v-for="(item,index) in treeData.children" :treeData = item :key="index"></SubTree>
    </ul>
  </li>
</template>
<script>
  export default {
    name: "SubTree",
    props: ['treeData'],
    methods: {
      /**
       * 遍历树状图数据，获取选中ID 及其所有父级ID
       * String keyword 传入选中ID
       * Object data 树对象
       * */
      getParentId(keyword, data) {
        let pidArr = []
        let flagArr = []
        flagArr.push({Id: data.Id, label: data.label})//当前节点ID，及label名
        flagArr.push(data.Id === keyword)//判断当前节点是否与选中节点Id一致，以下同上
        pidArr.push(flagArr)
        data.pidArr = pidArr//存放当前选中节点ID，，以下同上
        this.getChildId(keyword, data, pidArr)
      },
      getChildId(keyword, data, pidArr) {//如果节点有下级节点，则往下遍历获取每一层ID 是否与当前选中ID 相等
        let _this = this
        if (data.children.length) {
          data.children.map(item => {
            let flagArr = []
            flagArr.push({Id: item.Id, label: item.label})
            flagArr.push(item.Id === keyword)
            let newPidArr = [...pidArr, flagArr]
            item.pidArr = newPidArr
            this.getChildId(keyword, item, newPidArr)
          })
        } else {
          let resultArry = data.pidArr
          resultArry.forEach(item => {
            if (item[1]) {
              return _this.$parent.getParent(resultArry)//传递选中ID及起所有父级ID给父组建
            }
          })
        }
      },
      siblings(elem) { //参数elem就是想取谁的兄弟节点，就把那个元素传进去
        let nodes = []; //定义一个数组，用来存elem的兄弟元素
        let previ = elem.previousSibling;
        while (previ) { //先取o的哥哥们 判断有没有上一个哥哥元素，如果有则往下执行 previ表示previousSibling
          if (previ.nodeType === 1) {
            nodes.push(previ);
          }
          previ = previ.previousSibling; //最后把上一个节点赋给previ
        }
        nodes.reverse(); //把顺序反转一下 这样元素的顺序就是按先后的了
        let nexts = elem.nextSibling; //再取elem的弟弟
        while (nexts) { //判断有没有下一个弟弟结点 nexts是nextSibling的意思
          if (nexts.nodeType === 1) {
            nodes.push(nexts);
          }
          nexts = nexts.nextSibling;
        }
        return nodes; //最后按从老大到老小的顺序，把这一组元素返回
      }
    },
    mounted() {
      let _this = this, data = this.$parent.data
      this.$nextTick(() => {
        $('#userTree li').on('click', function (e) {
          e.stopPropagation()
          $(this).addClass('on')
          $(this).siblings().removeClass('on')
          $(this).children('ul').removeClass('none')

          $(this).siblings().children('ul').addClass('none')
          $(this).siblings().find('li').removeClass('on')
          $(this).siblings().find('ul').addClass('none')
          if ($(this).children('ul').length <= 0) {
            let curId = $(this).attr('data-id')
            _this.getParentId(curId, data[0])
          }
        });

      })
    }
  }
</script>
