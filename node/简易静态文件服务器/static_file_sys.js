/**
 *  静态文件http服务器
 *  让http://localhost:8080/
 *  能否访问到电脑上某一个文件夹的内容
 *  如果访问到文件夹那么返回该文件夹下的index.html文件
 *  如果不存在，返回该文件夹的内容的一个页面
 *  需要对特定的文件返回正确的Content-Type
 *  c:/foo/bar/baz
 *  否则就展示下面的文件
 */


const fs = require('fs');
const fsp = fs.promises;
const http = require('http');
const { resolve } = require('path');
const { rejects } = require('assert');
const server = http.createServer();

/**
 * base 路径设置
 */
const base = '..'

const port = 8080;

server.on('request', (request, response)=>{
    // console.log(request.socket.remoteAddress)
    console.log(request.method, request.url);
    // console.log(request.headers);
    // console.log(response);
    // 忽略对页面图标的访问
    if(request.url !== "/favicon.ico"){
        var path = base + request.url;
        listAllFilesPromise(path).then(files =>{
            if(files.length==1){
                fsp.readFile(files[0], {withFileTypes: true}).then(data=>{
                    response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                    response.write(`
                    <p>${data.toString()}</p>
                    `)
                    response.end()
                })
            }else{
                response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                var flag = true;
                var html = '';
                for(let i = 0;i < files.length ; i++){
                    html += `<a href="${files[i]}"> ${files[i]} </a>
                    <br>
                    `
                    if(files[i].includes('index.html')){
                        flag = false;
                        var indexPath = files[i];
                        break;
                    }
                }
                if(flag){
                    response.write(`
                    <h3>Not found index.html in this file but you can choose other</h3>
                    <p>${html}</p>
                    `)
                    response.end()
                }else{
                    fsp.readFile(indexPath, {withFileTypes: true}).then(data=>{
                        response.write(`
                        <h1>Hello! I find index.html </h1>
                        <p>${data.toString()}</p>
                        `)
                        response.end()
                    })
                }
            }

        })
    }else{
        response.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
        response.end();
    }

})

server.listen(port, ()=>{
    console.log('server listening on port ', port)
});


/**
 * 文件路径下文件列出的函数
 * @param {*路径} dirPath
 *  返回由文件路径构成的数组
 */
function listAllFilesPromise(dirPath){
    return fsp.stat(dirPath).then(stat=>{
        if(stat.isFile()){
            return [dirPath];
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
