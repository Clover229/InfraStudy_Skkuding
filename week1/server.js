import fs from 'fs' 
const os = require('os');
console.log('운영체제:', os.platform()); 
console.log('CPU 정보:', os.cpus());
console.log('총 메모리:', os.totalmem(), 'bytes');
console.log('홈 디렉토리:', os.homedir());

const fs= require('fs');
const http = require('http');
function Switch(data){
    data=data.replace('{{type}}',os.platform()) ;
    data=data.replace('{{hostname}}',os.homedir()) ;
    data =data.replace('{{cpu_num}}',os.cpus().length);
    data=data.replace('{{total_mem}}',os.totalmem()) ;
    
    return data
}

const server = http.createServer((req, res)=>{
    fs.readFile('week1.html', 'utf8', (err, data)=>{
        if (err){
            res.writeHead(500, {'Content-Type': 'text/plain'});//직접 content type 설정
            res.end('Error');
        } else{
            newdata=Switch(data)
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(newdata);
        }
    })
});

server.listen(3000, ()=>{
    console.log('서버 실행중.... http://localhost:3000');
})