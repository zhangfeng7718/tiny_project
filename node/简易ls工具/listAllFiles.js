/**
 * 接收一个文件夹路径  返回这个文件夹里面的所有的文件
 * 需要递归得到所有的文件名  并凡在一个一维数组中
 * 需要写三个版本
 * 同步版
 * 回调版
 * Promise版本
 */
var fs = require('fs');
const { resolve } = require('path');
var fsp = fs.promises;

/**
 * 同步版本
 * 函数默认第二个参数为结果数组
 * 在读取目录时，采用同步方法 且 使用 utf-8编码
 * 使用fs.statSync中的isDirectory判断是否是目录
 * 是的话递归调用函数本身  传入拼接的path
 * 如果不是话就直接把非文件夹文件推入结果数组
 */

 /**
  * 同步版本
  * @param {*} dirPath
  */
function listAllFilesSync(dirPath){
    var result = [];
    var stat = fs.statSync(dirPath);
    if(stat.isDirectory()){
        var files = fs.readdirSync(dirPath,'utf-8');
        for(file of files){
            if(fs.statSync(dirPath + '/'+ file).isDirectory()){
                var items = listAllFilesSync(dirPath + '/' + file);
                result.push(...items);
            }else{
                result.push(file)
            }
        }
    }else{
        return [dirPath]
    }
    return result;
}
/**
 * promise版本
 * @param {*} dirPath
 */
function listAllFilesPromise(dirPath){
    return fsp.stat(path).then(stat=>{
        if(stat.isFile()){
            return [path];
        }else{
            return fsp.readdir(dirPath, {withFileTypes: true}).then(entries=>{
                return Promise.all(entries.map(entry =>{
                    var fullPath = dirPath + '/' + entry.name;
                    return listAllFilesPromise(fullPath);
                })).then(arrays =>{
                    return [].concat(...arrays);
                })
            })
        }
    })
}



/**
 * 异步版本
 * @param {*} dirPath
 * @param {*} callback
 */
function listAllFilesCallback(dirPath, callback){
    var stat = fs.stat(dirPath, (err,stats)=>{
        if(err){
            callback(err);
        }else{
            if(stats.isDirectory()){
                fs.readdir(dirPath,'utf-8',function(err,entries){
                    if(err){
                        // 读取出错处理
                        callback(err);
                    }else{
                        var result = [];
                        var count = 0;
                        if(entries.length == 0){
                            callback([]);
                        }
                        entries.forEach((entry, idx)=>{
                            let fullPath = dirPath + '/' + entry.name;
                            let i = idx;
                            listAllFilesCallback(fullPath, (files)=>{
                                result[i] = files;
                                count++;
                                if(count == entries.length){
                                    callback(null, [].concat(...result))
                                }
                            })
                        })
                    }
                })
            }else{
                callback(null,[dirPath])
            }
        }
    })
}

// 使用await 并不意味着一劳永逸   如果非常粗糙的使用往往会导致运行效率非常
// 低下， 通常的做法是如果遇到可以同时进行的promise 或 异步 就要一起进行

/**
 * async 版本
 * 串行加载
 */
async function listAllFiles(path){
    var result = [];
    var stat = await fsp.stat(path);
    if(stat.isFile()){
        return [path];
    }else{
        var entries = await fsp.readdir(path, {withFileTypes: true})
        for(let entry of entries){
            var fullPath = path + '/' + entry.name;
            if(entry.isFile()){
                result.push(fullPath);
            }else{
                var files = await listAllFiles(fullPath);
                result.push(...files);
            }
        }
    }
    return [].concat(...result);
}

/**
 * async 版本优化
 * 并行下载 串行等待
 */
async function listAllFilesBetter(path){
    var result = [];
    var stat = await fsp.stat(path);
    if(stat.isFile()){
        return [path];
    }else{
        var entries = await fsp.readdir(path, {withFileTypes: true})
        // 启动所有子文件夹的读取
        var entryPromises = entries.map((entry, i) => {
            var fullPath = path + '/' + entry.name;
            return listAllFilesBetter(fullPath)
        })
        // 串行等待每个任务  即便第二个完成了 第一个没完成也不能处理
        for(let entryPromise of entryPromises){
            var files = await entryPromise;
            result.push(...files);
        }
    }
    return [].concat(...result)
}



/**
 * async 版本优化
 * 再次优化
 */
async function listAllFilesBetter(path){
    var result = [];
    var stat = await fsp.stat(path);
    if(stat.isFile()){
        return [path];
    }else{
        var entries = await fsp.readdir(path, {withFileTypes: true})
        // 启动所有子文件夹的读取
        var entryPromises = entries.map((entry, i) => {
            var fullPath = path + '/' + entry.name;
            return listAllFilesBetter(fullPath).then(files =>{
                result[i] = files;
            });
        })
    }
    return [].concat(...result)
}






// var files = listAllFilesSync('../note')
// var result = [];
// listAllFilesCallback('../note' , function(err, file){
//     if(err){

//     }else{
//         // result.push(...file);
//     }
//     // console.log(result);
// });
// console.log(result);


// listAllFilesPromise('../note').then(res=>{
//     console.log(res)
// },err =>{
//     // console.log(1)
// })