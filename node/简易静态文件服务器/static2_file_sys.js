/**
 * 实现一个静态文件服务器
 * 老师写的
 * 同步版本
 */

const fs = require('fs');
const fsp = fs.promises;
const http = require('http');
const path = require('path');
const { response } = require('express');

const port = 8060;
const base = '..'
// __dirname  模块当前所在文件夹的完整路径
// 处理文件路径时路径的最后必然是一个/


const server = http.createServer();

server.on('request', (request, response)=>{
    var targetPath = path.join(base , request.url);

    fs.stat(targetPath, (err, stat)=>{
        if(err){
            response.writeHead(404, {
                "Content-Type": "text/html;charset=utf-8"
            });
            response.end('404 Not Found')
        }else{
            if(stat.isFile()){
                fs.readFile(targetPath, (err, data)=>{
                    if(err){
                        response.writeHead(502, {
                            "Content-Type": "text/html;charset=utf-8"
                        });
                        response.end('502 请求的文件不存在')
                    }else{
                        response.end(data);
                    }
                })
            }else if(stat.isDirectory()){
                var indexPath = path.join(targetPath, 'index.html');
                fs.stat(indexPath, (err,stat)=>{
                    if(err){
                        // 如果地址栏不是 / 结尾 跳转到 /结尾的地址
                        if(!request.url.endsWith('/')){
                            response.writeHead(301, {
                                'Location': request.url + '/',
                                "Content-Type": "text/html;charset=utf-8"
                            })
                            response.end()
                            return;
                        }

                        fs.readdir(targetPath,{withFileTypes:true}, (err, entries)=>{
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
                        })

                    }else{
                        fs.readFile(targetPath, (err, data)=>{
                            if(err){
                                response.writeHead(502, {
                                    "Content-Type": "text/html;charset=utf-8"
                                });
                                response.end('502 请求的文件不存在')
                            }else{
                                response.end(data);
                            }
                        })
                    }
                })

            }
        }
    })

})

server.listen(port, ()=>{
    console.log('server listening on port ', port)
})
