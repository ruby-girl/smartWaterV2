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
  let matchNode = []//根据flag是否为TRUE 过滤选中节点及其所有父节点
  for (let i = manualNode.length - 1; i >= 0; i--) {
    if(manualNode[i][0].flag){
      matchNode.push(manualNode.slice(0,i+1))
      break
    }
  }

  if(matchNode.length>0)
    matchNode[0].forEach((item) => {//过来当前模糊查询所匹配节点
      Nodes.forEach((key, index) => {
        if (key.data.Id === item[0].Id) {
          theTree.store._getAllNodes()[0].expanded = true
          if (!theTree.store._getAllNodes()[index].expanded) {//手动选中当前筛选节点
               theTree.store._getAllNodes()[index].expanded = true
          }
        }else {
          theTree.store._getAllNodes()[index].expanded = false
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
