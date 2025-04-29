import fs from 'fs' 
import os from 'os';
import http from 'http';
console.log('운영체제:', os.platform()); 
console.log('CPU 정보:', os.cpus());
console.log('총 메모리:', os.totalmem(), 'bytes');
console.log('홈 디렉토리:', os.homedir());

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
            const newdata=Switch(data) //res는 응답에 관한 정보 담고 있음
            res.writeHead(200, {'Content-Type':'text/html'}); //응답 헤더에 대한 정보 기록. 콘텐츠 형식 등.
            res.end(newdata);
        }
    })
});

server.listen(3000, ()=>{
    console.log('서버 실행중.... http://localhost:3000');
})