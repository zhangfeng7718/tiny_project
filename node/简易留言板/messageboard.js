const http = require('http');
const { request } = require('express');
const server = http.createServer();
const querystring = require('querystring')


// const server = new http.Server();
const port = 8022;

/**
 * 相对于tcp连接  http模块会自动的拼接响应头  并且将 请求内容和响应封装在
 * request 和response 里
 */

const msgs = [{
    content: 'hello',
    name : 'zhangfeng',
}]

server.on('request', (request, response)=>{
    if(request.method === 'GET'){
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=UTF-8'
        })

        response.write(`
        <form action="/" method="post">
            <input name="name" />
            <textarea name="content"></textarea>
            <button>提交</button>
        </form>
        <url>
            ${
                msgs.map(msg=>{
                    return `
                      <li>
                        <h3>${msg.name}</h3>
                        <p>${msg.content}</p>
                      </li>
                    `
                }).join('')
            }
        </ul>
        `)
    }else if(request.method === 'POST'){
        request.on('data', data=>{
            var msg = querystring.parse(data.toString());
            msgs.push(msg);
            response.writeHead(301, {
                'Location': '/',
            })
            response.end();
        })
    }

})

server.listen(port, ()=>{
    console.log('server listening on port ', port)
});