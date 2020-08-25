// 二叉树的遍历
/* 二叉树结构
    function TreeNode(){
        this.val = ...;
        this.left = this.right = null;
    }




*/



/*二叉树的前序遍历
https://leetcode-cn.com/problems/binary-tree-preorder-trave
rsal/solution/javascriptjie-qian-xu-bian-li-er-cha-shu-by-user77/

*/
// 递归实现
var preorderTraversal = function(node){
    let result = [];
    var preorderTraverseNode = function(node){
        if(node){
            // 根节点
            result.push(node.val);
            //  遍历左子树
            preorderTraverseNode(node.left);
            // 遍历右子树
            preorderTraverseNode(node.right);
        }
    }

    preorderTraverseNode(root);
    return result
}

// 迭代实现

var preorderTraversal = function(root){
    const list = [];
    const stack = [];

    if(root) stack.push(root);
    while(stack.length>0){
        const curNode = stack.pop();
        list.push(curNode.val);

        if(curNode.right !==null){
            stack.push(curNode.right);
        }
        if(curNode.left !== null){
            stack.push(curNode.left);
        }
    }
    return list;
}


// 二叉树的中序遍历
/*
https://leetcode-cn.com/problems/binary-tree-inorder-traversal/solution/
javascriptjie-zhong-xu-bian-li-er-cha-shu-by-user7/
*/
// 递归实现1
var inorderTraversal = function(root) {
    if(root){
        return [...inorderTraversal(root.left),root.val,...inorderTraversal(root.right)];
    }else{
        return [];
    }
}

// 递归实现2

var inorderTraversal = function(root){
    var result = [];

    function inorderTraverseNode(root){
        if(root){
            if(root.left != null){
                inorderTraverseNode(root.left);
            }
            result.push(root.val);
            if(root.right != null){
                inorderTraverseNode(root.right);
            }
        }
    }

    inorderTraverseNode(root);
    return result;
}

// 迭代

var inorderTraversal = function (root){
    var result = [];
    var stack = [];

    while(root || stack.length ){
        while(root){
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        result.push(root.val);
        root = root.right;
    }

    return result;
}




// 二叉树的后序遍历
/*
https://leetcode-cn.com/problems/binary-tree-postorder-traversal/solution/
javascriptjie-er-cha-shu-de-hou-xu-bian-li-by-user/
*/
// 递归
var postorderTraversal  = function(root){
    var result = [];

    function postorderTraverseNode(root){
        if(root){
            if(root.left != null){
                postorderTraverseNode(root.left);
            }
            if(root.right != null){
                postorderTraverseNode(root.right);
            }
            result.push(root.val);
        }
    }

    postorderTraverseNode(root);
    return result;
}

// 迭代

var postorderTraversal = function(root){
    var result = [];
    var stack = [];

    if(root)stack.push(root);
    while(stack.length>0){
        var node = stack.pop();
        result.unshift(node.val);

        if(node.left!==null){
            stack.push(node.left);
        }
        if(node.right!==null){
            stack.push(node.right);
        }
    }
    return result;
}




// 排序算法的稳定性
/*
排序前后相同元素的相对位置是否发生变化  如果保证不发生变化就是稳定的

稳定的排序算法
冒泡 插入(BST) 归并
不稳定的排序算法
快速排序 选择排序
*/

// 把数组转换为树
function ary2tree(ary){
    if(ary.length===0)return null;
    var root = new treeNode(ary[0]);
    var result = root;
    var queue = [root];

    for(let i =1;i<ary.length;i++){
        var node = queue.shift();
        if(ary[i] === null){
            node.left = null;
        }else{
            node.left = new treeNode(ary[i]);
            queue.push(node.left);
        }

        i++;
        if(i>=ary.length) break;

        if(ary[i] === null){
            node.right = null;
        }else{
            node.right = new treeNode(ary[i]);
            queue.push(node.right);
        }
    }

    return result;
}



// 层序遍历  明确的是一层层的遍历的
var levelOrder = function(root){
    if(!root)return [];
    var res= [];
    var queue = [root];
    while(queue.length>0){
        var resArg = [];
        var len = queue.length; // 当前层的节点数量
        for(let i =0;i<len;i++){
            var curNode = queue.shift(); //节点出队列
            resArg.push(curNode.val);
            if(curNode.left)queue.push(curNode.left); //放入下一层的节点
            if(curNode.right)queue.push(curNode.right);
        }
        res.push(resArg);
    }
    return res;
}


// 搜索二叉树的插入和删除节点
// 搜索二叉树的特点: 根节点的左子树始终小于根节点   根节点的右子树大于等于根节点
// 使用中序遍历搜索二叉树得到的是一个升序的数列
// https://leetcode-cn.com/problems/rank-from-stream-lcci/

function insertIntoBST(bst,val){
    if(bst === null){
        return new treeNode(val);
    }

    if(val<bst.val){
        bst.left = insertIntoBST(bst.left,val);
    }else{
        bst.right = insertIntoBST(bst.right,val);
    }
    return bst;
}

// 插入到叶子节点时才是正确的 迭代写法
function insertIntoBST(bst,val){
    if(bst === null){
        return new treeNode(val);
    }
    var p = bst;
    while(true){
        if(val<p.val){
            if(p.left){
                p = p.left
            }else{
                p.left = new treeNode(val);
                break;
            }
        }else{
            if(p.right){
                p = p.right
            }else{
                p.right = new treeNode(val);
                break;
            }
        }
    }

    return bst;
}


// 构建整个排序二叉树 并输出其中序遍历的结果
function bstSort(ary){
    var tree = null;
    for(let i=0;i<ary.length;i++){
        tree = insertIntoBST(tree,ary[i]);
    }

    var result = [];
    inorderTraversal( (tree,val)=>{
        result.push(val);
    })
    return result;
}


// 排序二叉树的节点删除
var deleteNode = function (root, key) {
    if (root === null) {
        return null;
    }
    // 当前节点是要删除的节点
    if (root.val === key) {
        // 1:节点是叶子，删除该节点
        if (root.left === null && root.right === null) {
            root = null;
        }
        // 2:节点只有一边子节点，用子节点代替节点
        else if (root.left === null || root.right === null) {
            root = root.left === null ? root.right : root.left;
        }
        else {
            // 场景3:节点有两边节点，找到后置节点和当前节点交换
            let successor = root.right;
            while (successor.left !== null) {
                successor = successor.left;
            }
            root.val = successor.val;
            root.right = deleteNode(root.right, root.val);
        }

    }
    // 在右子树删除
    else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    }
    // 在左子树删除
    else if (key < root.val) {
        root.left = deleteNode(root.left, key);
    }

    return root;
};
