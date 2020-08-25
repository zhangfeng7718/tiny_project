/* 堆  也叫做 优先队列 Priorityqueue    二叉堆可以用满二叉树来表示
他分为大顶堆和小顶堆  就是根节点大于(小于)左节点和右节点
对二叉堆进行add时  先在最下层添加 然后不断的比较他的parentNode 直到满足  ParentNode.val >= node.val (小顶堆相反)
对二叉堆进行pop时  会取出根节点 然后找一个尾部节点放在根节点 不断的比较他的下层节点  如果都满足Parent.val >= node.val(小顶堆相反)
*
*/

class                {
    // 通过Predicate 改成大顶堆或者小顶堆
    constructor(initial = [], predicate = it => it){
        this.elements = initial.slice();
        this.predicate = predicate;
        this._heapfy();
    }
/*
返回堆顶元素
*/
    peak(){
        return this.elements[0];
    }
/*
往堆里添加一个元素
*/
    push(item){
        this.elements.push(item);
        var idx = this.elements.length - 1;
        Up(idx);
    }
    Up(idx){
        if(idx>0){
            var pIdx =  Math.floor( ( idx - 1) /2);
            if(this.predicate(this.elements[idx]) > this.predicate(this.elements[pIdx])){
                this.swap(idx,pIdx);
                this.Up(pIdx);
            }
        }
    }
/*
* 删除
*/
    pop(){
        if(this.elements.length === 1){
            return this.elements.pop();
        }
        var ret = this.elements[0];
        this.elements[0] = this.elements.pop();
        this.Down(0);
        return ret;
    }
    Down(idx){
        var maxIdx = idx;
        var leftIdx = idx * 2 + 1;
        var rightIdx = idx * 2 + 2;
        if(leftIdx < this.elements.length){
            if(this.predicate(this.elements[leftIdx]) > this.predicate(this.elements[maxIdx])){
                maxIdx = leftIdx;
            }
        }
        if(rightIdx < this.elements.length){
            if(this.predicate(this.elements[rightIdx]) > this.predicate(this.elements[maxIdx])){
                maxIdx = rightIdx;
            }
        }
        if(maxIdx !== idx){
            this.swap(maxIdx , idx);
            this.Down(maxIdx);
        }
    }
    heapfy(){
        var startIdx = Math.floor((this.elements.length -2) /2);
        for(let i = startIdx ; i >=0 ; i--){
            this.Down(i);
        }
    }
    swap(x,y){
        var temp = this.elements[x];
        this.elements[x] = this.elements[y];
        this.elements[y] = temp;
    }
    get size(){
        return this.elements.length;
    }
}




// 认为ary形成了一个堆

function heapDown(ary,idx,end){
    var maxIdx = idx;
    var leftIdx = idx * 2 + 1;
    var rightIdx = idx * 2 + 2;

    if(leftIdx <= end){
        if(ary[leftIdx] > ary[maxIdx]){
            maxIdx = leftIdx;
        }
    }
    if(rightIdx <= end){
        if(ary[rightIdx] > ary[maxIdx]){
            maxIdx = rightIdx;
        }
    }

    if(maxIdx !== idx){
        swap(ary,maxIdx , idx);
        heapDown(maxIdx);
    }
}
function swap(ary,x,y){
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
}

function heapfy(ary){
    var startIdx = Math.floor((ary.length -2) /2);
    for(let i = startIdx ; i >=0 ; i--){
        heapDown(i);
    }
}

// 时间 n * log(n)
// 空间 heapDown O1
// 不稳定
function heapSort(ary){
    heapfy(ary); // n*log(n)
    for(let i = ary.length - 1 ;i>= 0; i-- ){
        swap(ary, 0 ,i);
        heapDown(ary, 0, i-1); // log(n)
    }
    return ary;
}