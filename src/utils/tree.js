/**
 * Created by chenli on 19/10/29.
 */
/**
 * Parse the time to string
 * @param {(Object)} theTree
 * @param {string} manualNode node节点
 * @returns {string} alwaysExpand 是否展开
 */
export function treeClickChecked(theTree, manualNode, alwaysExpand) {
  let Nodes = theTree.store._getAllNodes()//获取所有节点
  console.log(Nodes)

  manualNode.forEach((item)=>{//过来当前模糊查询所匹配节点
    Nodes.forEach((key,index) =>{
      if(key.data.Id === item){
        theTree.store._getAllNodes()[0].expanded = true
        if(!theTree.store._getAllNodes()[index].expanded){//手动选中当前筛选节点
          //theTree.store._getAllNodes()[index].expanded = true
        }
      }
    })
  })


 /* for(var i=0;i<theTree.store._getAllNodes().length;i++){
    theTree.store._getAllNodes()[i].expanded = !theTree.store._getAllNodes()[i].expanded;
  }*/

/*

  for(var i=0;i<this.$refs.selectTree.store._getAllNodes().length;i++){
    this.$refs.selectTree.store._getAllNodes()[i].expanded = false;
  }

  var store = theTree.store
  store.setCurrentNode(manualNode)
  theTree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode)
  if (alwaysExpand) {

    if (theTree.currentNode.expanded) {
      // do nothing
    } else {
      theTree.currentNode.handleExpandIconClick()
    }
  } else {
    if (theTree.expandOnClickNode) {
      theTree.currentNode.handleExpandIconClick()
    }
  }
  theTree.$emit('node-click', manualNode.data, manualNode, theTree)
*/

}
