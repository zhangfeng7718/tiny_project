// 解决元素分组问题
// 合并 union
// 查询 find

class UF{
    /** 将p 和 q连接 */
    constructor(n){
        this.parents = new Array(n);
        this.count = n;
        this.size = [];

        for(let i = 0;i < n;i++){
            this.parents[i] = i;
            this.size[i] = 1;
        }
    }
    union(p, q){
        var rootP = this.find(p);
        var rootQ = this.find(q);
        if(rootP == rootQ){
            return ;
        }
        // 将两棵树合并为一颗
        if(this.size[rootP] > this.size[rootQ]){
            this.parents[rootQ] = rootP;
            this.size[rootP] += this.size[rootQ];
        }else{
            this.parents[rootP] = rootQ;
            this.size[rootQ] += this.size[rootP];
        }
        this.count--;
    }
    find(x){
        while(this.parents[x] !== x){
            this.parents[x] = this.parents[this.parents[x]];
            x = this.parents[x];
        }
        return x;
    }
    isConnected(p,q){
        var rootP = this.find(p);
        var rootQ = this.find(q);
        return rootQ === rootP;
    }
    count(){
        return this.count;
    }
}