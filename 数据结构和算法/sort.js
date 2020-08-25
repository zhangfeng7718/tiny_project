// 快速排序
function quickSort(ary,start=0,end=ary.length-1){
    if(start>=end){
        return;
    }
    var pivotIndex  = Math.floor((end - start + 1)) * Math.random() + start;
    var pivot = ary[pivotIndex];

    swap(ary,pivotIndex,end);

    var i = start -1;
    for(var j = start;j<end;j++){
        if(ary[j]<pivot){
            i++;
            swap(ary,i,j);
        }
    }
    i++;
    swap(ary,i,end);

    quickSort(ary,start,i-1);
    quickSort(ary,i+1,end);
    return ary;
}
function swap(ary,i,j){
    var temp = ary[i];
    ary[i] = ary[j];
    ary[j] = temp;
}
// 对象版本的  快速排序
function quickSort(ary,f ,start=0,end=ary.length-1){
    if(start>=end){
        return;
    }
    var pivotIndex  = Math.floor((end - start + 1))* Math.random();
    var pivot = ary[pivotIndex];
    swap(ary,pivotIndex,end);
    var i = start -1;
    for(var j = start;j<end;j++){
        if(f(ary[j])<f(pivot)){
            i++;
            swap(ary,i,j);
        }
    }
    i++;
    swap(ary,i,end);
    quickSort(ary,f,start,i-1);
    quickSort(ary,f,i+1,end);
    return ary;
}


// 归并排序
var sortArray = function(nums){
    return mergeSort(nums, 0 , nums.length - 1);
}
function mergeSort(nums, left ,right){
    if(left >= right)return nums;
    let mid = Math.floor(left + (right - left) / 2);
    mergeSort(nums, left , mid);
    mergeSort(nums, mid + 1 ,right);
    return merge(nums, left , mid , right);
}
function merge(nums, left , mid , right){
    let ans = [];
    let c = 0, i = left , j = mid + 1;
    while(i <= mid && j <= right){
        if(nums[i] < nums[j]){
            ans[c++] = nums[i++];
        }else{
            ans[c++] = nums[j++];
        }
    }
    while(i <= mid){
        ans[c++] = nums[i++];
    }
    while(j <= right){
        ans[c++] = nums[j++];
    }
    for(let i = 0;i < ans.length ;i ++){
        nums[i + left] = ans[i];
    }
    return nums;
}



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

// 选择排序
var sortArray = function(nums){
    for(let i = 0;i < nums.length ;i++){
        let min = Infinity;
        let minIndex;
        for(j = i; j< nums.length ;j++){
            if(nums[j] < min){
                min = nums[j];
                minIndex = j;
            }
        }
        [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
    }
    return nums;
}

// 插入排序
var sortArray = function(nums){
    for(let i = 1; i < nums.length ;i++){
        let temp = nums[i];
        let j = i - 1;
        for(; j >= 0 ;j--){
            if(temp >= nums[j])break;
            nums[j + 1] = nums[j];
        }
        nums[j + 1] = temp;
    }
    return nums;
}


// 冒泡排序
function sort(nums){
    for(let i = 0;i < nums.length ;i++){
        for(let j = i + 1;j < nums.length ;j++){
            if(nums[i] > nums[j]){
                var temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
            }
        }
    }
    return nums;
}