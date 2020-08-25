// 核心思想通过  Key 直接计算出内存地址
// 无法避免的问题  哈希冲突
// 1. 开放地址法    2. 重新哈希法    3. 链表存储法(可能出现效率低下的情况  在jdk 1.8 中使用红黑树)

function hash(str){
    var seed = 213121;
    var hash = 132;
    for(let i  = 0; i < str.length ; i++){
        hash = hash * seed + Key.charCodeAt(i);
    }
    return hash;
}
