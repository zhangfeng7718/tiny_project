/**
 * 实现一个静态文件服务器
 * 老师写的
 * async await 版本
 */

const fs = require('fs');
const fsp = fs.promises;
const http = require('http');
const path = require('path');

const child_process = require('child_process')

const { stdout } = require('process');
// npm i mime 包 require 直接使用即可  如果传入目录返回Null
const port = 8060;
const base = path.resolve('..'); //拿到完整的绝对路径
// __dirname  模块当前所在文件夹的完整路径
// 处理文件路径时路径的最后必然是一个/

var mimeMap = {
    '.jpg': 'image/jpeg',
    '.html': 'text/html',
    '.css': 'text/stylesheet',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.txt': 'text/plain',
}

const server = http.createServer();

server.on('request', async (request, response)=>{
    // 中文文件名解析发送
    var targetPath = decodeURIComponent(path.join(base , request.url));
    // 请求资源不在base目录下  直接结束请求
    if(!targetPath.startsWith(base)){
        response.end();
        return ;
    }
    // 阻止发送以点开头的文件和文件夹
    // path.sep 当前执行环境下的分隔符  window 是 \  linux 下是 /
    if(targetPath.split(path.sep).some(seg=> seg.startsWith('.'))){
        response.end();
        return ;
    }
    try{
        var stat = await fsp.stat(targetPath);
        if(stat.isFile()){
            var data = await fsp.readFile(targetPath);

            var type = mimeMap[path.extname(targetPath)];
            // || 'application/octet-stream'
            console.log(type)
            response.writeHead(200, {
                "Content-Type": `${type};charset=utf-8`
            });
            response.end(data);
            // fs.createReadStream(targetPath).pipe(response)
        }else if(stat.isDirectory()){
            var indexPath = path.join(targetPath, 'index.html');
            try{
                var indexStat = await fsp.stat(indexPath);
                var indexContent = await fsp.readFile(indexPath);
                var type = mimeMap[path.extname(indexContent)]|| 'application/octet-stream';
                response.writeHead(200, {
                    "Content-Type": `${type};charset=utf-8`
                });
                response.end(indexContent)
                // fs.createReadStream(indexContent).pipe(response)
            }catch(e){ // index.html 文件不存在
                if(!request.url.endsWith('/')){
                    response.writeHead(301, {
                        'Location': request.url + '/',
                        "Content-Type": "text/html;charset=utf-8"
                    })
                    response.end()
                    return;
                }

                // child_process.exec('ls -lha', (err, stdout)=>{
                    // res.end(stdout)
                // });

                var entries =  await fsp.readdir(targetPath,{withFileTypes:true});
                response.writeHead(200, {
                    "Content-Type": "text/html;charset=utf-8"
                });
                response.end(`
                    ${entries.map(entry=>{
                        var slash = entry.isDirectory() ? '/' : '';
                        return `
                            <div>
                                <a href= "${entry.name}${slash}">${entry.name}${slash}</a>
                            </div>
                        `
                    }).join('')}.
                `)
            }

        }
    }catch(e){
        response.writeHead(404, {
            "Content-Type": "text/html;charset=utf-8"
        });
        response.end('404 Not Found')
    }
})
server.listen(port, ()=>{
    console.log('server listening on port ', port)
})
