const fs = require('fs');
const fsp = fs.promises;
const pathMode = require('path');

// 传入的必须是一个绝对路径或者相对路径
var input = process.argv[2];
var base = __dirname;
console.log(input, base);

if(pathMode.isAbsolute(input)){
    var fullPath = input;
}else{
    var fullPath = pathMode.resolve(base , input);
}
console.log(fullPath);


listAllFile(fullPath, 0);

// function listAllFile(path,depth){
//     fsp.stat(path).then(stats=>{
//         if(stats.isFile()){
//             var lines = '---'.repeat(depth);
//             console.log(lines + pathMode.basename(path))
//         }else{
//             var lines = '---'.repeat(depth);
//             console.log(lines + pathMode.basename(path) + '/')
//             return fsp.readdir(path, {withFileTypes: true}).then(entries =>{
//                 return Promise.all(entries.map(entry=>{
//                     var complitePath = path + '/' + entry.name;
//                     return listAllFile(complitePath, depth + 1);
//                 }))
//             })
//         }
//     })
// }

async function listAllFile(path,depth){
    var stat = await fsp.stat(path);
    if(stat.isFile()){
        var lines = ' | '.repeat(depth);
        console.log(lines + '——' + pathMode.basename(path))
    }else{
        var lines = ' | '.repeat(depth);
        console.log(lines + '——' + pathMode.basename(path) + '/')
        var entries = await fsp.readdir(path, {withFileTypes: true});
        for(entry of entries){
            var complitePath = path + '/' + entry.name;
            await listAllFile(complitePath, depth + 1);
        }
    }
}